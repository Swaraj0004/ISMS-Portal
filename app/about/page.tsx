"use client";

import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import { motion } from "framer-motion";
import { Lock, Users, Calendar } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex flex-col items-center space-y-6 no-scrollbar">
        <main className="pt-20 bg-[var(--background)] text-[var(--foreground)]">
          <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[var(--accent)]">
              About MRSAC Internship Portal
            </h1>
            <p className="text-[var(--foreground-secondary)] max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
              Discover how the Maharashtra Remote Sensing Application Centre
              leverages cutting-edge geospatial technology and how our portal
              streamlines internship management with secure, smart solutions.
            </p>
          </section>

          <section className="py-16 px-4 sm:px-6 lg:px-8" id="about-mrsac">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[var(--accent)]">
                  About MRSAC
                </h2>
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg leading-relaxed">
                  Maharashtra Remote Sensing Application Centre (MRSAC) – a hub
                  for geospatial technology and remote sensing applications
                  across the state.
                </p>

                <div className="bg-gradient-to-r from-white/40 dark:from-gray-800/40 to-white/10 dark:to-gray-900/20 border border-[var(--border)] rounded-3xl p-6 space-y-5 shadow-lg backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300">
                  <h3 className="text-xl font-semibold text-[var(--accent)]">
                    Overview
                  </h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Established in January 1988 under the Societies Registration
                    Act, 1860. Autonomous under Planning Dept., nodal agency for
                    Maharashtra's geospatial digital database system (MGDDS).
                  </p>

                  <h3 className="text-xl font-semibold text-[var(--accent)]">
                    Mission & Vision
                  </h3>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Harness the potential of Remote Sensing & GIS for the
                    development and utilization of natural resources. Guides
                    users and departments by deploying remote sensing datasets,
                    GIS, and decision support systems.
                  </p>

                  <h3 className="text-xl font-semibold text-[var(--accent)]">
                    Major Projects
                  </h3>
                  <ul className="list-disc list-inside text-[var(--foreground-secondary)] space-y-2 leading-relaxed">
                    <li>
                      <strong>MahaBHUMI Geo-Portal:</strong> High-res base maps
                      with urban, transport, water, and land layers.
                    </li>
                    <li>
                      <strong>GIS-based DSS:</strong> NHP-DSS, MGNREGA GIS
                      Portal, Groundwater DSS.
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex justify-center order-1 md:order-2"
              >
                <Image
                  src="/internship-bg.jpg"
                  alt="About MRSAC"
                  width={500}
                  height={400}
                  className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </section>

          <section
            className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background)]"
            id="about-vault"
          >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex justify-center"
              >
                <Image
                  src="/images/secure-vault.png"
                  alt="Secure Document Management"
                  width={500}
                  height={400}
                  className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 mb-6 text-[var(--accent)]">
                  <Lock size={28} />
                  Secure Document Management
                </h2>
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg leading-relaxed">
                  Effortlessly manage all your essential internship documents in
                  one place.
                </p>
                <div className="bg-gradient-to-r from-white/40 dark:from-gray-800/40 to-white/10 dark:to-gray-900/20 border border-[var(--border)] rounded-3xl p-6 space-y-4 shadow-lg backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300">
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Upload, organize, and access offer letters, progress
                    reports, certificates, and more using a cloud-based digital
                    vault with bank-grade encryption.
                  </p>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Advanced access management, version history, and audit
                    trails keep every document protected and accountable.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-16 px-4 sm:px-6 lg:px-8" id="about-matching">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 mb-6 text-[var(--accent)]">
                  <Users size={28} />
                  Smart Internship Matching
                </h2>
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg leading-relaxed">
                  Effortlessly find your place with tailored guidance.
                </p>
                <div className="bg-gradient-to-r from-white/40 dark:from-gray-800/40 to-white/10 dark:to-gray-900/20 border border-[var(--border)] rounded-3xl p-6 space-y-4 shadow-lg backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300">
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Evaluates students’ background, skills, and interests to
                    recommend the most suitable internship role offered by
                    partner companies.
                  </p>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Targeted support and feedback at every stage maximize
                    placement potential and prepare for a meaningful internship
                    experience.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex justify-center order-1 md:order-2"
              >
                <Image
                  src="/images/smart-matching.png"
                  alt="Smart Internship Matching"
                  width={500}
                  height={400}
                  className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </section>

          <section
            className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--background)]"
            id="about-matching"
          >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex justify-center"
              >
                <Image
                  src="/images/smart-scheduling.png"
                  alt="Smart Scheduling"
                  width={500}
                  height={400}
                  className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-2"
              >
                <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 mb-6 text-[var(--accent)]">
                  <Calendar size={28} />
                  Stay Organized with Smart Scheduling
                </h2>
                <p className="text-[var(--foreground-secondary)] mb-6 text-lg leading-relaxed">
                  Effortless internship organization for every milestone.
                </p>
                <div className="bg-gradient-to-r from-white/40 dark:from-gray-800/40 to-white/10 dark:to-gray-900/20 border border-[var(--border)] rounded-3xl p-6 space-y-4 shadow-lg backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300">
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Plan meetings, deadlines, and interviews in a unified
                    calendar. Automated reminders keep everyone on track.
                  </p>
                  <p className="text-[var(--foreground-secondary)] leading-relaxed">
                    Real-time notifications, customizable alerts, and integrated
                    scheduling ensure smooth communication and no missed
                    deadlines.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </main>
      <Footer />
    </>
  );
}
