import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

const AdminAssignPlan = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    adminApi.get("/users").then(res => setUsers(res.data?.users || []));
    adminApi.get("/plans").then(res => setPlans(res.data));
  }, []);

  const assignPlan = async () => {
    if (!selectedUser || !selectedPlan) {
      alert("Select user & plan");
      return;
    }

    await adminApi.post("/assign-plan", {
      userId: selectedUser,
      planId: selectedPlan
    });

    alert("Plan assigned successfully ✅");
  };

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-bold">Assign Plan to User</h2>

      <select
        className="input"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select User</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      <select
        className="input"
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
      >
        <option value="">Select Plan</option>
        {plans.map(p => (
          <option key={p._id} value={p._id}>
            {p.name} – ₹{p.price}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="bg-emerald-600 px-4 py-2 rounded text-white"
        onClick={assignPlan}
      >
        Assign Plan
      </button>
    </div>
  );
};

export default AdminAssignPlan;
