#!/usr/bin/env python3
"""Build src/lib/images.ts from results/*.log (JSON embedded in CLI logs)."""
import json, glob, os, re

RES = "/home/z/my-project/results"
OUT = "/home/z/my-project/src/lib/images.ts"

pools = {}
for f in sorted(glob.glob(os.path.join(RES, "*.log"))):
    key = os.path.basename(f)[:-4]
    if key.startswith("_"):
        continue
    try:
        raw = open(f, encoding="utf-8", errors="ignore").read()
        start = raw.find("{")
        end = raw.rfind("}")
        if start == -1 or end == -1:
            print(f"skip {key}: no JSON")
            continue
        data = json.loads(raw[start : end + 1])
    except Exception as e:
        print(f"skip {key}: {e}")
        continue
    results = data.get("results", [])
    urls = []
    for r in results:
        u = r.get("original_url", "")
        w = int(str(r.get("original_width", "0")).replace("px", "") or 0)
        if not u or u in urls:
            continue
        if w and w < 500:
            continue
        urls.append(u)
    pools[key] = urls

lines = ["// AUTO-GENERATED from web image search — DEEPIER brand assets",
         "// All URLs are OSS-rehosted and publicly embeddable.", ""]
total = 0
for key, urls in pools.items():
    total += len(urls)
    arr = ",\n  ".join(f'"{u}"' for u in urls)
    lines.append(f"export const {key.upper().replace('-', '_')}_IMAGES = [\n  {arr},\n];\n")

with open(OUT, "w") as fh:
    fh.write("\n".join(lines))
print(f"Wrote {OUT} — {total} images total")
for k, v in pools.items():
    print(f"  {k}: {len(v)}")
