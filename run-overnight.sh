#!/usr/bin/env bash
# run-overnight.sh — keeps Claude Code building PoshanMitra while you sleep,
# resumes after usage limits, and hard-stops at 06:00.
#
#   chmod +x run-overnight.sh && ./run-overnight.sh
#
# macOS, to stop the machine sleeping:
#   caffeinate -dims ./run-overnight.sh

set -uo pipefail

STOP_HOUR=6                       # hard stop at 06:00 local time
RETRY_WAIT=300                    # 5 min between resume attempts
LOG="overnight-$(date +%Y%m%d-%H%M).log"
PROMPT_FILE="MASTER_PROMPT.md"

deadline=$(date -d "today ${STOP_HOUR}:00" +%s 2>/dev/null \
        || date -j -f "%Y-%m-%d %H:%M" "$(date +%Y-%m-%d) 0${STOP_HOUR}:00" +%s)
now=$(date +%s)
# if it's already past 6am today, the deadline is 6am tomorrow
[ "$now" -ge "$deadline" ] && deadline=$((deadline + 86400))

echo "── PoshanMitra overnight build ──"
echo "started : $(date '+%Y-%m-%d %H:%M:%S')"
echo "stops at: $(date -d "@$deadline" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -r "$deadline" '+%Y-%m-%d %H:%M:%S')"
echo "log     : $LOG"
echo

if [ ! -f "$PROMPT_FILE" ]; then
  echo "!! $PROMPT_FILE not found. Run this from the project folder."
  exit 1
fi

# Pull the fenced prompt block out of MASTER_PROMPT.md
awk '/^```$/{f=!f; next} f' "$PROMPT_FILE" > .overnight-prompt.txt
if [ ! -s .overnight-prompt.txt ]; then
  echo "!! Could not extract the prompt block from $PROMPT_FILE."
  exit 1
fi

remaining() { echo $(( deadline - $(date +%s) )); }

attempt=1
first_run=true

while [ "$(remaining)" -gt 0 ]; do
  left=$(remaining)
  printf '\n[%s] attempt %d · %dh %dm left\n' \
    "$(date '+%H:%M:%S')" "$attempt" $((left/3600)) $(((left%3600)/60)) | tee -a "$LOG"

  if $first_run; then
    timeout "${left}s" claude --dangerously-skip-permissions \
      "$(cat .overnight-prompt.txt)" 2>&1 | tee -a "$LOG"
    first_run=false
  else
    timeout "${left}s" claude --dangerously-skip-permissions --continue \
      "Continue the build. Read PROGRESS.md and DECISIONS.md first, then resume from the next unticked box in BUILD_PLAN.md. Do not restart or re-scaffold. Hard stop at 06:00." \
      2>&1 | tee -a "$LOG"
  fi

  code=$?
  [ "$code" -eq 124 ] && { echo "[$(date '+%H:%M:%S')] 06:00 reached — stopping." | tee -a "$LOG"; break; }

  left=$(remaining)
  [ "$left" -le 0 ] && break

  wait_for=$(( RETRY_WAIT < left ? RETRY_WAIT : left ))
  echo "[$(date '+%H:%M:%S')] session ended (exit $code) — retrying in $((wait_for/60))m" | tee -a "$LOG"
  sleep "$wait_for"
  attempt=$((attempt+1))
done

rm -f .overnight-prompt.txt

echo | tee -a "$LOG"
echo "── stopped at $(date '+%H:%M:%S') ──" | tee -a "$LOG"
git -C . add -A 2>/dev/null && git -C . commit -m "overnight build: automatic checkpoint" 2>/dev/null
echo "Read PROGRESS.md, then DECISIONS.md, then run: npm run dev" | tee -a "$LOG"
