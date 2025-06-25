import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const HF_TOKEN = process.env.HF_API_KEY;

app.get("/", (req, res) => {
  res.send("Server is running! Use POST /summarize");
});

app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const result = await response.json();
    const summary = result[0]?.summary_text || "Unable to summarize.";

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error summarizing content." });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
