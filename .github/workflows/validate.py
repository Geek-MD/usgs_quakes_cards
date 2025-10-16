import json
import os
import re
import sys

HACS_FILE = "hacs.json"
REQUIRED_FIELDS = ["name", "filename", "type"]
VALID_TYPES = ["plugin"]

OPTIONAL_FIELDS = ["country", "domains", "content_in_root", "render_readme"]


def load_hacs_file():
    if not os.path.exists(HACS_FILE):
        print("❌ hacs.json not found")
        sys.exit(1)
    with open(HACS_FILE, encoding="utf-8") as f:
        return json.load(f)


def validate_required_fields(data):
    for field in REQUIRED_FIELDS:
        if field not in data:
            print(f"❌ Required field '{field}' is missing in hacs.json")
            sys.exit(1)
    if data["type"] not in VALID_TYPES:
        print(f"❌ Invalid type: {data['type']}. Must be one of {VALID_TYPES}")
        sys.exit(1)


def validate_filename_exists(data):
    filename = data.get("filename")
    if filename and not os.path.exists(filename):
        print(f"❌ File '{filename}' specified in 'filename' does not exist")
        sys.exit(1)


def validate_resources(data):
    if "resources" in data:
        for resource in data["resources"]:
            if "url" not in resource or "type" not in resource:
                print("❌ Each resource must have 'url' and 'type' keys")
                sys.exit(1)

        filenames_from_resources = [
            os.path.basename(resource["url"]) for resource in data["resources"]
        ]
        if data.get("filename") and data["filename"] not in filenames_from_resources:
            print(
                f"❌ The 'filename' ({data['filename']}) is not listed in resources URLs"
            )
            sys.exit(1)


def validate_custom_element_definition():
    js_files = [f for f in os.listdir(".") if f.endswith(".js")]
    if not js_files:
        print("❌ No JavaScript (.js) files found in root directory")
        sys.exit(1)

    for file in js_files:
        with open(file, encoding="utf-8") as f:
            content = f.read()
            if "customElements.define(" not in content:
                print(f"❌ Missing customElements.define in {file}")
                sys.exit(1)


def validate_js_syntax():
    js_files = [f for f in os.listdir(".") if f.endswith(".js")]
    for file in js_files:
        try:
            with open(file, encoding="utf-8") as f:
                content = f.read()
                if not content.strip():
                    print(f"❌ JavaScript file {file} is empty")
                    sys.exit(1)
                if re.search(r"[^\x00-\x7F]", content):
                    print(f"⚠️ Warning: Non-ASCII characters found in {file}")
        except Exception as e:
            print(f"❌ Failed to read JS file {file}: {e}")
            sys.exit(1)


def validate_optional_fields(data):
    for field in OPTIONAL_FIELDS:
        if field in data:
            if not isinstance(data[field], (str, bool, list)):
                print(f"❌ Optional field '{field}' has invalid type")
                sys.exit(1)


def main():
    print("✅ Starting HACS plugin structure validation...")
    data = load_hacs_file()
    validate_required_fields(data)
    validate_filename_exists(data)
    validate_resources(data)
    validate_optional_fields(data)
    validate_custom_element_definition()
    validate_js_syntax()
    print("✅ All checks passed successfully.")


if __name__ == "__main__":
    main()
