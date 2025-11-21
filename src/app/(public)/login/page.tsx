import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { loadTranslation } from "@/utils/i18n";

/**
 * Public login page.
 */
export default function LoginPage() {
  const translation = loadTranslation("en");

  return (
    <Suspense>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-ink-50 to-ink-100 px-4 py-10 text-ink-900">
        <div className="w-full max-w-md">
          <LoginForm translation={{ auth: translation.auth }} />
        </div>
      </div>
    </Suspense>
  );
}
