import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/Components/Button";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "rohit.pokhariya123@gmail.com",
    href: "mailto:rohit.pokhariya123@gmail.com",
    
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9012464329",
    href: "tel:+919012464329",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India",
    href: "#",
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // 'success' or 'error'
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables."
        );
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        publicKey
      );

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.text || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
  <section
  id="contact"
  className="section-shell relative overflow-hidden py-24 md:py-36 scroll-mt-24"
>
  {/* Background blobs */}
  <div className="absolute inset-0">
    <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-1/4 w-56 h-56 md:w-64 md:h-64 bg-highlight/5 rounded-full blur-3xl" />
  </div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    {/* ===== Section Header ===== */}
    <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 reveal-on-scroll">
      <span className="section-kicker animate-fade-in">
        Get In Touch
      </span>

      <h2 className="section-title mt-5 mb-6 animate-fade-in animation-delay-100">
        Let's build{" "}
        <span className="font-serif italic font-normal text-white">
          something great.
        </span>
      </h2>

      <p className="section-copy mx-auto animate-fade-in animation-delay-200">
        Looking for a MERN developer or want to discuss a web project? Send me a
        message and let&apos;s connect.
      </p>
    </div>

    {/* ===== Main Grid ===== */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 max-w-5xl mx-auto reveal-on-scroll">
      
      {/* ===== Form ===== */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300">
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Your name..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 text-sm sm:text-base bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 text-sm sm:text-base bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 text-sm sm:text-base bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full flex items-center justify-center gap-2"
            type="submit"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : <>
              Send Message
              <Send className="w-5 h-5" />
            </>}
          </Button>

          {/* Status */}
          {submitStatus.type && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                submitStatus.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p>{submitStatus.message}</p>
            </div>
          )}
        </form>
      </div>

     {/* Contact Info */}
      <div className="space-y-6 animate-fade-in animation-delay-400">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-6">
            Contact Information
          </h3>

          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    {item.value}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">Currently Available</span>
          </div>
          <p className="text-sm text-muted-foreground">
            I'm currently open to new opportunities and exciting projects.
            I&apos;m open to MERN stack roles, software development opportunities,
            and meaningful projects. Let&apos;s talk.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  );
};
