#!/usr/bin/env bash
set -euo pipefail

# Links every skill in this repo into the local skill directories, for working
# on the skills locally. Each entry is a symlink into this checkout, so edits
# and `git pull` take effect without reinstalling.
#   ~/.claude/skills: Claude Code
#   ~/.agents/skills: Codex and other Agent Skills-compatible harnesses

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")

for DEST in "${DESTS[@]}"; do
  mkdir -p "$DEST"
  while IFS= read -r -d '' skill_md; do
    src="$(dirname "$skill_md")"
    name="$(basename "$src")"
    target="$DEST/$name"
    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "skipped $name: $target exists and is not a symlink; move it aside and re-run" >&2
      continue
    fi
    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done < <(find "$REPO/skills" -name SKILL.md -print0)
done
