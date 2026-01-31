import { redirect } from "next/navigation";
import Link from "next/link";
import { validateRequest } from "@/lib/auth";
import { db, pmMirrorContexts, pmSessions, users } from "@portfolio/db";
import { decrypt, deriveKey } from "@portfolio/crypto";
import { eq, desc } from "drizzle-orm";
import { MirrorContextViewer } from "@/components/pm/MirrorContextViewer";

export default async function ProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user's latest mirror context
  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!userRecord) {
    redirect("/auth/login");
  }

  const contexts = await db.query.pmMirrorContexts.findMany({
    where: eq(pmMirrorContexts.userId, user.id),
    orderBy: [desc(pmMirrorContexts.version)],
  });

  // Get sessions info
  const sessions = await db.query.pmSessions.findMany({
    where: eq(pmSessions.userId, user.id),
    orderBy: [desc(pmSessions.completedAt)],
  });

  // Decrypt contexts
  const tempKey = deriveKey(user.id, userRecord.encryptionSalt);
  
  const decryptedContexts = contexts.map((ctx) => {
    try {
      const content = decrypt(
        {
          data: ctx.encryptedContent,
          iv: ctx.iv,
          authTag: ctx.authTag,
        },
        tempKey
      );
      return {
        id: ctx.id,
        version: ctx.version,
        content,
        createdAt: ctx.createdAt,
      };
    } catch {
      return null;
    }
  }).filter(Boolean) as Array<{
    id: string;
    version: number;
    content: string;
    createdAt: Date | null;
  }>;

  const latestContext = decryptedContexts[0];
  const completedSessions = sessions.filter((s) => s.status === "completed").length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)]">
              <span className="text-gradient">Your Mirror Context</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2">
              {completedSessions} session{completedSessions !== 1 ? "s" : ""} completed
            </p>
          </div>

          <Link
            href="/personality-miner/session"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold transition-all hover:bg-[var(--color-accent-secondary)]"
          >
            <i className="fas fa-plus" />
            New Session
          </Link>
        </div>

        {latestContext ? (
          <>
            {/* Version selector if multiple contexts */}
            {decryptedContexts.length > 1 && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-muted)]">Version:</span>
                <div className="flex gap-2">
                  {decryptedContexts.map((ctx) => (
                    <span
                      key={ctx.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        ctx.id === latestContext.id
                          ? "bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)]"
                          : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      v{ctx.version}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mirror Context */}
            <MirrorContextViewer content={latestContext.content} />

            {/* Meta info */}
            <div className="mt-8 p-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
              <i className="fas fa-lock mr-2" />
              This content is encrypted and only visible to you.
              {latestContext.createdAt && (
                <span className="ml-4">
                  Generated: {new Date(latestContext.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-user-circle text-4xl text-[var(--color-text-muted)]" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">No Mirror Context Yet</h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
              Complete your first self-discovery session to generate your personalized mirror context.
            </p>

            <Link
              href="/personality-miner/session"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold transition-all hover:bg-[var(--color-accent-secondary)]"
            >
              Start Your First Session
              <i className="fas fa-arrow-right" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

