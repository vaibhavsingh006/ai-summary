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

// app.post("/summarize", async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ error: "Missing text" });

//   try {
//     const response = await fetch(HF_API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ inputs: text }),
//     });

//     const result = await response.json();
//     console.log(result);
//     const summary = result[0]?.summary_text || "Unable to summarize.";

//     res.json({ summary });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error summarizing content." });
//   }
// });

// working but not good response
// app.post("/summarize", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     console.log("No text provided");
//     return res.status(400).json({ summary: "No text provided." });
//   }

//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ inputs: text }),
//       }
//     );

//     const result = await response.json();
//     console.log("HF response:", result);

//     if (Array.isArray(result) && result[0]?.summary_text) {
//       return res.json({ summary: result[0].summary_text });
//     } else if (Array.isArray(result) && result[0]?.error) {
//       return res.json({ summary: `Error from HF: ${result[0].error}` });
//     } else {
//       return res.json({ summary: "Unable to summarize: unexpected format." });
//     }
//   } catch (err) {
//     console.error("Error in /summarize:", err);
//     return res.status(500).json({ summary: "Server error while summarizing." });
//   }
// });

app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    console.log("⚠️ No text provided");
    return res.status(400).json({ summary: "❌ No text provided." });
  }

  try {
    const input = `summarize: ${text}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/t5-small",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: input }),
      }
    );

    const result = await response.json();
    console.log("📦 Hugging Face result:", JSON.stringify(result, null, 2));

    if (Array.isArray(result) && result[0]?.summary_text) {
      return res.json({ summary: result[0].summary_text });
    } else if (result?.error) {
      return res.json({ summary: `⚠️ HF Error: ${result.error}` });
    } else {
      return res.json({ summary: "⚠️ Unexpected HF format." });
    }
  } catch (err) {
    console.error("🔥 Server Error:", err.message);
    return res.status(500).json({ summary: "❌ Server error." });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
