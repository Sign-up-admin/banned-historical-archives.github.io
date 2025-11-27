# Comprehensive fix for all package.json scripts
# Fixes the Cursor IDE terminal waiting issue on Windows PowerShell

$packageJsonPath = Join-Path $PSScriptRoot "..\package.json"
$packageJson = Get-Content $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$modified = $false

# Get all scripts
$allScripts = $packageJson.scripts.PSObject.Properties

foreach ($scriptProp in $allScripts) {
    $scriptName = $scriptProp.Name
    $currentScript = $scriptProp.Value
    
    # Skip if already has newline output at the end
    if ($currentScript -match 'Write-Output\s+""\s*$' -or $currentScript -match 'echo\s+""\s*$') {
        continue
    }
    
    # Handle different command types
    $newScript = $currentScript
    
    # Replace && with ; in PowerShell (&& doesn't work in PowerShell)
    # But keep it if it's part of npm run commands (npm handles &&)
    if ($newScript -match 'npm run' -or $newScript -match 'npx') {
        # For npm/npx commands, just add newline at the end
        if ($newScript -notmatch ';\s*Write-Output') {
            $newScript = "$newScript ; Write-Output `"`""
        }
    }
    # For commands ending with &&, add newline after
    elseif ($newScript -match '\s+&&\s+[^&]+$') {
        $newScript = "$newScript ; Write-Output `"`""
    }
    # If command doesn't end with semicolon, add newline
    elseif ($newScript -notmatch ';\s*$') {
        $newScript = "$newScript ; Write-Output `"`""
    }
    # If command ends with semicolon but no newline, add it
    elseif ($newScript -match ';\s*$' -and $newScript -notmatch 'Write-Output') {
        $newScript = "$newScript Write-Output `"`""
    }
    
    if ($newScript -ne $currentScript) {
        $packageJson.scripts.$scriptName = $newScript
        $modified = $true
        Write-Host "Fixed: $scriptName" -ForegroundColor Green
    }
}

if ($modified) {
    # Save with proper formatting
    $jsonContent = $packageJson | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($packageJsonPath, $jsonContent, [System.Text.Encoding]::UTF8)
    Write-Host "`nAll scripts have been fixed!" -ForegroundColor Green
    Write-Host "Please test a command to verify the fix works." -ForegroundColor Cyan
} else {
    Write-Host "`nAll scripts are already correctly configured." -ForegroundColor Green
}

