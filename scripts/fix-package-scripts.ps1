# Fix package.json scripts by adding newline output at the end
# This solves Cursor IDE terminal detection issues on Windows PowerShell

$packageJsonPath = Join-Path $PSScriptRoot "..\package.json"
$packageJson = Get-Content $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$modified = $false

# List of scripts that need fixing
$scriptsToFix = @(
    "dev",
    "build",
    "build-article-json",
    "build-indexes",
    "build-txt",
    "init-es",
    "reset-es",
    "check-es",
    "lint",
    "lint:fix",
    "type-check",
    "test",
    "test:coverage"
)

foreach ($scriptName in $scriptsToFix) {
    if ($packageJson.scripts.PSObject.Properties.Name -contains $scriptName) {
        $currentScript = $packageJson.scripts.$scriptName
        
        # Check if already contains newline output
        if ($currentScript -notmatch 'Write-Output\s+""' -and $currentScript -notmatch 'echo\s+""') {
            # Add newline output at the end of command
            $packageJson.scripts.$scriptName = "$currentScript ; Write-Output `"`""
            $modified = $true
            Write-Host "Fixed script: $scriptName" -ForegroundColor Green
        } else {
            Write-Host "Script already has newline: $scriptName" -ForegroundColor Yellow
        }
    }
}

if ($modified) {
    # Save modified package.json
    $jsonContent = $packageJson | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($packageJsonPath, $jsonContent, [System.Text.Encoding]::UTF8)
    Write-Host "`npackage.json has been updated!" -ForegroundColor Green
    Write-Host "You may need to run: npm install" -ForegroundColor Cyan
} else {
    Write-Host "`nAll scripts are already correctly configured." -ForegroundColor Green
}
