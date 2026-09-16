import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON (allow up to 25mb for photo uploads/base64)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy init Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Mock responses will be used if needed.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// SNAPLOG AI BUDDY SYSTEM INSTRUCTIONS & PERSONAS
// -------------------------------------------------------------
const PERSONA_PROMPTS: Record<string, string> = {
  "Unhinged Bestie": `You are "SNAPLOG BUDDY" in "Unhinged Bestie" mode inside the SNAPLOG app, developed by ASAAKURIGO AI DEVELOPMENT for Gen Z.
You speak like a chaotic, chronically online bestie. Use modern Gen Z slang naturally (e.g., 'no cap', 'slay', 'ate and left no crumbs', 'screaming crying throwing up', 'living rent free', 'core memory', 'lowkey/highkey', 'delulu', 'it's giving...').
You're hyper-expressive, funny, use occasional ALL CAPS for emphasis, and unconditionally support the user while keeping it 100% real. Keep responses punchy and avoid robotic fluff.`,

  "Hype Man": `You are "SNAPLOG BUDDY" in "Hype Man" mode inside SNAPLOG, developed by ASAAKURIGO AI DEVELOPMENT.
Your sole mission is to gas the user up to 10,000%. Every snap, fit, late-night run, or mundane moment is historic.
Use high energy, flame emojis, all caps exclamations, and hype them up with infectious optimism.`,

  "Sarcastic Critic": `You are "SNAPLOG BUDDY" in "Sarcastic Critic" mode inside SNAPLOG, developed by ASAAKURIGO AI DEVELOPMENT.
You deliver witty, playful, and sharp banter. You tease the user's camera angles, blurry shots, or questionable 3 AM food runs, but always with love and affection. Never truly mean, never hateful, strictly Gen Z banter.`,

  "Chill Study Buddy": `You are "SNAPLOG BUDDY" in "Chill Study Buddy" mode inside SNAPLOG, developed by ASAAKURIGO AI DEVELOPMENT.
You embody lo-fi hip hop, matcha lattes, rain on windows, and calm grounding energy.
You speak softly, use calm and reassuring words, encourage healthy breaks, hydration, and unhurried photo memories.`,

  "Y2K Nostalgic": `You are "SNAPLOG BUDDY" in "Y2K Nostalgic" mode inside SNAPLOG, developed by ASAAKURIGO AI DEVELOPMENT.
You act like it's 2004! Think Motorola Razr, disposable digicams, glitter gel pens, Limewire, Avril Lavigne, and early internet text speak (e.g., 'rawr xD', 'totally rad', 'omg brb', 'dial-up vibes'). You adore grainy digicam flash photos.`,

  "Professional Tech Assistant": `You are "SNAPLOG BUDDY" in "Professional Tech Assistant" mode inside SNAPLOG, developed by ASAAKURIGO AI DEVELOPMENT.
You provide precise technical analysis, camera metadata breakdowns, structured JSON configurations, and diagnostic clarity while maintaining sleek modern efficiency.`,
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "SNAPLOG", developer: "ASAAKURIGO AI DEVELOPMENT" });
});

// 1. AI Buddy Chat Endpoint
app.post("/api/buddy/chat", async (req, res) => {
  try {
    const { message, persona = "Unhinged Bestie", history = [], image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS["Unhinged Bestie"];
    const fullSystemInstruction = `${systemPrompt}
Remember: SNAPLOG is developed by ASAAKURIGO AI DEVELOPMENT.
Respect user privacy and safety. Keep answers conversational, authentic, and snappy.`;

    const ai = getAI();

    let contentsPayload: any;

    if (image && image.data) {
      const cleanBase64 = image.data.replace(/^data:image\/[a-z]+;base64,/, "");
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType || "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: message || "Analyze this photo and give me your unfiltered reaction!",
          },
        ],
      };
    } else {
      // Build text conversation context
      const formattedHistory = history.map((h: { role: string; text: string }) => `${h.role === "user" ? "User" : "Buddy"}: ${h.text}`).join("\n");
      const promptText = formattedHistory 
        ? `${formattedHistory}\nUser: ${message}\nBuddy:` 
        : message;

      contentsPayload = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.95,
      },
    });

    const reply = response.text || "my brain just lagged for a sec, say that again bestie!";
    res.json({ reply, persona });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({
      error: "Failed to generate AI Buddy response",
      fallbackReply: "Bestie my server hit a slight buffering moment, but I'm still right here with you!",
    });
  }
});

// 2. Multimodal Photo Analysis Endpoint
app.post("/api/buddy/analyze-photo", async (req, res) => {
  try {
    const { image, persona = "Unhinged Bestie", customPrompt } = req.body;

    if (!image || !image.data) {
      return res.status(400).json({ error: "Valid image data is required" });
    }

    const cleanBase64 = image.data.replace(/^data:image\/[a-z]+;base64,/, "");
    const ai = getAI();

    const systemInstruction = `You are "SNAPLOG BUDDY", the core AI inside SNAPLOG by ASAAKURIGO AI DEVELOPMENT. Current persona: ${persona}.
You are analyzing an unedited user photo dump / snapshot for Gen Z social sharing and automatic background archiving.
Evaluate aesthetics, mood, vibe score (1-100), lighting, hidden details, and bloopers.
Generate 3 distinct catchy caption styles: Aesthetic, Chaotic, and Minimal.
Assign an aesthetic stream category (e.g., 'Feels like 2 AM', 'Main Character Energy', 'Brain Rot Memes', 'Golden Hour Drift', 'Liminal Space', 'Candid Bloopers', 'Post-Study Glow', 'Thrift Core').
Provide a friendly, playful commentary/roast matching the ${persona} tone.

CRITICAL: Return strictly valid JSON adhering to this schema:
{
  "aesthetic_vibe": "string describing the visual aesthetic",
  "vibe_score": number (1-100),
  "mood": "string describing the emotional tone",
  "lighting_and_details": "brief breakdown of the lighting & hidden details",
  "bloopers_detected": "funny bloopers or candid quirks spotted",
  "suggested_captions": {
    "aesthetic": "string",
    "chaotic": "string",
    "minimal": "string"
  },
  "stream_category": "string (e.g. Feels like 2 AM, Main Character Energy, etc.)",
  "roast_or_commentary": "string in current persona",
  "story_overlay_text": "short 3-5 word retro stamp text"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType || "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: customPrompt || "Analyze this snap for my SNAPLOG archive and give me the full aesthetic breakdown.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.9,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Photo analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze photo",
      fallback: {
        aesthetic_vibe: "Vintage Digicam Flash Blur",
        vibe_score: 94,
        mood: "Main Character Energy",
        lighting_and_details: "Harsh direct flash with authentic grain and motion softness",
        bloopers_detected: "Accidental finger near lens edge adding 2004 nostalgia",
        suggested_captions: {
          aesthetic: "blurry moments, crystal memories 🫧",
          chaotic: "no thoughts just camera flash going off at the worst possible second",
          minimal: "09.14 // logged",
        },
        stream_category: "Main Character Energy",
        roast_or_commentary: "Certified heater! The motion blur actually makes it look like album art no cap.",
        story_overlay_text: "2AM ARCHIVE LOGGED",
      },
    });
  }
});

// 3. Weekly Recap & Camera Roll Roast Generator
app.post("/api/buddy/recap", async (req, res) => {
  try {
    const { snapsCount = 12, topStreams = [], persona = "Unhinged Bestie" } = req.body;
    const ai = getAI();

    const prompt = `Generate a high-energy Gen Z Weekly Memory Recap for a SNAPLOG user who logged ${snapsCount} photos across streams: ${topStreams.join(", ")}.
Persona: ${persona}.
Return JSON with this schema:
{
  "recap_title": "string",
  "vibe_summary": "string in persona",
  "chaos_index": number (1-100),
  "top_archetype": "string (e.g. 3 AM Nightcrawler, Caffeinated Academic, Thrift God)",
  "highlight_quote": "string",
  "camera_roll_roast": "string witty critique of their photo-taking habits this week",
  "aesthetic_breakdown": [
    {"label": "string", "percentage": number}
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are SNAPLOG BUDDY inside SNAPLOG by ASAAKURIGO AI DEVELOPMENT. Return strictly valid JSON.`,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Recap error:", error);
    res.status(500).json({
      error: "Failed to generate recap",
      fallback: {
        recap_title: "Week 37: Unhinged Chronicle",
        vibe_summary: "You logged 12 photos and 9 of them were past midnight. We love consistency!",
        chaos_index: 88,
        top_archetype: "2 AM Nightcrawler",
        highlight_quote: "If nobody got me, the digicam flash got me.",
        camera_roll_roast: "You take 14 burst shots of the exact same latte and then post the blurry one anyway. Iconic.",
        aesthetic_breakdown: [
          { label: "Feels like 2 AM", percentage: 55 },
          { label: "Main Character Energy", percentage: 30 },
          { label: "Brain Rot Memes", percentage: 15 },
        ],
      },
    });
  }
});

// 4. Customization & UI Assistant Generator
app.post("/api/buddy/configure-customization", async (req, res) => {
  try {
    const { userWish, currentConfig } = req.body;
    const ai = getAI();

    const prompt = `User wants to customize their SNAPLOG interface: "${userWish}".
Available themes: "Neon Cyber", "Y2K Digicam", "Minimal Glass", "Muted Earth", "Sunset Retro".
Available fonts: "Syne", "Space Mono", "VT323", "Plus Jakarta Sans".
Available widgets: "Digicam Viewfinder", "Clean Neo-Card", "Cyber HUD", "Polaroid Peel".
Available landing tabs: "Live Stream", "Interactive Map", "Shared Dumps", "AI Buddy Chat".
Available accents: hex colors like #39FF14 (lime), #FF007F (pink), #00F0FF (cyan), #FF7700 (tangerine), #8B5CF6 (violet), #10B981 (emerald).

Return valid JSON adhering strictly to:
{
  "theme_config": {
    "theme": "string",
    "accentColor": "string",
    "fontFamily": "string",
    "widgetStyle": "string"
  },
  "ai_buddy_persona": {
    "mode": "string",
    "slangIntensity": number (1-10)
  },
  "customization_settings": {
    "hapticEnabled": boolean,
    "audioFeedbackSound": "string (shutter | digicam_beep | pop_chime | cyber_chirp)",
    "primaryLandingTab": "string"
  },
  "buddy_commentary": "short explanation of why this aesthetic fits their request"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the SNAPLOG UI Management Engine developed by ASAAKURIGO AI DEVELOPMENT. Return strictly valid JSON.",
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("Customization error:", error);
    res.status(500).json({ error: "Failed to configure UI parameters" });
  }
});

// Vite Middleware / Static Serve Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`SNAPLOG Engine Server running on http://0.0.0.0:${PORT}`);
    console.log(`Developed by ASAAKURIGO AI DEVELOPMENT`);
  });
}

startServer();
