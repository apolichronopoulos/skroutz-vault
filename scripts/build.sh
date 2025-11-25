#!/bin/bash
# Usage: ./scripts/build.sh [version]
# If version is not provided, defaults to 1.0.0

set -e

VERSION="${1:-1.0.0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/build"
ZIP_NAME="skroutz-vault-v${VERSION}.zip"
ZIP_PATH="$PROJECT_ROOT/$ZIP_NAME"

echo "🔨 Building Skroutz Vault v${VERSION}..."

# Clean up previous build
if [ -d "$BUILD_DIR" ]; then
  rm -rf "$BUILD_DIR"
fi
mkdir -p "$BUILD_DIR"

# Copy extension files
echo "📋 Copying extension files..."
cp "$PROJECT_ROOT/manifest.json" "$BUILD_DIR/"
cp "$PROJECT_ROOT/popup.html" "$BUILD_DIR/"
cp "$PROJECT_ROOT/popup.js" "$BUILD_DIR/"
cp "$PROJECT_ROOT/background.js" "$BUILD_DIR/"
cp -r "$PROJECT_ROOT/icons" "$BUILD_DIR/"

# Create ZIP archive
echo "📦 Creating ZIP archive..."
cd "$BUILD_DIR"
rm -f "$ZIP_PATH"
zip -r "$ZIP_PATH" . > /dev/null
cd "$PROJECT_ROOT"

# Clean up build directory
#rm -rf "$BUILD_DIR"

echo "✅ Build complete!"
echo "📁 Output: $ZIP_PATH"
echo "📊 Size: $(du -h "$ZIP_PATH" | cut -f1)"
