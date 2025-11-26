#!/bin/bash
cd /home/runner/workspace/perpus
rm -f /home/runner/workspace/.git/index.lock 2>/dev/null
rm -f /home/runner/workspace/.git/refs/remotes/origin/main.lock 2>/dev/null
git push https://theolistianto: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@github.com/theolistianto/perpustakaan.git main -v
echo "✅ Push berhasil! Vercel akan auto-trigger build..."
