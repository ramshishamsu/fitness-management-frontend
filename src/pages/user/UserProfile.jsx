import { useEffect, useState } from "react";
import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserProfile = () => {
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    activityLevel: "",
    profileImage: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); // ✅ PREVIEW
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= CLEAN PREVIEW MEMORY ================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); // ✅ PREVIEW IMAGE
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async () => {
    const data = new FormData();
    data.append("image", image);

    const res = await API.post("/upload/profile-image", data);
    return res.data.imageUrl;
  };

  /* ================= SAVE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      let imageUrl = form.profileImage;

      if (image) {
        imageUrl = await uploadImage();
      }

      await API.put("/users/profile", {
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        fitnessGoal: form.fitnessGoal,
        activityLevel: form.activityLevel,
        profileImage: imageUrl,
      });

      // ✅ UPDATE STATE SO IMAGE SHOWS IMMEDIATELY
      setForm((prev) => ({
        ...prev,
        profileImage: imageUrl,
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
      }));

      setImage(null);
      setPreview("");

      setMessage("Profile updated successfully ✅");
    } catch (err) {
      console.error("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl text-white">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {message && (
        <div className="bg-green-500/10 text-green-400 p-3 rounded mb-4">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#0B0F14] border border-[#1F2937] p-6 rounded-xl"
      >
        {/* ================= PROFILE IMAGE ================= */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            Profile Photo
          </label>

          {/* IMAGE PREVIEW */}
          {preview || form.profileImage ? (
            <img
              src={preview || form.profileImage}
              alt="profile preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-600 mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-400 mb-3">
              No Image
            </div>
          )}

          {/* CUSTOM FILE INPUT */}
          <label className="inline-block cursor-pointer bg-[#00E676] text-black px-4 py-2 rounded font-semibold">
            Choose Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>

          {/* FILE NAME */}
          {image && (
            <p className="text-sm text-gray-400 mt-2">Selected: {image.name}</p>
          )}
        </div>

        {/* AGE */}
        <input
          type="number"
          name="age"
          value={form.age || ""}
          onChange={handleChange}
          placeholder="Age"
          className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-700"
        />

        {/* HEIGHT */}
        <input
          type="number"
          name="height"
          value={form.height || ""}
          onChange={handleChange}
          placeholder="Height (cm)"
          className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-700"
        />

        {/* WEIGHT */}
        <input
          type="number"
          name="weight"
          value={form.weight || ""}
          onChange={handleChange}
          placeholder="Weight (kg)"
          className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-700"
        />

        {/* FITNESS GOAL */}
        <select
          name="fitnessGoal"
          value={form.fitnessGoal || ""}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-700"
        >
          <option value="">Fitness Goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="strength">Strength</option>
          <option value="general_fitness">General Fitness</option>
        </select>

        {/* ACTIVITY LEVEL */}
        <select
          name="activityLevel"
          value={form.activityLevel || ""}
          onChange={handleChange}
          className="w-full mb-5 px-3 py-2 rounded bg-black border border-gray-700"
        >
          <option value="">Activity Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#00E676] text-black px-6 py-2 rounded font-semibold"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
