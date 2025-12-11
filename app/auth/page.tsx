"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@/public/animation/internship-lottie.json";
import { useRouter } from "next/navigation";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";
import Link from "next/link";

interface BeamsBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

const opacityMap = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1,
};

const createBeam = (width: number, height: number): Beam => {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
};

const Icon = ({
  path,
  className = "w-5 h-5",
}: {
  path: string;
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={path}
    />
  </svg>
);

const BeamsBackground: React.FC<BeamsBackgroundProps> = ({
  intensity = "strong",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beamsRef.current = Array.from({ length: 30 }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    const resetBeam = (beam: Beam) => {
      beam.y = canvas.height + 100;
      beam.x = Math.random() * canvas.width;
    };

    const drawBeam = (b: Beam) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate((b.angle * Math.PI) / 180);
      const pulseOpacity =
        b.opacity * (0.8 + Math.sin(b.pulse) * 0.2) * opacityMap[intensity];
      const gradient = ctx.createLinearGradient(0, 0, 0, b.length);
      gradient.addColorStop(0, `hsla(${b.hue},85%,65%,0)`);
      gradient.addColorStop(0.4, `hsla(${b.hue},85%,65%,${pulseOpacity})`);
      gradient.addColorStop(1, `hsla(${b.hue},85%,65%,0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-b.width / 2, 0, b.width, b.length);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      beamsRef.current.forEach((b) => {
        b.y -= b.speed;
        b.pulse += b.pulseSpeed;
        if (b.y + b.length < -50) resetBeam(b);
        drawBeam(b);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 blur-[15px] block w-full"
    />
  );
};

const icons = {
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  college:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4m0 4h5m0 0v-4m0 4h5m0 0v-4m-5 4v-4m-5 4v-4m14-8l-7-4-7 4m14 0V5",
  phone:
    "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
};

interface FormInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  icon,
}) => (
  <div className="relative group">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
      <Icon path={icon} />
    </span>
    <motion.input
      suppressHydrationWarning
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg placeholder-slate-500 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:border-slate-600"
    />
  </div>
);

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [form, setForm] = useState({
    loginUsername: "",
    loginPassword: "",
    regFullName: "",
    regCollege: "",
    regEmail: "",
    regPhone: "",
    regMessage: "",
  });

  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setCheckingUser(false);
        return;
      }

      try {
        const user = JSON.parse(userData);

        if (!user || !user.role) {
          localStorage.removeItem("user");
          setCheckingUser(false);
          return;
        }

        switch (user.role) {
          case "admin":
            router.replace("/admin");
            break;
          case "manager":
          case "project_manager":
            router.replace("/manager");
            break;
          case "intern":
          case "student":
            router.replace("/intern");
            break;
          default:
            localStorage.removeItem("user");
            setCheckingUser(false);
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        localStorage.removeItem("user");
        setCheckingUser(false);
      }
    };

    checkUser();
  }, [router]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInput =
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [field]: e.target.value });

  const handleLogin = async () => {
    if (!form.loginUsername || !form.loginPassword) {
      showToast("Please enter both email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.loginUsername,
          password: form.loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user?.role) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        switch (data.user.role) {
          case "admin":
            router.push("/admin");
            break;
          case "manager":
            router.push("/manager");
            break;
          case "intern":
            router.push("/intern");
            break;
          default:
            router.push("/");
        }
      } else {
        showToast(data.error || "Invalid email or password", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.loginUsername;
    if (!email) return showToast("Please enter your email.", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) showToast(data.message, "success");
      else showToast(data.error || "Failed to send password.", "error");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    }
    setLoading(false);
  };

  if (checkingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-white">
        <div className="text-center">
          <BouncingDots />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 flex items-center justify-center">
      <BeamsBackground intensity="strong" />

      <motion.div
        className="absolute inset-0 bg-neutral-950/5 overflow-hidden"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ backdropFilter: "blur(50px)" }}
      />
      <div className="relative z-10 w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-slate-800/30 backdrop-blur-xl border border-white/10"
        >
          <div className="hidden lg:flex w-full lg:w-5/12 bg-black/20 flex-col items-center p-10 text-center">
            <Lottie animationData={animationData} loop className="max-w-xs" />
            <h3 className="text-white font-semibold text-xl mt-6">
              {isRegister
                ? "Embark on a New Journey"
                : "Welcome Back, Innovator!"}
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              {isRegister
                ? "Unlock your potential. Register now to connect with opportunities."
                : "Your next great idea is just a login away. Let's get started."}
            </p>
          </div>

          <div className="w-full lg:w-7/12 p-8 sm:p-12 bg-black/10">
            <AnimatePresence mode="wait">
              <motion.form
                suppressHydrationWarning
                key="login"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                  Sign In
                </h2>
                <FormInput
                  id="loginUsername"
                  type="text"
                  placeholder="Username or Email"
                  value={form.loginUsername}
                  onChange={handleInput("loginUsername")}
                  icon={icons.user}
                />
                <FormInput
                  id="loginPassword"
                  type="password"
                  placeholder="Password"
                  value={form.loginPassword}
                  onChange={handleInput("loginPassword")}
                  icon={icons.lock}
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-slate-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
                >
                  {loading ? "Processing..." : "Login"}
                </motion.button>
                <p className="text-center text-sm text-slate-400">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="text-cyan-400 hover:underline"
                  >
                    <Link href="/#register">Register</Link>
                  </button>
                </p>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
