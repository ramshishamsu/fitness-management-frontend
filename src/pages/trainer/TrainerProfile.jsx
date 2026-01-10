import { useEffect, useState } from "react";
import axios from "../../api/axios";

const TrainerProfile = () => {
  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    phone: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD EXISTING PROFILE ================= */
 useEffect(() => {
  axios.get("/trainers/profile").then((res) => {
    if (res.data.profileImage) {
      setAvatar(
        `http://localhost:5003/${res.data.profileImage}?t=${Date.now()}`
      );
    }
  });
}, []);


  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // 👀 preview (THIS proves file is detected)
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await axios.put("/trainers/profile", formData);

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {/* PROFILE IMAGE */}
      <div className="mb-6">
        <label className="text-sm block mb-2">Profile Photo</label>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 rounded-full mb-3 object-cover border border-neutral-700"
          />
        )}

        {/* Hidden input */}
        <input
          type="file"
          id="profileImage"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Custom bar */}
        <label
          htmlFor="profileImage"
          className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded px-4 py-3 cursor-pointer hover:border-emerald-500 transition"
        >
          <span className="text-neutral-400">
            {profileImage ? profileImage.name : "Choose profile image"}
          </span>

          <span className="bg-neutral-800 px-3 py-1 rounded text-sm">
            Browse
          </span>
        </label>
      </div>

      {/* FIELDS */}
      <input
        name="specialization"
        value={form.specialization}
        onChange={handleChange}
        placeholder="Specialization"
        className="w-full mb-3 bg-neutral-900 border border-neutral-800 p-3 rounded"
      />

      <input
        name="experience"
        value={form.experience}
        onChange={handleChange}
        placeholder="Experience (years)"
        className="w-full mb-3 bg-neutral-900 border border-neutral-800 p-3 rounded"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full mb-3 bg-neutral-900 border border-neutral-800 p-3 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 text-black px-5 py-2 rounded font-semibold"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default TrainerProfile;
