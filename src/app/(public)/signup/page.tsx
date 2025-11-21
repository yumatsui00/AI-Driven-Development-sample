"use client";

import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";
import { loadTranslation } from "@/utils/i18n";
import { getStoredLang } from "@/utils/lang";

/**
 * Public signup page.
 */
export default function SignupPage() {
  const translation = loadTranslation(getStoredLang("en"));

  return (
    <Suspense>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-ink-50 to-ink-100 px-4 py-10 text-ink-900">
        <div className="w-full max-w-md">
          <SignupForm translation={{ auth: translation.auth }} />
        </div>
      </div>
    </Suspense>
  );
}
