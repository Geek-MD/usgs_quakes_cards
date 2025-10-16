import os
import sys
import json

# Define path to the root of the repository
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
HACS_FILE = os.path.join(REPO_ROOT, "hacs.json")

# Required keys for hacs.json
REQUIRED_KEYS = ["name", "description", "type", "file", "render_readme"]

def load_hacs_json(path):
    if not os.path.exists(path):
        print("❌ hacs.json not found at root directory.")
        sys.exit(1)
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Failed to load hacs.json: {e}")
        sys.exit(1)

def validate_keys(hacs_data):
    missing = [key for key in REQUIRED_KEYS if key not in hacs_data]
    if missing:
        print(f"❌ Missing required keys in hacs.json: {', '.join(missing)}")
        sys.exit(1)

def validate_resources(hacs_data):
    resources = hacs_data.get("resources", [])
    if not isinstance(resources, list):
        print("❌ 'resources' must be a list in hacs.json")
        sys.exit(1)

    all_ok = True
    for res in resources:
        url = res.get("url")
        if not url:
            print("❌ Resource entry missing 'url'")
            all_ok = False
        if not url.endswith(".js"):
            print(f"❌ Resource URL does not end with .js: {url}")
            all_ok = False
    if not all_ok:
        sys.exit(1)

def validate_files(hacs_data):
    """Validate local existence of the JS file referenced by `file` and resources (if local)."""
    js_file = hacs_data.get("file")
    if js_file:
        file_path = os.path.join(REPO_ROOT, js_file)
        if not os.path.exists(file_path):
            print(f"❌ JS file specified in 'file' not found: {js_file}")
            sys.exit(1)

    resources = hacs_data.get("resources", [])
    for res in resources:
        url = res.get("url")
        if url and not url.startswith("http"):
            local_path = os.path.join(REPO_ROOT, url)
            if not os.path.exists(local_path):
                print(f"❌ JS file specified in 'resources' not found: {url}")
                sys.exit(1)

def main():
    print("📄 Validating hacs.json structure...")
    hacs_data = load_hacs_json(HACS_FILE)
    validate_keys(hacs_data)
    validate_resources(hacs_data)
    validate_files(hacs_data)
    print("✅ hacs.json validation passed.")

if __name__ == "__main__":
    main()
