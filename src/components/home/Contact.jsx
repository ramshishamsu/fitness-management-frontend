import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
            Get In Touch
          </h2>
          <p className="mt-3 text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* CONTACT INFO */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-100">Email</p>
                    <p className="text-gray-600 dark:text-neutral-400">support@fitnesspro.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <Phone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-100">Phone</p>
                    <p className="text-gray-600 dark:text-neutral-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-100">Address</p>
                    <p className="text-gray-600 dark:text-neutral-400">123 Fitness Street, Gym City, GC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Business Hours
              </h4>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
                <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 7:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-6">
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2"
              >
                <Send size={18} />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
