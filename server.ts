import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Requested Endpoints for SAGE
  app.get("/api/user/:userId", async (req, res) => {
    // In a real app, this would fetch from MongoDB/Firestore
    res.json({ message: "Use Firestore client SDK for real-time profile data" });
  });

  app.get("/api/fact/random", async (req, res) => {
    // This could trigger the Gemini service server-side if preferred
    res.json({ message: "Content is generated via Gemini on the client for low latency" });
  });

  app.post("/api/quiz/submit", (req, res) => {
    const { userId, correct } = req.body;
    // Logic to update XP and records
    res.json({ success: true, xpGained: correct ? 15 : 5 });
  });

  app.post("/api/settings/update", (req, res) => {
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAGE Server running on http://localhost:${PORT}`);
  });
}

startServer();
