import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { outsideFoods } from '@/data/meals';
import { useUserStore } from '@/store/userStore';
import { Search, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutsideFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OutsideFoodModal({ open, onOpenChange }: OutsideFoodModalProps) {
  const { addOutsideFood, profile } = useUserStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [customFood, setCustomFood] = useState({ name: '', calories: '' });

  const filteredFoods = outsideFoods.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectFood = (food: typeof outsideFoods[0]) => {
    addOutsideFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
    
    toast({
      title: "Food added! 🍽️",
      description: `${food.name} (${food.calories} kcal) logged. Your remaining meals will be adjusted.`,
    });
    
    onOpenChange(false);
    setSearch('');
  };

  const handleAddCustom = () => {
    if (!customFood.name || !customFood.calories) return;
    
    const calories = parseInt(customFood.calories);
    if (isNaN(calories)) return;

    addOutsideFood({
      name: customFood.name,
      calories,
      protein: Math.round(calories * 0.1 / 4), // Rough estimate
      carbs: Math.round(calories * 0.5 / 4),
      fat: Math.round(calories * 0.4 / 9),
    });

    toast({
      title: "Food added! 🍽️",
      description: `${customFood.name} (${calories} kcal) logged.`,
    });

    onOpenChange(false);
    setCustomFood({ name: '', calories: '' });
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Outside Food</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Log what you ate outside to adjust your plan
          </p>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search popular foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Popular Foods */}
        <div className="flex-1 overflow-auto -mx-6 px-6 space-y-2">
          <AnimatePresence>
            {filteredFoods.map((food, i) => (
              <motion.button
                key={food.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleSelectFood(food)}
                className="w-full p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors flex justify-between items-center text-left"
              >
                <div>
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {food.protein}g protein • {food.carbs}g carbs
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sage">{food.calories}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Custom Food */}
        <div className="border-t pt-4 space-y-3">
          <div className="text-sm font-medium">Can't find it? Add custom:</div>
          <div className="flex gap-2">
            <Input
              placeholder="Food name"
              value={customFood.name}
              onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Calories"
              type="number"
              value={customFood.calories}
              onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
              className="w-24"
            />
            <Button 
              variant="sage" 
              size="icon"
              onClick={handleAddCustom}
              disabled={!customFood.name || !customFood.calories}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
