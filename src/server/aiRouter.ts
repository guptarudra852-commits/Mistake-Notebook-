import { Router } from "express";
import { GoogleGenAI, Type } from "@google/genai";

const router = Router();

// Retrieve API key from environment variable or fallback to provided default key
const getApiKey = () => process.env.GEMINI_API_KEY || "fdec747420bb95e11a4ea8f919d18d9c";

function getGenAI() {
  const apiKey = getApiKey();
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. AI Mistake Diagnostic & Golden Takeaway Generator
router.post("/analyze-mistake", async (req, res) => {
  try {
    const { title, question, myWrongAnswer, correctAnswer, subject, topic, mistakeType } = req.body;

    const ai = getGenAI();
    const prompt = `You are an expert academic tutor and diagnostic specialist. Analyze this student error in detail:
Subject: ${subject || "General Academic"}
Topic: ${topic || "General"}
Title: ${title || "Mistake"}
Question/Problem: ${question || "Not provided"}
Student's Wrong Answer: ${myWrongAnswer || "Not provided"}
Correct Answer: ${correctAnswer || "Not provided"}
Stated Error Category: ${mistakeType || "unspecified"}

Provide a deep diagnostic response with root cause analysis, clear explanation of why the wrong answer was produced, the underlying mathematical or conceptual rule, a memorable 'golden takeaway' (mnemonic or rule of thumb), and a practice variation question with step-by-step solution.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging, highly precise AI study coach. Provide structured, actionable academic guidance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rootCause: {
              type: Type.STRING,
              description: "Precise classification of the cognitive or technical error.",
            },
            detailedAnalysis: {
              type: Type.STRING,
              description: "Step-by-step explanation of where the reasoning deviated.",
            },
            goldenTakeaway: {
              type: Type.STRING,
              description: "A short, catchy rule of thumb or mnemonic to never repeat this error.",
            },
            recommendedAction: {
              type: Type.STRING,
              description: "Concrete step to master this topic.",
            },
            similarExampleQuestion: {
              type: Type.STRING,
              description: "A practice variation question to test understanding.",
            },
            similarExampleSolution: {
              type: Type.STRING,
              description: "Complete solution to the practice variation.",
            },
          },
          required: ["rootCause", "detailedAnalysis", "goldenTakeaway", "recommendedAction", "similarExampleQuestion", "similarExampleSolution"],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-mistake:", error);
    res.status(500).json({ success: false, error: error.message || "AI Analysis failed" });
  }
});

// 2. AI Quiz & Practice Flashcard Generator
router.post("/generate-flashcards", async (req, res) => {
  try {
    const { mistakes } = req.body;
    if (!Array.isArray(mistakes) || mistakes.length === 0) {
      return res.status(400).json({ success: false, error: "No mistakes provided for practice generation." });
    }

    const ai = getGenAI();
    const mistakesText = mistakes
      .map(
        (m, i) =>
          `[Item ${i + 1}] Subject: ${m.subjectId || "General"}, Topic: ${m.topic}, Question: ${m.question}, Wrong Answer: ${m.myWrongAnswer}, Correct Answer: ${m.correctAnswer}, Takeaway: ${m.goldenTakeaway}`
      )
      .join("\n");

    const prompt = `Based on these recorded academic errors, create 4 targeted multiple-choice practice quiz flashcards that directly test and reinforce those exact weak areas:\n${mistakesText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Generate realistic exam-style practice questions based on past mistakes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
            },
            required: ["id", "subject", "question", "options", "correctAnswer", "explanation", "hint"],
          },
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "[]";
    const data = JSON.parse(jsonText);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-flashcards:", error);
    res.status(500).json({ success: false, error: error.message || "Flashcard generation failed" });
  }
});

// 3. AI Exam Preparation & Weakspot Diagnostic Plan
router.post("/generate-study-report", async (req, res) => {
  try {
    const { summary } = req.body;
    const ai = getGenAI();

    const prompt = `Analyze this overall academic error breakdown for a student and build an AI Exam Diagnostic & 7-Day Study Action Plan:\n${JSON.stringify(summary, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master academic strategist and study counselor.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallDiagnosis: { type: Type.STRING },
            highestRiskSubject: { type: Type.STRING },
            weakAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sevenDayPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focusTopic: { type: Type.STRING },
                  recommendedTask: { type: Type.STRING },
                },
                required: ["day", "focusTopic", "recommendedTask"],
              },
            },
            examDayStrategy: { type: Type.STRING },
          },
          required: ["overallDiagnosis", "highestRiskSubject", "weakAreas", "sevenDayPlan", "examDayStrategy"],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(jsonText);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-study-report:", error);
    res.status(500).json({ success: false, error: error.message || "Report generation failed" });
  }
});

export default router;
