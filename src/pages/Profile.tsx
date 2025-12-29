import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Flame,
  Dumbbell,
  Calendar,
  Target,
  Award,
  LogOut,
  User as UserIcon,
  TrendingUp
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface UserStats {
  totalDays: number;
  avgCalories: number;
  avgProtein: number;
  totalMeals: number;
  streakDays: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalDays: 0,
    avgCalories: 0,
    avgProtein: 0,
    totalMeals: 0,
    streakDays: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchStats(session.user.id);
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchStats = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalCalories = data.reduce((sum, d) => sum + (d.total_calories || 0), 0);
        const totalProtein = data.reduce((sum, d) => sum + (d.total_protein || 0), 0);
        const totalMeals = data.reduce((sum, d) => sum + (d.meals_logged || 0), 0);

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < data.length; i++) {
          const statDate = new Date(data[i].date);
          const diffDays = Math.floor((today.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === streak) {
            streak++;
          } else {
            break;
          }
        }

        setStats({
          totalDays: data.length,
          avgCalories: data.length > 0 ? Math.round(totalCalories / data.length) : 0,
          avgProtein: data.length > 0 ? Math.round(totalProtein / data.length) : 0,
          totalMeals,
          streakDays: streak,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Apple-style Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm text-center"
        >
          <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {user?.user_metadata?.full_name || 'DailyGoals User'}
          </h2>
          <p className="text-gray-500">{user?.email}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            value={stats.avgCalories}
            unit="cal"
            label="Avg Daily Calories"
          />
          <StatCard
            icon={<Dumbbell className="w-6 h-6" />}
            value={stats.avgProtein}
            unit="g"
            label="Avg Daily Protein"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            value={stats.totalDays}
            label="Days Tracked"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            value={stats.totalMeals}
            label="Meals Logged"
          />
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Award className="w-8 h-8 text-black" />
            </div>
            <div>
              <div className="text-4xl font-bold">{stats.streakDays} Days</div>
              <div className="text-gray-500">Current Streak 🔥</div>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Your Progress</h3>
          </div>

          {stats.totalDays === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tracking data yet.</p>
              <p className="text-sm mt-1">Start logging your meals to see your progress!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Calorie Goal</span>
                  <span className="font-medium">{Math.min(100, Math.round((stats.avgCalories / 2000) * 100))}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (stats.avgCalories / 2000) * 100)}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Protein Goal</span>
                  <span className="font-medium">{Math.min(100, Math.round((stats.avgProtein / 60) * 100))}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (stats.avgProtein / 60) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  unit,
  label
}: {
  icon: React.ReactNode;
  value: number;
  unit?: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="text-gray-400 mb-3">{icon}</div>
      <div className="text-3xl font-bold">
        {value}{unit && <span className="text-lg text-gray-500">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
