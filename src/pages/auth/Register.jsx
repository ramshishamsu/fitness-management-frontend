import { useState,useEffect } from "react";
import { Link, useNavigate, useSearchParams} from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input, Button, ErrorText } from "./AuthUI";
import { registerUser } from "../../api/userApi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    specialization: "",
    experience: ""
  });
   const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    if (roleFromUrl === "trainer") {
      setForm((prev) => ({ ...prev, role: "trainer" }));
    }
  }, [searchParams]);
  
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your fitness journey today"
    >
      {error && <ErrorText text={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input name="name" placeholder="Full Name" onChange={handleChange} />
        <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <Input name="password" type="password" placeholder="Password" onChange={handleChange} />

        {/* ROLE SELECT */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full bg-[#0b0f14] border border-gray-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="user">Register as User</option>
          <option value="trainer">Register as Trainer</option>
        </select>

        {/* TRAINER EXTRA FIELDS */}
        {form.role === "trainer" && (
          <>
            <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <Input name="specialization" placeholder="Specialization" onChange={handleChange} />
            <Input name="experience" placeholder="Years of Experience" onChange={handleChange} />
          </>
        )}

        <Button loading={loading} text="Create Account" />
      </form>

      <p className="text-neutral-400 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
