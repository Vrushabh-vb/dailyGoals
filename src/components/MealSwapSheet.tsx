import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getAlternativeMeals, type Meal, type DietType } from '@/data/meals';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeftRight, Clock, IndianRupee } from 'lucide-react';

interface MealSwapSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMeal: Meal | null;
  diet: DietType;
  onSelect: (meal: Meal) => void;
}

export default function MealSwapSheet({ 
  open, 
  onOpenChange, 
  currentMeal, 
  diet, 
  onSelect 
}: MealSwapSheetProps) {
  if (!currentMeal) return null;

  const alternatives = getAlternativeMeals(currentMeal, diet);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-auto">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-sage" />
            Swap {currentMeal.name}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Similar calories & protein options
          </p>
        </SheetHeader>

        <div className="space-y-3 pb-6">
          <AnimatePresence>
            {alternatives.map((meal, i) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onSelect(meal)}
                className="bg-secondary/50 rounded-2xl p-4 cursor-pointer hover:bg-secondary transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{meal.name}</h4>
                    {meal.nameHindi && (
                      <span className="text-xs text-muted-foreground">{meal.nameHindi}</span>
                    )}
                  </div>
                  <Button variant="soft" size="sm">
                    <Check className="w-4 h-4 mr-1" /> Select
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  {meal.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-3">
                    <span className="font-medium text-sage">{meal.calories} kcal</span>
                    <span className="text-muted-foreground">{meal.protein}g protein</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.prepTime + meal.cookTime}m
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {meal.costPerServing}
                    </span>
                  </div>
                </div>

                {/* Calorie comparison */}
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs">
                  <span className={`font-medium ${
                    meal.calories < currentMeal.calories 
                      ? 'text-sage' 
                      : meal.calories > currentMeal.calories 
                        ? 'text-terracotta' 
                        : 'text-muted-foreground'
                  }`}>
                    {meal.calories < currentMeal.calories 
                      ? `${currentMeal.calories - meal.calories} fewer calories`
                      : meal.calories > currentMeal.calories
                        ? `${meal.calories - currentMeal.calories} more calories`
                        : 'Same calories'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
