import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUserStore, type Goal, type CookingSkill } from '@/store/userStore';
import type { DietType } from '@/data/meals';
import {
  ArrowLeft,
  TrendingDown,
  Scale,
  TrendingUp,
  Leaf,
  Egg,
  Drumstick,
  ChefHat,
  Flame,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { profile, setGoal, setDiet, setBudget, setCookingSkill, resetStore, setCurrentPlan } = useUserStore();

  const handleReset = () => {
    if (confirm('This will reset all your data and start fresh. Continue?')) {
      resetStore();
      navigate('/onboarding');
    }
  };

  const handleRegenerate = () => {
    setCurrentPlan(null as any);
    navigate('/dashboard');
  };

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
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Goal */}
        <SettingSection title="Fitness Goal">
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'lose' as Goal, label: 'Lose', icon: <TrendingDown className="w-5 h-5" /> },
              { value: 'maintain' as Goal, label: 'Maintain', icon: <Scale className="w-5 h-5" /> },
              { value: 'gain' as Goal, label: 'Gain', icon: <TrendingUp className="w-5 h-5" /> },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setGoal(value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${profile.goal === value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
                {profile.goal === value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Diet */}
        <SettingSection title="Diet Preference">
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'veg' as DietType, label: 'Veg', icon: <Leaf className="w-5 h-5" /> },
              { value: 'egg' as DietType, label: 'Egg', icon: <Egg className="w-5 h-5" /> },
              { value: 'non-veg' as DietType, label: 'Non-Veg', icon: <Drumstick className="w-5 h-5" /> },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setDiet(value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${profile.diet === value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
                {profile.diet === value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Budget */}
        <SettingSection title="Daily Budget">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Budget per day</span>
              <span className="text-3xl font-bold">₹{profile.budget}</span>
            </div>
            <Slider
              value={[profile.budget]}
              onValueChange={([v]) => setBudget(v)}
              min={50}
              max={300}
              step={10}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>₹50</span>
              <span>₹300</span>
            </div>
          </div>
        </SettingSection>

        {/* Cooking Skill */}
        <SettingSection title="Cooking Skill">
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'beginner' as CookingSkill, label: 'Beginner', icon: <Sparkles className="w-5 h-5" /> },
              { value: 'intermediate' as CookingSkill, label: 'Medium', icon: <ChefHat className="w-5 h-5" /> },
              { value: 'advanced' as CookingSkill, label: 'Advanced', icon: <Flame className="w-5 h-5" /> },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setCookingSkill(value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${profile.cookingSkill === value
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
                {profile.cookingSkill === value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Targets Info */}
        <SettingSection title="Daily Targets">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gray-100">
              <div className="text-sm text-gray-500 mb-1">Calories</div>
              <div className="text-3xl font-bold">{profile.targetCalories}</div>
            </div>
            <div className="p-5 rounded-2xl bg-gray-100">
              <div className="text-sm text-gray-500 mb-1">Protein</div>
              <div className="text-3xl font-bold">{profile.targetProtein}g</div>
            </div>
          </div>
        </SettingSection>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-medium"
            onClick={handleRegenerate}
          >
            Regenerate Today's Plan
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </div>
      </main>
    </div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl p-6 shadow-sm space-y-4"
    >
      <h2 className="font-semibold text-lg">{title}</h2>
      {children}
    </motion.section>
  );
}
