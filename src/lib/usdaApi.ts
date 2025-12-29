// USDA FoodData Central API Service
// Get your API key from: https://fdc.nal.usda.gov/api-key-signup.html

const USDA_API_KEY = 'DEMO_KEY'; // Replace with your actual API key
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFood {
    fdcId: number;
    description: string;
    dataType: string;
    brandOwner?: string;
    ingredients?: string;
    servingSize?: number;
    servingSizeUnit?: string;
    foodNutrients: USDANutrient[];
}

export interface USDANutrient {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
}

export interface SearchResult {
    totalHits: number;
    currentPage: number;
    totalPages: number;
    foods: USDAFood[];
}

export interface NutritionInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
}

// Common nutrient IDs
const NUTRIENT_IDS = {
    ENERGY: 1008, // Calories (kcal)
    PROTEIN: 1003,
    FAT: 1004,
    CARBS: 1005,
    FIBER: 1079,
    SUGAR: 2000,
};

/**
 * Search for foods in the USDA database
 */
export async function searchFoods(query: string, pageSize: number = 10): Promise<SearchResult> {
    try {
        const response = await fetch(
            `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR Legacy`
        );

        if (!response.ok) {
            throw new Error('Failed to search foods');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('USDA API Error:', error);
        throw error;
    }
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFoodDetails(fdcId: number): Promise<USDAFood> {
    try {
        const response = await fetch(
            `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to get food details');
        }

        return await response.json();
    } catch (error) {
        console.error('USDA API Error:', error);
        throw error;
    }
}

/**
 * Extract nutrition info from USDA food data
 */
export function extractNutrition(food: USDAFood): NutritionInfo {
    const nutrients = food.foodNutrients || [];

    const findNutrient = (id: number): number => {
        const nutrient = nutrients.find(n => n.nutrientId === id);
        return nutrient?.value || 0;
    };

    return {
        calories: Math.round(findNutrient(NUTRIENT_IDS.ENERGY)),
        protein: Math.round(findNutrient(NUTRIENT_IDS.PROTEIN) * 10) / 10,
        carbs: Math.round(findNutrient(NUTRIENT_IDS.CARBS) * 10) / 10,
        fat: Math.round(findNutrient(NUTRIENT_IDS.FAT) * 10) / 10,
        fiber: Math.round(findNutrient(NUTRIENT_IDS.FIBER) * 10) / 10,
        sugar: Math.round(findNutrient(NUTRIENT_IDS.SUGAR) * 10) / 10,
    };
}

/**
 * Search for Indian food ingredients
 */
export async function searchIndianIngredients(query: string): Promise<USDAFood[]> {
    const result = await searchFoods(query, 20);
    return result.foods;
}

// Common Indian ingredients with pre-fetched nutrition (fallback)
export const COMMON_INDIAN_INGREDIENTS: Record<string, NutritionInfo> = {
    'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
    'wheat flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, sugar: 0.3 },
    'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 0 },
    'paneer': { calories: 265, protein: 18, carbs: 1.2, fat: 21, fiber: 0, sugar: 0 },
    'chicken': { calories: 239, protein: 27, carbs: 0, fat: 14, fiber: 0, sugar: 0 },
    'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8 },
    'onion': { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, sugar: 4.2 },
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 },
    'ginger': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2, sugar: 1.7 },
    'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
    'cauliflower': { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9 },
    'capsicum': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, sugar: 2.4 },
    'curd': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 3.2 },
    'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5 },
    'ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
    'oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0 },
    'coconut': { calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, sugar: 6.2 },
    'lemon': { calories: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, sugar: 2.5 },
};
