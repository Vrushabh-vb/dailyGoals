import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DietType, Meal, MealType } from '@/data/meals';

export type Goal = 'lose' | 'maintain' | 'gain';
export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';

export interface DailyMealPlan {
  date: string;
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snack: Meal | null;
  outsideFoods: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>;
}

export interface UserProfile {
  goal: Goal;
  diet: DietType;
  budget: number; // daily budget in INR
  cookingSkill: CookingSkill;
  targetCalories: number;
  targetProtein: number;
  onboardingComplete: boolean;
}

interface UserState {
  profile: UserProfile;
  currentPlan: DailyMealPlan | null;
  weeklyPlans: DailyMealPlan[];
  showIndianPortions: boolean;
  
  // Actions
  setGoal: (goal: Goal) => void;
  setDiet: (diet: DietType) => void;
  setBudget: (budget: number) => void;
  setCookingSkill: (skill: CookingSkill) => void;
  completeOnboarding: () => void;
  setCurrentPlan: (plan: DailyMealPlan) => void;
  swapMeal: (mealType: MealType, newMeal: Meal) => void;
  addOutsideFood: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void;
  togglePortionView: () => void;
  resetStore: () => void;
}

const defaultProfile: UserProfile = {
  goal: 'maintain',
  diet: 'veg',
  budget: 150,
  cookingSkill: 'beginner',
  targetCalories: 2000,
  targetProtein: 60,
  onboardingComplete: false,
};

const getTargetCalories = (goal: Goal): number => {
  switch (goal) {
    case 'lose': return 1600;
    case 'maintain': return 2000;
    case 'gain': return 2400;
  }
};

const getTargetProtein = (goal: Goal): number => {
  switch (goal) {
    case 'lose': return 80;
    case 'maintain': return 60;
    case 'gain': return 100;
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      currentPlan: null,
      weeklyPlans: [],
      showIndianPortions: true,

      setGoal: (goal) => set((state) => ({
        profile: {
          ...state.profile,
          goal,
          targetCalories: getTargetCalories(goal),
          targetProtein: getTargetProtein(goal),
        }
      })),

      setDiet: (diet) => set((state) => ({
        profile: { ...state.profile, diet }
      })),

      setBudget: (budget) => set((state) => ({
        profile: { ...state.profile, budget }
      })),

      setCookingSkill: (cookingSkill) => set((state) => ({
        profile: { ...state.profile, cookingSkill }
      })),

      completeOnboarding: () => set((state) => ({
        profile: { ...state.profile, onboardingComplete: true }
      })),

      setCurrentPlan: (plan) => set({ currentPlan: plan }),

      swapMeal: (mealType, newMeal) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            [mealType]: newMeal,
          }
        };
      }),

      addOutsideFood: (food) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            outsideFoods: [...state.currentPlan.outsideFoods, food],
          }
        };
      }),

      togglePortionView: () => set((state) => ({
        showIndianPortions: !state.showIndianPortions
      })),

      resetStore: () => set({
        profile: defaultProfile,
        currentPlan: null,
        weeklyPlans: [],
        showIndianPortions: true,
      }),
    }),
    {
      name: 'meal-planner-storage',
    }
  )
);
