
from PIL import Image
import os

try:
    img_path = 'c:/Users/SKYNET/Desktop/K3 Boys/SkyDream/K3 Dev Projects/fairhire/apps/web/static/favicon.png'
    img = Image.open(img_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Find the bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Crop to the content
        cropped = img.crop(bbox)
        
        # Determine the size of the square canvas
        width, height = cropped.size
        new_size = max(width, height)
        
        # Create a new square transparent image
        new_img = Image.new('RGBA', (new_size, new_size), (0, 0, 0, 0))
        
        # Paste the cropped image centered
        paste_x = (new_size - width) // 2
        paste_y = (new_size - height) // 2
        new_img.paste(cropped, (paste_x, paste_y))
        
        # Save back to the original path
        new_img.save(img_path)
        print(f"Successfully cropped and resized favicon.png. New size: {new_size}x{new_size}")
    else:
        print("Image is completely transparent, cannot crop.")

except Exception as e:
    print(f"Error processing image: {e}")
