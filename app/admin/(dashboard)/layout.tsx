import Link from "next/link";
import SignOutButton from "@/app/components/admin/signoutbutton";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-zinc-50 text-zinc-900">
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-zinc-200">
          <span className="font-semibold text-sm tracking-tight">
            CMS Admin
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-zinc-200">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
