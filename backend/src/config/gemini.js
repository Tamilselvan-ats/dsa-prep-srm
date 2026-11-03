import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend or root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('[Gemini Config] WARNING: GEMINI_API_KEY is not set. Offline academic knowledge engine active.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Multi-model tiering list: if primary has high load, fallback to secondary
export const AVAILABLE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite'
];

export const getGeminiModel = (modelName = AVAILABLE_MODELS[0]) => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
      maxOutputTokens: 4096,
    }
  });
};

export const isGeminiConfigured = () => Boolean(apiKey);
