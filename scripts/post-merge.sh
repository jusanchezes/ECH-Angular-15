#!/bin/bash
set -e

# Post-merge setup for ECH EHR static prototype.
# This project has no build step or package manager — all dependencies are
# served via CDN or vendored directly into the repo (js/vendor/).
# Script is intentionally a no-op so future merges succeed cleanly.

echo "Post-merge setup complete (static file project — nothing to install)."
