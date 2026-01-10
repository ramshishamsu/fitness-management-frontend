import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input, Button, ErrorText } from "./AuthUI";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/useAuth";

const Login = () => {
  /* ===================== STATE ===================== */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== HOOKS ===================== */
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ===================== SUBMIT HANDLER ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Call backend login API
      const data = await loginUser({ email, password });

      // 2️⃣ Save token + user in auth context
      login(data);

      // 3️⃣ Extract role & status
      const { role, status } = data.user;

      // 4️⃣ ROLE-BASED REDIRECT

      // USER
      if (role === "user") {
        navigate("/user/dashboard", { replace: true });
        return;
      }

      // TRAINER
      if (role === "trainer") {
        if (status === "pending") {
          navigate("/trainer/pending", { replace: true });
        } else if (["approved", "active"].includes(status)) {
          navigate("/trainer/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        return;
      }

      // ADMIN
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // FALLBACK
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <AuthLayout title="Welcome Back" subtitle="Train smarter. Stay consistent.">
      {/* Error Message */}
      {error && <ErrorText text={error} />}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot password */}
        <div className="text-right text-sm">
          <Link
            to="/forgot-password"
            className="text-emerald-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button loading={loading} text="Login" />
      </form>

      {/* Footer links */}
      <p className="text-neutral-400 text-sm text-center mt-6">
        New here?{" "}
        <Link to="/register" className="text-emerald-400 hover:underline">
          Create account
        </Link>
        <br />
        Trainer?{" "}
        <Link
          to="/trainer/register"
          className="text-emerald-400 hover:underline"
        >
          Become a Trainer
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
