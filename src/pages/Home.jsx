/*
|--------------------------------------------------------------------------
| HOME – DARK INDUSTRIAL FITNESS UI
|--------------------------------------------------------------------------
| Inspired by cult.fit, Nike Training Club
*/

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, Flame, LineChart } from "lucide-react";
import Loader from "../components/common/Loader";

const Home = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }

    if (user?.user?.role === "user") {
      navigate("/user/dashboard", { replace: true });
    }

    if (user?.user?.role === "trainer") {
      if (auth.user.status === "pending") {
        navigate("/trainer/pending", { replace: true });
      } else {
        navigate("/trainer/profile", { replace: true });
      }
      return;
    }
    setCheckingAuth(false);
  }, []);
  // 🔴 IMPORTANT: show loader while checking
  if (checkingAuth) {
    return <Loader />;
  }

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Train Smarter. <br />
              <span className="text-emerald-400">Live Stronger.</span>
            </h1>

            <p className="text-neutral-300 text-lg mb-10 max-w-xl">
              A premium fitness management platform to track workouts, connect
              with trainers, and build lifelong fitness habits.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Member */}
              <Link
                to="/register"
                className="bg-emerald-500 text-black px-8 py-4 rounded-md font-semibold hover:bg-emerald-400 transition"
              >
                Get Started
              </Link>

              {/* Login */}
              <Link
                to="/login"
                className="border border-neutral-600 px-8 py-4 rounded-md font-medium hover:bg-neutral-800 transition"
              >
                Login
              </Link>

              {/* Trainer */}
              <Link
                to="/register?role=trainer"
                className="border border-emerald-500 text-emerald-400 px-8 py-4 rounded-md font-semibold hover:bg-emerald-500 hover:text-black transition"
              >
                Become a Trainer
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex justify-center"
          >
            <img
              src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
              alt="fitness"
              className="w-full max-w-lg h-[480px] object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Stat number="10K+" label="Active Users" />
          <Stat number="500+" label="Certified Trainers" />
          <Stat number="1M+" label="Workouts Tracked" />
          <Stat number="98%" label="User Satisfaction" />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-16 text-center">
          Built for <span className="text-emerald-400">Serious Fitness</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Dumbbell size={30} />}
            title="Smart Workouts"
            desc="Personalized workout plans that adapt to your progress."
          />
          <Feature
            icon={<Flame size={30} />}
            title="Trainer Guidance"
            desc="Work with professional trainers anytime, anywhere."
          />
          <Feature
            icon={<LineChart size={30} />}
            title="Progress Analytics"
            desc="Track performance with clean, visual insights."
          />
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://media.istockphoto.com/id/1141407939/photo/battle-ropes-session-at-the-gym.jpg?s=612x612&w=0&k=20&c=YZObVI5i4D9dtyxg0I_tTWUj4elDwbvVT02lRN0Zy9Y="
            alt="community"
            className="rounded-2xl shadow-xl"
          />

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Train with a <span className="text-emerald-400">Community</span>
            </h2>
            <p className="text-neutral-300 mb-8">
              Stay motivated by joining a community that shares your fitness
              goals and lifestyle.
            </p>

            <Link
              to="/register"
              className="inline-block bg-emerald-500 text-black px-8 py-4 rounded-md font-semibold hover:bg-emerald-400 transition"
            >
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-24">
        <h2 className="text-4xl font-extrabold mb-6">
          Start Your <span className="text-emerald-400">Transformation</span>
        </h2>
        <p className="text-neutral-400 mb-10">
          Build consistency. Track progress. Achieve results.
        </p>

        <Link
          to="/register"
          className="bg-emerald-500 text-black px-10 py-4 rounded-md font-bold hover:bg-emerald-400 transition"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Stat = ({ number, label }) => (
  <div>
    <p className="text-4xl font-bold text-emerald-400 mb-2">{number}</p>
    <p className="text-neutral-400">{label}</p>
  </div>
);

const Feature = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl"
  >
    <div className="w-14 h-14 mb-4 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-lg">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-neutral-400">{desc}</p>
  </motion.div>
);

export default Home;
