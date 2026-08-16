"use client";

import { useState } from "react";
import Image from "next/image";
import { FieldConfig, FieldWidget } from "@/lib/sectionregistry";
import MediaPickerModal from "@/app/components/admin/mediapickermodal";

function Widget({
  widget,
  value,
  onChange,
}: {
  widget: FieldWidget;
  value: string;
  onChange: (value: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (widget === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
    );
  }

  if (widget === "image") {
    return (
      <div>
        {value && (
          <div className="relative w-full aspect-video mb-2 rounded-md overflow-hidden border border-zinc-200 bg-zinc-100">
            <Image src={value} alt="" fill className="object-cover" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
        >
          {value ? "Change image" : "Choose image"}
        </button>
        {pickerOpen && (
          <MediaPickerModal
            onSelect={(url) => onChange(url)}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
    />
  );
}

export default function SectionForm({
  dataConfig,
  fieldsConfig,
  data,
  fields,
  onDataChange,
  onFieldsChange,
}: {
  dataConfig: FieldConfig[];
  fieldsConfig: FieldConfig[];
  data: Record<string, unknown>;
  fields: Record<string, unknown>;
  onDataChange: (data: Record<string, unknown>) => void;
  onFieldsChange: (fields: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      {fieldsConfig.map((config) => (
        <div key={config.key}>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            {config.label}
          </label>
          <Widget
            widget={config.widget}
            value={(fields[config.key] as string) ?? ""}
            onChange={(value) =>
              onFieldsChange({ ...fields, [config.key]: value })
            }
          />
        </div>
      ))}
      {dataConfig.map((config) => (
        <div key={config.key}>
          <label className="block text-xs font-medium text-zinc-500 mb-1">
            {config.label}
          </label>
          <Widget
            widget={config.widget}
            value={(data[config.key] as string) ?? ""}
            onChange={(value) => onDataChange({ ...data, [config.key]: value })}
          />
        </div>
      ))}
    </div>
  );
}
