import Link from "next/link";
import { validateRequest } from "@/lib/auth";

const features = [
  {
    icon: "🧠",
    title: "AI-Powered Insights",
    description:
      "Uses a fine-tuned Llama model trained on CBT/ACT methodologies to generate meaningful questions.",
  },
  {
    icon: "🔒",
    title: "End-to-End Encrypted",
    description:
      "Your responses are encrypted with your personal key. Only you can access your data.",
  },
  {
    icon: "🪞",
    title: "Mirror Context",
    description:
      "Receive a personalized profile that reflects your patterns, triggers, and growth opportunities.",
  },
  {
    icon: "📈",
    title: "Track Progress",
    description:
      "Return for new sessions and see how your understanding evolves over time.",
  },
];

const methodology = [
  {
    step: 1,
    title: "Share Your Aspects",
    description:
      "Tell us what areas of your life you want to explore: relationships, work, emotions, decisions...",
  },
  {
    step: 2,
    title: "Answer 15 Questions",
    description:
      "The AI generates personalized questions based on your input. Answer honestly and openly.",
  },
  {
    step: 3,
    title: "Receive Your Mirror",
    description:
      "Get a structured context document that maps your patterns, needs, and growth edges.",
  },
];

export default async function PersonalityMinerPage() {
  const { user } = await validateRequest();
  const isLoggedIn = !!user;
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded-full border border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] text-sm font-mono">
            Self-Discovery Tool
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-6">
            <span className="text-gradient">Personality Miner</span>
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            An AI-powered tool that helps you understand your psychological patterns
            through structured self-reflection based on CBT and ACT methodologies.
          </p>

          <Link
            href={isLoggedIn ? "/personality-miner/session" : "/auth/register"}
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold transition-all duration-300 hover:glow-accent hover:scale-105"
          >
            {isLoggedIn ? "Start New Session" : "Start Your Journey"}
            <i className="fas fa-arrow-right ml-2" />
          </Link>
          
          {isLoggedIn && (
            <Link
              href="/personality-miner/profile"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold transition-all duration-300 hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)]"
            >
              View My Profile
              <i className="fas fa-user ml-2" />
            </Link>
          )}
        </div>

        {/* What is it? */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center mb-8">
            What is Personality Miner?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-center mb-8">
            How It Works
          </h2>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]" />

            <div className="space-y-8">
              {methodology.map((item, index) => (
                <div
                  key={item.step}
                  className={`flex flex-col md:flex-row gap-6 items-center ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 text-center md:text-left">
                    <div
                      className={`p-6 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] ${
                        index % 2 === 1 ? "md:text-right" : ""
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Step number */}
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-lg z-10">
                    {item.step}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CBT/ACT Info */}
        <section className="mb-16">
          <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
            <h2 className="text-xl font-bold font-[family-name:var(--font-display)] mb-4">
              About the Methodology
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-[var(--color-text-secondary)]">
              <div>
                <h3 className="text-[var(--color-accent-primary)] font-semibold mb-2">
                  Cognitive Behavioral Therapy (CBT)
                </h3>
                <p className="text-sm">
                  Focuses on identifying and restructuring unhelpful thought patterns.
                  The questions help you examine your automatic thoughts and beliefs.
                </p>
              </div>

              <div>
                <h3 className="text-[var(--color-accent-primary)] font-semibold mb-2">
                  Acceptance & Commitment Therapy (ACT)
                </h3>
                <p className="text-sm">
                  Emphasizes psychological flexibility and values-driven action.
                  Helps you notice patterns without judgment and commit to meaningful change.
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-[var(--color-text-muted)] italic">
              Note: This tool is for self-reflection purposes only and is not a substitute
              for professional mental health support.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          {isLoggedIn ? (
            <Link
              href="/personality-miner/session"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-glow bg-transparent text-[var(--color-accent-primary)] font-semibold transition-all duration-300 hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-bg-primary)]"
            >
              Begin Session
              <i className="fas fa-arrow-right ml-2" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-glow bg-transparent text-[var(--color-accent-primary)] font-semibold transition-all duration-300 hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-bg-primary)]"
              >
                Create Account to Begin
              </Link>

              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[var(--color-accent-primary)] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

