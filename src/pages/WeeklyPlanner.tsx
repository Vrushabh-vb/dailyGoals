import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { generateDailyPlan, calculatePlanNutrition } from '@/lib/mealPlanner';
import type { DailyMealPlan } from '@/store/userStore';
import type { MealType } from '@/data/meals';
import {
  ArrowLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface WeeklyPlan {
  startDate: Date;
  days: DailyMealPlan[];
}

export default function WeeklyPlanner() {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!profile.onboardingComplete) {
      navigate('/onboarding');
      return;
    }
    generateWeeklyPlan();
  }, [profile.onboardingComplete]);

  const getWeekStart = (date: Date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const generateWeeklyPlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const startDate = getWeekStart();
      const days: DailyMealPlan[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const plan = generateDailyPlan(profile);
        plan.date = date.toISOString().split('T')[0];
        days.push(plan);
      }

      setWeeklyPlan({ startDate, days });
      setIsGenerating(false);
    }, 800);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (!weeklyPlan) return;
    const newStart = new Date(weeklyPlan.startDate);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7));

    setIsGenerating(true);
    setTimeout(() => {
      const days: DailyMealPlan[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(newStart);
        date.setDate(date.getDate() + i);
        const plan = generateDailyPlan(profile);
        plan.date = date.toISOString().split('T')[0];
        days.push(plan);
      }
      setWeeklyPlan({ startDate: newStart, days });
      setSelectedDay(0);
      setIsGenerating(false);
    }, 500);
  };

  const formatDateRange = () => {
    if (!weeklyPlan) return '';
    const start = weeklyPlan.startDate;
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getWeekTotals = () => {
    if (!weeklyPlan) return { calories: 0, protein: 0, cost: 0 };
    return weeklyPlan.days.reduce(
      (acc, day) => {
        const nutrition = calculatePlanNutrition(day);
        return {
          calories: acc.calories + nutrition.calories,
          protein: acc.protein + nutrition.protein,
          cost: acc.cost + nutrition.cost,
        };
      },
      { calories: 0, protein: 0, cost: 0 }
    );
  };

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-black"
        />
      </div>
    );
  }

  const selectedPlan = weeklyPlan.days[selectedDay];
  const selectedNutrition = calculatePlanNutrition(selectedPlan);
  const weekTotals = getWeekTotals();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Apple-style Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Weekly Planner</h1>
            <p className="text-sm text-gray-500">{formatDateRange()}</p>
          </div>
          <button
            onClick={generateWeeklyPlan}
            disabled={isGenerating}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-medium">{formatDateRange()}</span>
          <button
            onClick={() => navigateWeek('next')}
            className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Day Selector - Apple Pill Style */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {weeklyPlan.days.map((day, i) => {
            const date = new Date(day.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const nutrition = calculatePlanNutrition(day);

            return (
              <motion.button
                key={i}
                onClick={() => setSelectedDay(i)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 p-4 rounded-2xl min-w-[80px] text-center transition-all ${selectedDay === i
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white shadow-sm hover:shadow-md'
                  }`}
              >
                <div className={`text-xs font-medium ${selectedDay === i ? 'text-white/70' : 'text-gray-500'}`}>
                  {DAYS[date.getDay()]}
                </div>
                <div className="text-xl font-bold my-1">{date.getDate()}</div>
                {isToday && (
                  <div className={`text-[10px] font-medium ${selectedDay === i ? 'text-white' : 'text-black'}`}>
                    Today
                  </div>
                )}
                <div className={`text-xs mt-1 ${selectedDay === i ? 'text-white/70' : 'text-gray-500'}`}>
                  {nutrition.calories} cal
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Week Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-4">Week Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(weekTotals.calories / 7)}</div>
              <div className="text-sm text-gray-500">avg cal/day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Math.round(weekTotals.protein / 7)}g</div>
              <div className="text-sm text-gray-500">avg protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">₹{weekTotals.cost}</div>
              <div className="text-sm text-gray-500">total cost</div>
            </div>
          </div>
        </motion.div>

        {/* Selected Day Meals */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {FULL_DAYS[new Date(selectedPlan.date).getDay()]}
              </h2>
              <div className="text-sm text-gray-500">
                {selectedNutrition.calories} cal • {selectedNutrition.protein}g protein
              </div>
            </div>

            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((mealType) => {
              const meal = selectedPlan[mealType];
              if (!meal) return null;

              return (
                <motion.div
                  key={mealType}
                  onClick={() => navigate(`/recipe/${meal.id}`)}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {mealType}
                      </div>
                      <h3 className="font-semibold text-lg">{meal.name}</h3>
                      {meal.nameHindi && (
                        <span className="text-sm text-gray-500">{meal.nameHindi}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{meal.calories}</div>
                      <div className="text-xs text-gray-500">cal</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100">
                      {meal.protein}g protein
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100">
                      ₹{meal.costPerServing}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100">
                      {meal.prepTime + meal.cookTime} min
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
