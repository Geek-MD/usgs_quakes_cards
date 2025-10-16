import os
import json
import sys
from pathlib import Path
from jsonschema import validate, ValidationError

# Define the allowed schema for hacs.json
HACS_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "description": {"type": "string"},
        "type": {"type": "string", "enum": ["plugin"]},
        "content_in_root": {"type": "boolean"},
        "file": {"type": "string"},
        "filename": {"type": "string"},
        "render_readme": {"type": "boolean"},
        "country": {"type": "string"},
        "domains": {"type": "array", "items": {"type": "string"}},
        "resources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "url": {"type": "string"},
                    "type": {"type": "string", "enum": ["module"]}
                },
                "required": ["url", "type"]
            }
        }
    },
    "required": ["name", "description", "type", "file"],
    "additionalProperties": False
}

def validate_hacs_json(path: Path) -> bool:
    if not path.exists():
        print("❌ hacs.json not found")
        return False

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return False

    try:
        validate(instance=data, schema=HACS_SCHEMA)
    except ValidationError as e:
        print(f"❌ Schema validation error: {e.message}")
        return False

    print("✅ hacs.json schema is valid")
    return True

def validate_files(data: dict, base_dir: Path):
    ok = True

    file_path = base_dir / data.get("file", "")
    if not file_path.exists():
        print(f"❌ File '{file_path}' not found")
        ok = False
    else:
        print(f"✅ Found file: {file_path}")

    for resource in data.get("resources", []):
        resource_path = Path(resource["url"].split("/")[-1])
        if not (base_dir / resource_path).exists():
            print(f"❌ Resource file '{resource_path}' not found in repo")
            ok = False
        else:
            print(f"✅ Found resource: {resource_path}")

    return ok

def main():
    base_dir = Path(__file__).parent.resolve()
    hacs_path = base_dir / "hacs.json"

    if not validate_hacs_json(hacs_path):
        sys.exit(1)

    data = json.loads(hacs_path.read_text(encoding="utf-8"))
    if not validate_files(data, base_dir):
        sys.exit(1)

    print("\n✅ All validations passed!")

if __name__ == "__main__":
    main()
