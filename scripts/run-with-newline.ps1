# PowerShell 包装脚本 - 确保命令输出以换行符结束
# 用于解决 Cursor IDE 在 Windows PowerShell 上的终端检测问题

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Command
)

# 执行命令
Invoke-Expression $Command

# 确保输出以换行符结束
Write-Output ""

