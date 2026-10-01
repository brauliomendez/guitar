#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
source_dir="$repo_dir/entre-cuerdas/dist"
site_dir=/var/www/guitar

if [[ ! -f "$source_dir/index.html" ]]; then
  echo "No se encuentra $source_dir/index.html" >&2
  exit 1
fi

install -d -m 0755 "$site_dir"
rsync -r --delete --chmod=D755,F644 "$source_dir/" "$site_dir/"
echo "Sitio publicado en $site_dir"
