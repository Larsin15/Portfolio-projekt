"use client";

import { useState } from "react";

interface MirrorContextViewerProps {
  content: string;
}

export function MirrorContextViewer({ content }: MirrorContextViewerProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }

  // Simple markdown-like rendering
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-[var(--color-text-secondary)]">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold font-[family-name:var(--font-display)] text-gradient mb-6 mt-8 first:mt-0">
            {trimmed.slice(2)}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-[var(--color-text-primary)] mb-4 mt-8">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-[var(--color-accent-primary)] mb-3 mt-6">
            {trimmed.slice(4)}
          </h3>
        );
      }
      // List items
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        inList = true;
        listItems.push(trimmed.slice(2));
      }
      // Bold text in paragraphs
      else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-[var(--color-text-primary)] mb-2">
            {trimmed.slice(2, -2)}
          </p>
        );
      }
      // Italic/emphasis
      else if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
        flushList();
        elements.push(
          <p key={index} className="italic text-[var(--color-text-muted)] mb-4">
            {trimmed.slice(1, -1)}
          </p>
        );
      }
      // Horizontal rule
      else if (trimmed === "---" || trimmed === "***") {
        flushList();
        elements.push(
          <hr key={index} className="border-[var(--color-border)] my-8" />
        );
      }
      // Regular paragraphs
      else if (trimmed) {
        flushList();
        // Handle inline formatting
        const formatted = trimmed
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-[var(--color-bg-tertiary)] px-1 rounded">$1</code>');
        
        elements.push(
          <p 
            key={index} 
            className="text-[var(--color-text-secondary)] mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      }
      // Empty lines
      else {
        flushList();
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="relative">
      {/* Copy button */}
      <button
        type="button"
        onClick={copyToClipboard}
        className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-sm transition-all hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
      >
        <i className={`fas ${copied ? "fa-check" : "fa-copy"} mr-2`} />
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Content */}
      <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
        {renderContent()}
      </div>
    </div>
  );
}

