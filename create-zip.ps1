$ErrorActionPreference = "Stop"

$deployDir = "d:\real-estate-site-deploy"
$zipPath = "d:\real-estate-site-deploy.zip"
$sourceDir = "d:\real-estate-site"

# Clean up
if (Test-Path $deployDir) { Remove-Item -Recurse -Force $deployDir }
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

# Create fresh directory
New-Item -ItemType Directory -Path $deployDir | Out-Null

# List of files and directories to copy
$itemsToCopy = @(
    "src",
    "public",
    "supabase",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "next-env.d.ts",
    "postcss.config.mjs",
    "components.json",
    ".eslintrc.json",
    ".gitignore",
    "README.md"
)

Write-Host "Copying files..."
foreach ($item in $itemsToCopy) {
    $sourcePath = Join-Path $sourceDir $item
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $deployDir -Recurse -Force
        Write-Host "Copied $item"
    } else {
        Write-Host "Skipped $item (Not Found)"
    }
}

Write-Host "Zipping contents..."
# Compress-Archive with * creates the zip with the contents at the root
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force

Write-Host "Done! Zip file created at $zipPath"
