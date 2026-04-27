import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID required" });
  }

  try {
    const raw = await redis.get(`compass:results:${id}`);

    if (!raw) {
      return res.status(404).json({ error: "Results not found or expired" });
    }

    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get results error:", error);
    return res.status(500).json({ error: "Failed to retrieve results" });
  }
}
