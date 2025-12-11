"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Role, Mode, FormData, FormErrors } from "@/utils/types";
import {
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  MailIcon,
  LockIcon,
  MapPinIcon,
} from "@/utils/icons";

const initialFormData: FormData = {
  fullName: "",
  universityName: "",
  companyName: "",
  companyAddress: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialErrors: FormErrors = {};

interface InputFieldProps {
  id: keyof FormData;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  icon,
}) => (
  <div className="w-full">
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-300">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full pl-10 pr-3 py-3 rounded-xl border text-[var(--foreground)] dark:text-[var(--foreground-light)]
          border-gray-300 dark:border-gray-600 bg-[var(--input-bg)] dark:bg-[var(--input-bg-dark)]
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300
          ${error ? "border-red-500 focus:ring-red-500" : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </div>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        error ? "max-h-5 mt-1" : "max-h-0"
      }`}
    >
      <p id={`${id}-error`} className="text-red-500 text-xs">
        {error || "\u00A0"}
      </p>
    </div>
  </div>
);

const AuthForm: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.Student);
  const [mode, setMode] = useState<Mode>(Mode.Login);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setMessage("");
  }, []);

  const handleRoleChange = useCallback(
    (newRole: Role) => {
      setRole(newRole);
      resetForm();
    },
    [resetForm]
  );

  const handleModeToggle = useCallback(() => {
    setMode(mode === Mode.Login ? Mode.Signup : Mode.Login);
    resetForm();
  }, [mode, resetForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";

    if (mode === Mode.Signup) {
      if (role === Role.Student) {
        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.universityName)
          newErrors.universityName = "University Name is required";
      } else {
        if (!formData.companyName)
          newErrors.companyName = "Company Name required";
        if (!formData.companyAddress)
          newErrors.companyAddress = "Company Address required";
      }

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        mode === Mode.Login ? "/api/auth/login" : "/api/auth/signup";

      const payload: any = {
        email: formData.email,
        password: formData.password,
        role,
      };

      if (mode === Mode.Signup) {
        if (role === Role.Student) {
          payload.fullName = formData.fullName;
          payload.universityName = formData.universityName;
        } else {
          payload.companyName = formData.companyName;
          payload.companyAddress = formData.companyAddress;
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(data.message || "Success!");
        if (mode === Mode.Login && data.token) {
          localStorage.setItem("authToken", data.token);
        }
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error, try again.");
    } finally {
      setLoading(false);
    }
  };

  const title = useMemo(() => {
    const roleText = role === Role.Student ? "Student" : "Company";
    const modeText = mode === Mode.Login ? "Login" : "Sign Up";
    return `${roleText} ${modeText}`;
  }, [role, mode]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-[var(--card-bg)] rounded-2xl shadow-2xl transition-all duration-500">
        <div className="relative flex rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-[var(--primary)] rounded-md shadow-lg transform transition-transform duration-300 ease-in-out
          ${role === Role.Student ? "translate-x-0" : "translate-x-full"}`}
          />
          <button
            type="button"
            onClick={() => handleRoleChange(Role.Student)}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors duration-300 ${
              role === Role.Student
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange(Role.Company)}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors duration-300 ${
              role === Role.Company
                ? "text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            Company
          </button>
        </div>

        <h1 className="text-2xl font-bold text-center">{title}</h1>

        {message && (
          <p className="text-center text-sm text-red-500 animate-fade-in">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            icon={<MailIcon className="w-5 h-5" />}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            icon={<LockIcon className="w-5 h-5" />}
          />

          {mode === Mode.Signup && (
            <div className="transition-all duration-500 space-y-4 pt-4">
              {role === Role.Student ? (
                <>
                  <InputField
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    icon={<UserIcon className="w-5 h-5" />}
                  />
                  <InputField
                    id="universityName"
                    label="University Name"
                    type="text"
                    value={formData.universityName}
                    onChange={handleInputChange}
                    error={errors.universityName}
                    icon={<AcademicCapIcon className="w-5 h-5" />}
                  />
                </>
              ) : (
                <>
                  <InputField
                    id="companyName"
                    label="Company Name"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    error={errors.companyName}
                    icon={<BuildingOfficeIcon className="w-5 h-5" />}
                  />
                  <InputField
                    id="companyAddress"
                    label="Company Address"
                    type="text"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    error={errors.companyAddress}
                    icon={<MapPinIcon className="w-5 h-5" />}
                  />
                </>
              )}

              <InputField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                icon={<LockIcon className="w-5 h-5" />}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-md transition-transform duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === Mode.Login
                ? "Logging in..."
                : "Creating Account..."
              : mode === Mode.Login
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center">
          {mode === Mode.Login
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={handleModeToggle}
            className="ml-1 font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] focus:outline-none"
          >
            {mode === Mode.Login ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default AuthForm;
