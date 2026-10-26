import Link from "next/link"
import { LogoMark } from "@/components/logo"
import { requireAdmin } from "@/lib/auth"
import { logout } from "../actions"

export const dynamic = "force-dynamic"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-outline-variant/60 bg-surface/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark className="size-7" />
            <span className="font-display text-[22px] uppercase">Editor</span>
          </Link>
          <nav className="flex flex-1 items-center gap-5 text-label-lg uppercase text-on-surface-variant">
            <Link href="/admin" className="hover:text-on-surface">Posts</Link>
            <Link href="/admin/posts/new" className="hover:text-on-surface">New</Link>
            <Link href="/admin/account" className="hidden hover:text-on-surface sm:inline">Account</Link>
          </nav>
          <Link href="/" className="hidden text-label-md uppercase text-outline hover:text-on-surface md:inline">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" title={session.email} className="rounded-full border border-outline-variant px-4 py-2 text-label-md uppercase hover:border-outline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="shell py-10">{children}</div>
    </>
  )
}
