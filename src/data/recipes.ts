import { Meal, DifficultyLevel } from '@/data/meals';

export interface RecipeStep {
  step: number;
  instruction: string;
  duration?: number; // in minutes
  tip?: string;
}

export interface RecipeDetail {
  mealId: string;
  servings: number;
  ingredients: IngredientDetail[];
  steps: RecipeStep[];
  tips: string[];
  nutritionPerServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface IngredientDetail {
  name: string;
  quantity: string;
  unit: string;
  category: 'vegetables' | 'grains' | 'dairy' | 'spices' | 'protein' | 'other';
}

// Recipe details for each meal
export const recipeDetails: Record<string, RecipeDetail> = {
  'poha-1': {
    mealId: 'poha-1',
    servings: 2,
    ingredients: [
      { name: 'Poha (flattened rice)', quantity: '2', unit: 'cups', category: 'grains' },
      { name: 'Onion', quantity: '1', unit: 'medium', category: 'vegetables' },
      { name: 'Potato', quantity: '1', unit: 'small', category: 'vegetables' },
      { name: 'Peanuts', quantity: '2', unit: 'tbsp', category: 'protein' },
      { name: 'Curry leaves', quantity: '8-10', unit: 'leaves', category: 'spices' },
      { name: 'Mustard seeds', quantity: '1/2', unit: 'tsp', category: 'spices' },
      { name: 'Turmeric powder', quantity: '1/4', unit: 'tsp', category: 'spices' },
      { name: 'Green chili', quantity: '2', unit: 'pieces', category: 'vegetables' },
      { name: 'Oil', quantity: '2', unit: 'tbsp', category: 'other' },
      { name: 'Salt', quantity: 'to taste', unit: '', category: 'spices' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp', category: 'other' },
      { name: 'Fresh coriander', quantity: '2', unit: 'tbsp', category: 'vegetables' },
    ],
    steps: [
      { step: 1, instruction: 'Rinse the poha gently under running water for 30 seconds. Drain and set aside.', duration: 2, tip: 'Don\'t over-wash or it will become mushy' },
      { step: 2, instruction: 'Heat oil in a pan. Add mustard seeds and let them splutter.', duration: 1 },
      { step: 3, instruction: 'Add peanuts and fry until golden. Add curry leaves and green chilies.', duration: 2 },
      { step: 4, instruction: 'Add diced potatoes and cook until soft (about 5 minutes).', duration: 5, tip: 'Cover with lid for faster cooking' },
      { step: 5, instruction: 'Add sliced onions and sauté until translucent.', duration: 3 },
      { step: 6, instruction: 'Add turmeric and salt. Mix well.', duration: 1 },
      { step: 7, instruction: 'Add the rinsed poha. Gently fold everything together.', duration: 2, tip: 'Use a gentle folding motion to avoid breaking the poha' },
      { step: 8, instruction: 'Cover and cook on low heat for 2 minutes.', duration: 2 },
      { step: 9, instruction: 'Squeeze lemon juice and garnish with fresh coriander. Serve hot.', duration: 1 },
    ],
    tips: [
      'Use thick poha for best results',
      'Adding a pinch of sugar balances the flavors',
      'Serve immediately for the best texture',
      'You can add pomegranate seeds for extra crunch',
    ],
    nutritionPerServing: { calories: 280, protein: 6, carbs: 52, fat: 6 },
  },
  'dal-rice-1': {
    mealId: 'dal-rice-1',
    servings: 2,
    ingredients: [
      { name: 'Toor dal', quantity: '1', unit: 'cup', category: 'protein' },
      { name: 'Basmati rice', quantity: '1', unit: 'cup', category: 'grains' },
      { name: 'Onion', quantity: '1', unit: 'medium', category: 'vegetables' },
      { name: 'Tomato', quantity: '1', unit: 'medium', category: 'vegetables' },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', category: 'dairy' },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', category: 'spices' },
      { name: 'Turmeric powder', quantity: '1/2', unit: 'tsp', category: 'spices' },
      { name: 'Red chili powder', quantity: '1/2', unit: 'tsp', category: 'spices' },
      { name: 'Garlic', quantity: '4', unit: 'cloves', category: 'vegetables' },
      { name: 'Salt', quantity: 'to taste', unit: '', category: 'spices' },
      { name: 'Coriander leaves', quantity: '2', unit: 'tbsp', category: 'vegetables' },
    ],
    steps: [
      { step: 1, instruction: 'Wash the dal and pressure cook with 3 cups water and turmeric for 3 whistles.', duration: 15, tip: 'Soak dal for 30 minutes for faster cooking' },
      { step: 2, instruction: 'Cook rice separately until fluffy. Set aside.', duration: 15 },
      { step: 3, instruction: 'Heat ghee in a pan. Add cumin seeds and let them splutter.', duration: 1 },
      { step: 4, instruction: 'Add sliced garlic and fry until golden.', duration: 2 },
      { step: 5, instruction: 'Add chopped onions and sauté until golden brown.', duration: 5 },
      { step: 6, instruction: 'Add chopped tomatoes and cook until soft.', duration: 4 },
      { step: 7, instruction: 'Add red chili powder and salt. Mix well.', duration: 1 },
      { step: 8, instruction: 'Add the cooked dal and simmer for 5 minutes.', duration: 5, tip: 'Add water if dal is too thick' },
      { step: 9, instruction: 'Garnish with fresh coriander. Serve hot with rice.', duration: 1 },
    ],
    tips: [
      'The tadka (tempering) is what makes dal flavorful',
      'Use desi ghee for authentic taste',
      'Serve with a pickle on the side',
      'Add a squeeze of lemon before serving',
    ],
    nutritionPerServing: { calories: 420, protein: 14, carbs: 72, fat: 8 },
  },
  'palak-paneer-1': {
    mealId: 'palak-paneer-1',
    servings: 2,
    ingredients: [
      { name: 'Fresh spinach', quantity: '500', unit: 'grams', category: 'vegetables' },
      { name: 'Paneer', quantity: '200', unit: 'grams', category: 'dairy' },
      { name: 'Onion', quantity: '1', unit: 'medium', category: 'vegetables' },
      { name: 'Tomato', quantity: '1', unit: 'medium', category: 'vegetables' },
      { name: 'Ginger', quantity: '1', unit: 'inch', category: 'vegetables' },
      { name: 'Garlic', quantity: '4', unit: 'cloves', category: 'vegetables' },
      { name: 'Green chili', quantity: '2', unit: 'pieces', category: 'vegetables' },
      { name: 'Cream', quantity: '2', unit: 'tbsp', category: 'dairy' },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', category: 'spices' },
      { name: 'Garam masala', quantity: '1/2', unit: 'tsp', category: 'spices' },
      { name: 'Oil', quantity: '2', unit: 'tbsp', category: 'other' },
      { name: 'Salt', quantity: 'to taste', unit: '', category: 'spices' },
      { name: 'Wheat flour (for roti)', quantity: '1', unit: 'cup', category: 'grains' },
    ],
    steps: [
      { step: 1, instruction: 'Blanch spinach in boiling water for 2 minutes. Immediately transfer to ice water.', duration: 3, tip: 'Ice bath keeps spinach vibrant green' },
      { step: 2, instruction: 'Blend the blanched spinach into a smooth puree. Set aside.', duration: 2 },
      { step: 3, instruction: 'Cut paneer into cubes. Lightly fry until golden. Set aside.', duration: 5 },
      { step: 4, instruction: 'Heat oil. Add cumin seeds, ginger, garlic, and green chili. Sauté for 1 minute.', duration: 2 },
      { step: 5, instruction: 'Add chopped onions and cook until golden.', duration: 5 },
      { step: 6, instruction: 'Add chopped tomatoes and cook until soft.', duration: 4 },
      { step: 7, instruction: 'Add the spinach puree, salt, and garam masala. Simmer for 5 minutes.', duration: 5 },
      { step: 8, instruction: 'Add paneer cubes and cream. Mix gently and cook for 2 minutes.', duration: 3, tip: 'Don\'t overcook after adding paneer' },
      { step: 9, instruction: 'Make rotis and serve hot with palak paneer.', duration: 15 },
    ],
    tips: [
      'Don\'t overcook spinach or it will lose color',
      'Frying paneer before adding gives better texture',
      'Add cream at the end for a rich taste',
      'Kasuri methi enhances the flavor',
    ],
    nutritionPerServing: { calories: 420, protein: 18, carbs: 42, fat: 20 },
  },
  'fruit-chaat-1': {
    mealId: 'fruit-chaat-1',
    servings: 2,
    ingredients: [
      { name: 'Apple', quantity: '1', unit: 'medium', category: 'other' },
      { name: 'Banana', quantity: '1', unit: 'medium', category: 'other' },
      { name: 'Pomegranate', quantity: '1/2', unit: 'cup seeds', category: 'other' },
      { name: 'Grapes', quantity: '1/2', unit: 'cup', category: 'other' },
      { name: 'Orange', quantity: '1', unit: 'medium', category: 'other' },
      { name: 'Chaat masala', quantity: '1', unit: 'tsp', category: 'spices' },
      { name: 'Black salt', quantity: '1/4', unit: 'tsp', category: 'spices' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp', category: 'other' },
      { name: 'Honey (optional)', quantity: '1', unit: 'tsp', category: 'other' },
    ],
    steps: [
      { step: 1, instruction: 'Wash all fruits thoroughly.', duration: 2 },
      { step: 2, instruction: 'Cut apple into small cubes. Slice banana into rounds.', duration: 3 },
      { step: 3, instruction: 'Peel and segment the orange. Cut grapes in half if large.', duration: 3 },
      { step: 4, instruction: 'Combine all fruits in a large bowl.', duration: 1 },
      { step: 5, instruction: 'Sprinkle chaat masala and black salt over the fruits.', duration: 1, tip: 'Start with less masala, add more to taste' },
      { step: 6, instruction: 'Squeeze lemon juice and drizzle honey if using.', duration: 1 },
      { step: 7, instruction: 'Toss gently to combine. Serve immediately.', duration: 1 },
    ],
    tips: [
      'Use seasonal fruits for best taste',
      'Add mint leaves for freshness',
      'Don\'t cut bananas too early as they brown quickly',
      'Chill fruits before making for a refreshing snack',
    ],
    nutritionPerServing: { calories: 150, protein: 2, carbs: 35, fat: 1 },
  },
};

// Helper function to get recipe by meal ID
export const getRecipeById = (mealId: string): RecipeDetail | null => {
  return recipeDetails[mealId] || null;
};

// Generate generic recipe steps for meals without detailed recipes
export const generateGenericRecipe = (meal: Meal): RecipeDetail => {
  const genericSteps: RecipeStep[] = [
    { step: 1, instruction: `Gather all ingredients: ${meal.ingredients.join(', ')}.`, duration: 5 },
    { step: 2, instruction: 'Prepare vegetables by washing and chopping as needed.', duration: meal.prepTime },
    { step: 3, instruction: 'Heat oil or ghee in a pan over medium heat.', duration: 1 },
    { step: 4, instruction: 'Add spices and aromatics, sauté until fragrant.', duration: 2 },
    { step: 5, instruction: 'Add main ingredients and cook according to recipe requirements.', duration: Math.floor(meal.cookTime * 0.6) },
    { step: 6, instruction: 'Season with salt and adjust spices to taste.', duration: 1 },
    { step: 7, instruction: 'Simmer until fully cooked and flavors are well combined.', duration: Math.floor(meal.cookTime * 0.3) },
    { step: 8, instruction: 'Garnish and serve hot.', duration: 1 },
  ];

  return {
    mealId: meal.id,
    servings: 2,
    ingredients: meal.ingredients.map((ing, i) => ({
      name: ing,
      quantity: 'As needed',
      unit: '',
      category: 'other' as const,
    })),
    steps: meal.difficulty === 'no-cook' 
      ? [
          { step: 1, instruction: `Gather ingredients: ${meal.ingredients.join(', ')}.`, duration: 2 },
          { step: 2, instruction: 'Prepare and combine all ingredients.', duration: meal.prepTime },
          { step: 3, instruction: 'Mix well and serve.', duration: 1 },
        ]
      : genericSteps,
    tips: [
      'Adjust spice levels according to your preference',
      'Use fresh ingredients for best results',
      'Serve immediately for optimal taste',
    ],
    nutritionPerServing: {
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    },
  };
};
