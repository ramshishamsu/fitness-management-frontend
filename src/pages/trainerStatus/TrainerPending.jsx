import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MailCheck } from "lucide-react";

const TrainerPending = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center shadow-2xl"
      >
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Clock size={36} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          Application Under Review
        </h1>

        {/* Message */}
        <p className="text-neutral-400 leading-relaxed mb-8">
          Thank you for applying to become a trainer.  
          Our admin team is currently reviewing your profile and certifications.
          <br />
          <span className="text-neutral-300 font-medium">
            You will be notified once your application is approved.
          </span>
        </p>

        {/* Info box */}
        <div className="flex items-center justify-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 mb-8 text-sm text-neutral-300">
          <MailCheck size={18} className="text-emerald-400" />
          Please check your email for updates
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-md border border-neutral-700 hover:bg-neutral-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default TrainerPending;
