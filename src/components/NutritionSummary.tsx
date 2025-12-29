import { motion } from 'framer-motion';
import { Flame, Dumbbell, Wheat, Droplets, IndianRupee } from 'lucide-react';

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  targetCalories: number;
  targetProtein: number;
  cost: number;
  budget: number;
}

export default function NutritionSummary({
  calories,
  protein,
  carbs,
  fat,
  targetCalories,
  targetProtein,
  cost,
  budget,
}: NutritionSummaryProps) {
  const caloriePercent = Math.min((calories / targetCalories) * 100, 100);
  const proteinPercent = Math.min((protein / targetProtein) * 100, 100);
  const budgetPercent = Math.min((cost / budget) * 100, 100);

  const isOverCalories = calories > targetCalories;
  const isOverBudget = cost > budget;

  return (
    <div className="bg-card rounded-3xl p-5 shadow-card space-y-5">
      {/* Calories - Main focus */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center">
              <Flame className="w-4 h-4 text-sage" />
            </div>
            <span className="font-medium">Calories</span>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold ${isOverCalories ? 'text-destructive' : 'text-sage'}`}>
              {calories}
            </span>
            <span className="text-muted-foreground text-sm"> / {targetCalories}</span>
          </div>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${caloriePercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${isOverCalories ? 'bg-destructive' : 'gradient-sage'}`}
          />
        </div>
      </div>

      {/* Protein */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-turmeric-light flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-accent" />
            </div>
            <span className="font-medium">Protein</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-accent">{protein}g</span>
            <span className="text-muted-foreground text-sm"> / {targetProtein}g</span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${proteinPercent}%` }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="h-full rounded-full bg-accent"
          />
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-2xl bg-secondary">
          <Wheat className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <div className="font-bold">{carbs}g</div>
          <div className="text-xs text-muted-foreground">Carbs</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-secondary">
          <Droplets className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <div className="font-bold">{fat}g</div>
          <div className="text-xs text-muted-foreground">Fat</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-secondary">
          <IndianRupee className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <div className={`font-bold ${isOverBudget ? 'text-destructive' : ''}`}>₹{cost}</div>
          <div className="text-xs text-muted-foreground">of ₹{budget}</div>
        </div>
      </div>

      {/* Budget bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${budgetPercent}%` }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className={`h-full rounded-full ${isOverBudget ? 'bg-destructive' : 'bg-sage'}`}
        />
      </div>
    </div>
  );
}
