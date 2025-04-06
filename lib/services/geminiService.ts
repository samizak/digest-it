import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";

// Initialize Google AI Client
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Configure generation settings
const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
  temperature: 0.3,
};

export async function generateSummary(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error("Server configuration error: Missing API key");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
    safetySettings: safetySettings,
    generationConfig: generationConfig,
  });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  
  if (!response || !response.text) {
    if (response?.promptFeedback?.blockReason) {
      throw new Error(`Content blocked by API: ${response.promptFeedback.blockReason}`);
    }
    throw new Error("Failed to get valid response from LLM");
  }
  
  return response.text();
}