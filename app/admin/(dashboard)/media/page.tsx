import prisma from "@/lib/prisma";
import MediaLibraryGrid from "@/app/components/admin/medialibrarygrid";

export default async function MediaLibraryPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-4xl">
      <h1 className="text-lg font-semibold mb-6">Media Library</h1>
      <MediaLibraryGrid initialMedia={media} />
    </div>
  );
}
