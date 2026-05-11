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

export async function generateActionPlan(goal: string, hoursPerYear: number): Promise<string[]> {
  const prompt = `Create a concrete, sequential 4-week action plan to achieve the following goal: "${goal}".
The user has freed up ${hoursPerYear.toFixed(1)} hours per year for this.
Keep each week's step punchy, actionable and specific. Focus on momentum.
Return exactly 4 strings in a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    return JSON.parse(response.text || "[]") as string[];
  } catch (error) {
    console.error("AI Action Plan failed:", error);
    return [
      "Week 1: Research and foundational setup.",
      "Week 2: Begin core practice.",
      "Week 3: Increase intensity and seek feedback.",
      "Week 4: Review progress and adjust."
    ];
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
            costOfDelay: { type: Type.STRING },
          },
          required: ["estimatedHours", "rationale", "milestones", "guiltTrip", "costOfDelay"],
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
      costOfDelay: "If you started a year ago, you'd already be done.",
    };
  }
}
