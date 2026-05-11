import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_GOAL_ANALYZER_PROMPT, GEMINI_SWAP_ANALYZER_PROMPT } from "../constants";
import { GoalInsight, SwapInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSwap(hours: number, activity: string): Promise<SwapInsight> {
  const prompt = GEMINI_SWAP_ANALYZER_PROMPT
    .replace("{hours}", hours.toFixed(1))
    .replace(/{activity}/g, activity);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            achievableGoal: { type: Type.STRING },
            commentary: { type: Type.STRING },
          },
          required: ["achievableGoal", "commentary"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as SwapInsight;
  } catch (error) {
    console.error("AI Swap Analysis failed:", error);
    return {
      achievableGoal: "Master a new hobby",
      commentary: "Your time is your life. Spend it wisely.",
    };
  }
}

export async function analyzeGoal(goal: string, category: string): Promise<GoalInsight> {
  const prompt = GEMINI_GOAL_ANALYZER_PROMPT
    .replace("{goal}", goal)
    .replace("{category}", category);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedHours: { type: Type.NUMBER },
            rationale: { type: Type.STRING },
            milestones: { type: Type.ARRAY, items: { type: Type.STRING } },
            guiltTrip: { type: Type.STRING },
          },
          required: ["estimatedHours", "rationale", "milestones", "guiltTrip"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as GoalInsight;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      estimatedHours: 100,
      rationale: "Default estimation. AI was unavailable.",
      milestones: ["Research", "Practice", "Complete"],
      guiltTrip: "Time waits for no one.",
    };
  }
}
