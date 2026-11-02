require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://ajit-7pib.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
res.json({
success: true,
message: "PixelForge AI Studio backend is running!",
});
});

app.get("/api/status", (req, res) => {
res.json({
success: true,
server: "running",
apiKeyConfigured: Boolean(
process.env.POLLINATIONS_API_KEY?.trim()
),
});
});

app.post("/api/generate", async (req, res) => {
try {
const { prompt, style = "Realistic", ratio = "1:1" } = req.body;

if (typeof prompt !== "string" || !prompt.trim()) {
  return res.status(400).json({
    success: false,
    message: "Please enter an image prompt.",
  });
}

const apiKey = process.env.POLLINATIONS_API_KEY?.trim();

if (!apiKey || apiKey === "YOUR_REAL_API_KEY") {
  return res.status(500).json({
    success: false,
    message:
      "Pollinations API key is missing. Check backend/.env.",
  });
}

const styleInstructions = {
  Realistic: "photorealistic, realistic lighting, highly detailed",
  Anime: "anime illustration, detailed anime art",
  Digital: "high quality digital illustration",
  Cinematic: "cinematic lighting, dramatic composition",
  Fantasy: "fantasy artwork, magical atmosphere",
  "3D Render": "high quality 3D render, detailed textures",
  Watercolor: "watercolor painting, artistic brush strokes",
  "Oil Painting": "traditional oil painting, rich paint texture",
};

const dimensions = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
  "4:3": { width: 1024, height: 768 },
  "3:2": { width: 1200, height: 800 },
};

const selectedStyle =
  styleInstructions[style] || styleInstructions.Realistic;

const selectedDimensions =
  dimensions[ratio] || dimensions["1:1"];

const finalPrompt = `${prompt.trim().slice(0, 1000)}, ${selectedStyle}`;

console.log("Image generation requested.");
console.log("Style:", style);
console.log("Ratio:", ratio);

const imageUrl =
  "https://gen.pollinations.ai/image/" +
  encodeURIComponent(finalPrompt);

let imageResponse;

try {
  imageResponse = await axios.get(imageUrl, {
    params: {
      model: "flux",
      width: selectedDimensions.width,
      height: selectedDimensions.height,
      nologo: true,
    },
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "image/*",
    },
    responseType: "arraybuffer",
    timeout: 180000,
    maxContentLength: 20 * 1024 * 1024,
    maxBodyLength: 20 * 1024 * 1024,
  });
} catch (apiError) {
  const status = apiError.response?.status;
  const code = apiError.code;
console.error("Pollinations API request failed:", {
  status: apiError.response?.status,
  code: apiError.code,
  message: apiError.message,
  response: apiError.response?.data
    ? Buffer.from(apiError.response.data)
        .toString("utf8")
        .slice(0, 2000)
    : "No response received",
});

  if (status === 401 || status === 403) {
    return res.status(502).json({
      success: false,
      message:
        "API authentication failed. Verify your Pollinations API key and permissions.",
    });
  }

  if (status === 402) {
    return res.status(502).json({
      success: false,
      message:
        "The provider reports a payment or balance issue. Check your account.",
    });
  }

  if (status === 429) {
    return res.status(429).json({
      success: false,
      message:
        "API rate limit reached. Wait before trying again.",
    });
  }

  if (
    code === "ECONNRESET" ||
    code === "ECONNABORTED" ||
    code === "ETIMEDOUT" ||
    code === "EAI_AGAIN" ||
    code === "ENOTFOUND"
  ) {
    return res.status(502).json({
      success: false,
      message:
        `Network connection to the image provider failed (${code}). Check your internet connection and try again.`,
    });
  }

  if (status) {
    return res.status(502).json({
      success: false,
      message:
        `The image provider returned HTTP ${status}. Check the API documentation and account status.`,
    });
  }

  return res.status(502).json({
    success: false,
    message:
      "Could not connect to the image provider. Check your internet connection and try again.",
  });
}

const contentType = imageResponse.headers["content-type"];

if (!contentType || !contentType.startsWith("image/")) {
  console.error("Unexpected provider content type:", contentType);

  return res.status(502).json({
    success: false,
    message:
      "The image provider did not return an image. Check the API response and account settings.",
  });
}

const base64Image = Buffer.from(imageResponse.data).toString("base64");

console.log("Image generated successfully.");

return res.json({
  success: true,
  message: "Image generated successfully!",
  image: `data:${contentType};base64,${base64Image}`,
  prompt: prompt.trim(),
  style,
  ratio,
});

} catch (error) {
console.error("Unexpected backend error:", {
message: error.message,
code: error.code,
});

return res.status(500).json({
  success: false,
  message: "Unexpected backend error. Check the backend terminal.",
});

}
});

app.listen(PORT, () => {
console.log("PixelForge backend running at http://localhost:${PORT}");
console.log(
"Pollinations API key configured:",
Boolean(process.env.POLLINATIONS_API_KEY?.trim())
);
});