/*
|--------------------------------------------------------------------------
| FOOTER – DARK INDUSTRIAL (cult.fit style)
|--------------------------------------------------------------------------
| - Minimal
| - Responsive
| - Product-ready
*/

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h3 className="text-xl font-bold text-emerald-400 mb-4">
            FITNESS PRO
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed">
            A premium fitness management platform to train smarter,
            track progress, and stay consistent.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><FooterLink to="/">Home</FooterLink></li>
            <li><FooterLink to="/user">Dashboard</FooterLink></li>
            <li><FooterLink to="/trainer">Trainers</FooterLink></li>
            <li><FooterLink to="/pricing">Pricing</FooterLink></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><FooterLink to="/about">About</FooterLink></li>
            <li><FooterLink to="/careers">Careers</FooterLink></li>
            <li><FooterLink to="/blog">Blog</FooterLink></li>
            <li><FooterLink to="/contact">Contact</FooterLink></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><FooterLink to="/help">Help Center</FooterLink></li>
            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
            <li><FooterLink to="/terms">Terms & Conditions</FooterLink></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-neutral-800 py-6 text-center text-neutral-500 text-sm">
        © {new Date().getFullYear()} Fitness Pro. All rights reserved.
      </div>
    </footer>
  );
};

/* ================= HELPER ================= */

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="hover:text-white transition"
  >
    {children}
  </Link>
);

export default Footer;
