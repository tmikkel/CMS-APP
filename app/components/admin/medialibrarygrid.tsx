"use client";

import { useState } from "react";
import Image from "next/image";
import MediaUploadButton from "./mediauploadbutton";
import { deleteMedia } from "@/app/admin/(dashboard)/media/actions";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  width: number | null;
  height: number | null;
};

export default function MediaLibraryGrid({
  initialMedia,
}: {
  initialMedia: MediaItem[];
}) {
  const [media, setMedia] = useState(initialMedia);

  const handleDelete = async (id: string) => {
    const result = await deleteMedia(id);
    if (result.success) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <MediaUploadButton
          onUploaded={(newMedia) =>
            setMedia((prev) => [
              { ...newMedia, width: null, height: null },
              ...prev,
            ])
          }
        />
      </div>

      {media.length === 0 ? (
        <p className="text-sm text-zinc-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg border border-zinc-200 overflow-hidden"
            >
              <div className="aspect-square relative bg-zinc-100 h-100">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 rounded bg-white/90 px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
              <p className="text-xs text-zinc-500 truncate px-2 py-1">
                {item.filename}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
