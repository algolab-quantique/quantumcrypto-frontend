#!/bin/bash

# Script to convert image paths between GitHub/VS Code format and Next.js format
# Usage: ./convert-image-paths.sh [github|nextjs]

if [ "$1" = "nextjs" ]; then
    echo "Converting image paths for Next.js..."
    find . -name "*.md" -exec sed -i '' 's|../public/images/|/images/|g' {} +
    echo "✅ Converted to Next.js format (/images/)"
elif [ "$1" = "github" ]; then
    echo "Converting image paths for GitHub/VS Code..."
    find . -name "*.md" -exec sed -i '' 's|/images/|../public/images/|g' {} +
    echo "✅ Converted to GitHub/VS Code format (../public/images/)"
else
    echo "Usage: $0 [github|nextjs]"
    echo "  github  - Convert to ../public/images/ (for GitHub/VS Code)"
    echo "  nextjs  - Convert to /images/ (for Next.js)"
fi
