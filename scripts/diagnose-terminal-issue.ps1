# Diagnostic script to identify which commands still have the waiting issue

Write-Host "=== Cursor Terminal Issue Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Check package.json scripts
Write-Host "Checking package.json scripts..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$scriptsWithoutNewline = @()
foreach ($scriptProp in $packageJson.scripts.PSObject.Properties) {
    $scriptName = $scriptProp.Name
    $scriptValue = $scriptProp.Value
    
    if ($scriptValue -notmatch 'Write-Output\s+""\s*$' -and $scriptValue -notmatch 'echo\s+""\s*$') {
        $scriptsWithoutNewline += $scriptName
    }
}

if ($scriptsWithoutNewline.Count -gt 0) {
    Write-Host "⚠️  Scripts without newline fix:" -ForegroundColor Red
    $scriptsWithoutNewline | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
} else {
    Write-Host "✅ All scripts have newline fix" -ForegroundColor Green
}

Write-Host ""

# Check .vscode/settings.json
Write-Host "Checking .vscode/settings.json..." -ForegroundColor Yellow
if (Test-Path ".vscode/settings.json") {
    $settings = Get-Content ".vscode/settings.json" -Raw
    if ($settings -match 'terminal.integrated.defaultProfile.windows.*Git Bash') {
        Write-Host "✅ Git Bash is configured (recommended)" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  Using PowerShell (consider switching to Git Bash)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .vscode/settings.json not found" -ForegroundColor Yellow
}

Write-Host ""

# Recommendations
Write-Host "=== Recommendations ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you still experience waiting issues:" -ForegroundColor Yellow
Write-Host "1. Switch to Git Bash in .vscode/settings.json" -ForegroundColor White
Write-Host "2. Restart Cursor completely" -ForegroundColor White
Write-Host "3. Try running commands directly in terminal (not through Cursor's command palette)" -ForegroundColor White
Write-Host "4. Check if specific commands are the issue (e.g., long-running commands)" -ForegroundColor White
Write-Host ""

# Test specific command
Write-Host "=== Quick Test ===" -ForegroundColor Cyan
Write-Host "Running a test command..." -ForegroundColor Yellow
npm --version
Write-Host ""
Write-Host "If the command above completed without waiting, the fix is working!" -ForegroundColor Green
Write-Host "If you had to press Enter, please report which command had the issue." -ForegroundColor Yellow

