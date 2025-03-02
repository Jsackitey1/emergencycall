// Simple script to create placeholder icons for the PWA
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Try to import canvas, but provide a fallback if it fails
let createCanvas;
try {
  const canvas = await import('canvas');
  createCanvas = canvas.createCanvas;
  console.log('Canvas module loaded successfully');
} catch (error) {
  console.warn('Canvas module not found, using fallback icon generation');
  // Simple fallback that creates empty files
  createCanvas = (width, height) => {
    return {
      getContext: () => ({
        fillStyle: '',
        fillRect: () => {},
        font: '',
        textAlign: '',
        textBaseline: '',
        fillText: () => {}
      }),
      toBuffer: () => Buffer.from([])
    };
  };
}

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZES = [72, 96, 192, 512];
const ICONS_DIR = path.join(__dirname, '../public/icons');

// Create the icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log('Created icons directory');
}

// Create a simple SVG for each icon size
ICON_SIZES.forEach(size => {
  const iconPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
  
  // Skip if the icon already exists
  if (fs.existsSync(iconPath)) {
    console.log(`Icon ${size}x${size} already exists`);
    return; 
  }
  
  try {
    // Create a simple colored square as a placeholder
    const c = createCanvas(size, size);
    const ctx = c.getContext('2d');
    
    // Draw a blue background
    ctx.fillStyle = '#3182CE';
    ctx.fillRect(0, 0, size, size);
    
    // Draw a white "E" for Emergency
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('E', size / 2, size / 2);
    
    // Save as PNG
    const buffer = c.toBuffer('image/png');
    fs.writeFileSync(iconPath, buffer);
    console.log(`Created icon ${size}x${size}`);
  } catch (error) {
    // If canvas fails, create an empty file as a placeholder
    console.warn(`Error creating icon ${size}x${size}: ${error.message}`);
    console.log(`Creating empty placeholder for icon ${size}x${size}`);
    fs.writeFileSync(iconPath, Buffer.from([]));
  }
});

console.log('All icons created successfully!');
