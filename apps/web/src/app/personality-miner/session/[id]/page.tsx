"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  order: number;
  text: string;
}

export default function QASessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(`/api/pm/session/${sessionId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load session");
          return;
        }

        setQuestions(data.questions);
        // Initialize answers with any existing answers
        const existingAnswers: Record<string, string> = {};
        for (const q of data.questions) {
          if (q.answer) {
            existingAnswers[q.id] = q.answer;
          }
        }
        setAnswers(existingAnswers);
      } catch {
        setError("Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [sessionId]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";

  async function saveAnswer(questionId: string, answer: string) {
    try {
      await fetch("/api/pm/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer }),
      });
    } catch {
      console.error("Failed to save answer");
    }
  }

  function handleAnswerChange(value: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  async function handleNext() {
    if (!currentQuestion || !currentAnswer.trim()) return;

    // Save answer
    await saveAnswer(currentQuestion.id, currentAnswer);

    if (isLastQuestion) {
      // Submit session and generate mirror context
      setSubmitting(true);
      try {
        const res = await fetch(`/api/pm/complete/${sessionId}`, {
          method: "POST",
        });

        if (res.ok) {
          router.push("/personality-miner/profile");
        } else {
          setError("Failed to complete session");
        }
      } catch {
        setError("Failed to complete session");
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[var(--color-accent-primary)] mb-4" />
          <p className="text-[var(--color-text-secondary)]">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link
            href="/personality-miner/session"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold"
          >
            Start New Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-text-muted)]">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-[var(--color-accent-primary)]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        {currentQuestion && (
          <div className="mb-8">
            <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold flex-shrink-0">
                  {currentIndex + 1}
                </div>
                <h2 className="text-xl text-[var(--color-text-primary)] leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Take your time and answer honestly..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors resize-none"
              />

              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                <i className="fas fa-lock mr-1" />
                Your answer is encrypted and private
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium transition-all hover:border-[var(--color-accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <i className="fas fa-arrow-left" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentAnswer.trim() || submitting}
            className="px-6 py-3 rounded-lg bg-[var(--color-accent-primary)] text-[var(--color-bg-primary)] font-semibold transition-all hover:bg-[var(--color-accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Generating Mirror...
              </>
            ) : isLastQuestion ? (
              <>
                Complete Session
                <i className="fas fa-check" />
              </>
            ) : (
              <>
                Next
                <i className="fas fa-arrow-right" />
              </>
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
          <h3 className="text-sm uppercase tracking-wider text-[var(--color-accent-primary)] mb-3">
            <i className="fas fa-lightbulb mr-2" />
            Tips for Deeper Reflection
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li>• Be specific with examples from your life</li>
            <li>• Notice if you're avoiding or deflecting</li>
            <li>• There are no wrong answers—honesty matters most</li>
            <li>• Take breaks if you need them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

