export enum Role {
  Student = "student",
  Company = "company",
}

export enum Mode {
  Login = "login",
  Signup = "signup",
}

export interface FormData {
  fullName: string;
  universityName: string;
  companyName: string;

  companyAddress: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;
