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
import { useTheme } from "../context/ThemeContext";
import Features from "../components/home/Features";
import Contact from "../components/home/Contact";

const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
    <div className={`
      min-h-screen
      ${isDark 
        ? "bg-neutral-950 text-white" 
        : "bg-gray-50 text-gray-900"
      }
    `}>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className={`
          absolute inset-0 bg-gradient-to-br
          ${isDark 
            ? "from-black via-neutral-900 to-neutral-800" 
            : "from-gray-100 via-gray-50 to-white"
          }
        `} />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className={`
              text-5xl md:text-6xl font-extrabold leading-tight mb-6
              ${isDark ? "text-white" : "text-gray-900"}
            `}>
              Train Smarter. <br />
              <span className="text-emerald-400">Live Stronger.</span>
            </h1>

            <p className={`
              text-lg mb-10 max-w-xl
              ${isDark ? "text-neutral-300" : "text-gray-600"}
            `}>
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
                className={`
                  border px-8 py-4 rounded-md font-medium hover:transition
                  ${isDark 
                    ? "border-neutral-600 text-white hover:bg-neutral-800" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                Login
              </Link>

              {/* Trainer */}
              <Link
                to="/register?role=trainer"
                className={`
                  border px-8 py-4 rounded-md font-semibold transition
                  ${isDark 
                    ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black" 
                    : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                  }
                `}
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
      <section className={`
        border-t
        ${isDark ? "border-neutral-800 bg-neutral-900" : "border-gray-200 bg-gray-50"}
      `}>
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <Stat number="10K+" label="Active Users" isDark={isDark} />
          <Stat number="500+" label="Certified Trainers" isDark={isDark} />
          <Stat number="1M+" label="Workouts Tracked" isDark={isDark} />
          <Stat number="98%" label="User Satisfaction" isDark={isDark} />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <Features />

      {/* ================= COMMUNITY ================= */}
      <section className={`
        ${isDark ? "bg-neutral-900" : "bg-gray-800"}
      `}>
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <img
            src="https://media.istockphoto.com/id/1141407939/photo/battle-ropes-session-at-the-gym.jpg?s=612x612&w=0&k=20&c=YZObVI5i4D9dtyxg0I_tTWUj4elDwbvVT02lRN0Zy9Y="
            alt="community"
            className="rounded-2xl shadow-xl"
          />

          <div>
            <h2 className={`
              text-4xl font-bold mb-6
              ${isDark ? "text-white" : "text-gray-100"}
            `}>
              Train with a <span className="text-emerald-400">Community</span>
            </h2>
            <p className={`
              mb-8
              ${isDark ? "text-neutral-300" : "text-gray-300"}
            `}>
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

      {/* ================= CONTACT ================= */}
      <Contact />

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

const Stat = ({ number, label, isDark }) => (
  <div>
    <p className="text-4xl font-bold text-emerald-400 mb-2">{number}</p>
    <p className={isDark ? "text-neutral-400" : "text-gray-600"}>{label}</p>
  </div>
);



export default Home;
