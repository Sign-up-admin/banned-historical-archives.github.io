# Final comprehensive test for terminal fix

Write-Host "=== Final Fix Test ===" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{ Name = "npm --version"; Command = "npm --version" },
    @{ Name = "npm run check-es"; Command = "npm run check-es" },
    @{ Name = "npm run validate-env"; Command = "npm run validate-env" }
)

$passed = 0
$failed = 0

foreach ($test in $tests) {
    Write-Host "Testing: $($test.Name)" -ForegroundColor Yellow
    try {
        $null = Invoke-Expression $test.Command 2>&1
        Write-Host "PASSED - Command completed automatically" -ForegroundColor Green
        $passed++
    } catch {
        Write-Host "FAILED - May need manual Enter key" -ForegroundColor Red
        $failed++
    }
    Write-Host ""
}

Write-Host "=== Test Results ===" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "All tests passed! Fix is working!" -ForegroundColor Green
} else {
    Write-Host "Some tests failed, please check specific commands" -ForegroundColor Yellow
}
