#!/bin/bash
# force-clone.sh

# Echo commands for debugging
set -x

# Remove any existing submodule directory
rm -rf app/tradingview

# Clone the repo directly using the token
git clone https://raltunel:${GITHUB_TOKEN}@github.com/raltunel/perps-tv.git app/tradingview

# Continue with the normal build process
pnpm run build
