#!/usr/bin/env bash

set -e

echo "=== AI Code Review (Local Diff Mode) ==="

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
AI_DIR="$ROOT_DIR/.ai"

mkdir -p "$AI_DIR"

DIFF_FILE="$AI_DIR/diff.txt"
PROMPT_FILE="$AI_DIR/review_prompt.txt"

echo "Generating local diff against HEAD (staged + unstaged)..."
git diff HEAD > "$DIFF_FILE"

if [ ! -s "$DIFF_FILE" ]; then
  echo "❗ No changes detected. Diff is empty."
  echo "Make sure you have uncommitted changes or staged commits."
  exit 1
fi

echo "Local diff saved to $DIFF_FILE"

if [ ! -f "$ROOT_DIR/AI/Agent.md" ]; then
  echo "❗ Missing Agent.md at AI/Agent.md"
  exit 1
fi

if [ ! -f "$ROOT_DIR/AI/function.md" ]; then
  echo "❗ Missing function.md at AI/function.md"
  exit 1
fi

echo "Building review prompt..."
cat <<EOF > "$PROMPT_FILE"
# AI Code Review Request

Below is the local git diff (not PR diff), combined with Agent.md rules and function.md implementation details.

Use the review rules defined in Agent.md.

---

## Diff
$(cat "$DIFF_FILE")

---

## Agent.md
$(cat "$ROOT_DIR/AI/Agent.md")

---

## function.md
$(cat "$ROOT_DIR/AI/function.md")

EOF

echo "Review prompt generated at $PROMPT_FILE"
echo "=== Ready to copy and send to Codex ==="
