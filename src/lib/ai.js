const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Generic text generation using Groq
export const generateInterviewContent = async (prompt) => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not found. Please add VITE_GROQ_API_KEY to your environment variables.");
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { 
            role: "system", 
            content: `You are an elite AI technical interviewer and career coach, modeling the capabilities of Claude 3.5 Sonnet. Your persona is a Senior Engineering Manager at a Tier-1 tech company (Google/Netflix/Stripe). You are rigorous, insightful, and demand technical excellence.

Guidelines:
1. ANALYTICAL DEPTH: Go beyond surface-level answers. Identify specific technical nuances, trade-offs, and architectural implications.
2. PSYCHOLOGICAL PRECISION: Evaluate confidence, tone, and 'seniority' markers in communication.
3. ACTIONABLE FEEDBACK: Provide structured, brutal-but-fair critiques that lead to genuine growth.
4. INDUSTRY STANDARDS: Use actual industry terminology, real-world constraints, and STAR method assessment.
5. DYNAMIC VARIETY: Never repeat common examples. Ensure every output is fresh, unique, and tailored specifically to the user's input.

Your goal is to forge candidates into high-performers. Never be generic. Always be precise.` 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`[GROQ] API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

// Transcribe Audio using Groq Whisper
export const transcribeAudio = async (audioBlob) => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not found.");
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-large-v3-turbo');

  try {
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`[GROQ] Audio API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Audio Transcription Error:", error);
    throw error;
  }
};

// Parse JSON safely from AI response (handles markdown code fences)
export const parseJsonFromAI = (text) => {
  // Remove possible markdown code blocks
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const firstBracket = cleaned.indexOf('[');
  const firstBrace = cleaned.indexOf('{');
  const start = (firstBracket !== -1 && firstBrace !== -1) 
    ? Math.min(firstBracket, firstBrace) 
    : Math.max(firstBracket, firstBrace);

  const lastBracket = cleaned.lastIndexOf(']');
  const lastBrace = cleaned.lastIndexOf('}');
  const end = (lastBracket !== -1 && lastBrace !== -1)
    ? Math.max(lastBracket, lastBrace) + 1
    : Math.max(lastBracket, lastBrace) + 1;
  if (start === -1 || end === 0) {
    console.error("Failed to parse JSON. Raw text:", text);
    throw new Error("Could not find valid JSON in AI response");
  }

  const jsonSlice = cleaned.slice(start, end);
  return JSON.parse(jsonSlice);
};

// Generate interview questions for a role
export const generateQuestions = async (role, level) => {
  const seed = Math.random().toString(36).substring(7);
  const prompt = `Generate exactly 10 interview questions for a ${level}-level ${role}. 
Ensure these questions are unique and challenging. Reference ID: ${seed}.
Return ONLY a valid JSON array. Format:
[
  {
    "question": "...",
    "category": "Behavioral",
    "difficulty": "Medium",
    "tips": "..."
  }
]`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// Generate MCQ questions for a role
export const generateMCQs = async (role, level) => {
  const seed = Math.random().toString(36).substring(7);
  const prompt = `Generate exactly 10 multiple choice questions for a ${level}-level ${role}.
Ensure these questions are varied and technical. Reference ID: ${seed}.
Return ONLY a valid JSON array. Format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 0,
    "explanation": "..."
  }
]`;

  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// ─── CHAOS MODE ───────────────────────────────────────────────────────────────
export const generateCurveball = async (currentQuestion, partialAnswer, persona) => {
  const prompt = `You are a ${persona} interviewer. The candidate is answering: "${currentQuestion}"
Their answer so far: "${partialAnswer}"

Interrupt them with ONE of the following (pick the most fitting):
1. A sharp pivot to a completely different topic
2. A skeptical challenge ("That sounds theoretical. Prove it with a real example.")
3. A harder follow-up that raises the stakes

Return ONLY the interruption text (1–2 sentences). Be direct, even slightly uncomfortable. No preamble.`;
  return await generateInterviewContent(prompt);
};

// ─── ANSWER EVOLUTION ─────────────────────────────────────────────────────────
export const generateRewriteChallenge = async (question, answer) => {
  const prompt = `A candidate answered this interview question:
Q: "${question}"
A: "${answer}"

Give them ONE specific, surgical rewrite challenge. Examples:
- "Restate this but remove every hedge word ('I think', 'maybe', 'sort of') and add one concrete number."
- "Cut this answer by 40% without losing the core point. Start with your result, not the situation."
- "Reframe the opening to lead with your biggest achievement, then explain how you got there."

Return ONLY the challenge instruction (2 sentences max). Be direct and specific.`;
  return await generateInterviewContent(prompt);
};

export const scoreAnswerImprovement = async (originalAnswer, improvedAnswer, question) => {
  const prompt = `Compare two answers to: "${question}"

Original: "${originalAnswer}"
Improved: "${improvedAnswer}"

Score the improvement across: Clarity, Confidence, Conciseness, Impact.
Return ONLY valid JSON:
{
  "improvementScore": 25,
  "grade": "B+",
  "bestChange": "Led with a specific metric instead of a vague claim.",
  "stillMissing": "Could still reduce filler words in the second half."
}`;
  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// ─── CONFIDENCE CALIBRATION ───────────────────────────────────────────────────
const CONFIDENCE_KILLERS = [
  'maybe', 'possibly', 'i think', 'i guess', 'sort of', 'kind of',
  'um', 'uh', 'like,', 'you know', 'basically', 'i mean', 'actually',
  'i suppose', 'i feel like', 'not sure', 'might be', 'could be'
];
const CONFIDENCE_BOOSTERS = [
  'specifically', 'achieved', 'led', 'built', 'delivered', 'increased',
  'decreased', 'resulted in', 'i decided', 'i implemented', 'i drove',
  'i launched', 'i reduced', 'i grew', 'directly', 'my decision'
];

export const scoreConfidenceSentence = (sentence) => {
  let score = 70;
  const lower = sentence.toLowerCase();
  CONFIDENCE_KILLERS.forEach(k => { if (lower.includes(k)) score -= 12; });
  CONFIDENCE_BOOSTERS.forEach(b => { if (lower.includes(b)) score += 10; });
  const words = sentence.trim().split(' ').filter(Boolean);
  if (words.length < 12) score += 5;
  if (words.length > 45) score -= 8;
  return Math.max(10, Math.min(100, score));
};

export const analyzeConfidence = (transcript) => {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 8);
  return sentences.map((s, i) => ({
    text: s.trim(),
    score: scoreConfidenceSentence(s),
    index: i
  }));
};

// ─── JOB DNA ──────────────────────────────────────────────────────────────────
export const parseJobDescription = async (jdText) => {
  const prompt = `Analyze this job description and extract structured data:
"${jdText.slice(0, 3000)}"

Return ONLY valid JSON:
{
  "role": "Software Engineer",
  "company": "Acme Corp",
  "coreCompetencies": ["Leadership", "System Design", "Data Structures"],
  "cultureKeywords": ["ownership", "fast-paced", "collaborative"],
  "redFlags": ["avoid mentioning job hopping", "don't oversell autonomy"],
  "customQuestions": [
    { "question": "...", "competency": "Leadership", "difficulty": "Hard" }
  ]
}
customQuestions must have exactly 8 questions tailored to THIS specific role and company.`;
  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

export const generateGapReport = async (competencies, answersMap) => {
  const prompt = `Job required competencies: ${JSON.stringify(competencies)}
Candidate answers: ${JSON.stringify(answersMap)}

For each competency, score coverage 1-10 and identify gaps.
Return ONLY valid JSON:
{
  "competencyScores": [
    { "name": "Leadership", "score": 7, "covered": "Mentioned leading a team of 5.", "missing": "No metrics on outcome." }
  ],
  "overallReadiness": 72,
  "topGap": "Quantifying impact",
  "verdict": "You covered 6 of 8 competencies. Focus on storytelling with numbers."
}`;
  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// ─── NEGOTIATION DOJO ─────────────────────────────────────────────────────────
export const negotiationResponse = async (role, marketRate, offerAmount, conversationHistory, candidateMessage) => {
  const prompt = `You are a hiring manager for a ${role} position.
Market rate: $${marketRate}k/year. Your initial offer: $${offerAmount}k/year.
Conversation so far:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
Candidate just said: "${candidateMessage}"

Respond as the hiring manager. Be realistic and human:
- If candidate is too aggressive, push back firmly but politely
- If candidate uses good tactics (anchoring, competing offer, market data), show slight flexibility
- Never go more than 15% above initial offer without exceptional justification
- Include brief body language cues in [brackets] like [pauses] or [leans forward]
- Keep response under 4 sentences. Sound like a real person, not a robot.`;
  return await generateInterviewContent(prompt);
};

export const scoreNegotiation = async (role, initialOffer, finalOffer, marketRate, conversationHistory) => {
  const prompt = `Score this salary negotiation:
Role: ${role}, Initial Offer: $${initialOffer}k, Market Rate: $${marketRate}k, Final: $${finalOffer}k
Conversation: ${JSON.stringify(conversationHistory)}

Return ONLY valid JSON:
{
  "outcomeScore": 85,
  "tacticsScore": 70,
  "mainTacticUsed": "anchoring",
  "missedOpportunity": "You never mentioned competing offers which would have given more leverage.",
  "totalGained": 8000,
  "verdict": "Good negotiation. You left about $5k on the table.",
  "grade": "B+"
}`;
  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};

// ─── PANEL PRESSURE ───────────────────────────────────────────────────────────
export const generatePanelQuestion = async (role, panelist, previousQA) => {
  const prompt = `You are ${panelist.name}, ${panelist.trait}, interviewing a ${role} candidate in a panel.
Previous Q&A in this session:
${previousQA.map(qa => `Q(${qa.panelist}): ${qa.question}\nA: ${qa.answer}`).join('\n\n')}

Ask ONE sharp question in character. Be distinctly different from other panelists.
You may reference something the candidate said before to dig deeper.
Return ONLY the question text (no preamble, no attribution).`;
  return await generateInterviewContent(prompt);
};

export const generatePanelistReaction = async (panelist, candidateAnswer) => {
  const prompt = `You are ${panelist.name}, ${panelist.trait}.
The candidate just answered: "${candidateAnswer}"

Give your quick 1-sentence reaction in character. Be authentic to your persona.
Examples: skepticism, approval, pushing deeper, redirecting. No preamble.`;
  return await generateInterviewContent(prompt);
};

// ─── FAILURE PATTERN X-RAY ────────────────────────────────────────────────────
export const extractWeaknessTags = async (question, answer, feedback) => {
  const validTags = [
    'Conflict Resolution', 'Leadership', 'Technical Depth', 'Conciseness',
    'Confidence', 'STAR Structure', 'Quantifying Impact', 'Storytelling',
    'Handling Failure', 'Negotiation', 'System Design', 'Communication'
  ];
  const prompt = `Based on this interview Q&A and feedback, identify weakness categories.
Question: "${question}"
Answer: "${answer}"
Feedback: "${feedback}"

Return ONLY a JSON array of 1-3 tags from this exact list:
${JSON.stringify(validTags)}

Example: ["STAR Structure", "Quantifying Impact"]`;
  const text = await generateInterviewContent(prompt);
  return parseJsonFromAI(text);
};
