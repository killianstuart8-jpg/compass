import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "24 h"),
  analytics: true,
});

const SYSTEM_PROMPT = `You are "Compass" — a deeply insightful career and life direction counselor with the intuition of a seasoned therapist, the analytical precision of a career strategist, and the warmth of a trusted mentor.

Your mission: through a flowing, natural conversation, uncover who this person truly IS — not just what skills they have — and guide them toward career paths and life directions that will genuinely fulfill them.

CONVERSATION RULES:
- Ask ONE question at a time. Never overwhelm.
- Each question should feel deeply considered — not generic.
- Vary your question style: sometimes direct, sometimes reflective, sometimes imaginative.
- React warmly and thoughtfully to their answers before asking the next question.
- Build on what they've shared. Reference specific things they said.
- Aim for 8-12 questions total before generating results.
- Cover these areas naturally across the conversation: personality & energy, values & motivations, what they avoid/dislike, peak joy moments, work style preferences, impact they want to have on the world, financial vs. fulfillment balance, skills vs. passions.

RESULT GENERATION:
When you have gathered enough (after ~8-12 exchanges), output ONLY a JSON block in this exact format wrapped in <CAREER_RESULTS> tags, followed by a short warm closing message:

<CAREER_RESULTS>
{
  "summary": "2-3 sentence deeply personal summary of who this person is",
  "primaryCareer": {
    "title": "Career Title",
    "fit": 97,
    "description": "Why this is a perfect fit for them specifically",
    "path": [
      "Concrete first step to get started this week",
      "Second milestone (weeks to months)",
      "Third milestone (months to 1 year)",
      "Long-term vision (1-3 years)"
    ]
  },
  "alternativeCareers": [
    { "title": "Career Title", "fit": 89, "description": "Brief explanation" },
    { "title": "Career Title", "fit": 84, "description": "Brief explanation" },
    { "title": "Career Title", "fit": 79, "description": "Brief explanation" }
  ],
  "coreStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "watchOut": "One honest, compassionate caution about a pattern or blind spot"
}
</CAREER_RESULTS>`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    "anonymous";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return res.status(429).json({
      error: "You've reached the daily limit for Compass sessions. Please come back tomorrow to continue your journey.",
    });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: messages,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return res.status(500).json({
      error: "AI service error. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
```

---

Once you've replaced it, save the file and then run in your terminal:
```
git add .
git commit -m "Add rate limiting"
git push
