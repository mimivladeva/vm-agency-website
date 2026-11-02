
from pathlib import Path
import csscompressor

files = [
    "css/base/variables.css",
    "css/base/global.css",
    "css/base/typography.css",
    "css/base/components.css",
    "css/sections/method.css",
    "css/sections/contact.css",
    "css/layout/header.css",
    "css/layout/footer.css",
    "css/sections/about.css",
    "css/sections/hero.css",
    "css/sections/solutions.css",
]

for file in files:
    source = Path(file)

    if not source.exists():
        print(f"NO ENCONTRADO: {file}")
        continue

    css = source.read_text(encoding="utf-8")
    minified = csscompressor.compress(css)

    output = source.with_name(source.stem + ".min.css")
    output.write_text(minified, encoding="utf-8")

    original_size = source.stat().st_size / 1024
    minified_size = output.stat().st_size / 1024

    print(
        f"{source.name}: {original_size:.1f} KB "
        f"-> {output.name}: {minified_size:.1f} KB"
    )

print("\nProceso terminado.")
