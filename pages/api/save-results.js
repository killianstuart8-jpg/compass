import { Redis } from "@upstash/redis";
import { randomBytes } from "crypto";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { results, email } = req.body;

  if (!results) {
    return res.status(400).json({ error: "Results required" });
  }

  try {
    // Generate a short unique ID
    const id = randomBytes(6).toString("hex");

    // Store in Redis with 90-day TTL
    await redis.set(
      `compass:results:${id}`,
      JSON.stringify({
        results,
        email: email || null,
        createdAt: Date.now(),
      }),
      { ex: 60 * 60 * 24 * 90 }
    );

    // Subscribe email to Beehiiv if provided
    if (
      email &&
      process.env.BEEHIIV_API_KEY &&
      process.env.BEEHIIV_PUBLICATION_ID
    ) {
      try {
        await fetch(
          `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email,
              reactivate_existing: false,
              send_welcome_email: true,
            }),
          }
        );
      } catch {
        // Don't fail the whole request if Beehiiv errors
      }
    }

    return res.status(200).json({ id });
  } catch (error) {
    console.error("Save results error:", error);
    return res.status(500).json({ error: "Failed to save results" });
  }
}
