# Script to identify and kill processes using ports 3000-3010

Write-Host "Searching for processes using ports 3000-3010..."

# Define the ports to check
$ports = 3000..3010

foreach ($port in $ports) {
    $processInfo = netstat -ano | findstr ":$port "
    
    if ($processInfo) {
        Write-Host "Found process using port $port"
        
        $processInfo = $processInfo.Trim()
        
        # Extract PID
        $pidPattern = '\s+(\d+)$'
        if ($processInfo -match $pidPattern) {
            $pid = $Matches[1]
            
            # Get process name
            $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
            
            if ($processName) {
                Write-Host "Port $port is used by process: $processName (PID: $pid)"
                
                # Kill the process
                Write-Host "Attempting to kill process $processName with PID $pid..."
                Stop-Process -Id $pid -Force
                Write-Host "Process terminated."
            } else {
                Write-Host "Could not find process name for PID $pid"
            }
        } else {
            Write-Host "Could not extract PID from: $processInfo"
        }
    } else {
        Write-Host "No process found using port $port"
    }
}

Write-Host "Port cleanup complete." 