from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = ROOT / "code.txt"

# Priority files that are usually the most important for app behavior.
PRIORITY_FILES = [
    ROOT / "server.js",
    ROOT / "package.json",
    ROOT / "client" / "package.json",
    ROOT / "client" / "src" / "index.js",
    ROOT / "client" / "src" / "App.js",
]

# Source roots to scan for additional important files.
SCAN_DIRS = [
    ROOT / "client" / "src" / "pages",
    ROOT / "client" / "src" / "components",
]

EXCLUDED_DIR_NAMES = {
    "node_modules",
    "build",
    "dist",
    ".git",
    "public",
    "coverage",
    "__pycache__",
}

EXCLUDED_FILE_PARTS = (
    ".test.",
    "setupTests",
    "reportWebVitals",
    ".min.",
)

INCLUDED_SUFFIXES = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
}


def should_include(file_path: Path) -> bool:
    if file_path.suffix not in INCLUDED_SUFFIXES:
        return False

    lowered_name = file_path.name.lower()
    for part in EXCLUDED_FILE_PARTS:
        if part.lower() in lowered_name:
            return False

    for part in file_path.parts:
        if part in EXCLUDED_DIR_NAMES:
            return False

    return file_path.is_file()


def collect_files() -> list[Path]:
    selected: dict[Path, None] = {}

    for path in PRIORITY_FILES:
        if path.exists() and should_include(path):
            selected[path.resolve()] = None

    for base in SCAN_DIRS:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if should_include(path):
                selected[path.resolve()] = None

    return sorted(selected.keys(), key=lambda p: str(p).lower())


def write_output(files: list[Path]) -> None:
    lines: list[str] = []
    lines.append("# IMPORTANT CODE EXPORT")
    lines.append("")
    lines.append(f"Total files: {len(files)}")
    lines.append("")

    for file_path in files:
        rel = file_path.relative_to(ROOT)
        lines.append("=" * 80)
        lines.append(f"FILE: {rel.as_posix()}")
        lines.append("=" * 80)
        lines.append("")
        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            lines.append(f"[ERROR READING FILE: {exc}]")
            lines.append("")
            continue

        lines.append(content.rstrip())
        lines.append("")
        lines.append("")

    OUTPUT_FILE.write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    files_to_export = collect_files()
    write_output(files_to_export)
    print(f"Export complete: {OUTPUT_FILE}")
    print(f"Files exported: {len(files_to_export)}")
