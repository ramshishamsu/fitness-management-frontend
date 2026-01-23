import {
  Dumbbell,
  Apple,
  Users,
  BarChart3,
  Target,
  CreditCard,
  Moon,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "Personalized Workouts",
    description: "Trainer-designed workout plans tailored to your fitness level and goals."
  },
  {
    icon: Apple,
    title: "Nutrition Tracking",
    description: "Track calories, protein, carbs, and follow diet plans assigned by trainers."
  },
  {
    icon: Users,
    title: "Trainer Support",
    description: "Stay connected with certified trainers through guidance and in-app support."
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visual insights into workouts, nutrition, and overall fitness progress."
  },
  {
    icon: Target,
    title: "Goal Management",
    description: "Set fitness goals and track your achievements step by step."
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Subscribe to fitness plans with safe and seamless online payments."
  },
  {
    icon: Moon,
    title: "Dark / Light Mode",
    description: "Comfortable viewing experience with modern dark and light themes."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive design that works smoothly on all devices."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Powerful Features
          </h2>
          <p className="mt-3 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Everything you need to manage workouts, nutrition, progress, and trainers — all in one platform.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10 mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
