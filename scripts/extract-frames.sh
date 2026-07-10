#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Maman Gâteau — Extraction des frames du hero (canvas image-sequence)
# Usage : ./scripts/extract-frames.sh <video-source> [dossier-sortie]
# Produit : public/frames/desktop/frame_XXX.webp (96 frames, 16:9)
#           public/frames/mobile/frame_XXX.webp  (96 frames, ~9:16 crop centré)
# Requiert : ffmpeg avec support libwebp
# ---------------------------------------------------------------------------
set -euo pipefail

SRC="${1:?Usage: extract-frames.sh <video-source> [out-dir]}"
OUT="${2:-public/frames}"
FRAMES=96

mkdir -p "$OUT/desktop" "$OUT/mobile"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
FPS=$(python3 -c "print($FRAMES/$DUR)")

echo "→ Source: $SRC (durée ${DUR}s) — extraction de $FRAMES frames…"

# Desktop : 16:9, 1600px de large
ffmpeg -y -v error -i "$SRC" -vf "fps=$FPS,scale=1600:900:flags=lanczos" \
  -frames:v $FRAMES -c:v libwebp -quality 62 -start_number 0 \
  "$OUT/desktop/frame_%03d.webp"

# Mobile : crop 9:14 centré (suit le topper puis le gâteau), 780px de large
ffmpeg -y -v error -i "$SRC" -vf "fps=$FPS,crop=ih*(9/14):ih:(iw-ih*(9/14))/2:0,scale=780:1213:flags=lanczos" \
  -frames:v $FRAMES -c:v libwebp -quality 62 -start_number 0 \
  "$OUT/mobile/frame_%03d.webp"

# Posters (première et dernière frame en qualité supérieure, pour LCP/fallback)
ffmpeg -y -v error -i "$SRC" -vf "select=eq(n\,0),scale=1600:900:flags=lanczos" -frames:v 1 "$OUT/poster-first.webp"
ffmpeg -y -v error -sseof -0.1 -i "$SRC" -vf "scale=1600:900:flags=lanczos" -frames:v 1 -update 1 "$OUT/poster-last.webp"

echo "✓ $(ls "$OUT/desktop" | wc -l) frames desktop, $(ls "$OUT/mobile" | wc -l) frames mobile → $OUT"
du -sh "$OUT"
