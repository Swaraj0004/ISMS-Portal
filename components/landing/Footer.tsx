"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpIcon, LocationEdit, MailIcon, PhoneIcon } from "lucide-react";

const Footer: React.FC = () => {
  const contactDetails = [
    { icon: PhoneIcon, title: "Phone", info: "+91 992 369 5871" },
    { icon: MailIcon, title: "E-mail", info: "sanjaybalamwar.intern@gmail.com" },
    {
      icon: LocationEdit,
      title: "Location",
      info: "MRSAC, VNIT Campus, S.A. Rd, Nagpur, Maharashtra, India - 440010",
    },
  ];

  return (
    <footer
      className="w-full pt-5"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden shadow-2xl border"
          style={{ borderColor: "var(--border)" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4443.822899979756!2d79.05018157586649!3d21.122042584567012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0779c10ce01%3A0xc4f77613d7a4445!2sMaharashtra%20Remote%20Sensing%20Applications%20Centre!5e1!3m2!1sen!2sin!4v1758531405951!5m2!1sen!2sin"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location Map"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
          {contactDetails.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className="p-4 rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: "var(--primary-light)" }}
              >
                <item.icon
                  className="w-6 h-6"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-[var(--foreground-secondary)]">
                  {item.info}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className="border-t  py-6 flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8"
        style={{ borderColor: "var(--border)" }}
      >
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "rgba(59,130,246,0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
          onClick={() => {
            document.getElementById("home")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <ArrowUpIcon style={{ color: "var(--primary)" }} />
        </motion.button>
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Image
            alt="Logo"
            width={48}
            height={48}
            src="/logo.png"
            className="rounded-full object-contain"
            priority
          />
          <span className="text-[var(--foreground-secondary)] text-sm">
            &copy; {new Date().getFullYear()} MRSAC. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
