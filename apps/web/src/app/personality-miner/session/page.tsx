"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const suggestedAspects = [
  "Relationships",
  "Work & Career",
  "Emotional Patterns",
  "Decision Making",
  "Self-Worth",
  "Boundaries",
  "Communication",
  "Conflict",
  "Fear & Anxiety",
  "Goals & Motivation",
];

export default function SessionStartPage() {
  const router = useRouter();
  const [aspects, setAspects] = useState<string[]>([]);
  const [customAspect, setCustomAspect] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAspect(aspect: string) {
    setAspects((prev) =>
      prev.includes(aspect)
        ? prev.filter((a) => a !== aspect)
        : prev.length < 5
        ? [...prev, aspect]
        : prev
    );
  }

  function addCustomAspect() {
    if (customAspect.trim() && aspects.length < 5) {
      setAspects((prev) => [...prev, customAspect.trim()]);
      setCustomAspect("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (aspects.length === 0) {
      setError("Please select at least one aspect to explore.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aspects }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate questions");
        return;
      }

      // Redirect to Q&A session with the session ID
      router.push(`/personality-miner/session/${data.sessionId}`);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/personality-miner"
            className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors mb-6"
          >
            <i className="fas fa-arrow-left" />
            Back to Overview
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] mb-4">
            <span className="text-gradient">What Would You Like to Explore?</span>
          </h1>
          
          <p className="text-[var(--color-text-secondary)]">
            Select up to 5 aspects of yourself you want to understand better.
            The AI will generate personalized questions based on your choices.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Selected aspects */}
          {aspects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                Selected ({aspects.length}/5)
              </h2>
              <div className="flex flex-wrap gap-2">
                {aspects.map((aspect) => (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => toggleAspect(aspect)}
                    className="px-4 py-2 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-medium flex items-center gap-2 transition-all hover:bg-[var(--color-accent-secondary)]"
                  >
                    {aspect}
                    <i className="fas fa-times text-sm" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested aspects */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Suggested Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {suggestedAspects
                .filter((a) => !aspects.includes(a))
                .map((aspect) => (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => toggleAspect(aspect)}
                    disabled={aspects.length >= 5}
                    className="px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aspect}
                  </button>
                ))}
            </div>
          </div>

          {/* Custom aspect */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Or Add Your Own
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAspect}
                onChange={(e) => setCustomAspect(e.target.value)}
                placeholder="Type something specific..."
                disabled={aspects.length >= 5}
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomAspect();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomAspect}
                disabled={!customAspect.trim() || aspects.length >= 5}
                className="px-4 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || aspects.length === 0}
            className="w-full py-4 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold text-lg transition-all duration-300 hover:bg-[var(--color-accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                Generate My Questions
                <i className="fas fa-arrow-right" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
            Your responses will be encrypted and only accessible to you.
          </p>
        </form>
      </div>
    </div>
  );
}

