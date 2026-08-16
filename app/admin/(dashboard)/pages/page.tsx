import Link from "next/link";
import prisma from "@/lib/prisma";
import { createPage } from "./actions";

export default async function PagesListPage() {
  const pages = await prisma.page.findMany({
    include: { translations: { where: { locale: "EN" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Pages</h1>
      </div>

      <form action={createPage} className="flex gap-2 mb-8">
        <input
          name="title"
          placeholder="Page title"
          required
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          name="slug"
          placeholder="slug"
          required
          className="w-40 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          Create page
        </button>
      </form>

      {pages.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No pages yet. Create your first one above.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-zinc-200">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Slug</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-zinc-100">
                <td className="py-3">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="text-zinc-900 hover:underline font-medium"
                  >
                    {page.translations[0]?.title ?? "—"}
                  </Link>
                </td>
                <td className="py-3 text-zinc-500">/{page.slug}</td>
                <td className="py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      page.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="py-3 text-zinc-500">
                  {page.updatedAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
