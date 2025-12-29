// AI-Powered Indian Recipe Generator using OpenAI SDK
// Supports: OpenAI, Gemini (via OpenAI-compatible endpoint), or Groq

import OpenAI from 'openai';

export interface AIConfig {
    provider: 'openai' | 'gemini' | 'groq';
    apiKey: string;
}

// Default configuration using Groq (free and fast)
// API key loaded from environment variable
const DEFAULT_CONFIG: AIConfig = {
    provider: 'groq',
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
};

export interface GeneratedRecipe {
    name: string;
    nameHindi?: string;
    description: string;
    servings: number;
    prepTime: number;
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: { item: string; quantity: string; hindi?: string }[];
    instructions: string[];
    tips?: string[];
    variations?: string[];
}

// Get OpenAI client based on provider
function getClient(config: AIConfig): OpenAI {
    switch (config.provider) {
        case 'gemini':
            return new OpenAI({
                apiKey: config.apiKey,
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                dangerouslyAllowBrowser: true,
            });
        case 'groq':
            return new OpenAI({
                apiKey: config.apiKey,
                baseURL: 'https://api.groq.com/openai/v1',
                dangerouslyAllowBrowser: true,
            });
        default:
            return new OpenAI({
                apiKey: config.apiKey,
                dangerouslyAllowBrowser: true,
            });
    }
}

// Get model name based on provider
function getModelName(provider: AIConfig['provider']): string {
    switch (provider) {
        case 'gemini':
            return 'gemini-2.0-flash';
        case 'groq':
            return 'llama-3.3-70b-versatile';
        default:
            return 'gpt-4o-mini';
    }
}

// System prompt for Indian recipe generation
const INDIAN_RECIPE_SYSTEM_PROMPT = `You are an expert Indian chef and nutritionist. Your task is to create authentic Indian recipes based on available ingredients.

Guidelines:
- Focus on INDIAN cuisine only (North Indian, South Indian, etc.)
- Use common Indian cooking techniques (tadka, dum, bhuna, etc.)
- Include Hindi names for dishes and key ingredients
- Provide accurate nutritional information
- Keep recipes practical for home cooking
- Suggest Indian alternatives for any missing ingredients
- Include traditional tips and variations

Always respond in valid JSON format matching the requested schema.`;

/**
 * Generate Indian recipes based on available ingredients
 */
export async function generateIndianRecipes(
    ingredients: string[],
    config: AIConfig,
    preferences?: {
        diet?: 'veg' | 'non-veg' | 'egg';
        mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
        difficulty?: 'easy' | 'medium' | 'hard';
        maxPrepTime?: number;
    }
): Promise<GeneratedRecipe[]> {
    const client = getClient(config);
    const model = getModelName(config.provider);

    const dietPreference = preferences?.diet === 'veg'
        ? 'vegetarian (no eggs)'
        : preferences?.diet === 'egg'
            ? 'vegetarian with eggs allowed'
            : 'any (including meat)';

    const prompt = `Generate 3 authentic Indian recipes using these available ingredients: ${ingredients.join(', ')}

Preferences:
- Diet: ${dietPreference}
- Meal type: ${preferences?.mealType || 'any meal'}
- Difficulty: ${preferences?.difficulty || 'any'}
- Max prep time: ${preferences?.maxPrepTime ? preferences.maxPrepTime + ' minutes' : 'no limit'}

Create recipes that:
1. Use mostly the provided ingredients (okay to add basic Indian pantry items like oil, salt, spices)
2. Are authentic Indian dishes
3. Include Hindi names
4. Have accurate nutritional estimates

Return a JSON array with this exact structure:
[
  {
    "name": "English name",
    "nameHindi": "Hindi name in Devanagari",
    "description": "Brief description",
    "servings": 2,
    "prepTime": 15,
    "cookTime": 20,
    "difficulty": "easy",
    "calories": 250,
    "protein": 8,
    "carbs": 30,
    "fat": 10,
    "ingredients": [
      {"item": "Ingredient name", "quantity": "1 cup", "hindi": "Hindi name"}
    ],
    "instructions": ["Step 1...", "Step 2..."],
    "tips": ["Helpful tip..."],
    "variations": ["Variation idea..."]
  }
]`;

    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: INDIAN_RECIPE_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        const content = response.choices[0]?.message?.content || '[]';

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('No JSON array found in response:', content);
            return [];
        }

        const recipes: GeneratedRecipe[] = JSON.parse(jsonMatch[0]);
        return recipes;
    } catch (error) {
        console.error('AI Recipe Generation Error:', error);
        throw error;
    }
}

/**
 * Generate a complete meal plan for a day
 */
export async function generateDayMealPlan(
    pantryIngredients: string[],
    config: AIConfig,
    preferences?: {
        diet?: 'veg' | 'non-veg' | 'egg';
        targetCalories?: number;
        targetProtein?: number;
    }
): Promise<{
    breakfast: GeneratedRecipe;
    lunch: GeneratedRecipe;
    dinner: GeneratedRecipe;
    snack: GeneratedRecipe;
    totalNutrition: { calories: number; protein: number; carbs: number; fat: number };
}> {
    const client = getClient(config);
    const model = getModelName(config.provider);

    const dietPreference = preferences?.diet === 'veg'
        ? 'vegetarian (no eggs)'
        : preferences?.diet === 'egg'
            ? 'vegetarian with eggs allowed'
            : 'any (including meat)';

    const prompt = `Create a complete Indian meal plan for one day using these available ingredients: ${pantryIngredients.join(', ')}

Preferences:
- Diet: ${dietPreference}
- Target calories: ${preferences?.targetCalories || 2000} kcal
- Target protein: ${preferences?.targetProtein || 60}g

Create 4 meals: breakfast, lunch, dinner, and a snack.
All dishes must be INDIAN cuisine.
Make sure total nutrition is close to targets.

Return JSON with this structure:
{
  "breakfast": { recipe object },
  "lunch": { recipe object },
  "dinner": { recipe object },
  "snack": { recipe object },
  "totalNutrition": { "calories": 1900, "protein": 65, "carbs": 250, "fat": 60 }
}

Each recipe object should have: name, nameHindi, description, servings, prepTime, cookTime, difficulty, calories, protein, carbs, fat, ingredients (array of {item, quantity, hindi}), instructions (array), tips (array).`;

    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: INDIAN_RECIPE_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const content = response.choices[0]?.message?.content || '{}';

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('AI Meal Plan Generation Error:', error);
        throw error;
    }
}

/**
 * Get recipe suggestions based on a single dish name
 */
export async function getRecipeSuggestion(
    dishName: string,
    config: AIConfig
): Promise<GeneratedRecipe | null> {
    const client = getClient(config);
    const model = getModelName(config.provider);

    const prompt = `Provide a detailed Indian recipe for: ${dishName}

Return JSON with this structure:
{
  "name": "English name",
  "nameHindi": "Hindi name in Devanagari",
  "description": "Brief description",
  "servings": 2,
  "prepTime": 15,
  "cookTime": 20,
  "difficulty": "easy",
  "calories": 250,
  "protein": 8,
  "carbs": 30,
  "fat": 10,
  "ingredients": [
    {"item": "Ingredient name", "quantity": "1 cup", "hindi": "Hindi name"}
  ],
  "instructions": ["Step 1...", "Step 2..."],
  "tips": ["Helpful tip..."],
  "variations": ["Variation idea..."]
}`;

    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: INDIAN_RECIPE_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('AI Recipe Suggestion Error:', error);
        return null;
    }
}

// Storage key for API config
const AI_CONFIG_KEY = 'dailygoals_ai_config';

/**
 * Save AI config to localStorage
 */
export function saveAIConfig(config: AIConfig): void {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Load AI config from localStorage (returns default if none saved)
 */
export function loadAIConfig(): AIConfig {
    const saved = localStorage.getItem(AI_CONFIG_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return DEFAULT_CONFIG;
}

/**
 * Get default config
 */
export function getDefaultConfig(): AIConfig {
    return DEFAULT_CONFIG;
}

/**
 * Check if AI is configured (always true with default)
 */
export function isAIConfigured(): boolean {
    return true;
}
