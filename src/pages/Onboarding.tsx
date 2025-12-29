import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUserStore, type Goal, type CookingSkill } from '@/store/userStore';
import type { DietType } from '@/data/meals';
import {
  TrendingDown,
  Scale,
  TrendingUp,
  Leaf,
  Egg,
  Drumstick,
  ChefHat,
  Flame,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

const steps = ['goal', 'diet', 'budget', 'skill', 'preview'] as const;
type Step = typeof steps[number];

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, setGoal, setDiet, setBudget, setCookingSkill, completeOnboarding } = useUserStore();

  const [currentStep, setCurrentStep] = useState<Step>('goal');
  const currentIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Apple-style Progress Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-0 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {steps.map((step, i) => (
              <motion.div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${i <= currentIndex ? 'bg-black' : 'bg-gray-200'
                  }`}
                initial={{ width: 8 }}
                animate={{ width: i === currentIndex ? 24 : 8 }}
              />
            ))}
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 pt-24 pb-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 'goal' && (
            <GoalStep
              key="goal"
              selected={profile.goal}
              onSelect={(g) => { setGoal(g); nextStep(); }}
            />
          )}
          {currentStep === 'diet' && (
            <DietStep
              key="diet"
              selected={profile.diet}
              onSelect={(d) => { setDiet(d); nextStep(); }}
            />
          )}
          {currentStep === 'budget' && (
            <BudgetStep
              key="budget"
              value={profile.budget}
              onChange={setBudget}
              onContinue={nextStep}
            />
          )}
          {currentStep === 'skill' && (
            <SkillStep
              key="skill"
              selected={profile.cookingSkill}
              onSelect={(s) => { setCookingSkill(s); nextStep(); }}
            />
          )}
          {currentStep === 'preview' && (
            <PreviewStep
              key="preview"
              profile={profile}
              onComplete={handleComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GoalStep({ selected, onSelect }: { selected: Goal; onSelect: (g: Goal) => void }) {
  const goals: { value: Goal; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'lose', label: 'Lose Weight', desc: 'Calorie deficit diet', icon: <TrendingDown className="w-6 h-6" /> },
    { value: 'maintain', label: 'Stay Healthy', desc: 'Balanced nutrition', icon: <Scale className="w-6 h-6" /> },
    { value: 'gain', label: 'Build Muscle', desc: 'High protein meals', icon: <TrendingUp className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg mx-auto px-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          What's your goal?
        </h1>
        <p className="text-gray-500 text-lg">
          We'll personalize your meal plan accordingly
        </p>
      </div>

      <div className="space-y-3">
        {goals.map((goal, i) => (
          <motion.button
            key={goal.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(goal.value)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${selected === goal.value
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === goal.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {goal.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{goal.label}</div>
              <div className="text-sm text-gray-500">{goal.desc}</div>
            </div>
            {selected === goal.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-black flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function DietStep({ selected, onSelect }: { selected: DietType; onSelect: (d: DietType) => void }) {
  const diets: { value: DietType; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'veg', label: 'Vegetarian', desc: 'Plant-based meals', icon: <Leaf className="w-6 h-6" /> },
    { value: 'egg', label: 'Eggetarian', desc: 'Veg + eggs', icon: <Egg className="w-6 h-6" /> },
    { value: 'non-veg', label: 'Non-Vegetarian', desc: 'All foods included', icon: <Drumstick className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg mx-auto px-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Diet preference?
        </h1>
        <p className="text-gray-500 text-lg">
          Choose what works best for you
        </p>
      </div>

      <div className="space-y-3">
        {diets.map((diet, i) => (
          <motion.button
            key={diet.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(diet.value)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${selected === diet.value
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === diet.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {diet.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{diet.label}</div>
              <div className="text-sm text-gray-500">{diet.desc}</div>
            </div>
            {selected === diet.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-black flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function BudgetStep({ value, onChange, onContinue }: { value: number; onChange: (v: number) => void; onContinue: () => void }) {
  const getBudgetLabel = (val: number) => {
    if (val <= 75) return 'Very Tight';
    if (val <= 125) return 'Budget';
    if (val <= 175) return 'Moderate';
    if (val <= 250) return 'Comfortable';
    return 'Generous';
  };

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg mx-auto px-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Daily food budget
        </h1>
        <p className="text-gray-500 text-lg">
          We'll plan meals within your budget
        </p>
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 mb-8">
        <div className="text-center mb-8">
          <motion.div
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold tracking-tight"
          >
            ₹{value}
          </motion.div>
          <div className="text-gray-500 mt-2 text-lg">{getBudgetLabel(value)}</div>
        </div>

        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={50}
          max={300}
          step={10}
          className="py-4"
        />

        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>₹50</span>
          <span>₹300</span>
        </div>
      </div>

      <Button
        className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-2xl font-medium text-base"
        onClick={onContinue}
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}

function SkillStep({ selected, onSelect }: { selected: CookingSkill; onSelect: (s: CookingSkill) => void }) {
  const skills: { value: CookingSkill; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'beginner', label: 'Beginner', desc: 'No-cook & easy recipes', icon: <Sparkles className="w-6 h-6" /> },
    { value: 'intermediate', label: 'Intermediate', desc: 'Some cooking experience', icon: <ChefHat className="w-6 h-6" /> },
    { value: 'advanced', label: 'Advanced', desc: 'Comfortable with all recipes', icon: <Flame className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg mx-auto px-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Cooking skill level?
        </h1>
        <p className="text-gray-500 text-lg">
          We'll suggest appropriate recipes
        </p>
      </div>

      <div className="space-y-3">
        {skills.map((skill, i) => (
          <motion.button
            key={skill.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelect(skill.value)}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 text-left ${selected === skill.value
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === skill.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {skill.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{skill.label}</div>
              <div className="text-sm text-gray-500">{skill.desc}</div>
            </div>
            {selected === skill.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-black flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function PreviewStep({ profile, onComplete }: { profile: any; onComplete: () => void }) {
  const goalLabels: Record<Goal, string> = {
    lose: 'Weight Loss',
    maintain: 'Stay Healthy',
    gain: 'Build Muscle',
  };

  const dietLabels: Record<DietType, string> = {
    veg: 'Vegetarian',
    egg: 'Eggetarian',
    'non-veg': 'Non-Vegetarian',
  };

  const skillLabels: Record<CookingSkill, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  const summaryItems = [
    { label: 'Goal', value: goalLabels[profile.goal] },
    { label: 'Diet', value: dietLabels[profile.diet] },
    { label: 'Budget', value: `₹${profile.budget}/day` },
    { label: 'Skill', value: skillLabels[profile.cookingSkill] },
  ];

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-lg mx-auto px-6"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          You're all set!
        </h1>
        <p className="text-gray-500 text-lg">
          Here's your personalized plan summary
        </p>
      </div>

      <div className="bg-gray-50 rounded-3xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-3">
          {summaryItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-4"
            >
              <div className="text-sm text-gray-500 mb-1">{item.label}</div>
              <div className="font-semibold">{item.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Target Calories</span>
            <span className="font-semibold">{profile.targetCalories} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Target Protein</span>
            <span className="font-semibold">{profile.targetProtein}g</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-2xl font-medium text-base"
        onClick={onComplete}
      >
        Generate My Meal Plan
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  );
}
