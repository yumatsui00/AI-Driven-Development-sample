"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthTranslations, LoginInput } from "@/types/auth";

type LoginFormProps = {
  translation: AuthTranslations;
};

/**
 * Login form with client-side validation and CSV-backed credential check via API.
 */
export default function LoginForm({ translation }: LoginFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError(translation.auth.invalidCredentials);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(translation.auth.invalidCredentials);
        return;
      }
      localStorage.setItem(
        "session",
        JSON.stringify({ login: true, userId: data.user.id, email: data.user.email })
      );
      router.push("/dashboard");
    } catch (e) {
      setError(translation.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <h1 className="text-2xl font-bold text-ink-900">{translation.auth.loginTitle}</h1>
        <p className="text-sm text-ink-600">{translation.auth.loginSubtitle}</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{translation.auth.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{translation.auth.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {translation.auth.loginAction}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
