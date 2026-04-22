import { Redis } from "@upstash/redis";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simple password check
  const { password, limit = "50", offset = "0" } = req.query;
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).json({ error: "Redis not configured" });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const limitNum = Math.min(parseInt(limit), 100);
    const offsetNum = parseInt(offset);

    // Get total count
    const total = await redis.zcard("logs:index");

    // Get keys in reverse chronological order (newest first)
    const keys = await redis.zrange(
      "logs:index",
      -(offsetNum + limitNum),
      -(offsetNum + 1),
      { rev: true }
    );

    if (!keys || keys.length === 0) {
      return res.status(200).json({ logs: [], total: 0 });
    }

    // Fetch all log entries
    const entries = await Promise.all(
      keys.map(async (key) => {
        const raw = await redis.get(key);
        if (!raw) return null;
        try {
          return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return null;
        }
      })
    );

    const logs = entries.filter(Boolean);

    return res.status(200).json({ logs, total });
  } catch (error) {
    console.error("Admin logs error:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}
