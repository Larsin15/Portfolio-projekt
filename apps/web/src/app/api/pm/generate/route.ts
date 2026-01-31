import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db, pmSessions, pmQuestions, pmAspects } from "@portfolio/db";
import { encrypt, deriveKey } from "@portfolio/crypto";
import { generateQuestions } from "@/lib/ollama";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { aspects } = body;

    if (!aspects || !Array.isArray(aspects) || aspects.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one aspect to explore" },
        { status: 400 }
      );
    }

    if (aspects.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 aspects allowed" },
        { status: 400 }
      );
    }

    // Get user's encryption salt
    const userRecord = await db.query.users.findFirst({
      where: eq((await import("@portfolio/db")).users.id, user.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For now, we'll use a temporary key derivation
    // In production, the password would be provided via a secure session mechanism
    // For demo purposes, we'll derive from a combination of user ID and salt
    const tempKey = deriveKey(user.id, userRecord.encryptionSalt);

    // Get user's session count
    const existingSessions = await db.query.pmSessions.findMany({
      where: eq(pmSessions.userId, user.id),
      orderBy: [desc(pmSessions.sessionNumber)],
      limit: 1,
    });

    const sessionNumber = existingSessions.length > 0
      ? existingSessions[0].sessionNumber + 1
      : 1;

    // Create new session
    const [session] = await db
      .insert(pmSessions)
      .values({
        userId: user.id,
        sessionNumber,
        status: "in_progress",
      })
      .returning();

    // Store encrypted aspects
    const encryptedAspects = encrypt(JSON.stringify({ aspects }), tempKey);
    await db.insert(pmAspects).values({
      userId: user.id,
      encryptedData: encryptedAspects.data,
      iv: encryptedAspects.iv,
      authTag: encryptedAspects.authTag,
    });

    // Generate questions using LLM
    const questions = await generateQuestions(aspects);

    // Store encrypted questions
    for (let i = 0; i < questions.length; i++) {
      const encryptedQuestion = encrypt(questions[i], tempKey);
      await db.insert(pmQuestions).values({
        sessionId: session.id,
        questionOrder: i + 1,
        encryptedQuestion: encryptedQuestion.data,
        iv: encryptedQuestion.iv,
        authTag: encryptedQuestion.authTag,
      });
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      questionCount: questions.length,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

