import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUserStore } from '@/store/userStore';
import { generateDailyPlan, calculatePlanNutrition } from '@/lib/mealPlanner';
import MealCard from '@/components/MealCard';
import MealSwapSheet from '@/components/MealSwapSheet';
import OutsideFoodModal from '@/components/OutsideFoodModal';
import type { Meal, MealType } from '@/data/meals';
import type { User, Session } from '@supabase/supabase-js';
import {
  RefreshCw,
  Plus,
  Settings,
  Utensils,
  Sun,
  Moon,
  Coffee,
  Calendar,
  User as UserIcon,
  Apple,
  Scale
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, currentPlan, setCurrentPlan, swapMeal, showIndianPortions, togglePortionView } = useUserStore();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [swapSheet, setSwapSheet] = useState<{ open: boolean; meal: Meal | null; mealType: MealType | null }>({
    open: false,
    meal: null,
    mealType: null,
  });
  const [outsideFoodOpen, setOutsideFoodOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate('/onboarding');
      return;
    }

    if (!currentPlan) {
      generateNewPlan();
    }
  }, [profile.onboardingComplete, currentPlan]);

  const generateNewPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateDailyPlan(profile);
      setCurrentPlan(plan);
      setIsGenerating(false);
    }, 500);
  };

  const handleSwapClick = (meal: Meal, mealType: MealType) => {
    setSwapSheet({ open: true, meal, mealType });
  };

  const handleSwapConfirm = (newMeal: Meal) => {
    if (swapSheet.mealType) {
      swapMeal(swapSheet.mealType, newMeal);
    }
    setSwapSheet({ open: false, meal: null, mealType: null });
  };

  const nutrition = currentPlan ? calculatePlanNutrition(currentPlan) : null;

  const mealTypeConfig: Record<MealType, { icon: React.ReactNode; label: string; time: string }> = {
    breakfast: { icon: <Coffee className="w-5 h-5" />, label: 'Breakfast', time: '8:00 AM' },
    lunch: { icon: <Sun className="w-5 h-5" />, label: 'Lunch', time: '1:00 PM' },
    dinner: { icon: <Moon className="w-5 h-5" />, label: 'Dinner', time: '8:00 PM' },
    snack: { icon: <Utensils className="w-5 h-5" />, label: 'Snack', time: '5:00 PM' },
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 mx-auto mb-6 rounded-full border-2 border-gray-200 border-t-black"
          />
          <p className="text-gray-500">Creating your meal plan...</p>
        </motion.div>
      </div>
    );
  }

  const calorieProgress = nutrition ? Math.min((nutrition.calories / profile.targetCalories) * 100, 100) : 0;
  const proteinProgress = nutrition ? Math.min((nutrition.protein / profile.targetProtein) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-style Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Today</h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                onClick={() => navigate('/weekly')}
              >
                <Calendar className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                onClick={() => navigate(user ? '/profile' : '/auth')}
              >
                <UserIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 pb-24">
        {/* Nutrition Overview - Apple Card Style */}
        {nutrition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 mb-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-4">Nutrition Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold tracking-tight">{nutrition.calories}</div>
                <div className="text-sm text-gray-500">of {profile.targetCalories} cal</div>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calorieProgress}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight">{nutrition.protein}g</div>
                <div className="text-sm text-gray-500">of {profile.targetProtein}g protein</div>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${proteinProgress}%` }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold tracking-tight">₹{nutrition.cost}</div>
                <div className="text-sm text-gray-500">of ₹{profile.budget} budget</div>
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((nutrition.cost / profile.budget) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <Button
            className="h-12 bg-black hover:bg-gray-800 text-white rounded-2xl font-medium text-sm"
            onClick={() => setOutsideFoodOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Food
          </Button>
          <Button
            variant="outline"
            className="h-12 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl font-medium text-sm"
            onClick={() => navigate('/pantry')}
          >
            <Apple className="w-4 h-4 mr-1" />
            Pantry
          </Button>
          <Button
            variant="outline"
            className="h-12 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl font-medium text-sm"
            onClick={() => navigate('/nutrition')}
          >
            <Scale className="w-4 h-4 mr-1" />
            Nutrition
          </Button>
        </motion.div>

        {/* Regenerate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <button
            onClick={generateNewPlan}
            disabled={isGenerating}
            className="w-full h-12 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-gray-600 font-medium">Regenerate Plan</span>
          </button>
        </motion.div>

        {/* Portion Toggle - Apple Switch Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm"
        >
          <div>
            <div className="font-medium">Indian Portions</div>
            <div className="text-sm text-gray-500">Show in cups, bowls & spoons</div>
          </div>
          <button
            onClick={togglePortionView}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${showIndianPortions ? 'bg-black' : 'bg-gray-200'
              }`}
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm"
              animate={{ left: showIndianPortions ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </motion.div>

        {/* Meals Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Today's Meals</h2>

          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((mealType, index) => {
            const meal = currentPlan[mealType];
            if (!meal) return null;
            const config = mealTypeConfig[mealType];

            return (
              <motion.div
                key={mealType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      {config.icon}
                    </div>
                    <div>
                      <div className="font-semibold">{config.label}</div>
                      <div className="text-xs text-gray-500">{config.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{meal.calories} cal</div>
                    <div className="text-xs text-gray-500">{meal.protein}g protein</div>
                  </div>
                </div>
                <div className="p-4">
                  <MealCard
                    meal={meal}
                    showIndianPortions={showIndianPortions}
                    onSwap={() => handleSwapClick(meal, mealType)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Outside Foods */}
        {currentPlan.outsideFoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <h2 className="text-lg font-semibold">Outside Foods</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {currentPlan.outsideFoods.map((food, i) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <span className="font-medium">{food.name}</span>
                  <span className="text-sm text-gray-500">{food.calories} cal</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Swap Sheet */}
      <MealSwapSheet
        open={swapSheet.open}
        onOpenChange={(open) => setSwapSheet({ ...swapSheet, open })}
        currentMeal={swapSheet.meal}
        diet={profile.diet}
        onSelect={handleSwapConfirm}
      />

      {/* Outside Food Modal */}
      <OutsideFoodModal
        open={outsideFoodOpen}
        onOpenChange={setOutsideFoodOpen}
      />
    </div>
  );
}
