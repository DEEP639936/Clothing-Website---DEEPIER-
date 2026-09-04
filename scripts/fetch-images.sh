#!/bin/bash
# DEEPIER asset gathering v2 — throttled to avoid 429
cd /home/z/my-project
mkdir -p results

fetch() { # key query count
  local key="$1" q="$2" c="$3"
  for attempt in 1 2 3; do
    if z-ai image-search -q "$q" --count "$c" --gl us --no-rank -o "results/${key}.json" >> "results/${key}.log" 2>&1; then
      echo "done: $key" >> results/_progress.log
      return 0
    fi
    echo "retry $attempt: $key" >> results/_progress.log
    sleep 20
  done
  echo "FAILED: $key" >> results/_progress.log
}

fetch men-tee "male model wearing black oversized t-shirt streetwear studio editorial photography" 10 &
sleep 12
fetch women-tee "female model wearing oversized t-shirt minimal fashion editorial studio photography" 10 &
wait
sleep 8
fetch men-hoodie "man wearing hoodie streetwear fashion editorial photography" 8 &
sleep 12
fetch women-hoodie "woman wearing hoodie sweatshirt fashion editorial photography" 8 &
wait
sleep 8
fetch embroidery "embroidery close up thread stitches on fabric macro photography" 10 &
sleep 12
fetch atelier "tailor hands embroidery sewing atelier workshop craftsmanship photography" 8 &
wait
sleep 8
fetch men-shirt "man wearing casual overshirt shirt fashion editorial studio photography" 8 &
sleep 12
fetch women-shirt "woman wearing linen shirt minimal fashion editorial photography" 8 &
wait
sleep 8
fetch men-jacket "man wearing bomber jacket street style fashion editorial photography" 8 &
sleep 12
fetch women-jacket "woman wearing jacket street style fashion editorial photography" 8 &
wait
sleep 8
fetch hero "fashion editorial model full body dramatic studio lighting monochrome photography" 10 &
sleep 12
fetch lifestyle "street style fashion person walking city editorial photography" 10 &
wait
sleep 8
fetch sweatshirt "model wearing crewneck sweatshirt minimal fashion editorial photography" 8 &
sleep 12
fetch fabric "fabric texture cotton linen close up neutral tones photography" 8 &
wait
echo "ALL DONE" >> results/_progress.log
