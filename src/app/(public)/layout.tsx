import RedirectIfLoggedIn from "@/components/auth/RedirectIfLoggedIn";

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <RedirectIfLoggedIn>{children}</RedirectIfLoggedIn>;
}
