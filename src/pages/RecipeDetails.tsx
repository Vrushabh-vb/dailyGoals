import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getMealById, type Meal } from '@/data/meals';
import { getRecipeById, generateGenericRecipe, type RecipeDetail } from '@/data/recipes';
import { 
  ArrowLeft, 
  Clock, 
  IndianRupee, 
  Users, 
  ChefHat,
  Lightbulb,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function RecipeDetails() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (mealId) {
      const foundMeal = getMealById(mealId);
      if (foundMeal) {
        setMeal(foundMeal);
        const detailedRecipe = getRecipeById(mealId);
        setRecipe(detailedRecipe || generateGenericRecipe(foundMeal));
      }
    }
  }, [mealId]);

  const toggleStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  if (!meal || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  const totalTime = meal.prepTime + meal.cookTime;
  const progress = (completedSteps.size / recipe.steps.length) * 100;

  const difficultyColors: Record<string, string> = {
    'no-cook': 'bg-sage-light text-sage-dark',
    'easy': 'bg-sage-light text-sage-dark',
    'medium': 'bg-turmeric-light text-accent-foreground',
    'hard': 'bg-terracotta-light text-secondary-foreground',
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
        <div className="container py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight">{meal.name}</h1>
            {meal.nameHindi && (
              <span className="text-sm text-muted-foreground">{meal.nameHindi}</span>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div 
            className="h-full bg-sage"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-3"
        >
          <div className="bg-card rounded-2xl p-4 text-center shadow-card">
            <Clock className="w-5 h-5 mx-auto mb-1 text-sage" />
            <div className="font-bold">{totalTime}</div>
            <div className="text-xs text-muted-foreground">mins</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card">
            <Users className="w-5 h-5 mx-auto mb-1 text-accent" />
            <div className="font-bold">{recipe.servings}</div>
            <div className="text-xs text-muted-foreground">servings</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card">
            <IndianRupee className="w-4 h-4 mx-auto mb-1 text-terracotta" />
            <div className="font-bold">{meal.costPerServing}</div>
            <div className="text-xs text-muted-foreground">per serving</div>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-card">
            <ChefHat className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[meal.difficulty]}`}>
              {meal.difficulty}
            </div>
          </div>
        </motion.div>

        {/* Nutrition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-5 shadow-card"
        >
          <h2 className="font-semibold mb-4">Nutrition per serving</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-sage-light">
              <div className="text-xl font-bold text-sage-dark">{meal.calories}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-turmeric-light">
              <div className="text-xl font-bold text-accent-foreground">{meal.protein}g</div>
              <div className="text-xs text-muted-foreground">protein</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary">
              <div className="text-xl font-bold">{meal.carbs}g</div>
              <div className="text-xs text-muted-foreground">carbs</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-terracotta-light">
              <div className="text-xl font-bold text-secondary-foreground">{meal.fat}g</div>
              <div className="text-xs text-muted-foreground">fat</div>
            </div>
          </div>
        </motion.section>

        {/* Ingredients */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-5 shadow-card"
        >
          <h2 className="font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span>{ing.name}</span>
                <span className="text-muted-foreground text-sm">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="font-semibold">Cooking Steps</h2>
          {recipe.steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => toggleStep(step.step)}
              className={`bg-card rounded-2xl p-4 shadow-card cursor-pointer transition-all ${
                completedSteps.has(step.step) ? 'opacity-60' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  {completedSteps.has(step.step) ? (
                    <CheckCircle2 className="w-6 h-6 text-sage" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Step {step.step}</span>
                    {step.duration && (
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {step.duration} min
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${completedSteps.has(step.step) ? 'line-through text-muted-foreground' : ''}`}>
                    {step.instruction}
                  </p>
                  {step.tip && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-sage bg-sage-light rounded-lg p-2">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Tips */}
        {recipe.tips.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-turmeric-light rounded-3xl p-5"
          >
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Pro Tips
            </h2>
            <ul className="space-y-2">
              {recipe.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-accent">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Complete Button */}
        {completedSteps.size === recipe.steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center pt-4"
          >
            <Button variant="hero" onClick={() => navigate('/dashboard')}>
              🎉 Recipe Complete!
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
