
from PIL import Image
import os

def check_image(path):
    try:
        if not os.path.exists(path):
            print(f"{path} does not exist")
            return

        img = Image.open(path)
        print(f"Checking {path}:")
        print(f"  Format: {img.format}")
        print(f"  Size: {img.size}")
        print(f"  Mode: {img.mode}")
        bbox = img.getbbox()
        if bbox:
            print(f"  Content BBox: {bbox}")
            # Calculate fill percentage?
            width, height = img.size
            content_width = bbox[2] - bbox[0]
            content_height = bbox[3] - bbox[1]
            print(f"  Content Size: {content_width}x{content_height}")
            
            if content_width < width * 0.8 or content_height < height * 0.8:
                print("  -> Has significant padding")
        else:
            print("  -> Empty/Transparent")
    except Exception as e:
        print(f"Error: {e}")

check_image('c:/Users/SKYNET/Desktop/K3 Boys/SkyDream/K3 Dev Projects/fairhire/apps/web/static/logo.png')
check_image('c:/Users/SKYNET/Desktop/K3 Boys/SkyDream/K3 Dev Projects/fairhire/apps/web/static/favicon.png')
