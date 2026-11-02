from pathlib import Path
import rjsmin

files = [
    "lang/bg.js",
    "lang/es.js",
    "lang/en.js",
]

for file in files:
    source = Path(file)

    if not source.exists():
        print(f"NO ENCONTRADO: {file}")
        continue

    js = source.read_text(encoding="utf-8")
    minified = rjsmin.jsmin(js)

    output = source.with_name(source.stem + ".min.js")
    output.write_text(minified, encoding="utf-8")

    original_size = source.stat().st_size / 1024
    minified_size = output.stat().st_size / 1024

    print(
        f"{source.name}: {original_size:.1f} KB "
        f"-> {output.name}: {minified_size:.1f} KB"
    )

print("\nProceso terminado.")