#!/bin/bash
set -e

echo "=== AI Code Review Execution Start ==="

# Create workspace
mkdir -p .ai

echo "Downloading latest PR diff artifact..."
gh run download --name pr-diff --dir .ai || {
  echo "Failed to download diff artifact."
  exit 1
}

DIFF_FILE=".ai/pr-diff/diff.txt"
AGENT_FILE="AI/Agent.md"
FUNCTION_FILE="AI/function.md"

if [ ! -f "$DIFF_FILE" ]; then
  echo "Error: diff file not found at $DIFF_FILE"
  exit 1
fi

if [ ! -f "$AGENT_FILE" ]; then
  echo "Error: Agent.md not found at $AGENT_FILE"
  exit 1
fi

if [ ! -f "$FUNCTION_FILE" ]; then
  echo "Error: function.md not found at $FUNCTION_FILE"
  exit 1
fi

echo "All required files found."

echo ""
echo "=== Review Inputs Preview ==="
echo "--- Agent.md ---"
sed -n '1,40p' "$AGENT_FILE"
echo ""
echo "--- function.md ---"
sed -n '1,40p' "$FUNCTION_FILE"
echo ""
echo "--- DIFF (first 60 lines) ---"
sed -n '1,60p' "$DIFF_FILE"

echo ""
echo "=== Preparing Review Payload ==="

cat > .ai/review_prompt.txt <<EOF
You are Codex performing a formal AI-driven code review.

Follow strictly the review rules defined in Agent.md.

## Inputs:
- Agent.md rules
- function.md (branch specification)
- diff.txt (PR diff)

## Required Review Criteria:
1. Specification consistency
2. Security concerns
3. TypeScript type safety
4. Error-handling correctness
5. CSV / I/O behavior validation
6. Maintainability and readability
7. Missing test cases

## Prohibited:
- Do NOT output code modifications
- Do NOT fix issues directly
- Only point out issues, inconsistencies, risks, or missing tests

--- Agent.md ---
$(cat "$AGENT_FILE")

--- function.md ---
$(cat "$FUNCTION_FILE")

--- DIFF ---
$(cat "$DIFF_FILE")
EOF

echo "Review prompt generated at .ai/review_prompt.txt"

echo ""
echo "=== Ready to Send to Codex ==="
echo "Open Codex and paste the content of:"
echo "  .ai/review_prompt.txt"
echo ""
echo "=== AI Code Review Preparation Completed ==="
