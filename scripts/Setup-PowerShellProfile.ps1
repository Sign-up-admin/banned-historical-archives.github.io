# Setup PowerShell profile to fix Cursor terminal detection
# This adds a function that ensures all commands end with newline

$profilePath = $PROFILE.CurrentUserAllHosts

# Create profile directory if it doesn't exist
$profileDir = Split-Path $profilePath -Parent
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

# Check if fix already exists
$profileContent = ""
if (Test-Path $profilePath) {
    $profileContent = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue
}

$fixCode = @"

# Cursor IDE Terminal Fix - Auto newline output
# This ensures commands always end with newline to fix terminal detection
function Invoke-CommandWithNewline {
    param([string]$Command)
    Invoke-Expression $Command
    Write-Output ""
}

# Override common commands to auto-add newline
function npm {
    $result = & (Get-Command npm -CommandType Application) $args
    Write-Output ""
    return $result
}

"@

if ($profileContent -notmatch "Cursor IDE Terminal Fix") {
    Add-Content -Path $profilePath -Value $fixCode -Encoding UTF8
    Write-Host "PowerShell profile has been updated!" -ForegroundColor Green
    Write-Host "Profile location: $profilePath" -ForegroundColor Cyan
    Write-Host "Please restart your terminal or run: . `$PROFILE" -ForegroundColor Yellow
} else {
    Write-Host "PowerShell profile already contains the fix." -ForegroundColor Yellow
}

