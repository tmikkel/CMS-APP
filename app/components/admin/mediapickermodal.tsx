"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaUploadButton from "./mediauploadbutton";

type MediaItem = { id: string; url: string; filename: string };

export default function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media/list")
      .then((res) => res.json())
      .then((data) => {
        setMedia(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-150 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Choose an image</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <MediaUploadButton
            onUploaded={(newMedia) => {
              setMedia((prev) => [newMedia, ...prev]);
              onSelect(newMedia.url);
              onClose();
            }}
          />
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : media.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No images yet. Upload one above.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {media.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.url);
                  onClose();
                }}
                className="aspect-square relative rounded-md overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-colors"
              >
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
