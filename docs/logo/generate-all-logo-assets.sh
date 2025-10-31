#!/bin/bash
# AKC Logo Assets Generation Script
# Generates all PNG files and organizes them for exchange submission

set -e  # Exit on error

echo "🚀 AKC Logo Assets Generation Starting..."
echo ""

# Check current location
if [ ! -f "AKC-Logo.svg" ]; then
    echo "❌ Error: AKC-Logo.svg not found!"
    echo "   Please run this script from docs/logo/ directory"
    exit 1
fi

# Check ImageMagick installation
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not installed!"
    echo "   Install with: brew install imagemagick"
    exit 1
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p png
mkdir -p exchanges/lbank
mkdir -p exchanges/coinmarketcap
mkdir -p exchanges/coingecko
mkdir -p social
mkdir -p favicons
mkdir -p banners

# Generate PNG files
echo ""
echo "🎨 Generating PNG files..."

echo "  → Full Logo (1024x1024, 512x512)..."
convert AKC-Logo.svg -resize 1024x1024 png/AKC-Logo-1024.png
convert AKC-Logo.svg -resize 512x512 png/AKC-Logo-512.png

echo "  → Icons (256, 200, 128, 64, 32, 16)..."
convert AKC-Icon.svg -resize 256x256 png/AKC-Icon-256.png
convert AKC-Icon.svg -resize 200x200 png/AKC-Icon-200.png
convert AKC-Icon.svg -resize 128x128 png/AKC-Icon-128.png
convert AKC-Icon.svg -resize 64x64 png/AKC-Icon-64.png
convert AKC-Icon.svg -resize 32x32 png/AKC-Icon-32.png
convert AKC-Icon.svg -resize 16x16 png/AKC-Icon-16.png

# Create exchange packages
echo ""
echo "🏦 Creating exchange packages..."

cp png/AKC-Logo-1024.png exchanges/lbank/
cp png/AKC-Icon-256.png exchanges/lbank/

cat > exchanges/lbank/README.txt << 'EOF'
AKASSECT (AKC) Token Logo Package
===================================

Project: AKASSECT
Symbol: AKC
Network: BNB Smart Chain (BEP-20)
Total Supply: 300,000,000 AKC

Logo Files:
- AKC-Logo-1024.png: Full logo (1024x1024)
- AKC-Icon-256.png: Icon version (256x256)

Colors:
- Background: Black (#000000)
- Primary: Gold (#FFD700)

Contact:
Email: akassectakc@gmail.com
GitHub: github.com/akassectakc-a11y/AKC-COIN

© 2025 AKASSECT LLC. All rights reserved.
EOF

cp png/AKC-Icon-200.png exchanges/coinmarketcap/logo.png
cp png/AKC-Icon-200.png exchanges/coingecko/logo.png

# Create social media images
echo ""
echo "📱 Creating social media images..."

convert AKC-Icon.svg -resize 400x400 social/twitter-profile.png
convert AKC-Logo.svg -resize 512x512 social/telegram-profile.png
convert AKC-Logo.svg -resize 512x512 social/discord-icon.png

# Create favicons
echo ""
echo "🔖 Creating favicons..."

cp png/AKC-Icon-32.png favicons/favicon-32x32.png
cp png/AKC-Icon-16.png favicons/favicon-16x16.png
convert favicons/favicon-32x32.png \
        favicons/favicon-16x16.png \
        favicons/favicon.ico

# Show file sizes
echo ""
echo "📊 File sizes:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
du -h png/*.png | awk '{printf "  %s\n", $0}'

# Complete
echo ""
echo "✅ All logo assets generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  • 8 PNG files in png/"
echo "  • 3 exchange packages"
echo "  • 3 social media images"
echo "  • 3 favicon files"
echo ""
echo "🎯 Next steps:"
echo "  1. Check files: open png/"
echo "  2. Test preview: open logo-preview.html"
echo "  3. Verify sizes: ls -lh png/*.png"
echo "  4. Ready for LBank submission! ✅"
echo ""
