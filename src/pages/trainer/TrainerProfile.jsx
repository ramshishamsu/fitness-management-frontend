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
  const [docs, setDocs] = useState([]);
  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState('id');
  const [docLoading, setDocLoading] = useState(false);

  /* ================= LOAD EXISTING PROFILE & DOCS ================= */
 useEffect(() => {
  axios.get("/trainers/profile").then((res) => {
    const trainer = res.data;
    if (trainer.profileImage) {
      setAvatar(
        `http://localhost:5003/${trainer.profileImage}?t=${Date.now()}`
      );
    }
    if (trainer.documents) {
      setDocs(trainer.documents);
    }
  }).catch(err => console.error('Failed to load trainer profile', err));
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Verification Documents</h3>

        {/* Upload controls */}
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 p-2 rounded"
          >
            <option value="id">Government ID</option>
            <option value="certificate">Certificate</option>
            <option value="other">Other</option>
          </select>

          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setDocFile(e.target.files[0])}
            className="col-span-2"
          />
        </div>

        <button
          type="button"
          onClick={async () => {
            if (!docFile) return alert('Please choose a file first');
            try {
              setDocLoading(true);
              const fd = new FormData();
              fd.append('document', docFile);
              fd.append('type', docType);

              const res = await axios.post('/trainers/verify', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              // append to list
              setDocs((d) => [res.data.doc, ...d]);
              setDocFile(null);
              alert('Document uploaded ✅');
            } catch (err) {
              console.error(err);
              alert('Upload failed ❌');
            } finally {
              setDocLoading(false);
            }
          }}
          disabled={docLoading}
          className="bg-emerald-500 text-black px-4 py-2 rounded font-semibold mt-2"
        >
          {docLoading ? 'Uploading...' : 'Upload Document'}
        </button>

        {docFile && (
          <div className="text-sm text-neutral-400 mt-2">Selected: {docFile.name}</div>
        )}

        {/* Existing docs list */}
        <div className="mt-4">
          {docs.length === 0 && (
            <p className="text-sm text-neutral-400">No documents uploaded yet.</p>
          )}

          {docs.map((doc, idx) => (
            <div key={idx} className="p-3 bg-neutral-900 border border-neutral-800 rounded mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{doc.type?.toUpperCase()}</div>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-300">View</a>
                </div>
                <div className="text-sm">
                  {doc.verified ? (
                    <span className="text-emerald-400">Verified</span>
                  ) : (
                    <span className="text-yellow-400">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 text-black px-5 py-2 rounded font-semibold mt-6"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default TrainerProfile;
