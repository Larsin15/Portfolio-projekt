import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db, pmQuestions, pmAnswers, pmSessions, users } from "@portfolio/db";
import { encrypt, deriveKey } from "@portfolio/crypto";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, answer } = body;

    if (!questionId || !answer) {
      return NextResponse.json(
        { error: "Question ID and answer are required" },
        { status: 400 }
      );
    }

    // Verify the question belongs to a session owned by this user
    const question = await db.query.pmQuestions.findFirst({
      where: eq(pmQuestions.id, questionId),
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const session = await db.query.pmSessions.findFirst({
      where: eq(pmSessions.id, question.sessionId),
    });

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get user's encryption key
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tempKey = deriveKey(user.id, userRecord.encryptionSalt);

    // Encrypt answer
    const encryptedAnswer = encrypt(answer, tempKey);

    // Check if answer already exists
    const existingAnswer = await db.query.pmAnswers.findFirst({
      where: eq(pmAnswers.questionId, questionId),
    });

    if (existingAnswer) {
      // Update existing answer
      await db
        .update(pmAnswers)
        .set({
          encryptedAnswer: encryptedAnswer.data,
          iv: encryptedAnswer.iv,
          authTag: encryptedAnswer.authTag,
          answeredAt: new Date(),
        })
        .where(eq(pmAnswers.id, existingAnswer.id));
    } else {
      // Insert new answer
      await db.insert(pmAnswers).values({
        questionId,
        encryptedAnswer: encryptedAnswer.data,
        iv: encryptedAnswer.iv,
        authTag: encryptedAnswer.authTag,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save answer error:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}

