import { Metadata } from "next";
import { SignupForm } from "../_components/signup-form";

export const metadata: Metadata = {
  title: "Signup",
};
export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <SignupForm />
    </div>
  );
}
