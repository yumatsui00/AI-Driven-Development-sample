"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthTranslations, SignupInput } from "@/types/auth";

type SignupFormProps = {
  translation: AuthTranslations;
};

/**
 * Signup form with client-side validation and CSV-backed persistence via API.
 */
export default function SignupForm({ translation }: SignupFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SignupInput>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SignupInput, value: string) => {
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error === "email_exists" ? translation.auth.duplicatedEmail : translation.auth.invalidCredentials);
        return;
      }
      router.push("/login");
    } catch (e) {
      setError(translation.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <h1 className="text-2xl font-bold text-ink-900">{translation.auth.signupTitle}</h1>
        <p className="text-sm text-ink-600">{translation.auth.signupSubtitle}</p>
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
            {translation.auth.signupAction}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
