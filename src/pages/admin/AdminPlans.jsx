import { useEffect, useState } from "react";
import API  from "../../api/adminApi";

const AdminPlans = () => {

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    features: ""
  });

  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const { data } = await API.get("/plans");
      setPlans(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.post("/plans", {
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
        features: form.features.split(",").map(f => f.trim())
      });

      alert("Plan created ✅");
      setForm({ name: "", price: "", duration: "", features: "" });
      fetchPlans();

    } catch {
      alert("Create failed ❌");
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
      await API.delete(`/plans/${id}`);
      fetchPlans();
    } catch {
      alert("Delete failed ❌");
    }
  };

  const updatePlan = async () => {
    try {
      await API.put(`/plans/${editingPlan._id}`, {
        name: editingPlan.name,
        price: Number(editingPlan.price),
        duration: Number(editingPlan.duration),
        features: editingPlan.features.split(",").map(f => f.trim())
      });

      alert("Plan updated ✅");
      setEditingPlan(null);
      fetchPlans();

    } catch {
      alert("Update failed ❌");
    }
  };

  return (
    <div className="space-y-12">

      {/* CREATE PLAN */}
      <form onSubmit={submitHandler} className="space-y-4 max-w-md">
        <input className="input" placeholder="Plan Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input className="input" type="number" placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input className="input" type="number" placeholder="Duration"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })} />

        <input className="input" placeholder="Features"
          value={form.features}
          onChange={(e) => setForm({ ...form, features: e.target.value })} />

        <button type="submit" className="bg-green-600 px-6 py-2 rounded text-white">
          Create Plan
        </button>
      </form>

      {/* PLAN LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan._id} className="border p-4 rounded bg-gray-900 text-white">

            <h3>{plan.name}</h3>
            <p>₹{plan.price} / {plan.duration} months</p>

            <div className="flex gap-3 mt-3">
              <button
                type="button"   // 🔥 FIX
                className="bg-blue-600 px-3 py-1 rounded"
                onClick={() =>
                  setEditingPlan({ ...plan, features: plan.features.join(", ") })
                }>
                Edit
              </button>

              <button
                type="button"   // 🔥 FIX
                className="bg-red-600 px-3 py-1 rounded"
                onClick={() => deletePlan(plan._id)}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-md w-full space-y-3">

            <input className="input" value={editingPlan.name}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, name: e.target.value })} />

            <input className="input" type="number" value={editingPlan.price}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, price: e.target.value })} />

            <input className="input" type="number" value={editingPlan.duration}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, duration: e.target.value })} />

            <input className="input" value={editingPlan.features}
              onChange={(e) =>
                setEditingPlan({ ...editingPlan, features: e.target.value })} />

            <div className="flex justify-end gap-3">
              <button
                type="button"   // 🔥 FIX
                onClick={() => setEditingPlan(null)}
                className="bg-gray-400 px-4 py-1 rounded">
                Cancel
              </button>

              <button
                type="button"   // 🔥 FIX
                onClick={updatePlan}
                className="bg-green-600 px-4 py-1 rounded text-white">
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPlans;
