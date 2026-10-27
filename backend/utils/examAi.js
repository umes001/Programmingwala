import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generate structured examination questions using Google Gemini API
 */
export const generateQuestionsWithAI = async ({
  subject = 'Java',
  course = 'Java Full Stack',
  topic = 'Core Syntax',
  subtopic = '',
  questionType = 'MCQ',
  difficulty = 'MEDIUM',
  count = 5,
  programmingLanguage = 'Java',
  marks = 2,
  negativeMarks = 0.5,
  additionalInstructions = ''
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables.');
  }

  const prompt = `
You are an expert technical computer science examiner and software engineering professor.
Generate exactly ${count} high-quality, professional examination questions.

Parameters:
- Subject: ${subject}
- Course: ${course}
- Topic: ${topic} ${subtopic ? '(' + subtopic + ')' : ''}
- Question Type: ${questionType} (Options: MCQ, DESCRIPTIVE, CODE_ERROR, TRUE_FALSE)
- Difficulty Level: ${difficulty} (EASY, MEDIUM, or HARD)
- Programming Language: ${programmingLanguage}
- Marks per question: ${marks}
- Negative Marks: ${negativeMarks}
${additionalInstructions ? 'Special Instructions: ' + additionalInstructions : ''}

You MUST reply with ONLY a strictly valid JSON array of objects. Do not include markdown code block backticks (e.g. no triple backticks). Output pure JSON only.

JSON Object Structure specifications by Question Type:

1. If questionType is "MCQ":
[
  {
    "question_type": "MCQ",
    "question_text": "What is ...?",
    "marks": ${marks},
    "negative_marks": ${negativeMarks},
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "topic": "${topic}",
    "explanation": "Detailed explanation of why the correct option is right.",
    "correct_answer": "B",
    "options": [
      { "option_key": "A", "option_text": "First option", "is_correct": false },
      { "option_key": "B", "option_text": "Second option (correct)", "is_correct": true },
      { "option_key": "C", "option_text": "Third option", "is_correct": false },
      { "option_key": "D", "option_text": "Fourth option", "is_correct": false }
    ]
  }
]

2. If questionType is "DESCRIPTIVE":
[
  {
    "question_type": "DESCRIPTIVE",
    "question_text": "Explain in detail ...",
    "model_answer": "Comprehensive ideal answer explaining concepts...",
    "expected_answer": "Key points expected in response...",
    "keywords": "keyword1, keyword2, keyword3",
    "evaluation_method": "AI_ASSISTED",
    "marks": ${marks},
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "topic": "${topic}",
    "explanation": "Scoring rubric guidelines"
  }
]

3. If questionType is "CODE_ERROR":
[
  {
    "question_type": "CODE_ERROR",
    "question_text": "Identify and explain the compile-time or runtime mistake in the following code:",
    "programming_language": "${programmingLanguage}",
    "code": "public class Sample { ... }",
    "expected_error": "Type mismatch: cannot convert from String to int at line 3",
    "correct_code": "public class Sample { ... corrected ... }",
    "explanation": "Explanation of the bug and how the correction fixes it.",
    "marks": ${marks},
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "topic": "${topic}"
  }
]

4. If questionType is "TRUE_FALSE":
[
  {
    "question_type": "TRUE_FALSE",
    "question_text": "State whether the following statement is TRUE or FALSE.",
    "statement": "In Java, an interface can implement another interface.",
    "correct_answer": "FALSE",
    "explanation": "Interfaces extend other interfaces; classes implement interfaces.",
    "marks": ${marks},
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "topic": "${topic}"
  }
]

Return strictly the raw JSON array.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Clean raw output to guarantee pure JSON
  const cleanedJson = rawText
    .replace(/^\s*```(json)?/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    const questions = JSON.parse(cleanedJson);
    if (!Array.isArray(questions)) {
      throw new Error('AI response was not a JSON array.');
    }
    return questions;
  } catch (parseErr) {
    console.error('Failed to parse Gemini output:', rawText);
    throw new Error(`Failed to parse AI generated questions: ${parseErr.message}`);
  }
};

/**
 * AI-Assisted Evaluation for Descriptive and Code-Error Student Answers
 */
export const evaluateStudentAnswerWithAI = async ({
  questionText,
  modelAnswer,
  expectedAnswer,
  keywords = '',
  maxMarks = 5,
  studentAnswer,
  correctedCode = ''
}) => {
  if (!GEMINI_API_KEY || !studentAnswer) {
    return {
      score: 0,
      maxScore: maxMarks,
      feedback: 'Answer submitted for manual review.',
      confidence: 0.5
    };
  }

  const prompt = `
You are an objective, fair computer science university evaluator.
Evaluate the student's submission against the question and reference answers.

Question:
${questionText}

Reference / Model Answer:
${modelAnswer || expectedAnswer || 'N/A'}

Expected Keywords:
${keywords || 'N/A'}

Maximum Marks: ${maxMarks}

Student's Written Explanation:
${studentAnswer}

${correctedCode ? 'Student\'s Corrected Code:\n' + correctedCode : ''}

Provide a fair evaluation. Respond ONLY with a JSON object in this exact format:
{
  "score": <number between 0 and ${maxMarks}>,
  "maxScore": ${maxMarks},
  "feedback": "<brief constructive feedback explaining the score>",
  "confidence": <number between 0.0 and 1.0>
}
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    });

    if (!response.ok) {
      return { score: 0, maxScore: maxMarks, feedback: 'AI evaluation service unavailable. Pending manual review.', confidence: 0 };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/^\s*```(json)?/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return {
      score: 0,
      maxScore: maxMarks,
      feedback: 'Pending manual teacher review: ' + err.message,
      confidence: 0
    };
  }
};

export default {
  generateQuestionsWithAI,
  evaluateStudentAnswerWithAI
};
