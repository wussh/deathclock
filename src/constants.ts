export const DEFAULT_USER_DATA = {
  age: 28,
  expectedAge: 80,
  sleepHours: 8,
  workHours: 8,
  leisureHours: 4,
  socialHours: 2,
  hobbies: [],
};

export const GOAL_CATEGORIES = [
  'Skill',
  'Health',
  'Project',
  'Travel',
  'Relationship',
  'Other',
];

export const GEMINI_GOAL_ANALYZER_PROMPT = `
You are a pragmatic life strategist. Your job is to estimate the realistic number of hours someone needs to achieve a specific goal.
BE HONEST AND REALISTIC. Don't underestimate.

Goal: "{goal}"
Category: "{category}"

Provide a JSON response with the following structure:
{
  "estimatedHours": number,
  "rationale": "short 1-2 sentence explanation",
  "milestones": ["milestone 1", "milestone 2", "milestone 3"],
  "guiltTrip": "A punchy, slightly haunting sentence about why they should start now instead of later.",
  "costOfDelay": "A concrete gap showing where they would be right now if they had started 1 year ago. E.g., 'If you started 1 year ago, you would already be speaking conversational French right now.' or 'You would already have $10,000 saved.'."
}
`;

export const GEMINI_SWAP_ANALYZER_PROMPT = `
I am saving {hours} hours per year by reducing my time spent on "{activity}".
Given these {hours} hours, what is ONE specific, impressive, and realistic skill or goal I could achieve in a year with that time?
For example, if it's 200 hours, maybe "learn conversational Spanish" or "write a 50,000 word novel".
Be specific, punchy, and make it sound like an exciting trade-off.

Provide a JSON response with the following structure:
{
  "achievableGoal": "String describing the goal in a short phrase (e.g. 'Read 40 books', 'Learn to play the piano')",
  "commentary": "A short, witty, slightly haunting comment about the trade-off."
}
`;
