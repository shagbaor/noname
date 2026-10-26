import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { getSession } from "@/lib/auth"
import { LoginForm } from "./login-form"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  if (await getSession()) redirect("/admin")
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="animate-rise w-full max-w-[26rem]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-8 shadow-sheet">
          <h1 className="text-display-sm uppercase">Editor sign in</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">For archive editors only.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
