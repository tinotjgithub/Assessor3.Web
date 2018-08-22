## Script to configure Hello World

Import-Module WebAdministration

#reseting IIS
#invoke-command -scriptblock {iisreset}

# Checks if the site is already installed and if it does then removes all the web applications
# from under it and then deletes the files.
$site = Get-Item ("IIS:\Sites\" + $VARIISWebsiteName) -EA 0
If ($site -ne $null -and $site.Name -eq $VARIISWebsiteName)
{

	#set maintenece page
	Set-ItemProperty IIS:\Sites\$VARIISWebsiteName -name physicalPath -value "C:\inetpub\offline"

	if((get-WebAppPoolState -name (Get-Item "IIS:\Sites\$VARIISWebsiteName"| Select-Object applicationPool).applicationPool).Value  -eq "Started"){
#start application pool
	Stop-WebAppPool (Get-Item "IIS:\Sites\$VARIISWebsiteName"| Select-Object applicationPool).applicationPool
    Write-Host "App Pool Stopped"
    }
    
    Start-Sleep -s 2
    if((Get-Item "IIS:\Sites\$VARIISWebsiteName").State -eq "Started"){
    # Stop website
	Stop-WebSite $VARIISWebsiteName
	Write-Host "Web Site Stopped"
    }

    #create the folder for backup the existing files
    $backupLocation = New-Item -Path $VARBackupLocation -ItemType Directory -Name ($VARIISWebsiteName+"_$(Get-Date -f dd_MM_yyyy_HHmmss)")

    # copy the contents to the backup folder
    Get-ChildItem -Path "$OctopusPackageDirectoryPath" | % {
      Copy-Item $_.fullname $backupLocation -Recurse -Force
    }

	#Remove-Item "$OctopusPackageDirectoryPath\*" -recurse -exclude @("*.Gateway.*","*.TestAutomation.*")
    get-childitem "$OctopusPackageDirectoryPath\" -Exclude @("*.Gateway.*","*.TestAutomation.*") | remove-item -Recurse -ErrorAction SilentlyContinue -Force
}