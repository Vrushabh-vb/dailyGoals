import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils, Calendar, TrendingUp, ChefHat, ArrowRight, CheckCircle2 } from 'lucide-react';
import CookingAssistant from '@/components/CookingAssistant';

const features = [
  {
    icon: Utensils,
    title: 'Personalized Plans',
    description: 'AI-crafted meal plans tailored to your unique goals and preferences',
  },
  {
    icon: Calendar,
    title: 'Weekly Planning',
    description: 'Effortlessly plan your entire week with balanced, nutritious meals',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your nutrition and stay aligned with your health objectives',
  },
  {
    icon: ChefHat,
    title: 'Simple Recipes',
    description: 'Step-by-step guidance for every meal, making cooking effortless',
  },
];

const benefits = [
  'Personalized to your dietary preferences',
  'Budget-friendly meal suggestions',
  'Save time with weekly planning',
  'Reduce food waste effectively',
];

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white">
      {/* Apple-style Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">DailyGoals</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </button>
              <Button
                className="bg-black hover:bg-gray-800 text-white rounded-full px-5 h-9 text-sm font-medium"
                onClick={() => navigate('/onboarding')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Apple Style */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none mb-6"
          >
            Smart meal planning.
            <br />
            <span className="text-gray-400">Made simple.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-normal"
          >
            AI-powered nutrition planning designed for Indian cuisine. Achieve your health goals effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white rounded-full px-8 h-14 text-base font-medium group"
              onClick={() => navigate('/onboarding')}
            >
              Start Planning
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-base font-medium border-2 border-black/10 hover:border-black/20"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 text-sm text-gray-500"
          >
            Join 10,000+ users eating healthier
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Apple Grid Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
              Everything you need.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make healthy eating effortless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-10 hover:shadow-xl transition-shadow duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Apple Two Column */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
                Made for Indian kitchens.
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                From poha to paneer, dal to dosa. We understand Indian cuisine and create meal plans that fit your taste, budget, and lifestyle.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { name: 'Vegetarian', img: '/veg.png' },
                { name: 'Non-Veg', img: '/non-veg.png' },
                { name: 'Vegan', img: '/vegan.png' },
                { name: 'Quick Meals', img: '/quick.png' },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative overflow-hidden rounded-3xl aspect-square cursor-pointer"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="font-semibold text-white text-lg">{item.name}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Apple Style */}
      <section className="py-20 bg-black text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Start your journey today.
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of Indians eating healthier with DailyGoals. Your personalized meal plan is one click away.
          </p>
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 text-black rounded-full px-8 h-14 text-base font-medium"
            onClick={() => navigate('/onboarding')}
          >
            Create Your Meal Plan
          </Button>
        </motion.div>
      </section>

      {/* Footer - Apple Minimal */}
      <footer className="py-12 bg-gray-50 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <div className="text-sm font-semibold mb-2">DailyGoals</div>
          <p className="text-sm text-gray-500">Eat Smart. Live Healthy.</p>
          <p className="text-xs text-gray-400 mt-4">© 2026 DailyGoals. All rights reserved.</p>
        </div>
      </footer>

      <CookingAssistant />
    </div>
  );
}