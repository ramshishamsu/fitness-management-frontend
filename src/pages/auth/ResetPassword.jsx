import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { Input, Button, ErrorText } from "./AuthUI";
import { resetPassword } from "../../api/userApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(token, password);
      navigate("/login");
    } catch {
      setError("Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a strong password"
    >
      {error && <ErrorText text={error} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button loading={loading} text="Update Password" />
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
