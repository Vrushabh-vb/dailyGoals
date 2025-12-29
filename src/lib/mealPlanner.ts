import { meals, getMealsByType, type Meal, type DietType, type MealType } from '@/data/meals';
import type { CookingSkill, DailyMealPlan, Goal } from '@/store/userStore';

interface PlannerOptions {
  goal: Goal;
  diet: DietType;
  budget: number;
  cookingSkill: CookingSkill;
  targetCalories: number;
  targetProtein: number;
}

const difficultyScore = (skill: CookingSkill): string[] => {
  switch (skill) {
    case 'beginner':
      return ['no-cook', 'easy'];
    case 'intermediate':
      return ['no-cook', 'easy', 'medium'];
    case 'advanced':
      return ['no-cook', 'easy', 'medium', 'hard'];
  }
};

const selectBestMeal = (
  type: MealType,
  options: PlannerOptions,
  usedMealIds: Set<string>,
  remainingBudget: number,
  remainingCalories: number
): Meal | null => {
  const allowedDifficulties = difficultyScore(options.cookingSkill);
  
  const candidates = getMealsByType(type, options.diet)
    .filter(m => 
      allowedDifficulties.includes(m.difficulty) &&
      m.costPerServing <= remainingBudget &&
      !usedMealIds.has(m.id)
    );

  if (candidates.length === 0) {
    // Fallback: ignore budget constraint
    const fallback = getMealsByType(type, options.diet)
      .filter(m => allowedDifficulties.includes(m.difficulty) && !usedMealIds.has(m.id));
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  // Score meals based on calorie fit and protein
  const targetForMeal = type === 'snack' ? remainingCalories * 0.1 : remainingCalories * 0.3;
  
  const scored = candidates.map(m => {
    const calorieDiff = Math.abs(m.calories - targetForMeal);
    const proteinBonus = m.protein * 2;
    const budgetBonus = (remainingBudget - m.costPerServing) * 0.5;
    const score = proteinBonus + budgetBonus - calorieDiff * 0.1;
    return { meal: m, score };
  });

  // Add some randomness
  scored.sort((a, b) => b.score - a.score);
  const topCandidates = scored.slice(0, Math.min(3, scored.length));
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
  
  return selected?.meal || null;
};

export const generateDailyPlan = (options: PlannerOptions): DailyMealPlan => {
  const usedMealIds = new Set<string>();
  let remainingBudget = options.budget;
  let remainingCalories = options.targetCalories;

  const today = new Date().toISOString().split('T')[0];

  // Allocate budget: breakfast 20%, lunch 35%, dinner 35%, snack 10%
  const budgetAllocation = {
    breakfast: options.budget * 0.2,
    lunch: options.budget * 0.35,
    dinner: options.budget * 0.35,
    snack: options.budget * 0.1,
  };

  const breakfast = selectBestMeal('breakfast', options, usedMealIds, budgetAllocation.breakfast, remainingCalories);
  if (breakfast) {
    usedMealIds.add(breakfast.id);
    remainingBudget -= breakfast.costPerServing;
    remainingCalories -= breakfast.calories;
  }

  const lunch = selectBestMeal('lunch', options, usedMealIds, budgetAllocation.lunch + (budgetAllocation.breakfast - (breakfast?.costPerServing || 0)), remainingCalories);
  if (lunch) {
    usedMealIds.add(lunch.id);
    remainingBudget -= lunch.costPerServing;
    remainingCalories -= lunch.calories;
  }

  const dinner = selectBestMeal('dinner', options, usedMealIds, remainingBudget * 0.8, remainingCalories);
  if (dinner) {
    usedMealIds.add(dinner.id);
    remainingBudget -= dinner.costPerServing;
    remainingCalories -= dinner.calories;
  }

  const snack = selectBestMeal('snack', options, usedMealIds, remainingBudget, remainingCalories);
  if (snack) {
    usedMealIds.add(snack.id);
  }

  return {
    date: today,
    breakfast,
    lunch,
    dinner,
    snack,
    outsideFoods: [],
  };
};

export const calculatePlanNutrition = (plan: DailyMealPlan) => {
  const mealNutrition = [plan.breakfast, plan.lunch, plan.dinner, plan.snack]
    .filter(Boolean)
    .reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal?.calories || 0),
        protein: acc.protein + (meal?.protein || 0),
        carbs: acc.carbs + (meal?.carbs || 0),
        fat: acc.fat + (meal?.fat || 0),
        cost: acc.cost + (meal?.costPerServing || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }
    );

  const outsideNutrition = plan.outsideFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    calories: mealNutrition.calories + outsideNutrition.calories,
    protein: mealNutrition.protein + outsideNutrition.protein,
    carbs: mealNutrition.carbs + outsideNutrition.carbs,
    fat: mealNutrition.fat + outsideNutrition.fat,
    cost: mealNutrition.cost,
  };
};

export const adjustPlanAfterOutsideFood = (
  plan: DailyMealPlan,
  outsideCalories: number,
  options: PlannerOptions
): DailyMealPlan => {
  // Calculate current calories
  const current = calculatePlanNutrition(plan);
  const targetAfterOutside = options.targetCalories - outsideCalories;
  
  // If we're way over, suggest lighter alternatives
  if (current.calories > targetAfterOutside + 200) {
    // Try to find lighter alternatives for remaining meals
    const updatedPlan = { ...plan };
    
    // If dinner hasn't been eaten yet, suggest a lighter option
    if (plan.dinner) {
      const lighterDinners = getMealsByType('dinner', options.diet)
        .filter(m => m.calories < plan.dinner!.calories - 100)
        .sort((a, b) => a.calories - b.calories);
      
      if (lighterDinners.length > 0) {
        updatedPlan.dinner = lighterDinners[0];
      }
    }
    
    return updatedPlan;
  }
  
  return plan;
};
