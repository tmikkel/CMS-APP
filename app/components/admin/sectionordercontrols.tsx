"use client";

import { useTransition } from "react";
import { moveSection } from "@/app/admin/(dashboard)/pages/[id]/actions";

export default function SectionOrderControls({
  pageId,
  sectionId,
  isFirst,
  isLast,
}: {
  pageId: string;
  sectionId: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleMove = (direction: "up" | "down") => {
    startTransition(async () => {
      await moveSection(pageId, sectionId, direction);
    });
  };

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => handleMove("up")}
        disabled={isFirst || isPending}
        className="rounded border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Move section up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => handleMove("down")}
        disabled={isLast || isPending}
        className="rounded border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Move section down"
      >
        ↓
      </button>
    </div>
  );
}
