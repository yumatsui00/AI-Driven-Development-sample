"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/session";

type RequireAuthProps = {
  children: React.ReactNode;
};

/**
 * Client-side guard for authenticated routes.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.login !== true) {
      router.replace("/");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}
