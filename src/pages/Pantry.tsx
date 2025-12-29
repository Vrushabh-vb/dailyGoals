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
    ChefHat,
    Sparkles,
    Check,
    Apple,
    Egg,
    Milk,
    Wheat,
    Flame,
    Droplets,
    Loader2,
    Clock,
    AlertCircle,
    Download,
    Image
} from 'lucide-react';
import {
    generateIndianRecipes,
    type GeneratedRecipe,
    loadAIConfig
} from '@/lib/aiRecipeGenerator';
import { useUserStore } from '@/store/userStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PantryIngredient {
    id: string;
    name: string;
    category: string;
    addedAt: Date;
}

const CATEGORIES = [
    { id: 'vegetable', label: 'Vegetables', icon: Apple, color: 'bg-green-100 text-green-600' },
    { id: 'protein', label: 'Protein', icon: Egg, color: 'bg-orange-100 text-orange-600' },
    { id: 'dairy', label: 'Dairy', icon: Milk, color: 'bg-blue-100 text-blue-600' },
    { id: 'grain', label: 'Grains', icon: Wheat, color: 'bg-amber-100 text-amber-600' },
    { id: 'spice', label: 'Spices', icon: Flame, color: 'bg-red-100 text-red-600' },
    { id: 'oil', label: 'Oils', icon: Droplets, color: 'bg-yellow-100 text-yellow-600' },
];

const INGREDIENT_SUGGESTIONS: Record<string, string[]> = {
    vegetable: ['potato', 'onion', 'tomato', 'cauliflower', 'spinach', 'capsicum', 'peas', 'carrot', 'beans', 'cabbage', 'brinjal', 'okra'],
    protein: ['paneer', 'chicken', 'egg', 'dal', 'chana', 'rajma', 'fish', 'mutton', 'tofu', 'soya chunks'],
    dairy: ['milk', 'curd', 'cream', 'butter', 'ghee', 'cheese', 'khoya'],
    grain: ['rice', 'wheat flour', 'rava', 'poha', 'oats', 'bread', 'besan', 'maida'],
    spice: ['turmeric', 'cumin', 'coriander', 'chili', 'garam masala', 'mustard seeds', 'curry leaves', 'ginger', 'garlic'],
    oil: ['mustard oil', 'ghee', 'coconut oil', 'vegetable oil', 'sesame oil'],
};

export default function Pantry() {
    const navigate = useNavigate();
    const { profile } = useUserStore();
    const [pantry, setPantry] = useState<PantryIngredient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showRecipes, setShowRecipes] = useState(false);
    const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Load pantry
    useEffect(() => {
        const savedPantry = localStorage.getItem('pantry');
        if (savedPantry) {
            setPantry(JSON.parse(savedPantry));
        }
    }, []);

    // Save pantry to localStorage
    useEffect(() => {
        localStorage.setItem('pantry', JSON.stringify(pantry));
    }, [pantry]);

    const getAllSuggestions = () => Object.values(INGREDIENT_SUGGESTIONS).flat();

    const getFilteredSuggestions = () => {
        if (!searchQuery) return [];
        return getAllSuggestions()
            .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(s => !pantry.some(p => p.name.toLowerCase() === s.toLowerCase()))
            .slice(0, 8);
    };

    const addIngredient = (name: string, category: string = 'other') => {
        const exists = pantry.some(p => p.name.toLowerCase() === name.toLowerCase());
        if (exists) return;

        setPantry([...pantry, {
            id: Date.now().toString(),
            name: name.toLowerCase(),
            category,
            addedAt: new Date(),
        }]);
        setSearchQuery('');
    };

    const removeIngredient = (id: string) => {
        setPantry(pantry.filter(p => p.id !== id));
    };

    // Generate recipes using AI
    const generateRecipes = async () => {
        if (pantry.length < 1) return;

        setIsLoading(true);
        setError(null);
        setShowRecipes(true);

        try {
            const ingredientNames = pantry.map(p => p.name);
            const config = loadAIConfig();
            const recipes = await generateIndianRecipes(ingredientNames, config, {
                diet: profile.diet,
            });
            setGeneratedRecipes(recipes);
        } catch (err: any) {
            console.error('Error generating recipes:', err);
            setError(err.message || 'Failed to generate recipes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const categorySuggestions = selectedCategory
        ? INGREDIENT_SUGGESTIONS[selectedCategory] || []
        : [];

    const searchSuggestions = getFilteredSuggestions();

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
                        <h1 className="text-xl font-semibold">My Pantry</h1>
                        <p className="text-sm text-gray-500">{pantry.length} ingredients • AI-Powered 🤖</p>
                    </div>
                    {pantry.length >= 1 && (
                        <Button
                            onClick={generateRecipes}
                            disabled={isLoading}
                            className="bg-black hover:bg-gray-800 text-white rounded-full px-5 h-10 text-sm font-medium"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate Recipes
                        </Button>
                    )}
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-6 space-y-6">

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search ingredients (e.g., paneer, aloo, chicken)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-black text-base"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search Results */}
                <AnimatePresence>
                    {searchSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden divide-y divide-gray-100"
                        >
                            {searchSuggestions.map((ingredient) => (
                                <button
                                    key={ingredient}
                                    onClick={() => addIngredient(ingredient, 'other')}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span className="font-medium capitalize">{ingredient}</span>
                                    <Plus className="w-5 h-5 text-gray-400" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add custom ingredient */}
                {searchQuery && searchSuggestions.length === 0 && !pantry.some(p => p.name === searchQuery.toLowerCase()) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-4"
                    >
                        <button
                            onClick={() => addIngredient(searchQuery, 'other')}
                            className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                            <span className="font-medium">Add "{searchQuery}"</span>
                            <Plus className="w-5 h-5 text-gray-400" />
                        </button>
                    </motion.div>
                )}

                {/* Category Quick Add */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Quick Add by Category</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${selectedCategory === cat.id
                                    ? 'bg-black text-white'
                                    : 'bg-white shadow-sm hover:shadow-md'
                                    }`}
                            >
                                <cat.icon className="w-6 h-6" />
                                <span className="text-sm font-medium">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedCategory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {categorySuggestions.map((ingredient) => {
                                        const isAdded = pantry.some(p => p.name === ingredient);
                                        return (
                                            <button
                                                key={ingredient}
                                                onClick={() => addIngredient(ingredient, selectedCategory)}
                                                disabled={isAdded}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isAdded
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {isAdded && <Check className="w-3 h-3 inline mr-1" />}
                                                {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Current Pantry */}
                {pantry.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg">Your Ingredients</h2>
                        <div className="bg-white rounded-3xl p-4 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                {pantry.map((ingredient) => (
                                    <motion.div
                                        key={ingredient.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition-colors"
                                    >
                                        <span className="text-sm font-medium capitalize">{ingredient.name}</span>
                                        <button
                                            onClick={() => removeIngredient(ingredient.id)}
                                            className="w-5 h-5 rounded-full bg-gray-300 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {pantry.length === 0 && !searchQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <ChefHat className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Add Your Ingredients</h3>
                        <p className="text-gray-500 mb-6">Tell us what's in your kitchen and we'll create<br />personalized Indian recipes for you</p>
                    </motion.div>
                )}
            </main>

            {/* Generated Recipes Modal */}
            <AnimatePresence>
                {showRecipes && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
                        onClick={() => setShowRecipes(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-t-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">🍛 Indian Recipes for You</h2>
                                        <p className="text-gray-500">
                                            {isLoading ? 'AI is cooking up recipes...' : `${generatedRecipes.length} recipes generated`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowRecipes(false)}
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6 space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-16 h-16 mx-auto mb-4"
                                        >
                                            <ChefHat className="w-16 h-16 text-gray-300" />
                                        </motion.div>
                                        <h3 className="text-lg font-medium mb-2">Generating Indian Recipes...</h3>
                                        <p className="text-gray-500">Our AI chef is creating personalized dishes for you</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2 text-red-600">Error</h3>
                                        <p className="text-gray-500 mb-4">{error}</p>
                                        <Button onClick={generateRecipes}>
                                            Try Again
                                        </Button>
                                    </div>
                                ) : generatedRecipes.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No recipes generated</h3>
                                        <p className="text-gray-500">Try adding more ingredients</p>
                                    </div>
                                ) : (
                                    generatedRecipes.map((recipe, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-gray-50 rounded-2xl p-5 cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => setSelectedRecipe(recipe)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{recipe.name}</h3>
                                                    {recipe.nameHindi && (
                                                        <span className="text-sm text-gray-500">{recipe.nameHindi}</span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-green-600">{recipe.calories}</div>
                                                    <div className="text-xs text-gray-500">calories</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                                            <div className="flex gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {recipe.prepTime + recipe.cookTime} min
                                                </span>
                                                <span>•</span>
                                                <span>{recipe.protein}g protein</span>
                                                <span>•</span>
                                                <span className="capitalize">{recipe.difficulty}</span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recipe Detail Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                        onClick={() => setSelectedRecipe(null)}
                    >
                        <motion.div
                            id="recipe-detail"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-white">
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
                                {selectedRecipe.nameHindi && (
                                    <p className="text-white/80">{selectedRecipe.nameHindi}</p>
                                )}
                                <div className="flex gap-4 mt-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{selectedRecipe.calories}</div>
                                        <div className="text-xs text-white/80">calories</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{selectedRecipe.protein}g</div>
                                        <div className="text-xs text-white/80">protein</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{selectedRecipe.prepTime + selectedRecipe.cookTime}</div>
                                        <div className="text-xs text-white/80">minutes</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>

                                {/* Ingredients */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                        {selectedRecipe.ingredients.map((ing, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span>{ing.item} {ing.hindi && <span className="text-gray-400">({ing.hindi})</span>}</span>
                                                <span className="text-gray-500">{ing.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                                    <ol className="space-y-3">
                                        {selectedRecipe.instructions.map((step, i) => (
                                            <li key={i} className="flex gap-3">
                                                <span className="w-6 h-6 rounded-full bg-black text-white text-sm flex items-center justify-center flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <span className="text-gray-600">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Tips */}
                                {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-lg mb-3">💡 Tips</h3>
                                        <ul className="space-y-2">
                                            {selectedRecipe.tips.map((tip, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex gap-2">
                                                    <span>•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Export Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl"
                                        onClick={async () => {
                                            const element = document.getElementById('recipe-detail');
                                            if (!element) return;
                                            const canvas = await html2canvas(element, { scale: 2 });
                                            const link = document.createElement('a');
                                            link.download = `${selectedRecipe.name.replace(/\s+/g, '-')}.png`;
                                            link.href = canvas.toDataURL('image/png');
                                            link.click();
                                        }}
                                    >
                                        <Image className="w-4 h-4 mr-2" />
                                        Save Image
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 bg-black hover:bg-gray-800 rounded-xl"
                                        onClick={async () => {
                                            const element = document.getElementById('recipe-detail');
                                            if (!element) return;
                                            const canvas = await html2canvas(element, { scale: 2 });
                                            const imgData = canvas.toDataURL('image/png');
                                            const pdf = new jsPDF('p', 'mm', 'a4');
                                            const pdfWidth = pdf.internal.pageSize.getWidth();
                                            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                                            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                                            pdf.save(`${selectedRecipe.name.replace(/\s+/g, '-')}.pdf`);
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Save PDF
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
