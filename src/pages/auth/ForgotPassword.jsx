import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input, Button, ErrorText, SuccessText } from "./AuthUI";
import { forgotPassword } from "../../api/userApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="We’ll send you a reset link"
    >
      {message && <SuccessText text={message} />}
      {error && <ErrorText text={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button loading={loading} text="Send Reset Link" />
      </form>

      <p className="text-neutral-400 text-sm text-center mt-6">
        Back to{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
