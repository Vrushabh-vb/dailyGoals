// Recipe API Service - Using TheMealDB (free) and API Ninjas
// TheMealDB: https://www.themealdb.com/api.php
// API Ninjas: https://api-ninjas.com/api/recipe

const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Optional: Get a free API key from https://api-ninjas.com/
const API_NINJAS_KEY = ''; // Add your API key here for more results

export interface Recipe {
    id: string;
    name: string;
    category: string;
    area: string;
    instructions: string;
    thumbnail: string;
    ingredients: string[];
    measures: string[];
    videoUrl?: string;
    source?: string;
    // Estimated values (TheMealDB doesn't provide nutrition)
    calories?: number;
    protein?: number;
    prepTime?: number;
}

export interface MealDBRecipe {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strYoutube?: string;
    strSource?: string;
    [key: string]: string | undefined;
}

/**
 * Extract ingredients from MealDB recipe object
 */
function extractIngredients(meal: MealDBRecipe): { ingredients: string[]; measures: string[] } {
    const ingredients: string[] = [];
    const measures: string[] = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push(ingredient.trim());
            measures.push(measure?.trim() || '');
        }
    }

    return { ingredients, measures };
}

/**
 * Transform MealDB response to our Recipe format
 */
function transformMealDBRecipe(meal: MealDBRecipe): Recipe {
    const { ingredients, measures } = extractIngredients(meal);

    // Estimate calories based on ingredients count (rough estimate)
    const estimatedCalories = 200 + ingredients.length * 30;
    const estimatedProtein = Math.round(ingredients.length * 3);

    return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory,
        area: meal.strArea,
        instructions: meal.strInstructions,
        thumbnail: meal.strMealThumb,
        ingredients,
        measures,
        videoUrl: meal.strYoutube,
        source: meal.strSource,
        calories: estimatedCalories,
        protein: estimatedProtein,
        prepTime: Math.round(15 + ingredients.length * 3),
    };
}

/**
 * Search recipes by main ingredient using TheMealDB
 */
export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
    try {
        const response = await fetch(
            `${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        if (!data.meals) return [];

        // Get full details for each meal
        const recipes: Recipe[] = [];
        for (const meal of data.meals.slice(0, 6)) {
            const details = await getRecipeById(meal.idMeal);
            if (details) recipes.push(details);
        }

        return recipes;
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}

/**
 * Get recipe details by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
    try {
        const response = await fetch(
            `${MEALDB_BASE_URL}/lookup.php?i=${id}`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        if (!data.meals || !data.meals[0]) return null;

        return transformMealDBRecipe(data.meals[0]);
    } catch (error) {
        console.error('MealDB API Error:', error);
        return null;
    }
}

/**
 * Search recipes by name
 */
export async function searchByName(name: string): Promise<Recipe[]> {
    try {
        const response = await fetch(
            `${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(name)}`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        if (!data.meals) return [];

        return data.meals.slice(0, 10).map(transformMealDBRecipe);
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}

/**
 * Get random recipes
 */
export async function getRandomRecipes(count: number = 5): Promise<Recipe[]> {
    try {
        const recipes: Recipe[] = [];

        for (let i = 0; i < count; i++) {
            const response = await fetch(`${MEALDB_BASE_URL}/random.php`);
            const data = await response.json();

            if (data.meals && data.meals[0]) {
                recipes.push(transformMealDBRecipe(data.meals[0]));
            }
        }

        return recipes;
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<string[]> {
    try {
        const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);
        const data = await response.json();

        return data.categories?.map((c: any) => c.strCategory) || [];
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}

/**
 * Search recipes by multiple ingredients
 * Returns recipes that match any of the ingredients, sorted by match count
 */
export async function searchByMultipleIngredients(ingredients: string[]): Promise<{ recipe: Recipe; matchCount: number; matchedIngredients: string[] }[]> {
    const allRecipes = new Map<string, { recipe: Recipe; matchedIngredients: Set<string> }>();

    // Search for each ingredient
    for (const ingredient of ingredients) {
        const recipes = await searchByIngredient(ingredient);

        for (const recipe of recipes) {
            const existing = allRecipes.get(recipe.id);
            if (existing) {
                existing.matchedIngredients.add(ingredient);
            } else {
                allRecipes.set(recipe.id, {
                    recipe,
                    matchedIngredients: new Set([ingredient]),
                });
            }
        }
    }

    // Convert to array and sort by match count
    const results = Array.from(allRecipes.values())
        .map(({ recipe, matchedIngredients }) => ({
            recipe,
            matchCount: matchedIngredients.size,
            matchedIngredients: Array.from(matchedIngredients),
        }))
        .sort((a, b) => b.matchCount - a.matchCount);

    return results;
}

/**
 * Calculate match percentage between pantry and recipe ingredients
 */
export function calculateMatchPercentage(
    pantryIngredients: string[],
    recipeIngredients: string[]
): { percentage: number; matched: string[]; missing: string[] } {
    const normalizedPantry = pantryIngredients.map(i => i.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];

    for (const ingredient of recipeIngredients) {
        const normalizedIngredient = ingredient.toLowerCase();
        const isMatched = normalizedPantry.some(p =>
            normalizedIngredient.includes(p) || p.includes(normalizedIngredient)
        );

        if (isMatched) {
            matched.push(ingredient);
        } else {
            missing.push(ingredient);
        }
    }

    const percentage = recipeIngredients.length > 0
        ? Math.round((matched.length / recipeIngredients.length) * 100)
        : 0;

    return { percentage, matched, missing };
}

/**
 * Filter recipes by Indian cuisine or vegetarian
 */
export async function getIndianRecipes(): Promise<Recipe[]> {
    try {
        const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=Indian`);
        const data = await response.json();

        if (!data.meals) return [];

        const recipes: Recipe[] = [];
        for (const meal of data.meals.slice(0, 10)) {
            const details = await getRecipeById(meal.idMeal);
            if (details) recipes.push(details);
        }

        return recipes;
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}

/**
 * Get vegetarian recipes
 */
export async function getVegetarianRecipes(): Promise<Recipe[]> {
    try {
        const response = await fetch(`${MEALDB_BASE_URL}/filter.php?c=Vegetarian`);
        const data = await response.json();

        if (!data.meals) return [];

        const recipes: Recipe[] = [];
        for (const meal of data.meals.slice(0, 10)) {
            const details = await getRecipeById(meal.idMeal);
            if (details) recipes.push(details);
        }

        return recipes;
    } catch (error) {
        console.error('MealDB API Error:', error);
        return [];
    }
}
