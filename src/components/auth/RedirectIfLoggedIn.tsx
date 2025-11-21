"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/session";

type RedirectIfLoggedInProps = {
  children: React.ReactNode;
};

/**
 * Redirects logged-in users away from public routes.
 */
export default function RedirectIfLoggedIn({ children }: RedirectIfLoggedInProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.login) {
      router.replace("/home");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
