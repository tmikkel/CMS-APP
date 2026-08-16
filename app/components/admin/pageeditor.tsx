"use client";
import { sectionComponents } from "@/lib/sectionregistry";

import { useState, useRef, useCallback } from "react";
import {
  updateSectionContent,
  addSection,
  moveSection,
} from "@/app/admin/(dashboard)/pages/[id]/actions";
import SectionForm from "@/app/components/admin/sectionform";
import {
  sectionTypeLabels,
  sectionFieldConfig,
  EditableSectionType,
} from "@/lib/sectionregistry";
import {
  HeroData,
  HeroFields,
  TestimonialsData,
  TestimonialsFields,
  CtaData,
  CtaFields,
} from "@/app/types/sections";

type EditableSection = {
  id: string;
  type: EditableSectionType;
  order: number;
  data: Record<string, unknown>;
  fields: Record<string, unknown>;
};

type SaveStatus = "idle" | "pending" | "saved";

const AUTOSAVE_DELAY_MS = 800;

export default function PageEditor({
  pageId,
  initialSections,
}: {
  pageId: string;
  initialSections: EditableSection[];
}) {
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSections[0]?.id ?? null,
  );
  const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const scheduleSave = useCallback(
    (section: EditableSection) => {
      setSaveStatus((prev) => ({ ...prev, [section.id]: "pending" }));

      if (timers.current[section.id]) {
        clearTimeout(timers.current[section.id]);
      }

      timers.current[section.id] = setTimeout(async () => {
        const result = await updateSectionContent(
          section.id,
          pageId,
          section.type,
          section.data,
          section.fields,
        );
        setSaveStatus((prev) => ({
          ...prev,
          [section.id]: result.success ? "saved" : "idle",
        }));
      }, AUTOSAVE_DELAY_MS);
    },
    [pageId],
  );

  const updateSection = (
    id: string,
    updater: (s: EditableSection) => EditableSection,
  ) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.id === id ? updater(s) : s));
      const updated = next.find((s) => s.id === id);
      if (updated) scheduleSave(updated);
      return next;
    });
  };

  const handleAddSection = async (type: EditableSectionType) => {
    const created = await addSection(pageId, type);
    const enFields =
      (created.translations.find((t) => t.locale === "EN")?.fields as Record<
        string,
        unknown
      >) ?? {};

    setSections((prev) => [
      ...prev,
      {
        id: created.id,
        type: created.type as EditableSectionType,
        order: created.order,
        data: created.data as Record<string, unknown>,
        fields: enFields,
      },
    ]);
    setSelectedId(created.id);
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = sections.findIndex((s) => s.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const result = await moveSection(pageId, id, direction);
    if (!result.success) return;

    setSections((prev) => {
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const selectedSection = sections.find((s) => s.id === selectedId);

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-1">
        {sections.map((section, index) => (
          <div
            key={section.id}
            onClick={() => setSelectedId(section.id)}
            className={`relative cursor-pointer rounded-lg border-2 transition-colors ${
              selectedId === section.id
                ? "border-zinc-900"
                : "border-transparent hover:border-zinc-300"
            }`}
          >
            <div className="absolute -top-3 left-3 flex items-center gap-2 z-10">
              <span className="bg-zinc-900 text-white text-xs px-2 py-0.5 rounded">
                {sectionTypeLabels[section.type]}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(section.id, "up");
                }}
                disabled={index === 0}
                className="bg-white border border-zinc-300 rounded px-1.5 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(section.id, "down");
                }}
                disabled={index === sections.length - 1}
                className="bg-white border border-zinc-300 rounded px-1.5 text-xs disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            {(() => {
              const Component = sectionComponents[section.type];
              return Component ? (
                <Component data={section.data} fields={section.fields} />
              ) : null;
            })()}
          </div>
        ))}

        <div className="flex gap-2 pt-4">
          {(Object.keys(sectionTypeLabels) as EditableSectionType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => handleAddSection(type)}
                className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
              >
                + {sectionTypeLabels[type]}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="w-80 shrink-0">
        <div className="sticky top-8 rounded-lg border border-zinc-200 bg-white p-4">
          {selectedSection ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">
                  Edit {sectionTypeLabels[selectedSection.type]}
                </h3>
                <span className="text-xs text-zinc-400">
                  {saveStatus[selectedSection.id] === "pending" && "Saving..."}
                  {saveStatus[selectedSection.id] === "saved" && "Saved"}
                </span>
              </div>

              <SectionForm
                dataConfig={sectionFieldConfig[selectedSection.type].data}
                fieldsConfig={sectionFieldConfig[selectedSection.type].fields}
                data={selectedSection.data}
                fields={selectedSection.fields}
                onDataChange={(data) =>
                  updateSection(selectedSection.id, (s) => ({ ...s, data }))
                }
                onFieldsChange={(fields) =>
                  updateSection(selectedSection.id, (s) => ({ ...s, fields }))
                }
              />
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Select a section to edit it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
