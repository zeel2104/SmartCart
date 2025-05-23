import pandas as pd
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Load CSV
csv_path = "WMT_Grocery_202209.csv"
df = pd.read_csv(csv_path, low_memory=False)
df['IMAGE_URL'] = ""

output_csv = "WMT_Grocery_with_images_test.csv"
start_index = 0

if os.path.exists(output_csv):
    df_out = pd.read_csv(output_csv, low_memory=False)
    already_filled = df_out['IMAGE_URL'].notnull()
    start_index = already_filled.sum()
    df['IMAGE_URL'] = df_out['IMAGE_URL']
    print(f"🔁 Resuming from index {start_index}")
else:
    df_out = df.copy()

# Function creates a new driver for each call
def get_image_selenium(url):
    options = Options()
    options.headless = True
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)
        time.sleep(3)
        images = driver.find_elements(By.TAG_NAME, 'img')
        for img in images:
            src = img.get_attribute('src')
            if src and "walmartimages.com" in src:
                return src
        return None
    except Exception as e:
        print(f"❌ Error at {url[:60]}: {e}")
        return None
    finally:
        driver.quit()  # Always close the browser

# Loop through first 10 rows
for idx in range(start_index, min(start_index + 10, len(df))):
    url = df.loc[idx, 'PRODUCT_URL']
    print(f"\n🌐 Visiting {url}")
    image_url = get_image_selenium(url)
    print(f"🖼️  Image URL: {image_url}")
    df.at[idx, 'IMAGE_URL'] = image_url

# Save CSV
try:
    df.to_csv(output_csv, index=False)
    print(f"\n💾 Saved to {output_csv}")
except PermissionError:
    print(f"\n❌ Please close '{output_csv}' in Excel and try again.")

print("\n🎉 Done!")
