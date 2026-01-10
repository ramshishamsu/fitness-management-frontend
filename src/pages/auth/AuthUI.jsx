/*
|--------------------------------------------------------------------------
| AUTH UI COMPONENTS – DARK INDUSTRIAL
|--------------------------------------------------------------------------
| Shared inputs, buttons, messages for auth pages
*/

export const Input = (props) => (
  <input
    {...props}
    required
    className="
      w-full
      bg-neutral-800
      text-white
      border border-neutral-700
      rounded-lg
      px-4 py-3
      placeholder-neutral-400
      focus:outline-none
      focus:ring-2
      focus:ring-emerald-500
    "
  />
);

export const Button = ({ text, loading }) => (
  <button
    disabled={loading}
    className="
      w-full
      bg-emerald-500
      text-black
      py-3
      rounded-lg
      font-semibold
      hover:bg-emerald-400
      transition
      disabled:opacity-60
    "
  >
    {loading ? "Please wait..." : text}
  </button>
);

export const ErrorText = ({ text }) => (
  <p className="text-red-400 text-sm text-center mt-2">
    {text}
  </p>
);

export const SuccessText = ({ text }) => (
  <p className="text-emerald-400 text-sm text-center mt-2">
    {text}
  </p>
);
