"use client";

import { X } from "lucide-react";

const ROWS = [
  { size: "XS", chest: 34, shoulder: 15.5, length: 26, sleeve: 7.5 },
  { size: "S", chest: 36, shoulder: 16.5, length: 27, sleeve: 7.75 },
  { size: "M", chest: 38, shoulder: 17.5, length: 28, sleeve: 8 },
  { size: "L", chest: 40, shoulder: 18.5, length: 29, sleeve: 8.25 },
  { size: "XL", chest: 42, shoulder: 19.5, length: 30, sleeve: 8.5 },
  { size: "XXL", chest: 44, shoulder: 20.5, length: 31, sleeve: 8.75 },
];

export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Size guide">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto dp-scroll bg-bone p-6 animate-fade-up sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold uppercase">Size Guide</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Garment measurements in inches. Measured flat, tolerance ±0.5&Prime;.</p>
          </div>
          <button aria-label="Close size guide" onClick={onClose} className="p-2 -mr-2 transition-transform hover:rotate-90 duration-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-3 pr-4 font-bold uppercase tracking-wider">Size</th>
                <th className="py-3 pr-4 font-bold uppercase tracking-wider">Chest</th>
                <th className="py-3 pr-4 font-bold uppercase tracking-wider">Shoulder</th>
                <th className="py-3 pr-4 font-bold uppercase tracking-wider">Length</th>
                <th className="py-3 font-bold uppercase tracking-wider">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} className="border-b border-line transition-colors hover:bg-secondary">
                  <td className="py-3 pr-4 font-bold">{r.size}</td>
                  <td className="py-3 pr-4">{r.chest}&Prime;</td>
                  <td className="py-3 pr-4">{r.shoulder}&Prime;</td>
                  <td className="py-3 pr-4">{r.length}&Prime;</td>
                  <td className="py-3">{r.sleeve}&Prime;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 border border-line bg-white p-5">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.16em]">Not sure about your size?</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">
            Measure a garment you already love: lay it flat and measure armpit-to-armpit for chest,
            seam-to-seam across the shoulder, and top-of-collar to hem for length. Match to the chart —
            when between sizes, size up for drape, down for structure.
          </p>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Oversized fits run 4&ndash;6&Prime; roomier than the chart. If you want a regular silhouette in an
            oversized style, take one size down. Still unsure? Chat with us — real humans, real answers.
          </p>
        </div>
      </div>
    </div>
  );
}
