#!/bin/bash

echo "🚀 VentCleaners - Next.js Deployment Script"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the VentCleaners directory?"
    exit 1
fi

# Check if Next.js config exists
if [ ! -f "next.config.ts" ]; then
    echo "❌ Error: next.config.ts not found. This doesn't look like a Next.js project."
    exit 1
fi

echo "✓ Found Next.js project files"
echo ""

# Build locally first to check for errors
echo "📦 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo ""
echo "✓ Build successful!"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "1) Preview deployment (recommended first)"
echo "2) Production deployment"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Deploying preview..."
        vercel
        ;;
    2)
        echo "Deploying to production..."
        vercel --prod
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Click the deployment URL to verify the new Next.js site loads"
echo "2. Test the form submission"
echo "3. Check that both A/B test variants work (clear localStorage to test)"
echo "4. If everything works, promote to production (if you did preview)"
