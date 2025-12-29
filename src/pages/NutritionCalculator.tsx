import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Plus,
    Search,
    X,
    Scale,
    Loader2,
    Flame,
    Beef,
    Wheat,
    Droplet,
    Download,
    Image,
    Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// USDA FoodData Central API (free, no key needed for basic search)
const USDA_API_KEY = 'DEMO_KEY'; // Free demo key
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

interface FoodItem {
    id: string;
    name: string;
    quantity: number;
    unit: 'g' | 'serving' | 'piece';
    nutrients: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
        sugar: number;
        sodium: number;
        potassium: number;
        vitaminC: number;
        iron: number;
    };
}

interface SearchResult {
    fdcId: number;
    description: string;
    foodCategory?: string;
    servingSize?: number;
    servingSizeUnit?: string;
}

// Common Indian foods with nutrition data per 100g
const COMMON_FOODS: Record<string, FoodItem['nutrients']> = {
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, potassium: 358, vitaminC: 8.7, iron: 0.3 },
    'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, potassium: 126, vitaminC: 0, iron: 1.8 },
    'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, sodium: 1, potassium: 35, vitaminC: 0, iron: 0.2 },
    'roti': { calories: 297, protein: 9.9, carbs: 63, fat: 1.2, fiber: 10.7, sugar: 0.4, sodium: 409, potassium: 186, vitaminC: 0, iron: 3.6 },
    'dal': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 2, sodium: 6, potassium: 369, vitaminC: 1.5, iron: 3.3 },
    'paneer': { calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, fiber: 0, sugar: 0, sodium: 18, potassium: 100, vitaminC: 0, iron: 0.2 },
    'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, potassium: 256, vitaminC: 0, iron: 1 },
    'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5, sodium: 44, potassium: 150, vitaminC: 0, iron: 0 },
    'curd': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 3.2, sodium: 36, potassium: 141, vitaminC: 0.5, iron: 0.1 },
    'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, potassium: 107, vitaminC: 4.6, iron: 0.1 },
    'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, potassium: 421, vitaminC: 20, iron: 0.8 },
    'onion': { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4, potassium: 146, vitaminC: 7.4, iron: 0.2 },
    'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5, potassium: 237, vitaminC: 14, iron: 0.3 },
    'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, potassium: 558, vitaminC: 28, iron: 2.7 },
    'ghee': { calories: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, potassium: 0, vitaminC: 0, iron: 0 },
    'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sugar: 100, sodium: 1, potassium: 2, vitaminC: 0, iron: 0 },
    'oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, potassium: 0, vitaminC: 0, iron: 0 },
    'chapati': { calories: 240, protein: 8, carbs: 50, fat: 1, fiber: 4, sugar: 1, sodium: 300, potassium: 120, vitaminC: 0, iron: 2 },
    'samosa': { calories: 262, protein: 4.7, carbs: 28, fat: 15, fiber: 2, sugar: 2, sodium: 320, potassium: 180, vitaminC: 4, iron: 1.5 },
    'biryani': { calories: 200, protein: 12, carbs: 25, fat: 6, fiber: 1, sugar: 1, sodium: 450, potassium: 200, vitaminC: 2, iron: 1.8 },
};

// Unit conversions (approximate)
const UNIT_TO_GRAMS: Record<string, Record<string, number>> = {
    'banana': { piece: 120, serving: 120 },
    'egg': { piece: 50, serving: 50 },
    'apple': { piece: 180, serving: 180 },
    'roti': { piece: 40, serving: 40 },
    'chapati': { piece: 40, serving: 40 },
    'samosa': { piece: 120, serving: 120 },
    'default': { piece: 100, serving: 100 },
};

export default function NutritionCalculator() {
    const navigate = useNavigate();
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState<'g' | 'serving' | 'piece'>('piece');

    // Search for foods
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const matches = Object.keys(COMMON_FOODS).filter(food =>
            food.includes(query) || query.includes(food)
        );
        setSearchResults(matches.slice(0, 6));
    }, [searchQuery]);

    // Calculate grams from quantity and unit
    const calculateGrams = (foodName: string, qty: number, u: 'g' | 'serving' | 'piece'): number => {
        if (u === 'g') return qty;
        const conversions = UNIT_TO_GRAMS[foodName] || UNIT_TO_GRAMS['default'];
        return qty * (conversions[u] || 100);
    };

    // Add food to list
    const addFood = (foodName: string) => {
        const baseNutrients = COMMON_FOODS[foodName];
        if (!baseNutrients) return;

        const grams = calculateGrams(foodName, quantity, unit);
        const multiplier = grams / 100;

        const scaledNutrients: FoodItem['nutrients'] = {
            calories: Math.round(baseNutrients.calories * multiplier),
            protein: Math.round(baseNutrients.protein * multiplier * 10) / 10,
            carbs: Math.round(baseNutrients.carbs * multiplier * 10) / 10,
            fat: Math.round(baseNutrients.fat * multiplier * 10) / 10,
            fiber: Math.round(baseNutrients.fiber * multiplier * 10) / 10,
            sugar: Math.round(baseNutrients.sugar * multiplier * 10) / 10,
            sodium: Math.round(baseNutrients.sodium * multiplier),
            potassium: Math.round(baseNutrients.potassium * multiplier),
            vitaminC: Math.round(baseNutrients.vitaminC * multiplier * 10) / 10,
            iron: Math.round(baseNutrients.iron * multiplier * 10) / 10,
        };

        const newFood: FoodItem = {
            id: Date.now().toString(),
            name: foodName,
            quantity,
            unit,
            nutrients: scaledNutrients,
        };

        setFoods([...foods, newFood]);
        setSearchQuery('');
        setSelectedFood(null);
        setQuantity(1);
        setUnit('piece');
    };

    // Remove food
    const removeFood = (id: string) => {
        setFoods(foods.filter(f => f.id !== id));
    };

    // Calculate totals
    const totals = foods.reduce(
        (acc, food) => ({
            calories: acc.calories + food.nutrients.calories,
            protein: acc.protein + food.nutrients.protein,
            carbs: acc.carbs + food.nutrients.carbs,
            fat: acc.fat + food.nutrients.fat,
            fiber: acc.fiber + food.nutrients.fiber,
            sugar: acc.sugar + food.nutrients.sugar,
            sodium: acc.sodium + food.nutrients.sodium,
            potassium: acc.potassium + food.nutrients.potassium,
            vitaminC: acc.vitaminC + food.nutrients.vitaminC,
            iron: acc.iron + food.nutrients.iron,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, potassium: 0, vitaminC: 0, iron: 0 }
    );

    // Export as PDF
    const exportPDF = async () => {
        const element = document.getElementById('nutrition-summary');
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('nutrition-summary.pdf');
    };

    // Export as Image
    const exportImage = async () => {
        const element = document.getElementById('nutrition-summary');
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const link = document.createElement('a');
        link.download = 'nutrition-summary.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/5">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Nutrition Calculator</h1>
                        <p className="text-sm text-gray-500">Track your daily intake</p>
                    </div>
                    {foods.length > 0 && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exportImage}
                                className="rounded-full"
                            >
                                <Image className="w-4 h-4 mr-1" />
                                Image
                            </Button>
                            <Button
                                size="sm"
                                onClick={exportPDF}
                                className="rounded-full bg-black text-white"
                            >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-6 space-y-6">
                {/* Search & Add */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h2 className="font-semibold text-lg mb-4">Add Food Item</h2>

                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search food (e.g., banana, egg, rice)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-black"
                        />
                    </div>

                    {/* Search Results */}
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 bg-gray-50 rounded-xl overflow-hidden"
                            >
                                {searchResults.map((food) => (
                                    <button
                                        key={food}
                                        onClick={() => {
                                            setSelectedFood(food);
                                            setSearchQuery(food);
                                            setSearchResults([]);
                                        }}
                                        className="w-full p-3 flex items-center justify-between hover:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0"
                                    >
                                        <span className="font-medium capitalize">{food}</span>
                                        <span className="text-sm text-gray-500">{COMMON_FOODS[food]?.calories} cal/100g</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quantity Selector */}
                    {selectedFood && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="flex-1">
                                <label className="text-sm text-gray-500 mb-1 block">Quantity</label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min={1}
                                    className="h-12 rounded-xl"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-gray-500 mb-1 block">Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value as 'g' | 'serving' | 'piece')}
                                    className="w-full h-12 rounded-xl border-2 border-gray-200 px-3"
                                >
                                    <option value="piece">Piece</option>
                                    <option value="serving">Serving</option>
                                    <option value="g">Grams</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={() => addFood(selectedFood)}
                                    className="h-12 px-6 bg-black hover:bg-gray-800 rounded-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Added Foods */}
                {foods.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="font-semibold text-lg">Your Foods</h2>
                        {foods.map((food) => (
                            <motion.div
                                key={food.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                            >
                                <div className="flex-1">
                                    <div className="font-medium capitalize">{food.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {food.quantity} {food.unit} • {food.nutrients.calories} cal
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>P: {food.nutrients.protein}g</span>
                                    <span>C: {food.nutrients.carbs}g</span>
                                    <span>F: {food.nutrients.fat}g</span>
                                </div>
                                <button
                                    onClick={() => removeFood(food.id)}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Nutrition Summary */}
                {foods.length > 0 && (
                    <div id="nutrition-summary" className="bg-white rounded-3xl p-6 shadow-sm">
                        <h2 className="font-semibold text-lg mb-4">Nutrition Summary</h2>

                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-orange-50 rounded-2xl">
                                <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                                <div className="text-2xl font-bold">{totals.calories}</div>
                                <div className="text-xs text-gray-500">Calories</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-2xl">
                                <Beef className="w-6 h-6 mx-auto mb-2 text-red-500" />
                                <div className="text-2xl font-bold">{Math.round(totals.protein)}g</div>
                                <div className="text-xs text-gray-500">Protein</div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 rounded-2xl">
                                <Wheat className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                                <div className="text-2xl font-bold">{Math.round(totals.carbs)}g</div>
                                <div className="text-xs text-gray-500">Carbs</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-2xl">
                                <Droplet className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                <div className="text-2xl font-bold">{Math.round(totals.fat)}g</div>
                                <div className="text-xs text-gray-500">Fat</div>
                            </div>
                        </div>

                        {/* Micronutrients */}
                        <h3 className="font-medium mb-3">Micronutrients</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Fiber', value: `${Math.round(totals.fiber)}g`, color: 'bg-green-100' },
                                { label: 'Sugar', value: `${Math.round(totals.sugar)}g`, color: 'bg-pink-100' },
                                { label: 'Sodium', value: `${totals.sodium}mg`, color: 'bg-purple-100' },
                                { label: 'Potassium', value: `${totals.potassium}mg`, color: 'bg-yellow-100' },
                                { label: 'Vitamin C', value: `${Math.round(totals.vitaminC)}mg`, color: 'bg-orange-100' },
                                { label: 'Iron', value: `${Math.round(totals.iron * 10) / 10}mg`, color: 'bg-red-100' },
                            ].map((item) => (
                                <div key={item.label} className={`p-3 rounded-xl ${item.color}`}>
                                    <div className="text-sm text-gray-600">{item.label}</div>
                                    <div className="font-semibold">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Macro Ratio */}
                        <div className="mt-6">
                            <h3 className="font-medium mb-3">Macro Ratio</h3>
                            <div className="h-4 rounded-full overflow-hidden flex bg-gray-200">
                                {totals.calories > 0 && (
                                    <>
                                        <div
                                            className="bg-red-400 h-full"
                                            style={{ width: `${(totals.protein * 4 / totals.calories) * 100}%` }}
                                        />
                                        <div
                                            className="bg-amber-400 h-full"
                                            style={{ width: `${(totals.carbs * 4 / totals.calories) * 100}%` }}
                                        />
                                        <div
                                            className="bg-blue-400 h-full"
                                            style={{ width: `${(totals.fat * 9 / totals.calories) * 100}%` }}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400" /> Protein
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-amber-400" /> Carbs
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" /> Fat
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {foods.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Scale className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Track Your Nutrition</h3>
                        <p className="text-gray-500">Add foods to see their nutritional breakdown</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
