/*
|--------------------------------------------------------------------------
| DARK AUTH LAYOUT – INDUSTRIAL
|--------------------------------------------------------------------------
| Shared layout for all auth pages
*/

import { Link } from "react-router-dom";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">

        <Link to="/" className="block text-center mb-6">
          <span className="text-emerald-400 font-bold text-lg">
            FITNESS PRO
          </span>
        </Link>

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {title}
        </h2>

        {subtitle && (
          <p className="text-neutral-400 text-center mb-8">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
