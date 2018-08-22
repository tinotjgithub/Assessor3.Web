## Script to configure FrontEnd

Import-Module WebAdministration

# Checking that the site is not already in IIS
$site = Get-Item ("IIS:\Sites\" + $VARIISWebsiteName) -EA 0
if($site -eq $null)
{
    # Set the site to require an SSL connection
    Set-WebConfiguration -Location "$VARIISWebsiteName" -Filter 'system.webserver/security/access' -Value "Ssl"
}

if( !((Get-WebConfiguration //staticcontent).collection | ? {$_.fileextension -eq '.woff2'}) ) {
  Add-WebConfigurationProperty //staticContent -name collection -value @{fileExtension='.woff2'; mimeType='application/font-woff2'}
}

Set-ItemProperty IIS:\AppPools\$VARAppPool managedPipelineMode 0
$NewPool = Get-Item IIS:\AppPools\$VARAppPool
$NewPool.processModel.identityType = 3
$NewPool.processModel.loadUserProfile=1   # Sets load User Profile to true
$NewPool.autoStart = 'true'
$NewPool.startmode = 'alwaysrunning'
$NewPool.processModel.idleTimeout = [TimeSpan]::FromMinutes(0)
$NewPool | Set-Item

# Setting under Web Site

Set-ItemProperty IIS:\Sites\$VARIISWebsiteName -name applicationDefaults.preloadEnabled -value "true"
Set-ItemProperty IIS:\Sites\$VARIISWebsiteName -name serverAutoStart  -value "true"

$scriptDir = Split-Path $MyInvocation.MyCommand.Path
$bundleConfig = $scriptDir + "\build\generated\config.*.js"
#sample url "http://rm-nextgen-wo-poc-gateway.cloudapp.net/"
$serviceBase = "https://$VARIISWebsiteName/"
$serviceAIBase = "https://$VARIISAIWebsiteName"
$AIInstrumentationKey=@{$false=$OctopusParameters["Octopus.Action[Deploy Application Insight].Output.AzureRMOutputs[AppInsightInstrumentationKey]"];$true=$VARAppInsightInstrumentationKey}[[string]::IsNullOrEmpty($OctopusParameters["Octopus.Action[Deploy Application Insight].Output.AzureRMOutputs[AppInsightInstrumentationKey]"])]
(Get-Content $bundleConfig ).replace('$$SERVICE_BASE_URL$$', $serviceBase) | Set-Content $bundleConfig
(Get-Content $bundleConfig ).replace('$$PASSWORD_CHANGE_WEBSITE_URL$$', $VARPasswordChangeWebsite) | Set-Content $bundleConfig
(Get-Content $bundleConfig ).replace('$$FORGOT_PASSWORD_URL$$', $VARForgotPassword) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$AI_SERVICE_BASE_URL$$', $serviceAIBase) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$ANALYTICS_TRACK_CODE$$', $AnalyticTrackCode) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$AUTO_POPULATE_STAMPS_TO_FAVOUIRITES_COUNT$$', $VARAutoPopulateStampsCount) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$AssessorAuthCookie$$', $VARAssessorAuthCookie) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$LOGGER_TYPE$$', $LoggerType) | Set-Content $bundleConfig
(Get-Content $bundleConfig).replace('$$INSTRUMENTATION_KEY$$', $AIInstrumentationKey) | Set-Content $bundleConfig
#updating manifest file
$manifestConfig = $scriptDir + "\manifest.json"
$manifestContent = (Get-Content -Raw -Path $manifestConfig | ConvertFrom-Json)
$manifestContent.name="$VARAwardingBody RM Assessor 3"
$manifestContent.short_name="$VARAwardingBody RM Assessor 3"
$manifestContent.start_url="https://$VARIISWebsiteName/"
$manifestContent | ConvertTo-Json  | set-content $manifestConfig

#updating index.html
# $randomNumber = "?id=" + (Get-Random)
# $indexHtml = $scriptDir + "\index.html"
# (Get-Content $indexHtml ).replace('config.js', 'config.js' + $randomNumber) | Set-Content $indexHtml
# (Get-Content $indexHtml ).replace('languages.js', 'languages.js' + $randomNumber) | Set-Content $indexHtml
# (Get-Content $indexHtml ).replace('vendor-bundle.js', 'vendor-bundle.js' + $randomNumber) | Set-Content $indexHtml
# (Get-Content $indexHtml ).replace('app.js', 'app.js' + $randomNumber) | Set-Content $indexHtml
# (Get-Content $indexHtml ).replace('app.css', 'app.css' + $randomNumber) | Set-Content $indexHtml
# (Get-Content $indexHtml ).replace('.png', '.png' + $randomNumber) | Set-Content $indexHtml

#customer branding replacing logo based on awardingbody
$sourceFile = "$OctopusPackageDirectoryPath\content\images\customer\logo\$VARAwardingBody-logo.png"
$destinationFile = "$OctopusPackageDirectoryPath\content\images\customer\client-logo.png"
If (test-path $sourceFile){
	[System.IO.File]::Copy($sourceFile,$destinationFile,$true);
}

Remove-Item "$OctopusPackageDirectoryPath\content\images\customer\logo" -recurse

#remove source map files after deployment
Remove-Item "$OctopusPackageDirectoryPath\build\generated\*.js.map" -recurse

#modify language file for accepted language
$jsFileSplit = (Get-Content "$scriptDir\build\generated\languages.*.js") -join "`r`n" -split "="

$jsonLanguageJsonFile = $jsFileSplit[1] | ConvertFrom-Json

# get all the accepted languages to an array
$language = $VARAcceptedLanguages.split(";") #@("en", "de")

$VARjsonstring = $jsonLanguageJsonFile.languages.language

$jsonLanguageJsonFile.languages.'awarding-body' = $VARLanAwardingBody
$jsonLanguageJsonFile.languages.language = @($jsonLanguageJsonFile.languages.language  | where {$_.code -in $language})

$finalJson = $jsFileSplit[0] + "= "
$finalJson += ConvertTo-Json -depth 10 $jsonLanguageJsonFile

$finalJson| Set-Content "$scriptDir\build\generated\languages.*.js"

Write-Host 'Getting the deployment time from web.config file'

## Get the web.config file content
$webConfig = "$scriptDir\web.config"
$configfile = [xml] (get-content $webConfig)

## Get the deployment time from web.config file
$deploymentTimeNode = $configfile.SelectSingleNode("//appSettings/add[@key='DeploymentTime']/@value")

$doc = new-object System.Xml.XmlDocument
$doc.Load($webConfig)
$doc.SelectSingleNode('//appSettings/add[@key="AssessorCookieDomain"]/@value').'#text' = "$VARDomainname"
$doc.SelectSingleNode('//appSettings/add[@key="AssessorAuthCookieName"]/@value').'#text' = "$VARAssessorAuthCookie"
$doc.Save($webConfig)

if($deploymentTimeNode -ne $null)
{
	## To resolve the caching issue with load balanced servers, keep the last modified date same
	$lastModifiedTime = Get-Date $deploymentTimeNode.'#text'

	Write-Host "Updating the last modified date of the files: $($lastModifiedTime)"

	## Xap file location
	$currentFilePath = "C:\inetpub\$VARIISWebsiteName"

	if((Test-Path -Path $currentFilePath))
	{
		## Loop through each xap in the location and update their last modified date
		Get-ChildItem $currentFilePath -Recurse | Where {$_.FullName -notlike "*.Gateway.*"} | Foreach-Object{
			## Update the last modified date
			$_.LastWriteTime = $lastModifiedTime
			Start-sleep -milliseconds 100
		}

		Write-Host 'Successfully updated the last modified date of files to ' + $lastModifiedTime
	}
}
else
{
	Write-Host "The deployment time value is not available in web.config"
}

if ("$VARApplyDevKitHacks" -eq $true)
{
	# clear customheaders for dev kit
    $doc = new-object System.Xml.XmlDocument
    $doc.Load($webConfig)
	$doc.SelectSingleNode("//system.webServer/httpProtocol/customHeaders").RemoveAll()
    $clearDoc = new-object System.Xml.XmlDocument
    $clearNode = $doc.CreateElement("clear")
    $doc.SelectSingleNode("//system.webServer/httpProtocol/customHeaders").AppendChild($clearNode)
    $doc.Save($webConfig)
}


#start application pool
Start-WebAppPool (Get-Item "IIS:\Sites\$VARIISWebsiteName"| Select-Object applicationPool).applicationPool
Write-Host "App Pool Started"
Start-WebSite $VARIISWebsiteName

if($VARInvokeServices -eq $true){
$CsvProc = Start-Process -FilePath $VARserviceInvokerPath -ArgumentList $VarArgList -PassThru

while($CsvProc.HasExited -eq $false) {
        Write-Output "Service invocation in Progress"
        Start-Sleep -s 10
     }

Write-Output "Service invocation Completed"
}