const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');
const REQUIRED_SIZES = [72, 96, 192, 512];

// Create the icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  console.log('Creating icons directory...');
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Check if icons exist, create placeholders if they don't
REQUIRED_SIZES.forEach(size => {
  const iconPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
  
  if (!fs.existsSync(iconPath)) {
    console.log(`Creating placeholder icon for ${size}x${size}...`);
    
    // Copy the vite.svg as a placeholder if it exists
    const viteSvgPath = path.join(__dirname, '../public/vite.svg');
    if (fs.existsSync(viteSvgPath)) {
      fs.copyFileSync(viteSvgPath, iconPath);
    } else {
      // Create an empty file if vite.svg doesn't exist
      fs.writeFileSync(iconPath, '');
    }
  }
});

console.log('Placeholder icons created successfully!');
