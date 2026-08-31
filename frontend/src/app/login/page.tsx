import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = { title: "Sign in · Smart Todo" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm justRegistered={params.registered === "1"} />;
}
