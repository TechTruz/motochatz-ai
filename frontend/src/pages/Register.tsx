import { RegisterForm } from "@/components/RegisterForm";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Register() {
  useDocumentTitle("Register");
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
