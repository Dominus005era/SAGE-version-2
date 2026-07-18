import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "dummy-gemini-api-key";
const ai = new GoogleGenAI({ apiKey });

export async function askAIAnalyzer(
  message: string,
  stats: Record<string, number>,
  currentRoutine?: any
): Promise<string> {
  const statsString = Object.entries(stats)
    .map(([k, v]) => `- ${k}: ${v} generated`)
    .join("\n");

  const prompt = `You are SAGE Analyzer, a highly advanced cognitive coach for an AI-driven learning platform.
The user is asking: "${message}"

Here are the user's learning stats on SAGE:
${statsString}

Current pinned routine: ${currentRoutine ? JSON.stringify(currentRoutine) : "None pinned"}

Please analyze their stats, suggest focus areas, and recommend a structured routine if requested.
Keep your tone encouraging, highly technical, and concise.

FORMATTING RULES FOR ROUTINES:
If the user asks for a routine, format the ROUTINE block at the bottom of your response in valid JSON as follows:

1. For a DAILY routine (e.g. "suggest a daily routine"):
ROUTINE: {
  "type": "daily",
  "tasks": [
    {"task": "Complete 5 Facts", "count": 5, "type": "fact"},
    {"task": "Solve 3 Quizzes", "count": 3, "type": "quiz"},
    {"task": "Solve 1 Logic Challenge", "count": 1, "type": "logic"}
  ]
}

2. For a WEEKLY routine without daily breakdown (e.g. "suggest a weekly routine"):
ROUTINE: {
  "type": "weekly",
  "tasks": [
    {"task": "Complete 25 Facts", "count": 25, "type": "fact"},
    {"task": "Solve 15 Quizzes", "count": 15, "type": "quiz"},
    {"task": "Finish 3 Logic Challenges", "count": 3, "type": "logic"}
  ]
}

3. For a MONTHLY routine (e.g. "suggest a monthly routine"):
ROUTINE: {
  "type": "monthly",
  "tasks": [
    {"task": "Complete 100 Facts", "count": 100, "type": "fact"},
    {"task": "Solve 50 Quizzes", "count": 50, "type": "quiz"},
    {"task": "Master 10 Logic Challenges", "count": 10, "type": "logic"}
  ]
}

4. For a WEEKLY routine WITH DAILY TASKS (e.g. "weekly routine with daily tasks", "day by day routine", "day to day routine"):
ROUTINE: {
  "type": "weekly_daily",
  "days": [
    {"dayNumber": 1, "dayName": "Day 1", "tasks": [{"task": "Complete 5 Facts", "count": 5, "type": "fact"}, {"task": "Solve 2 Quizzes", "count": 2, "type": "quiz"}]},
    {"dayNumber": 2, "dayName": "Day 2", "tasks": [{"task": "Read 3 Stories", "count": 3, "type": "story"}, {"task": "Solve 1 Logic Challenge", "count": 1, "type": "logic"}]},
    {"dayNumber": 3, "dayName": "Day 3", "tasks": [{"task": "Debunk 2 Myths", "count": 2, "type": "myth"}, {"task": "Complete 4 Quizzes", "count": 4, "type": "quiz"}]},
    {"dayNumber": 4, "dayName": "Day 4", "tasks": [{"task": "Complete 5 Facts", "count": 5, "type": "fact"}, {"task": "Analyze 1 Case Study", "count": 1, "type": "case_study"}]},
    {"dayNumber": 5, "dayName": "Day 5", "tasks": [{"task": "Play 2 Scenarios", "count": 2, "type": "scenario"}, {"task": "Solve 2 Logic Challenges", "count": 2, "type": "logic"}]},
    {"dayNumber": 6, "dayName": "Day 6", "tasks": [{"task": "Participate in 2 AI Debates", "count": 2, "type": "discussion"}, {"task": "Complete 3 Quizzes", "count": 3, "type": "quiz"}]},
    {"dayNumber": 7, "dayName": "Day 7", "tasks": [{"task": "Complete 5 Facts", "count": 5, "type": "fact"}, {"task": "Finish Weekly Logic Review", "count": 1, "type": "logic"}]}
  ]
}`;

  if (!process.env.GEMINI_API_KEY || apiKey === "dummy-gemini-api-key") {
    return getMockResponse(message, stats);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || getMockResponse(message, stats);
  } catch (error) {
    console.error("AI Analyzer Error:", error);
    return getMockResponse(message, stats);
  }
}

function getMockResponse(query: string, stats: Record<string, number>): string {
  const lower = query.toLowerCase();

  const isMonthly = lower.includes("monthly") || lower.includes("month") || lower.includes("montly") || lower.includes("30 day");
  const isWeekly = lower.includes("weekly") || lower.includes("week") || lower.includes("wekly") || lower.includes("7 day");
  const isWeeklyDaily = (isWeekly && (lower.includes("daily") || lower.includes("day"))) || lower.includes("day by day") || lower.includes("day to day");

  // 1. Weekly Routine with Daily Tasks / Day-by-day
  if (isWeeklyDaily) {
    return `Synthesizing a structured 7-Day Protocol for your cognitive learning plan.

Here is your customized Week-long Day-by-Day Routine:
ROUTINE: {
  "type": "weekly_daily",
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Day 1",
      "tasks": [
        {"task": "Complete 5 Facts", "count": 5, "type": "fact"},
        {"task": "Solve 2 Quizzes", "count": 2, "type": "quiz"}
      ]
    },
    {
      "dayNumber": 2,
      "dayName": "Day 2",
      "tasks": [
        {"task": "Read 3 Stories", "count": 3, "type": "story"},
        {"task": "Solve 1 Logic Challenge", "count": 1, "type": "logic"}
      ]
    },
    {
      "dayNumber": 3,
      "dayName": "Day 3",
      "tasks": [
        {"task": "Debunk 2 Myths", "count": 2, "type": "myth"},
        {"task": "Complete 4 Quizzes", "count": 4, "type": "quiz"}
      ]
    },
    {
      "dayNumber": 4,
      "dayName": "Day 4",
      "tasks": [
        {"task": "Complete 5 Facts", "count": 5, "type": "fact"},
        {"task": "Analyze 1 Case Study", "count": 1, "type": "case_study"}
      ]
    },
    {
      "dayNumber": 5,
      "dayName": "Day 5",
      "tasks": [
        {"task": "Play 2 Scenarios", "count": 2, "type": "scenario"},
        {"task": "Solve 2 Logic Challenges", "count": 2, "type": "logic"}
      ]
    },
    {
      "dayNumber": 6,
      "dayName": "Day 6",
      "tasks": [
        {"task": "Participate in 2 AI Debates", "count": 2, "type": "discussion"},
        {"task": "Complete 3 Quizzes", "count": 3, "type": "quiz"}
      ]
    },
    {
      "dayNumber": 7,
      "dayName": "Day 7",
      "tasks": [
        {"task": "Complete 5 Facts", "count": 5, "type": "fact"},
        {"task": "Finish Weekly Logic Review", "count": 1, "type": "logic"}
      ]
    }
  ]
}

Pin this routine to your dashboard to activate the 7-day progression! Day 1 will appear in your active view, and as you advance, completed or incomplete days will archive into mini status boxes below.`;
  }

  // 2. Monthly Routine
  if (isMonthly) {
    return `Developing long-term cognitive strategy... Here is your 30-Day Master Trajectory.

ROUTINE: {
  "type": "monthly",
  "tasks": [
    {"task": "Complete 100 Facts", "count": 100, "type": "fact"},
    {"task": "Solve 50 Quizzes", "count": 50, "type": "quiz"},
    {"task": "Participate in 10 AI Debates", "count": 10, "type": "discussion"},
    {"task": "Master 10 Logic Challenges", "count": 10, "type": "logic"}
  ]
}

Pin this routine to maintain a 30-day continuous learning streak!`;
  }

  // 3. Weekly Routine
  if (isWeekly) {
    return `Analyzing cognitive throughput... I recommend a balanced 7-day active recall regimen.

Here is your Weekly Routine:
ROUTINE: {
  "type": "weekly",
  "tasks": [
    {"task": "Complete 25 Facts", "count": 25, "type": "fact"},
    {"task": "Solve 15 Quizzes", "count": 15, "type": "quiz"},
    {"task": "Analyze 5 Case Studies", "count": 5, "type": "case_study"},
    {"task": "Finish 3 Logic Challenges", "count": 3, "type": "logic"}
  ]
}

Pin this routine to track your 7-day cognitive goals!`;
  }

  // 4. Default Daily Routine
  if (lower.includes("routine") || lower.includes("schedule") || lower.includes("plan") || lower.includes("daily")) {
    return `Based on your profile analytics, your cognitive development is progressing well. However, you need to balance your active recall modes. I suggest prioritizing Logic Challenges to build structural thinking.

Here is your custom Daily Routine (Valid for 24 Hours):
ROUTINE: {
  "type": "daily",
  "tasks": [
    {"task": "Complete 5 Facts", "count": 5, "type": "fact"},
    {"task": "Solve 3 Quizzes", "count": 3, "type": "quiz"},
    {"task": "Finish 1 Logic Challenge", "count": 1, "type": "logic"}
  ]
}

Pin this routine to your dashboard! If no tasks are completed within 1 day, the routine pin will automatically clear.`;
  }

  if (lower.includes("focus") || lower.includes("weak") || lower.includes("improve")) {
    return `Analyzing your recent learning metrics...
- Your **Fact Recall** is solid, but you are lacking dynamic reasoning practice.
- Recommend focusing on **AI Discussions** and **Scenarios** to test decision-making under uncertainty.
- Try a Socratic debate today on Philosophy or technology to stretch your conceptual boundaries.`;
  }

  return `Hello Operative. I am SAGE Analyzer. 
Looking at your stats, you have generated:
${Object.entries(stats).map(([k, v]) => `• ${v} ${k}s`).join("\n")}

How can I optimize your daily learning trajectory? Ask me to:
- "Suggest a daily routine"
- "Suggest a weekly routine with daily tasks"
- "Suggest a monthly routine"`;
}
