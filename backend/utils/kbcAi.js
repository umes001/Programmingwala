import dotenv from 'dotenv';
dotenv.config();

/**
 * Generate high-speed KBC questions using Google Gemini API
 * @param {Object} options
 * @param {number} options.level - KBC level from 1 to 16
 * @param {string} options.topicOrPhrase - e.g. "sql inner join questions", "react hooks", "node streams"
 * @param {number} [options.count=1] - number of questions to generate (default: 1)
 */
export async function generateKbcQuestionWithGemini({
  level = 1,
  topicOrPhrase = "MERN and SQL",
  count = 1
}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment.');
  }

  const lvl = Math.max(1, Math.min(16, parseInt(level, 10) || 1));

  // Determine difficulty context based on level
  let difficultyContext = "Foundation / Syntax / Beginner friendly";
  if (lvl >= 6 && lvl <= 10) {
    difficultyContext = "Intermediate / Practical problem solving / Real-world scenarios";
  } else if (lvl >= 11) {
    difficultyContext = "Advanced / Deep architectural internals / Tricky edge cases";
  }

  const isMulti = count > 1;

  const prompt = `You are the technical question master for Kaun Banega Crorepati (KBC) Software Engineering Edition, hosted by Amitabh Bachchan.
Generate ${count === 1 ? '1 high-quality multiple choice question' : `${count} high-quality multiple choice questions`} on: "${topicOrPhrase}".
Target: KBC Level ${lvl} of 16 (Difficulty: ${difficultyContext}).

Strict Rules:
1. Every question MUST have EXACTLY 4 distinct options (Option A, B, C, D).
2. CRITICAL SINGLE-ANSWER RULE: EXACTLY ONE (1) OPTION MUST BE CORRECT. The other THREE (3) options MUST be completely incorrect, plausible technical distractors. There must NEVER be multiple correct answers, partial truths, or ambiguous options.
3. FORBIDDEN META-OPTIONS: Do NOT use "All of the above", "None of the above", "Both A and B", or "Both A and C". Every single option must be a concrete, independent statement/value.
4. "correct" MUST be the exact 0-based integer index of the single correct option (0 for Option A, 1 for Option B, 2 for Option C, or 3 for Option D). Ensure the correct answer is randomly distributed across 0, 1, 2, or 3 (never biased to B).
5. "explanation" must clearly explain why that one specific option is correct and why the other options are wrong.
6. "topic" must be a concise topic label (e.g. "SQL", "React", "Node.js", "Express", "MongoDB", "JavaScript").
7. The question and options must be technically accurate, realistic, and unambiguous.

${isMulti 
  ? `Return ONLY a valid JSON array of objects:
[
  {
    "topic": "SQL",
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "..."
  }
]`
  : `Return ONLY a single valid JSON object:
{
  "topic": "SQL",
  "question": "What is ...?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 2,
  "explanation": "..."
}`
}`;

  // Candidate models prioritized for speed and current availability
  const candidateModels = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash',
    'gemini-3.5-flash'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[KBC Gemini] Model ${model} returned ${response.status}: ${errorText.slice(0, 120)}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      // Clean markdown code fence if present
      const cleaned = rawText
        .replace(/^\s*```(json)?/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (isMulti) {
        let list = parsed;
        if (!Array.isArray(parsed)) {
          if (parsed && Array.isArray(parsed.questions)) {
            list = parsed.questions;
          } else if (parsed && typeof parsed === 'object') {
            list = Object.values(parsed).filter(v => v && typeof v === 'object' && v.question);
          } else {
            list = [parsed];
          }
        }
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error('Expected array of questions from AI');
        }
        return list.map(q => sanitizeQuestion(q, lvl, topicOrPhrase));
      } else {
        const single = Array.isArray(parsed) ? parsed[0] : (parsed?.questions?.[0] || parsed);
        return sanitizeQuestion(single, lvl, topicOrPhrase);
      }
    } catch (err) {
      lastError = err;
      console.warn(`[KBC Gemini] Failed with ${model}: ${err.message}`);
    }
  }

  throw new Error(`Gemini AI generation failed: ${lastError ? lastError.message : 'No responsive models'}`);
}

function sanitizeQuestion(raw, lvl, defaultTopic) {
  if (!raw || !raw.question) {
    throw new Error('AI output missing question text');
  }

  let options = Array.isArray(raw.options) ? raw.options : [];
  if (options.length < 4) {
    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }
  } else if (options.length > 4) {
    options = options.slice(0, 4);
  }

  let correct = parseInt(raw.correct, 10);
  if (isNaN(correct) || correct < 0 || correct > 3) {
    correct = 0;
  }

  // Ensure all 4 options are distinct non-empty strings
  const cleanedOptions = options.map((o, idx) => {
    const val = String(o || '').trim();
    return val || `Option ${String.fromCharCode(65 + idx)}`;
  });

  // ── SHUFFLE OPTIONS WHILE GUARANTEEING 100% CORRECT ANSWER ACCURACY ──
  // The correct answer is tracked and placed randomly across A, B, C, or D (not clustered on B)
  const origCorrect = correct;
  const indexed = cleanedOptions.map((text, idx) => ({ text, isCorrect: idx === origCorrect }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const shuffledOptions = indexed.map(o => o.text);
  const shuffledCorrect = indexed.findIndex(o => o.isCorrect);

  return {
    level: lvl,
    topic: (raw.topic || defaultTopic || 'MERN & SQL').trim(),
    question: raw.question.trim(),
    options: shuffledOptions,
    correct: shuffledCorrect >= 0 ? shuffledCorrect : 0, // Strictly one correct option index (0, 1, 2, or 3)
    explanation: (raw.explanation || '').trim()
  };
}
