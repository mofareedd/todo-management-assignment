import { Metadata } from "next";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
