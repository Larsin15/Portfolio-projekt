import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db, pmSessions, pmQuestions, pmAnswers, users } from "@portfolio/db";
import { decrypt, deriveKey } from "@portfolio/crypto";
import { eq, and, asc } from "drizzle-orm";

export async function GET(
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

    // Get questions for this session
    const questions = await db.query.pmQuestions.findMany({
      where: eq(pmQuestions.sessionId, sessionId),
      orderBy: [asc(pmQuestions.questionOrder)],
    });

    // Get answers for these questions
    const questionIds = questions.map((q) => q.id);
    const answersData = await db.query.pmAnswers.findMany({
      where: (answers, { inArray }) => inArray(answers.questionId, questionIds),
    });

    // Build answers map
    const answersMap = new Map<string, string>();
    for (const answer of answersData) {
      try {
        const decrypted = decrypt(
          {
            data: answer.encryptedAnswer,
            iv: answer.iv,
            authTag: answer.authTag,
          },
          tempKey
        );
        answersMap.set(answer.questionId, decrypted);
      } catch {
        // Failed to decrypt, skip
      }
    }

    // Decrypt questions and attach answers
    const decryptedQuestions = questions.map((q) => {
      try {
        const text = decrypt(
          {
            data: q.encryptedQuestion,
            iv: q.iv,
            authTag: q.authTag,
          },
          tempKey
        );
        return {
          id: q.id,
          order: q.questionOrder,
          text,
          answer: answersMap.get(q.id) || null,
        };
      } catch {
        return {
          id: q.id,
          order: q.questionOrder,
          text: "[Failed to decrypt]",
          answer: null,
        };
      }
    });

    return NextResponse.json({
      session: {
        id: session.id,
        sessionNumber: session.sessionNumber,
        status: session.status,
      },
      questions: decryptedQuestions,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}

