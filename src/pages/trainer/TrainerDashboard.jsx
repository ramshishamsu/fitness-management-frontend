/*
|--------------------------------------------------------------------------
| TRAINER DASHBOARD – DARK INDUSTRIAL
|--------------------------------------------------------------------------
| Inspired by cult.fit / Nike Training Club (Trainer View)
*/

import { Users, Calendar, IndianRupee, Clock } from "lucide-react";

const TrainerDashboard = () => {
  return (
    <div className="bg-neutral-950 min-h-screen text-white px-6 py-10">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Trainer Dashboard 🏋️‍♂️
        </h1>
        <p className="text-neutral-400">
          Manage your clients and sessions efficiently
        </p>
      </div>
      

      {/* ================= STATS ================= */}
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-4 mb-14">
        <StatCard
          icon={<Users />}
          label="Active Clients"
          value="18"
        />
        <StatCard
          icon={<Calendar />}
          label="Sessions This Week"
          value="24"
        />
        <StatCard
          icon={<IndianRupee />}
          label="Monthly Earnings"
          value="₹42,000"
        />
        <StatCard
          icon={<Clock />}
          label="Today’s Sessions"
          value="5"
        />
      </div>

      {/* ================= TODAY SCHEDULE ================= */}
      <div className="max-w-7xl mx-auto mb-14">
        <h2 className="text-xl font-semibold mb-6">
          Today’s Schedule
        </h2>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800">
          <ScheduleRow
            client="Rahul"
            time="7:00 AM – Strength Training"
          />
          <ScheduleRow
            client="Anjali"
            time="9:00 AM – Cardio"
          />
          <ScheduleRow
            client="Arjun"
            time="6:00 PM – Personal Session"
          />
        </div>
      </div>

      {/* ================= CLIENTS ================= */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">
          Recent Clients
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <ClientCard name="Rahul" plan="Weight Loss" />
          <ClientCard name="Anjali" plan="Muscle Gain" />
          <ClientCard name="Arjun" plan="Athletic Training" />
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, label, value }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
    <div className="w-12 h-12 mb-4 flex items-center justify-center bg-emerald-500/10 text-emerald-400 rounded-lg">
      {icon}
    </div>
    <p className="text-neutral-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ScheduleRow = ({ client, time }) => (
  <div className="p-5 flex justify-between items-center">
    <p className="font-medium">{client}</p>
    <span className="text-neutral-400 text-sm">{time}</span>
  </div>
);

const ClientCard = ({ name, plan }) => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
    <p className="text-lg font-semibold mb-1">{name}</p>
    <p className="text-neutral-400 text-sm mb-4">{plan}</p>

    <button className="w-full bg-emerald-500 text-black py-2 rounded-md font-semibold hover:bg-emerald-400 transition">
      View Profile
    </button>
  </div>
);

export default TrainerDashboard;
