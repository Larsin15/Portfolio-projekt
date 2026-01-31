import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db, pmSessions, pmQuestions, pmAnswers, pmMirrorContexts, users } from "@portfolio/db";
import { encrypt, decrypt, deriveKey } from "@portfolio/crypto";
import { generateMirrorContext } from "@/lib/ollama";
import { eq, and, asc, desc } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    
    // Check authentication
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get session
    const session = await db.query.pmSessions.findFirst({
      where: and(
        eq(pmSessions.id, sessionId),
        eq(pmSessions.userId, user.id)
      ),
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get user's encryption key
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tempKey = deriveKey(user.id, userRecord.encryptionSalt);

    // Get all questions and answers
    const questions = await db.query.pmQuestions.findMany({
      where: eq(pmQuestions.sessionId, sessionId),
      orderBy: [asc(pmQuestions.questionOrder)],
    });

    const questionIds = questions.map((q) => q.id);
    const answers = await db.query.pmAnswers.findMany({
      where: (answers, { inArray }) => inArray(answers.questionId, questionIds),
    });

    // Build Q&A pairs
    const qaPairs: Array<{ question: string; answer: string }> = [];
    
    for (const question of questions) {
      const answer = answers.find((a) => a.questionId === question.id);
      if (answer) {
        try {
          const decryptedQuestion = decrypt(
            {
              data: question.encryptedQuestion,
              iv: question.iv,
              authTag: question.authTag,
            },
            tempKey
          );
          const decryptedAnswer = decrypt(
            {
              data: answer.encryptedAnswer,
              iv: answer.iv,
              authTag: answer.authTag,
            },
            tempKey
          );
          qaPairs.push({
            question: decryptedQuestion,
            answer: decryptedAnswer,
          });
        } catch {
          // Skip if decryption fails
        }
      }
    }

    // Generate mirror context
    const mirrorContent = await generateMirrorContext(qaPairs);

    // Get version number
    const existingContexts = await db.query.pmMirrorContexts.findMany({
      where: eq(pmMirrorContexts.userId, user.id),
      orderBy: [desc(pmMirrorContexts.version)],
      limit: 1,
    });

    const version = existingContexts.length > 0
      ? existingContexts[0].version + 1
      : 1;

    // Encrypt and store mirror context
    const encryptedContent = encrypt(mirrorContent, tempKey);
    await db.insert(pmMirrorContexts).values({
      userId: user.id,
      sessionId,
      version,
      encryptedContent: encryptedContent.data,
      iv: encryptedContent.iv,
      authTag: encryptedContent.authTag,
    });

    // Mark session as completed
    await db
      .update(pmSessions)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(pmSessions.id, sessionId));

    return NextResponse.json({
      success: true,
      version,
    });
  } catch (error) {
    console.error("Complete session error:", error);
    return NextResponse.json(
      { error: "Failed to complete session" },
      { status: 500 }
    );
  }
}

