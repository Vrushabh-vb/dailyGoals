import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Meal } from '@/data/meals';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Clock, IndianRupee, BookOpen } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  showIndianPortions: boolean;
  onSwap: () => void;
}

const difficultyColors: Record<string, string> = {
  'no-cook': 'bg-sage-light text-sage-dark',
  'easy': 'bg-sage-light text-sage-dark',
  'medium': 'bg-turmeric-light text-accent-foreground',
  'hard': 'bg-terracotta-light text-secondary-foreground',
};

const difficultyLabels: Record<string, string> = {
  'no-cook': 'No Cook',
  'easy': 'Easy',
  'medium': 'Medium',
  'hard': 'Advanced',
};

export default function MealCard({ meal, showIndianPortions, onSwap }: MealCardProps) {
  const navigate = useNavigate();
  const totalTime = meal.prepTime + meal.cookTime;

  const formatPortion = () => {
    if (showIndianPortions && meal.portions.length > 0) {
      return meal.portions.map(p => `${p.amount} ${p.unit}`).join(' + ');
    }
    const totalGrams = meal.portions.reduce((acc, p) => acc + p.gramsEquivalent, 0);
    return `${totalGrams}g`;
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-card rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg leading-tight">{meal.name}</h3>
          {meal.nameHindi && (
            <span className="text-sm text-muted-foreground">{meal.nameHindi}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="icon" 
            size="icon" 
            className="shrink-0"
            onClick={() => navigate(`/recipe/${meal.id}`)}
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          <Button 
            variant="icon" 
            size="icon" 
            className="shrink-0"
            onClick={onSwap}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {meal.description}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[meal.difficulty]}`}>
          {difficultyLabels[meal.difficulty]}
        </span>
        {meal.badges.slice(0, 2).map(badge => (
          <span key={badge} className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {badge}
          </span>
        ))}
      </div>

      {/* Nutrition Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-xl bg-sage-light">
          <div className="text-lg font-bold text-sage-dark">{meal.calories}</div>
          <div className="text-xs text-muted-foreground">kcal</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-turmeric-light">
          <div className="text-lg font-bold text-accent-foreground">{meal.protein}g</div>
          <div className="text-xs text-muted-foreground">protein</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-secondary">
          <div className="text-lg font-bold">{meal.carbs}g</div>
          <div className="text-xs text-muted-foreground">carbs</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-terracotta-light">
          <div className="text-lg font-bold text-secondary-foreground">{meal.fat}g</div>
          <div className="text-xs text-muted-foreground">fat</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{totalTime} min</span>
        </div>
        <div className="font-medium">
          {formatPortion()}
        </div>
        <div className="flex items-center gap-1">
          <IndianRupee className="w-3 h-3" />
          <span>{meal.costPerServing}</span>
        </div>
      </div>
    </motion.div>
  );
}
