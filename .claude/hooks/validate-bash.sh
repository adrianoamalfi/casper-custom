#!/usr/bin/env bash
# Law II — System Integrity
# Validates every Bash command before execution (PreToolUse hook).
# Receives the command via stdin as JSON: { "tool_input": { "command": "..." } }
# Exit 2 + stderr message blocks execution and surfaces the reason to the user.

set -euo pipefail

INPUT="$(cat)"
COMMAND="$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin)['tool_input']['command'])" 2>/dev/null || echo "")"

# ── Law II.1 — Irreversible operations (require explicit human confirmation) ───
IRREVERSIBLE_PATTERNS=(
  "rm -rf"
  "git push --force"
  "git push -f"
  "git reset --hard"
  "git clean -f"
  "DROP TABLE"
  "DROP DATABASE"
  "truncate"
  "mkfs"
  "> /dev/sd"
  "shutdown"
  "reboot"
)

for pattern in "${IRREVERSIBLE_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiF "$pattern"; then
    echo "BLOCKED [Law II.1]: irreversible operation detected: '$pattern'. Requires explicit user confirmation." >&2
    exit 2
  fi
done

# ── Law I.2 — Perimeter: block access outside the working directory ────────────
if echo "$COMMAND" | grep -qE "(cat|rm|mv|cp|chmod|chown)\s+/etc/|/usr/|/System/|/private/"; then
  echo "BLOCKED [Law I.2]: access outside project perimeter detected." >&2
  exit 2
fi

# ── Law II.4 — Do not bypass hooks or safety checks ───────────────────────────
if echo "$COMMAND" | grep -qE "\-\-no-verify|\-\-no-gpg-sign|--skip-hooks"; then
  echo "BLOCKED [Law II.4]: bypassing safeguards is not permitted without explicit authorization." >&2
  exit 2
fi

exit 0
