export type DifficultyLevel = 'no-cook' | 'easy' | 'medium' | 'hard';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DietType = 'veg' | 'non-veg' | 'egg';

export interface IndianPortion {
  unit: string;
  amount: number;
  gramsEquivalent: number;
}

export interface Meal {
  id: string;
  name: string;
  nameHindi?: string;
  type: MealType;
  diet: DietType;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  costPerServing: number; // in INR
  difficulty: DifficultyLevel;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  portions: IndianPortion[];
  ingredients: string[];
  badges: string[];
  image?: string;
  description: string;
}

export const meals: Meal[] = [
  // BREAKFAST OPTIONS
  {
    id: 'poha-1',
    name: 'Vegetable Poha',
    nameHindi: 'सब्जी पोहा',
    type: 'breakfast',
    diet: 'veg',
    calories: 280,
    protein: 6,
    carbs: 52,
    fat: 6,
    fiber: 3,
    costPerServing: 25,
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 10,
    portions: [
      { unit: 'katori', amount: 1.5, gramsEquivalent: 200 }
    ],
    ingredients: ['Poha', 'Onion', 'Potato', 'Peanuts', 'Curry leaves', 'Turmeric'],
    badges: ['10-min', 'Budget-friendly'],
    description: 'Light and fluffy flattened rice with vegetables and peanuts'
  },
  {
    id: 'upma-1',
    name: 'Rava Upma',
    nameHindi: 'रवा उपमा',
    type: 'breakfast',
    diet: 'veg',
    calories: 310,
    protein: 8,
    carbs: 48,
    fat: 10,
    fiber: 4,
    costPerServing: 20,
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 12,
    portions: [
      { unit: 'katori', amount: 1.5, gramsEquivalent: 180 }
    ],
    ingredients: ['Semolina', 'Onion', 'Green chili', 'Mustard seeds', 'Curry leaves'],
    badges: ['Hostel-friendly', 'Budget-friendly'],
    description: 'Savory semolina porridge with vegetables and spices'
  },
  {
    id: 'idli-1',
    name: 'Idli Sambar',
    nameHindi: 'इडली सांभर',
    type: 'breakfast',
    diet: 'veg',
    calories: 250,
    protein: 9,
    carbs: 45,
    fat: 3,
    fiber: 5,
    costPerServing: 30,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 20,
    portions: [
      { unit: 'idli', amount: 3, gramsEquivalent: 150 },
      { unit: 'katori sambar', amount: 1, gramsEquivalent: 100 }
    ],
    ingredients: ['Rice', 'Urad dal', 'Mixed vegetables', 'Sambar powder'],
    badges: ['Protein-rich', 'Low-fat'],
    description: 'Steamed rice cakes served with lentil vegetable stew'
  },
  {
    id: 'paratha-1',
    name: 'Aloo Paratha',
    nameHindi: 'आलू पराठा',
    type: 'breakfast',
    diet: 'veg',
    calories: 350,
    protein: 8,
    carbs: 52,
    fat: 14,
    fiber: 4,
    costPerServing: 35,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 15,
    portions: [
      { unit: 'paratha', amount: 2, gramsEquivalent: 180 },
      { unit: 'tbsp curd', amount: 2, gramsEquivalent: 60 }
    ],
    ingredients: ['Wheat flour', 'Potato', 'Onion', 'Green chili', 'Coriander', 'Ghee'],
    badges: ['Filling', 'Traditional'],
    description: 'Stuffed potato flatbread with curd'
  },
  {
    id: 'oats-1',
    name: 'Masala Oats',
    nameHindi: 'मसाला ओट्स',
    type: 'breakfast',
    diet: 'veg',
    calories: 220,
    protein: 8,
    carbs: 38,
    fat: 5,
    fiber: 6,
    costPerServing: 25,
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 8,
    portions: [
      { unit: 'bowl', amount: 1, gramsEquivalent: 200 }
    ],
    ingredients: ['Oats', 'Mixed vegetables', 'Tomato', 'Onion', 'Spices'],
    badges: ['10-min', 'High-fiber', 'Hostel-friendly'],
    description: 'Indian style savory oatmeal with vegetables'
  },
  {
    id: 'egg-bhurji-1',
    name: 'Egg Bhurji with Toast',
    nameHindi: 'अंडा भुर्जी',
    type: 'breakfast',
    diet: 'egg',
    calories: 380,
    protein: 18,
    carbs: 32,
    fat: 20,
    fiber: 2,
    costPerServing: 40,
    difficulty: 'easy',
    prepTime: 5,
    cookTime: 10,
    portions: [
      { unit: 'egg', amount: 2, gramsEquivalent: 120 },
      { unit: 'bread slice', amount: 2, gramsEquivalent: 60 }
    ],
    ingredients: ['Eggs', 'Onion', 'Tomato', 'Green chili', 'Bread'],
    badges: ['10-min', 'High-protein'],
    description: 'Spiced scrambled eggs with toast'
  },
  {
    id: 'smoothie-1',
    name: 'Banana Peanut Smoothie',
    nameHindi: 'केला मूंगफली स्मूदी',
    type: 'breakfast',
    diet: 'veg',
    calories: 320,
    protein: 12,
    carbs: 42,
    fat: 14,
    fiber: 4,
    costPerServing: 35,
    difficulty: 'no-cook',
    prepTime: 5,
    cookTime: 0,
    portions: [
      { unit: 'glass', amount: 1, gramsEquivalent: 300 }
    ],
    ingredients: ['Banana', 'Peanut butter', 'Milk', 'Honey', 'Oats'],
    badges: ['No-cook', 'Quick', 'High-protein'],
    description: 'Creamy protein-rich smoothie for busy mornings'
  },
  {
    id: 'dosa-1',
    name: 'Masala Dosa',
    nameHindi: 'मसाला डोसा',
    type: 'breakfast',
    diet: 'veg',
    calories: 340,
    protein: 8,
    carbs: 55,
    fat: 10,
    fiber: 4,
    costPerServing: 40,
    difficulty: 'medium',
    prepTime: 10,
    cookTime: 15,
    portions: [
      { unit: 'dosa', amount: 1, gramsEquivalent: 150 },
      { unit: 'katori chutney', amount: 0.5, gramsEquivalent: 50 }
    ],
    ingredients: ['Rice', 'Urad dal', 'Potato', 'Onion', 'Coconut chutney'],
    badges: ['Traditional', 'South Indian'],
    description: 'Crispy rice crepe with spiced potato filling'
  },

  // LUNCH OPTIONS
  {
    id: 'dal-rice-1',
    name: 'Dal Chawal',
    nameHindi: 'दाल चावल',
    type: 'lunch',
    diet: 'veg',
    calories: 420,
    protein: 14,
    carbs: 72,
    fat: 8,
    fiber: 8,
    costPerServing: 35,
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 25,
    portions: [
      { unit: 'katori dal', amount: 1, gramsEquivalent: 150 },
      { unit: 'katori rice', amount: 1.5, gramsEquivalent: 200 }
    ],
    ingredients: ['Toor dal', 'Rice', 'Tomato', 'Onion', 'Ghee', 'Cumin'],
    badges: ['Protein-rich', 'Comfort food'],
    description: 'Classic lentil curry with steamed rice'
  },
  {
    id: 'rajma-1',
    name: 'Rajma Chawal',
    nameHindi: 'राजमा चावल',
    type: 'lunch',
    diet: 'veg',
    calories: 480,
    protein: 16,
    carbs: 78,
    fat: 10,
    fiber: 12,
    costPerServing: 45,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 40,
    portions: [
      { unit: 'katori rajma', amount: 1, gramsEquivalent: 180 },
      { unit: 'katori rice', amount: 1.5, gramsEquivalent: 200 }
    ],
    ingredients: ['Kidney beans', 'Rice', 'Tomato', 'Onion', 'Ginger', 'Spices'],
    badges: ['High-protein', 'High-fiber', 'Punjabi'],
    description: 'Spiced kidney bean curry with rice'
  },
  {
    id: 'chole-1',
    name: 'Chole Bhature',
    nameHindi: 'छोले भटूरे',
    type: 'lunch',
    diet: 'veg',
    calories: 580,
    protein: 15,
    carbs: 75,
    fat: 24,
    fiber: 10,
    costPerServing: 50,
    difficulty: 'hard',
    prepTime: 30,
    cookTime: 45,
    portions: [
      { unit: 'katori chole', amount: 1, gramsEquivalent: 180 },
      { unit: 'bhatura', amount: 2, gramsEquivalent: 120 }
    ],
    ingredients: ['Chickpeas', 'Flour', 'Onion', 'Tomato', 'Chole masala'],
    badges: ['Indulgent', 'Weekend special'],
    description: 'Spiced chickpea curry with fried bread'
  },
  {
    id: 'roti-sabzi-1',
    name: 'Roti with Mixed Vegetables',
    nameHindi: 'रोटी सब्जी',
    type: 'lunch',
    diet: 'veg',
    calories: 380,
    protein: 10,
    carbs: 58,
    fat: 12,
    fiber: 8,
    costPerServing: 40,
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 20,
    portions: [
      { unit: 'chapati', amount: 3, gramsEquivalent: 120 },
      { unit: 'katori sabzi', amount: 1, gramsEquivalent: 150 }
    ],
    ingredients: ['Wheat flour', 'Mixed vegetables', 'Onion', 'Tomato', 'Spices'],
    badges: ['Balanced', 'Everyday meal'],
    description: 'Whole wheat flatbread with mixed vegetable curry'
  },
  {
    id: 'biryani-veg-1',
    name: 'Vegetable Biryani',
    nameHindi: 'वेज बिरयानी',
    type: 'lunch',
    diet: 'veg',
    calories: 450,
    protein: 10,
    carbs: 68,
    fat: 15,
    fiber: 5,
    costPerServing: 55,
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 35,
    portions: [
      { unit: 'plate', amount: 1, gramsEquivalent: 280 },
      { unit: 'katori raita', amount: 0.5, gramsEquivalent: 60 }
    ],
    ingredients: ['Basmati rice', 'Mixed vegetables', 'Biryani masala', 'Saffron', 'Ghee'],
    badges: ['Aromatic', 'Festive'],
    description: 'Fragrant layered rice with vegetables and spices'
  },
  {
    id: 'chicken-curry-1',
    name: 'Chicken Curry with Rice',
    nameHindi: 'चिकन करी चावल',
    type: 'lunch',
    diet: 'non-veg',
    calories: 520,
    protein: 32,
    carbs: 55,
    fat: 18,
    fiber: 3,
    costPerServing: 85,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 35,
    portions: [
      { unit: 'katori curry', amount: 1, gramsEquivalent: 180 },
      { unit: 'katori rice', amount: 1.5, gramsEquivalent: 200 }
    ],
    ingredients: ['Chicken', 'Rice', 'Onion', 'Tomato', 'Ginger-garlic', 'Spices'],
    badges: ['High-protein', 'Non-veg favorite'],
    description: 'Classic Indian chicken curry with steamed rice'
  },
  {
    id: 'egg-curry-1',
    name: 'Egg Curry with Roti',
    nameHindi: 'अंडा करी रोटी',
    type: 'lunch',
    diet: 'egg',
    calories: 440,
    protein: 20,
    carbs: 45,
    fat: 20,
    fiber: 5,
    costPerServing: 50,
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 20,
    portions: [
      { unit: 'egg', amount: 2, gramsEquivalent: 120 },
      { unit: 'chapati', amount: 2, gramsEquivalent: 80 }
    ],
    ingredients: ['Eggs', 'Onion', 'Tomato', 'Wheat flour', 'Spices'],
    badges: ['High-protein', 'Budget-friendly'],
    description: 'Boiled eggs in spicy onion-tomato gravy'
  },
  {
    id: 'khichdi-1',
    name: 'Dal Khichdi',
    nameHindi: 'दाल खिचड़ी',
    type: 'lunch',
    diet: 'veg',
    calories: 350,
    protein: 12,
    carbs: 60,
    fat: 6,
    fiber: 6,
    costPerServing: 25,
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 20,
    portions: [
      { unit: 'katori', amount: 2, gramsEquivalent: 280 }
    ],
    ingredients: ['Rice', 'Moong dal', 'Ghee', 'Cumin', 'Vegetables'],
    badges: ['Comfort food', 'Easy digest', 'Hostel-friendly'],
    description: 'One-pot rice and lentil comfort meal'
  },

  // DINNER OPTIONS
  {
    id: 'palak-paneer-1',
    name: 'Palak Paneer with Roti',
    nameHindi: 'पालक पनीर रोटी',
    type: 'dinner',
    diet: 'veg',
    calories: 420,
    protein: 18,
    carbs: 42,
    fat: 20,
    fiber: 6,
    costPerServing: 65,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 25,
    portions: [
      { unit: 'katori palak paneer', amount: 1, gramsEquivalent: 180 },
      { unit: 'chapati', amount: 2, gramsEquivalent: 80 }
    ],
    ingredients: ['Spinach', 'Paneer', 'Onion', 'Tomato', 'Cream', 'Wheat flour'],
    badges: ['Iron-rich', 'High-protein'],
    description: 'Creamy spinach curry with cottage cheese'
  },
  {
    id: 'dal-tadka-1',
    name: 'Dal Tadka with Jeera Rice',
    nameHindi: 'दाल तड़का जीरा राइस',
    type: 'dinner',
    diet: 'veg',
    calories: 400,
    protein: 14,
    carbs: 65,
    fat: 10,
    fiber: 8,
    costPerServing: 40,
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 25,
    portions: [
      { unit: 'katori dal', amount: 1, gramsEquivalent: 150 },
      { unit: 'katori rice', amount: 1, gramsEquivalent: 180 }
    ],
    ingredients: ['Yellow dal', 'Rice', 'Ghee', 'Cumin', 'Garlic', 'Red chili'],
    badges: ['Protein-rich', 'Everyday meal'],
    description: 'Tempered lentils with cumin-flavored rice'
  },
  {
    id: 'paneer-tikka-1',
    name: 'Paneer Tikka Wrap',
    nameHindi: 'पनीर टिक्का रैप',
    type: 'dinner',
    diet: 'veg',
    calories: 380,
    protein: 16,
    carbs: 38,
    fat: 18,
    fiber: 4,
    costPerServing: 60,
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 15,
    portions: [
      { unit: 'wrap', amount: 1, gramsEquivalent: 200 }
    ],
    ingredients: ['Paneer', 'Bell peppers', 'Onion', 'Roti', 'Yogurt', 'Spices'],
    badges: ['High-protein', 'Quick dinner'],
    description: 'Grilled paneer and veggies in a soft wrap'
  },
  {
    id: 'fish-curry-1',
    name: 'Fish Curry with Rice',
    nameHindi: 'मछली करी चावल',
    type: 'dinner',
    diet: 'non-veg',
    calories: 450,
    protein: 28,
    carbs: 52,
    fat: 14,
    fiber: 3,
    costPerServing: 95,
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 25,
    portions: [
      { unit: 'piece fish', amount: 2, gramsEquivalent: 150 },
      { unit: 'katori rice', amount: 1, gramsEquivalent: 180 }
    ],
    ingredients: ['Fish', 'Rice', 'Coconut milk', 'Onion', 'Tomato', 'Spices'],
    badges: ['Omega-3 rich', 'Coastal'],
    description: 'Bengali style fish curry with steamed rice'
  },
  {
    id: 'veggie-soup-1',
    name: 'Vegetable Soup with Bread',
    nameHindi: 'सब्जी सूप ब्रेड',
    type: 'dinner',
    diet: 'veg',
    calories: 220,
    protein: 6,
    carbs: 35,
    fat: 6,
    fiber: 5,
    costPerServing: 30,
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 20,
    portions: [
      { unit: 'bowl', amount: 1, gramsEquivalent: 250 },
      { unit: 'bread slice', amount: 2, gramsEquivalent: 60 }
    ],
    ingredients: ['Mixed vegetables', 'Vegetable stock', 'Bread', 'Herbs'],
    badges: ['Light dinner', 'Low-calorie'],
    description: 'Light and nourishing vegetable soup'
  },
  {
    id: 'moong-dal-chilla-1',
    name: 'Moong Dal Chilla',
    nameHindi: 'मूंग दाल चीला',
    type: 'dinner',
    diet: 'veg',
    calories: 280,
    protein: 14,
    carbs: 35,
    fat: 10,
    fiber: 6,
    costPerServing: 30,
    difficulty: 'easy',
    prepTime: 15,
    cookTime: 15,
    portions: [
      { unit: 'chilla', amount: 2, gramsEquivalent: 180 }
    ],
    ingredients: ['Moong dal', 'Onion', 'Tomato', 'Green chili', 'Coriander'],
    badges: ['High-protein', 'Light', 'Hostel-friendly'],
    description: 'Savory lentil pancakes with vegetables'
  },
  {
    id: 'butter-chicken-1',
    name: 'Butter Chicken with Naan',
    nameHindi: 'बटर चिकन नान',
    type: 'dinner',
    diet: 'non-veg',
    calories: 620,
    protein: 35,
    carbs: 48,
    fat: 32,
    fiber: 3,
    costPerServing: 120,
    difficulty: 'hard',
    prepTime: 30,
    cookTime: 40,
    portions: [
      { unit: 'katori curry', amount: 1, gramsEquivalent: 200 },
      { unit: 'naan', amount: 2, gramsEquivalent: 120 }
    ],
    ingredients: ['Chicken', 'Butter', 'Cream', 'Tomato', 'Cashews', 'Naan'],
    badges: ['Indulgent', 'Restaurant style'],
    description: 'Creamy tomato-based chicken curry with naan'
  },

  // SNACK OPTIONS
  {
    id: 'fruit-chaat-1',
    name: 'Fruit Chaat',
    nameHindi: 'फ्रूट चाट',
    type: 'snack',
    diet: 'veg',
    calories: 150,
    protein: 2,
    carbs: 35,
    fat: 1,
    fiber: 4,
    costPerServing: 40,
    difficulty: 'no-cook',
    prepTime: 10,
    cookTime: 0,
    portions: [
      { unit: 'bowl', amount: 1, gramsEquivalent: 200 }
    ],
    ingredients: ['Apple', 'Banana', 'Pomegranate', 'Chaat masala', 'Lemon'],
    badges: ['No-cook', 'Healthy', 'Refreshing'],
    description: 'Mixed fruits with tangy chaat masala'
  },
  {
    id: 'sprouts-1',
    name: 'Sprouts Chaat',
    nameHindi: 'अंकुरित चाट',
    type: 'snack',
    diet: 'veg',
    calories: 180,
    protein: 10,
    carbs: 28,
    fat: 3,
    fiber: 8,
    costPerServing: 25,
    difficulty: 'no-cook',
    prepTime: 10,
    cookTime: 0,
    portions: [
      { unit: 'katori', amount: 1, gramsEquivalent: 150 }
    ],
    ingredients: ['Mixed sprouts', 'Onion', 'Tomato', 'Lemon', 'Chaat masala'],
    badges: ['No-cook', 'High-protein', 'High-fiber'],
    description: 'Protein-packed sprouted legumes salad'
  },
  {
    id: 'roasted-chana-1',
    name: 'Roasted Chana Mix',
    nameHindi: 'भुना चना मिक्स',
    type: 'snack',
    diet: 'veg',
    calories: 160,
    protein: 8,
    carbs: 25,
    fat: 4,
    fiber: 6,
    costPerServing: 15,
    difficulty: 'no-cook',
    prepTime: 2,
    cookTime: 0,
    portions: [
      { unit: 'handful', amount: 1, gramsEquivalent: 40 }
    ],
    ingredients: ['Roasted chickpeas', 'Peanuts', 'Salt', 'Spices'],
    badges: ['No-cook', 'Portable', 'Budget-friendly'],
    description: 'Crunchy protein snack mix'
  },
  {
    id: 'lassi-1',
    name: 'Sweet Lassi',
    nameHindi: 'मीठी लस्सी',
    type: 'snack',
    diet: 'veg',
    calories: 180,
    protein: 6,
    carbs: 28,
    fat: 5,
    fiber: 0,
    costPerServing: 25,
    difficulty: 'no-cook',
    prepTime: 5,
    cookTime: 0,
    portions: [
      { unit: 'glass', amount: 1, gramsEquivalent: 250 }
    ],
    ingredients: ['Yogurt', 'Sugar', 'Cardamom', 'Rose water'],
    badges: ['No-cook', 'Refreshing', 'Probiotic'],
    description: 'Traditional sweetened yogurt drink'
  },
  {
    id: 'samosa-1',
    name: 'Baked Samosa',
    nameHindi: 'बेक्ड समोसा',
    type: 'snack',
    diet: 'veg',
    calories: 220,
    protein: 5,
    carbs: 30,
    fat: 10,
    fiber: 3,
    costPerServing: 20,
    difficulty: 'medium',
    prepTime: 20,
    cookTime: 25,
    portions: [
      { unit: 'piece', amount: 2, gramsEquivalent: 100 }
    ],
    ingredients: ['Wheat flour', 'Potato', 'Peas', 'Spices'],
    badges: ['Baked not fried', 'Traditional'],
    description: 'Healthier baked version of the classic snack'
  },
  {
    id: 'makhana-1',
    name: 'Roasted Makhana',
    nameHindi: 'भुना मखाना',
    type: 'snack',
    diet: 'veg',
    calories: 120,
    protein: 4,
    carbs: 20,
    fat: 3,
    fiber: 2,
    costPerServing: 30,
    difficulty: 'easy',
    prepTime: 2,
    cookTime: 8,
    portions: [
      { unit: 'bowl', amount: 1, gramsEquivalent: 40 }
    ],
    ingredients: ['Fox nuts', 'Ghee', 'Salt', 'Pepper'],
    badges: ['10-min', 'Low-calorie', 'Superfood'],
    description: 'Light and crunchy roasted lotus seeds'
  }
];

// Popular outside foods for quick logging
export const outsideFoods = [
  { id: 'of-1', name: 'Samosa (2 pcs)', calories: 300, protein: 6, carbs: 35, fat: 16 },
  { id: 'of-2', name: 'Vada Pav', calories: 350, protein: 8, carbs: 45, fat: 16 },
  { id: 'of-3', name: 'Pizza Slice', calories: 280, protein: 12, carbs: 35, fat: 12 },
  { id: 'of-4', name: 'Burger', calories: 450, protein: 18, carbs: 40, fat: 24 },
  { id: 'of-5', name: 'Pav Bhaji', calories: 400, protein: 10, carbs: 55, fat: 16 },
  { id: 'of-6', name: 'Dosa (Restaurant)', calories: 380, protein: 9, carbs: 60, fat: 12 },
  { id: 'of-7', name: 'Thali (Full)', calories: 800, protein: 22, carbs: 120, fat: 28 },
  { id: 'of-8', name: 'Biryani (Restaurant)', calories: 650, protein: 20, carbs: 85, fat: 25 },
  { id: 'of-9', name: 'Momos (6 pcs)', calories: 350, protein: 12, carbs: 45, fat: 14 },
  { id: 'of-10', name: 'Frankie Roll', calories: 320, protein: 10, carbs: 40, fat: 14 },
  { id: 'of-11', name: 'Cold Coffee', calories: 200, protein: 4, carbs: 32, fat: 6 },
  { id: 'of-12', name: 'Chai + Biscuits', calories: 150, protein: 3, carbs: 25, fat: 5 },
];

export const getMealsByType = (type: MealType, diet: DietType): Meal[] => {
  return meals.filter(m => 
    m.type === type && 
    (diet === 'non-veg' || m.diet === 'veg' || (diet === 'egg' && m.diet !== 'non-veg'))
  );
};

export const getMealById = (id: string): Meal | undefined => {
  return meals.find(m => m.id === id);
};

export const getAlternativeMeals = (meal: Meal, diet: DietType, count: number = 3): Meal[] => {
  const sametype = getMealsByType(meal.type, diet).filter(m => m.id !== meal.id);
  
  // Sort by calorie similarity
  const sorted = sametype.sort((a, b) => {
    const diffA = Math.abs(a.calories - meal.calories) + Math.abs(a.protein - meal.protein) * 5;
    const diffB = Math.abs(b.calories - meal.calories) + Math.abs(b.protein - meal.protein) * 5;
    return diffA - diffB;
  });
  
  return sorted.slice(0, count);
};
