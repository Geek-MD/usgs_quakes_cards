import json
import os
import sys
import re

HACS_FILE = "hacs.json"

REQUIRED_FIELDS = ["name", "description", "file", "type"]
OPTIONAL_FIELDS = ["render_readme", "country", "domains", "content_in_root", "resources"]
VALID_TYPES = ["plugin"]
JS_COMPONENT_REGEX = r"customElements\.define\s*\(\s*['\"]([\w\-]+)['\"]"

def error(msg):
    print(f"❌ {msg}")
    sys.exit(1)

def warn(msg):
    print(f"⚠️ {msg}")

def success(msg):
    print(f"✅ {msg}")

def validate_json_schema(data):
    for field in REQUIRED_FIELDS:
        if field not in data:
            error(f"Missing required field: '{field}'")

    if data["type"] not in VALID_TYPES:
        error(f"Invalid type: '{data['type']}' (must be one of: {VALID_TYPES})")

    if "resources" in data:
        if not isinstance(data["resources"], list):
            error("The 'resources' field must be a list")
        for res in data["resources"]:
            if not isinstance(res, dict) or "url" not in res or "type" not in res:
                error("Each resource must be an object with 'url' and 'type' fields")

    for opt in OPTIONAL_FIELDS:
        if opt in data:
            success(f"Found optional field: '{opt}'")

def validate_js_file(path):
    if not os.path.isfile(path):
        error(f"JS file not found: {path}")

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        error(f"Failed to read JS file {path}: {e}")

    # Check for customElements.define(...)
    if not re.search(JS_COMPONENT_REGEX, content):
        error(f"{path} is missing 'customElements.define(...)'")

    # Simple JS syntax check (balanced braces and parentheses)
    braces, brackets, parens = 0, 0, 0
    for char in content:
        if char == '{': braces += 1
        if char == '}': braces -= 1
        if char == '(': parens += 1
        if char == ')': parens -= 1
        if char == '[': brackets += 1
        if char == ']': brackets -= 1
    if braces != 0 or brackets != 0 or parens != 0:
        error(f"Unbalanced brackets/braces/parentheses in {path}")

    success(f"JS file {path} passed all checks")

def validate_file_field_consistency(data):
    file_name = data["file"]
    js_path = os.path.join(".", file_name)
    validate_js_file(js_path)

    # Check if the file is listed in resources
    if "resources" in data:
        matched = False
        for res in data["resources"]:
            if file_name in res["url"]:
                matched = True
                break
        if not matched:
            warn(f"'file' ({file_name}) is not referenced in any 'resources.url'")

def main():
    if not os.path.isfile(HACS_FILE):
        error(f"{HACS_FILE} not found in current directory")

    try:
        with open(HACS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        error(f"Invalid JSON in {HACS_FILE}: {e}")

    success(f"Loaded {HACS_FILE}")
    validate_json_schema(data)
    validate_file_field_consistency(data)

    # Validate all listed resources
    if "resources" in data:
        for res in data["resources"]:
            js_filename = os.path.basename(res["url"].split("/")[-1])
            validate_js_file(js_filename)

    success("🎉 All validations passed!")

if __name__ == "__main__":
    main()
