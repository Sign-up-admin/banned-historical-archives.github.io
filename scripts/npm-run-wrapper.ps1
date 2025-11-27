# npm run wrapper for PowerShell
# Ensures commands always end with newline output

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$ScriptName,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

# Run the npm script
$command = "npm run $ScriptName"
if ($Args.Count -gt 0) {
    $command += " " + ($Args -join " ")
}

# Execute and ensure newline output
Invoke-Expression $command
Write-Output ""

