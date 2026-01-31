/**
 * Ollama LLM client for Personality Miner.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Generate a completion from Ollama.
 */
export async function generate(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}

/**
 * Check if Ollama is available.
 */
export async function isAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate questions based on user aspects.
 * Falls back to template questions if Ollama is unavailable.
 */
export async function generateQuestions(aspects: string[]): Promise<string[]> {
  const available = await isAvailable();

  if (!available) {
    // Fallback to template questions
    return getTemplateQuestions(aspects);
  }

  const systemPrompt = `You are a compassionate but direct self-discovery facilitator trained in CBT and ACT methodologies.
Generate exactly 15 probing, personalized questions based on the aspects the user wants to explore.
Each question should be 1-2 sentences max, specific, and challenge patterns without judgment.
Return ONLY the numbered questions, one per line (1. Question... 2. Question... etc).`;

  const prompt = `The user wants to explore these aspects of themselves:
${aspects.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Generate 15 self-discovery questions tailored to these topics.`;

  try {
    const response = await generate(prompt, systemPrompt);
    
    // Parse numbered questions from response
    const lines = response.split("\n").filter((line) => line.trim());
    const questions = lines
      .map((line) => {
        // Remove number prefix like "1. " or "1) "
        return line.replace(/^\d+[\.\)]\s*/, "").trim();
      })
      .filter((q) => q.length > 10);

    if (questions.length >= 10) {
      return questions.slice(0, 15);
    }
    
    // Fallback if parsing fails
    return getTemplateQuestions(aspects);
  } catch (error) {
    console.error("Ollama generation failed:", error);
    return getTemplateQuestions(aspects);
  }
}

/**
 * Template questions when Ollama is unavailable.
 */
function getTemplateQuestions(aspects: string[]): string[] {
  const baseQuestions = [
    "What topics or situations do you find yourself consistently avoiding in conversations?",
    "When you say 'anyway' or 'whatever' to change subjects, what are you typically trying to escape from?",
    "You often ask 'what do you think?' - whose approval matters most to you and why?",
    "When was the last time you made a significant decision without seeking external validation?",
    "When you say 'I can't', is it truly impossible or just uncomfortable?",
    "What power do you have in situations where you feel stuck?",
    "When you analyze emotions 'logically', what feeling are you avoiding?",
    "What would happen if you let yourself fully feel without explaining it?",
    "What boundary do you repeatedly fail to set, and what does it cost you?",
    "When do you say 'yes' when you mean 'no'?",
    "What pattern do you notice in your relationship conflicts?",
    "When relationships get difficult, what is your typical response - fight, flight, freeze, or fawn?",
    "What truth about yourself do you resist accepting?",
    "What would your harshest critic say about you, and how much of it is true?",
    "What is the smallest boundary you can set today that prevents a bigger conflict later?",
  ];

  // Add aspect-specific framing
  const aspectIntro = aspects.length > 0
    ? `Thinking about ${aspects.join(", ")}... `
    : "";

  return baseQuestions.map((q, i) => 
    i === 0 ? `${aspectIntro}${q}` : q
  );
}

/**
 * Generate mirror context from Q&A pairs.
 */
export async function generateMirrorContext(
  qaPairs: Array<{ question: string; answer: string }>
): Promise<string> {
  const available = await isAvailable();

  if (!available) {
    return getTemplateMirrorContext(qaPairs);
  }

  const systemPrompt = `You are creating a "Mirror Context" document - a structured self-reflection tool based on CBT/ACT principles.
Based on the Q&A responses, create a comprehensive document with:
1. EXECUTIVE SUMMARY (5-10 bullet points of key patterns with evidence)
2. CORE PATTERNS (3-6 patterns with: what it looks like, evidence quotes, likely function, cost, replacement behavior)
3. TRIGGERS, NEEDS, AND NON-NEGOTIABLES (top 5 each with evidence)
4. MIRRORING RULES (linguistic cues to watch, what to challenge, what to validate)

Be direct but compassionate. Only state what's supported by evidence. Use their exact words when quoting.`;

  const prompt = `Create a Mirror Context document based on these Q&A responses:

${qaPairs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`).join("\n\n")}

Generate a structured analysis using markdown formatting.`;

  try {
    return await generate(prompt, systemPrompt);
  } catch (error) {
    console.error("Mirror generation failed:", error);
    return getTemplateMirrorContext(qaPairs);
  }
}

/**
 * Template mirror context when Ollama is unavailable.
 */
function getTemplateMirrorContext(
  qaPairs: Array<{ question: string; answer: string }>
): string {
  const answersText = qaPairs.map((qa) => qa.answer).join(" ");
  const wordCount = answersText.split(/\s+/).length;

  return `# Mirror Context

*Generated from ${qaPairs.length} questions, ${wordCount} words of reflection*

## 1) Executive Summary

- Your responses show patterns worth exploring deeper
- Consider reviewing your answers for recurring themes
- Note moments where you felt resistance or avoidance
- Pay attention to the language you used to describe emotions
- Track situations that trigger strong reactions

## 2) Core Patterns

### Pattern: Self-Awareness in Progress
- **What it looks like**: You engaged with introspective questions
- **Evidence**: Your ${qaPairs.length} answers demonstrate willingness to reflect
- **Likely function**: Seeking understanding of yourself
- **Cost**: Unknown until patterns become clearer
- **Replacement behavior**: Continue with regular self-reflection sessions

## 3) Triggers, Needs, and Non-Negotiables

### Triggers (to explore)
- Review answers where you felt strongest emotions
- Note topics you wrote most/least about
- Consider what made certain questions harder

### Needs (hypotheses)
- Understanding yourself better
- Tools for managing difficult situations
- Validation of your experiences

### Non-Negotiables (to define)
- What boundaries are essential to you?
- What values won't you compromise?

## 4) Mirroring Rules

### Watch for
- Moments of deflection or minimization
- "Anyway" and "whatever" as topic changers
- Over-explaining or justifying

### To challenge
- Absolutes like "always" or "never"
- External blame without self-reflection
- Avoiding specific examples

### To validate
- Honest self-examination
- Recognition of patterns
- Willingness to be uncomfortable

---

*This is a preliminary analysis. For deeper insights, ensure the LLM service is running and complete another session.*
`;
}

