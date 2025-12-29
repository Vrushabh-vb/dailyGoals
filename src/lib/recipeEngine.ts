// Smart Recipe Matching Engine
// Uses TF-IDF inspired similarity scoring for ingredient-based recipe matching

import { meals, type Meal } from '@/data/meals';

export interface PantryIngredient {
    id: string;
    name: string;
    category: 'vegetable' | 'protein' | 'dairy' | 'grain' | 'spice' | 'oil' | 'other';
    quantity?: string;
    addedAt: Date;
}

export interface RecipeMatch {
    recipe: Meal;
    matchScore: number;
    matchedIngredients: string[];
    missingIngredients: string[];
}

// Common Indian ingredients normalized for matching
const INGREDIENT_SYNONYMS: Record<string, string[]> = {
    'onion': ['pyaz', 'pyaaz', 'kanda'],
    'tomato': ['tamatar'],
    'potato': ['aloo', 'aaloo'],
    'paneer': ['cottage cheese', 'indian cheese'],
    'dal': ['lentils', 'daal', 'toor dal', 'moong dal', 'yellow dal', 'urad dal'],
    'rice': ['chawal', 'bhaat', 'basmati rice'],
    'wheat': ['atta', 'gehu', 'wheat flour', 'flour'],
    'ginger': ['adrak'],
    'garlic': ['lahsun', 'lehsun', 'ginger-garlic'],
    'turmeric': ['haldi'],
    'cumin': ['jeera', 'zeera'],
    'coriander': ['dhania', 'cilantro'],
    'chili': ['mirchi', 'mirch', 'green chili', 'red chili'],
    'mustard': ['sarson', 'rai', 'mustard seeds'],
    'capsicum': ['shimla mirch', 'bell pepper', 'bell peppers'],
    'cauliflower': ['gobi', 'phool gobi'],
    'spinach': ['palak'],
    'eggplant': ['baingan', 'brinjal'],
    'okra': ['bhindi', 'ladyfinger'],
    'peas': ['matar', 'mutter'],
    'carrot': ['gajar'],
    'cabbage': ['patta gobi', 'band gobi'],
    'cucumber': ['kheera', 'kakdi'],
    'chickpeas': ['chana', 'chole'],
    'kidney beans': ['rajma'],
    'black gram': ['urad dal', 'urad'],
    'moong': ['mung', 'green gram', 'moong dal'],
    'egg': ['anda', 'eggs'],
    'chicken': ['murgh', 'murg'],
    'mutton': ['gosht'],
    'fish': ['machli', 'macchi'],
    'curd': ['dahi', 'yogurt', 'yoghurt'],
    'milk': ['doodh'],
    'cream': ['malai'],
    'butter': ['makhan'],
    'ghee': ['clarified butter'],
    'oil': ['tel'],
    'semolina': ['rava', 'sooji', 'suji'],
    'poha': ['flattened rice', 'beaten rice'],
    'vegetables': ['mixed vegetables', 'mixed veggies', 'sabzi'],
};

// Normalize ingredient name for matching
function normalizeIngredient(ingredient: string): string {
    const lower = ingredient.toLowerCase().trim();

    // Check synonyms
    for (const [canonical, synonyms] of Object.entries(INGREDIENT_SYNONYMS)) {
        if (lower === canonical || synonyms.some(s => lower.includes(s) || s.includes(lower))) {
            return canonical;
        }
    }

    return lower;
}

// Calculate ingredient match score between pantry and recipe
function calculateMatchScore(
    pantryIngredients: string[],
    recipeIngredients: string[]
): { score: number; matched: string[]; missing: string[] } {
    const normalizedPantry = pantryIngredients.map(normalizeIngredient);
    const normalizedRecipe = recipeIngredients.map(normalizeIngredient);

    const matched: string[] = [];
    const missing: string[] = [];

    for (const ingredient of normalizedRecipe) {
        // Check for exact match or partial match
        const isMatched = normalizedPantry.some(p =>
            p === ingredient ||
            p.includes(ingredient) ||
            ingredient.includes(p)
        );

        if (isMatched) {
            matched.push(ingredient);
        } else {
            missing.push(ingredient);
        }
    }

    // Score calculation: matched / total, with bonus for fewer missing
    const matchRatio = matched.length / Math.max(normalizedRecipe.length, 1);
    const missingPenalty = Math.min(missing.length * 0.08, 0.3);
    const score = Math.max(0, matchRatio - missingPenalty);

    return { score, matched, missing };
}

// Find recipes that match available ingredients
export function findMatchingRecipes(
    pantryIngredients: PantryIngredient[],
    minMatchScore: number = 0.25
): RecipeMatch[] {
    const pantryNames = pantryIngredients.map(p => p.name);

    const matches: RecipeMatch[] = [];

    for (const recipe of meals) {
        const { score, matched, missing } = calculateMatchScore(
            pantryNames,
            recipe.ingredients
        );

        if (score >= minMatchScore) {
            matches.push({
                recipe,
                matchScore: Math.round(score * 100),
                matchedIngredients: matched,
                missingIngredients: missing,
            });
        }
    }

    // Sort by match score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// Get ingredient suggestions based on category
export function getIngredientSuggestions(category?: string): string[] {
    const suggestions: Record<string, string[]> = {
        vegetable: ['potato', 'onion', 'tomato', 'cauliflower', 'spinach', 'capsicum', 'carrot', 'peas', 'beans', 'cabbage', 'eggplant', 'okra', 'cucumber'],
        protein: ['paneer', 'chicken', 'egg', 'dal', 'chickpeas', 'kidney beans', 'fish', 'mutton', 'tofu', 'sprouts'],
        dairy: ['milk', 'curd', 'cream', 'butter', 'ghee', 'cheese', 'yogurt'],
        grain: ['rice', 'wheat flour', 'semolina', 'poha', 'oats', 'bread', 'naan'],
        spice: ['turmeric', 'cumin', 'coriander', 'chili', 'garam masala', 'mustard seeds', 'curry leaves', 'ginger', 'garlic'],
        oil: ['oil', 'ghee', 'coconut oil', 'mustard oil', 'butter'],
    };

    if (category && suggestions[category]) {
        return suggestions[category];
    }

    return Object.values(suggestions).flat();
}

// Get all available ingredients from our recipes
export function getAllRecipeIngredients(): string[] {
    const allIngredients = new Set<string>();

    for (const recipe of meals) {
        for (const ingredient of recipe.ingredients) {
            allIngredients.add(ingredient.toLowerCase());
        }
    }

    return Array.from(allIngredients).sort();
}
