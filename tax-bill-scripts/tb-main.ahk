;Variables

;Sleep Times
global EXEOpen := 1500
global PageSleep := 2125
global LongPageSleep := 3000
global ProgramSleep := 4500
global KeySleep := 800
global KeySleepSlow := 1650

;File Variables
FileSave := A_YYYY . "-" . A_MM . "-" . A_DD
SourceFile := "C:\Users\User1\OneDrive - Property Valuation Services (1)\Documents\Collector_Bill_masterScript" . FileSave



;Open Excel File
global XL := ComObjCreate("Excel.Application")
XL.Visible := TRUE
;XL.Workbooks.Open(SourceFile . ".csv")
;Right-click file -> copy as path-> paste into paratheses for script to grab data from excel sheet
;XL.Workbooks.Open("C:\Users\jabella\Documents\TestData.xlsx")
;XL.Workbooks.Open("C:\Users\User1\OneDrive - Property Valuation Services (1)\Documents\Collector_Bill_masterScript\harriscounty.xlsx")
XL.Workbooks.Open("C:\Users\User1\Desktop\Test.csv")
Sleep, EXEOpen

;Col Starts at AccountLookupString and  Row skips first Row of Excel sheet
;Set Row and Col
global Row := 1
global Col := 2
RC := XL.ActiveSheet.UsedRange.Rows.Count - Row + 1
;RC := XL.ActiveSheet.UsedRange.Rows.Count - 1

;Set CurrentYear and PriorYear
global PrevYear := A_YYYY - 1
global Year := A_YYYY

;Special Error Note when wanting specifics in error note
global SEN := ""

Run, chrome.exe
;Sleep, PageSleep
Sleep, EXEOpen
Sleep KeySleepSlow

Loop, % RC
{	
	Col := 2
	global AccLookup := XL.ActiveSheet.Cells(Row, Col).Value
	
	Col := 3
	AccWeb := XL.ActiveSheet.Cells(Row, Col).Value
	
	;Set CollectorID
	Col := 4
	global CID := XL.ActiveSheet.Cells(Row, Col).Value
	
	Col := 5
	global AccREPP := XL.ActiveSheet.Cells(Row, Col).Value

	;Check for working websites
	;FoFObj := ComObjCreate("WinHttp.WinHttpRequest.5.1")
	;FoFObj.Open("GET", AccWeb)
	;FoFObj.Open("HEAD", AccWeb, True)
	;FoFObj.Send()
	;FoFObj.WaitForResponse()
	
	;Go to Website (AccWeb) if it works
	;if ((!InStr(FoFObj.ResponseText, "404")) and (AccWeb <> ""))
	if(AccWeb <> "")
	{
		;Turns on caret browsing
		Send {f7}
		Sleep KeySleep
		
		;Put website into clipboard to paste it into URL instead of SendInput. Faster to paste the URL.
		clipboard :=
		clipboard = %AccWeb%
		WinActivate, New Tab
		Sleep KeySleep
		Send, ^l
		Sleep, KeySleep
		Send ^v
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep PageSleep
		;Need to empty the clipboard after going to website.
		clipboard :=
		;Case can only evaluate up to 20 expressions
		Switch CID
		{
		Case 20, 898:
			Sleep PageSleep
			MaricopaCounty()
		Case 45, 560, 49, 42, 44, 50, 51, 52, 55, 46, 43, 1051, 1114, 1117:
			Sleep PageSleep
			GenFloridaCounty()
		Case 1697, 2138, 2171, 559, 589, 590, 597, 695, 842, 913, 892:
			Sleep PageSleep
			GenFloridaCounty()
		Case 378:
			Sleep PageSleep
			HarrisCounty()
		Case 2349:
			Sleep PageSleep
			FranklinCounty()
		Case 1247:
			Sleep PageSleep
			BaltimoreCountyPP()	
		Case 849:
			Sleep PageSleep
			KnoxvilleCounty()
		Case 2373:
			Sleep PageSleep
			CuyahogaCounty()	
		Case 35:
			Sleep PageSleep
			DenverGovCounty()
		Case 850:
			Sleep PageSleep
			DurhamCounty()	
		Case 1871:
			Sleep PageSleep
			PotterCounty()	
		Case 391, 3667:
			Sleep, PageSleep
			BIS()	
		Case 33:
			Sleep PageSleep
			ArapahoeCounty()	
		Case 1484:
			Sleep PageSleep
			CFISDCounty()	
		Case 901:
			Sleep PageSleep
			BexarCounty()
		Case 101:
			Sleep PageSleep
			ClarkCountyIL()	
		Case 1477:
			Sleep PageSleep
			DallasCounty()
		Case 344:
			Sleep PageSleep
			CameronCounty()
		Case 1262:
			Sleep PageSleep
			OrangeCountyCA()
		Case 472:
			Sleep PageSleep
			DekalbCounty()
		Case 821, 1426:
			Sleep PageSleep
			PimaCounty()
		Case 756:
			Sleep PageSleep
			JeffCounty()
		Case 89:
			Sleep PageSleep
			MuscogeeCounty()
		Case 848:
			Sleep PageSleep
			KnoxCounty()
		Case 329:
			Sleep PageSleep
			RuthCounty()
		Case 7:
			Sleep PageSleep
			MadisonCounty()
		Case 75:
			Sleep PageSleep
			CobbCounty()
		Case 579:
			Sleep PageSleep
			GwinnettCounty()
		Case 765:
			Sleep PageSleep
			DonaAnaCounty()
		Case 1397:
			Sleep PageSleep
			ClarkCountyNV()			
		Case 1005:
			Sleep PageSleep
			BernalilloCounty()
		Case 1898:
			Sleep PageSleep
			SaltLakeCounty()
		Case 146:
			Sleep PageSleep
			JeffersonCounty()
		Case 600:
			Sleep PageSleep
			ShawneeCounty()	
		Case 128:
			Sleep PageSleep
			JohnsonCounty()	
		Case 130:
			Sleep PageSleep
			SedgwickCounty()
		Case 244:
			Sleep PageSleep
			ClayCountyMO()	
		Case 308:
			Sleep PageSleep
			TulsaCounty()	
		Case 3068:
			Sleep PageSleep
			FultonCounty()
		Case 248:
			Sleep PageSleep
			JacksonCounty()
		Case 257:
			Sleep PageSleep
			StLouisCounty()
		Case 307:
			Sleep PageSleep
			OklahomaCounty()
		Case 47:
			Sleep PageSleep
			HernandoCounty()
		Case 53:
			Sleep PageSleep
			OrangeCounty()
		Case 54:
			Sleep PageSleep
			PalmBeachCounty()
		Case 56:
			Sleep PageSleep
			PolkCounty()
		Case 57:
			Sleep PageSleep
			SarasotaCounty()
		Case 58:
			Sleep PageSleep
			SeminoleCounty()
		Case 588:
			Sleep PageSleep
			ClayCountyFL()
		Case 659, 1111:
			Sleep PageSleep
			PTAXWeb()
		Case 1168, 1313, 4773:
			Sleep PageSleep
			ITMWeb()
		Case 1698, 2800, 2801, 3169, 3276, 6184:
			Sleep PageSleep
			VisualGovWebFL()
		Case 1899:
			Sleep PageSleep
			StJohnsCounty()
		Case 2802, 3718:
			Sleep PageSleep
			;Covers SuwanneeCounty as well, some of these sites can be merged but wording is causing some issues need to look back on this
			ColumbiaCounty()
		Case 406:
			Sleep PageSleep
			SmithCounty()	
		Case 536:
			Sleep PageSleep
			TarrantCounty()
		Case 327:
			Sleep PageSleep
			DavidsonCounty()
		Case 3146:
			Sleep PageSleep
			PierceCounty()
		Case 856:
			Sleep PageSleep
			CookCounty()
		Case 114:
			Sleep PageSleep
			MarionCounty()	
		Case 1115:
			Sleep PageSleep
			MobileCounty()
		Case 749:
			Sleep PageSleep
			NewOrleansCounty()
		Case 3667:
			Sleep PageSleep
			BellCounty()
		Case 281:
			Sleep PageSleep
			WakeCountyNC()
		Case 400, 2093, 3669, 374:
			Sleep PageSleep
			NuecesCounty()
		Case 8949:
			Sleep PageSleep
			TruAuto()	
		Case 1484:
			Sleep PageSleep
			CypressCounty()
		Case 371:
			Sleep PageSleep
			ElpasoCounty()
		Case 1723:
			Sleep PageSleep
			PiercePPCounty()				
		Default:
			Sleep, PageSleep
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
}
Send, {f7}
MsgBox Script Complete!
TruAuto(){	
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	Sleep, ProgramSleep
	

	
	;Check if TrueAutomation website
	Send, ^f
	Sleep, KeySleep
	SendRaw, Legal Description
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
		
	;Look for Legal Description in TrueAutomation website
	if(clipboard = "Legal Description")
	{		
		;Expand All
		Send, ^f
		Sleep, KeySleep
		SendRaw, Expand All
		Sleep, KeySleep
		Send, {esc}
		Sleep, KeySleep
		Send, {enter}
		Sleep, KeySleepSlow
			
		;Search for Assessed Value and navigate to value to determine if it is numeric or not
		Send, ^f
		SendRaw, Assessed Value
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		Send, {right 6}
		Send, {shiftdown}{right}{shiftup}
		Sleep, KeySleepSlow
		Send, ^c
		Send, {right}
		Sleep, KeySleep
			
		if((clipboard is number) and (not InStr(clipboard, "/")))
		{
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

DenverGovCounty(){

        Send ^f
		Sleep KeySleep
		SendRaw Business Asset Taxes for current tax year
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Business Asset Taxes for current tax year")
		{
		

			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			

		}
		else
		{
			ErrorNote()
		}
	return
	


}

ArapahoeCounty(){
	
	Send ^f
		Sleep KeySleep
		SendRaw By AIN
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Sleep KeySleepSlow
		Send {tab}
		Sleep KeySleepSlow
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Property Taxes for 2023 Payable 2024
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Property Taxes for 2023 Payable 2024")
		{
		

			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			

		}
		else
		{
			ErrorNote()
		}
	return

}	

BellCounty(){
 		Send ^f
		Sleep KeySleep
		SendRaw Original Tax Statement is not available. Please try again later.
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard <> "Original Tax Statement is not available. Please try again later.")
		{
		

			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			

		}
		else
		{
			ErrorNote()
		}
	return

}

CFISDCounty(){
	
Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendInput all data refers to tax information for %PrevYear% 
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	
	if (clipboard = "all data refers to tax information for " . PrevYear)
	{
		
	
			Send ^f
			Sleep KeySleep
			SendRaw Current Tax Statement
			;Sleep KeySleep
			;Send {enter}
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep PageSleep
			Sleep PageSleep
			Send ^f
			Sleep KeySleep
			SendRaw >> here <<
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep PageSleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep PageSleep
			Send ^w
	}	
	else
	{
		ErrorNote()
	}
	return


}

BernalilloCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Parcel ID
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel ID:
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	Sleep KeySleep
	SendInput %AccLookup%
	Send ^f
	Sleep KeySleep
	SendRaw Current Ownership Data
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send +{tab}
	Sleep KeySleep
	Send {down 2}
	Sleep KeySleep
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	
	Sleep KeySleepSlow
	Send ^f
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = AccLookup)
	{
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleepSlow
		Sleep KeySleep
		Sleep KeySleepSlow
		Sleep KeySleep
		
		Sleep KeySleepSlow
		Send !{left 2}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw Tax &
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send +{tab}
		Sleep KeySleep
		Send {up 2}
		Sleep KeySleep
		Send {enter}
	}
	else
	{
		ErrorNote()
	}
	return
}

BexarCounty(){
	Counter := 0
	Sleep PageSleep
	Sleep LongPageSleep
	Send ^f
	Sleep KeySleep
	SendInput Unless otherwise noted, all data refers to tax information for %Year%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Unless otherwise noted, all data refers to tax information for " . Year)
	{
		Send ^f
		Sleep KeySleep
		SendRaw Total Market Value:
		Sleep KeySleep
		Send {esc}
		Sleep KeySleep
		Send {right 3}
		Sleep KeySleepSlow
		Send {shiftdown}{right}{shiftup}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = 0)
		{
			SEN := "Bill is blank."
		}
		
		Send {shiftdown}{tab 3}{shiftup}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep PageSleep
		Sleep LongPageSleep
		Sleep LongPageSleep
		Send ^f
		Sleep KeySleepSlow
		SendRaw >> here <<
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		while(clipboard <> ">> here <<" and Counter < 5)
		{
			Counter := Counter + 1
			Sleep LongPageSleep
			Send ^f
			Sleep KeySleepSlow
			SendRaw >> here <<
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			Sleep KeySleepSlow
			Sleep KeySleepSlow
		}
		
		if(clipboard = ">> here <<")
		{
			Send {enter}
			Sleep LongPageSleep
			Sleep LongPageSleep
			Sleep PageSleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
		}
		else
		{
			SEN := "Webpage slow or error occurred."
			ErrorNote()
		}
		Send ^w
		Sleep KeySleepSlow
		Send ^w
	}
	else
	{
		ErrorNote()
	}
	return
}

GenFloridaCounty(){
	Sleep LongPageSleep
	Send ^f
	Sleep KeySleep
	SendInput %Year% Annual Bill
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = Year . " Annual Bill")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Print (PDF)
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep LongPageSleep
		Sleep LongPageSleep
		Sleep PageSleep
		Sleep KeySleepSlow
		;Turn off mouse cursor before print to remove cursor from PDF document
		Send {f7}
		Sleep KeySleep
		Sleep LongPageSleep
		Sleep PageSleep
		SaveFile()
		Sleep PageSleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

ClayCountyMO(){
	Send ^f
	Sleep KeySleepSlow
	SendRaw Property Account Number:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab 1}
	Sleep KeySleepSlow
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {enter}
	
	Sleep KeySleepSlow
	Send ^f
	SendRaw Please type another one
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	
	if(clipboard <> "Please type another one")
	{
		SendInput ^l{Raw}javascript:generatePrintWindow()
		Send {Enter}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw Print
		Sleep KeySleepSlow
		Send {enter}
		Send {enter}
		Sleep KeySleepSlow
		Send {esc}
		Send {enter}
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		SaveFile()
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

CobbCounty(){
	Sleep PageSleep
	Send ^f
	Sleep KeySleep
	SendInput %Year%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	if(clipboard = Year)
	{
		Send ^f
		Sleep KeySleep
		Send {Space}Unpaid
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
	
		if(clipboard = " Unpaid")
		{
			Send {tab 2}
			Sleep KeySleep
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
		}
		else
		{	
			Send {tab 1}
			Sleep KeySleep
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
		}
	
		Send ^f
		SendRaw Assessed Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
	
		if(clipboard = "Assessed Value")
		{
			Send ^f
				Sleep KeySleep
				SendRaw View & Print Bill
				Sleep KeySleep
				Send {esc}
				Sleep KeySleepSlow
				Send {enter}
				
				Send ^f
				Sleep KeySleep
				SendRaw Save PDF
				Sleep KeySleep
				Send {esc}
				Sleep KeySleepSlow
				Send {enter}
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				Sleep PageSleep
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
				Sleep KeySleep
				
		}
		else
		{
			ErrorNote()
		}
	}		
	else
	{
		ErrorNote()
	}
	return
}

DallasCounty(){
	Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendInput All tax information refers to the %PrevYear% 
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	
	if (clipboard = "All tax information refers to the " . PrevYear)
	{
		
		Send ^f
		SendRaw Market Value:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {right 4}
		Sleep KeySleepSlow
		Send {shiftdown}{right}{shiftup}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard <> 0)
		{
			Send ^f
			Sleep KeySleep
			SendRaw Current Tax Statement
			;Sleep KeySleep
			;Send {enter}
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep PageSleep
			Sleep PageSleep
			Send ^f
			Sleep KeySleep
			SendRaw >> here <<
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep PageSleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep PageSleep
			Send ^w
		}
		else
		{
			SEN := "Bill is blank."
			ErrorNote()
		}
	}	
	else
	{
		ErrorNote()
	}
	return
}

DekalbCounty(){
	;REPP does not matter here because PP AccLookup can be put into Parcel ID field and PIN
	;REPP RE does only works in the Parcel ID field though
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel ID
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Send KeySleep
		
	if(clipboard = "Parcel ID")
	{
		Sleep KeySleepSlow
		Send {tab}
		Sleep KeySleepSlow
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep PageSleep
			
		Send ^f
		Sleep KeySleep
		SendRaw Tax Bill Details
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep PageSleep
			
		Send ^f
		Sleep KeySleep
		SendRaw DeKalb County Real Estate Tax Statement
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleep
			
		if(clipboard = "DeKalb County Real Estate Tax Statement")
		{
			Send ^f
			Sleep KeySleepSlow
			SendInput %Year%
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep
			Send {tab}
			Sleep KeySleep
			Send {enter}
			Sleep PageSleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleepSlow
			Send ^w
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

DonaAnaCounty()	{
	Send ^f
	Sleep KeySleep
	SendRaw Statement Of Taxes Due
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep PageSleep
	
	Send ^f
	SendRaw Statement Of Taxes Due
	Send {esc}
	Send {enter}
	Sleep KeySleep
	Sleep PageSleep
	Sleep PageSleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Statement Of Taxes Due
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Statement Of Taxes Due")
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Send !{left 1}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw Statement of Taxes Due
		Sleep KeySleepSlow
		Send {esc}
		Send {tab}
		Send {enter}
		
	}
	else
	{
		ErrorNote()
	}
	return
}

FultonCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw There are no records
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
	if(clipboard <> "There are no records")
	{
	Sleep KeySleepSlow
	Sleep PageSleep
	AdobeSavePDF()
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	}
	else
	{
		ErrorNote()
	}
	return
}

GwinnettCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Not Found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Not Found")
	{
		Sleep KeySleepSlow
		Sleep PageSleep
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
	}
	else
	{
		ErrorNote()
	}
	return
}

OrangeCountyCA(){
	Send ^f
	Sleep KeySleep
	SendRaw Not Found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Not Found")
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}
HarrisCounty(){

	
	;Look for "Current Year" Property Tax Statement text
	Send ^f
	Sleep KeySleep
	SendInput %PrevYear% Property Tax Statement
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = PrevYear . " Property Tax Statement")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Print Statement
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep PageSleep
		Send ^s
		Sleep KeySleepSlow
		SaveFile()
		Sleep KeySleepSlow
		InsertQuery()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^w
	}
	else
	{
		ErrorNote()
	}
	return
}

JacksonCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Property Account Number:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab 1}
	Sleep KeySleep
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw Property Account Summary
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Property Account Summary")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Printable Version
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw Print
		Sleep KeySleepSlow
		Send {enter}
		Send {enter}
		Sleep KeySleepSlow
		Send {esc}
		Send {enter}
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		SaveFile()
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

JeffCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Server Error
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Server Error")
	{
		Send ^f
		Sleep KeySleep
		SendRaw TOTAL MARKET VALUE
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		if(clipboard = "TOTAL MARKET VALUE")
		{
			Sleep KeySleepSlow
			Send {down}
			Sleep KeySleepSlow
			Send {right}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleepSlow
			Sleep KeySleepSlow  
			Send {shiftdown}(right}{right}{shiftup} ;weird issue on website where the two {right} is required even though manually only one right should only be needed
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleep
			Send {right}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			
			if clipboard is number
			{
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}		
	}
	else
	{
		ErrorNote()
	}
	return
}

JeffersonCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw limit 10 parcels
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	SendInput %AccLookup%
	Sleep KeySleep
	Send {tab 2}
	Sleep KeySleepSlow
	Send {enter}
	Sleep LongPageSleep
	Sleep LongPageSleep

	Send ^f
	Sleep KeySleep
	SendRaw No items found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Send KeySleepSlow
	
	if(clipboard <> "No items found")
	{
		Send ^f
		Sleep KeySleep
		SendRaw View/Print Details
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Send ^w
	}
	else
	{
		ErrorNote()
	}
	return
}


JohnsonCounty(){
	Send ^f
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = AccLookup)
	{
		Send ^u
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw btnPrintTaxStatement2022
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep	
		
			if(clipboard = "btnPrintTaxStatement2022")
			{
				Send ^w
				Sleep KeySleepSlow
				Send ^f
				Sleep KeySleepSlow
				SendRaw Tax Statement
				Sleep KeySleepSlow
				Send {esc}
				Sleep KeySleepSlow
				Send {enter}
				Sleep LongPageSleep
				Sleep KeySleepSlow
				
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
			}
			else
			{
				ErrorNote()
			}
		
		
	}
	else
	{
		ErrorNote()
	}
	return
}

MadisonCounty(){
	;Control is represented with the ^ in AHK
	;Brings up the search window on webpage
	Send ^f
	Sleep KeySleep
	;Use SendRaw when using string of text
	SendRaw Assessment Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Send KeySleepSlow
	
	;MsgBox % Variable_Name this gets value of variable. MsgBox is a print statement that will display a message to user.
	
	if(clipboard = "Assessment Value")
	{
		;Right Arrow key 3 times
		Send {right 3}
		Sleep KeySleepSlow
		;Always make sure to put {shiftup} after {shiftdown} or else AHK will think the shift key is held down the entire time
		Send {shiftdown}{right}{shiftup}
		Sleep KeySleep
		;Copy
		Send ^c
		Sleep KeySleepSlow
	
		if clipboard is number
		{
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

MaricopaCounty(){
	SendInput %AccLookup%
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	;Go to "View Your Tax Bill Tab"
	Send ^f
	Sleep KeySleep
	SendRaw View Your Tax Bill
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	;Check if form is present
	Send ^f
	Sleep KeySleep
	SendInput %Year% Property Tax Statement for Parcel{#} %AccLookup%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = Year . " Property Tax Statement for Parcel# " . AccLookup)
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
	}
	else
	{
		ErrorNote()
	}
	return
}

MuscogeeCounty(){
	Send {esc}
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw Property Values
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	
	if(clipboard = "Property Values")
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
	}
	else
	{
		ErrorNote()
	}
	return
}

KnoxCounty(){
	Send ^f
	Sleep KeySleep
	SendInput Tax Year %PrevYear%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep LongPageSleep
	Sleep LongPageSleep
	Sleep LongPageSleep
	Sleep LongPageSleep
	
	if(clipboard = "Tax Year " . PrevYear)
	{
		Send ^f
		Sleep KeySleep
		SendRaw Print History
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep PageSleep
		Send ^s
		Sleep KeySleep
		SaveFile()
		Sleep KeySleep
		InsertQuery()
		Send ^w
	}
	else
	{
		ErrorNote()
	}
	return
}

PimaCounty(){
	if(AccREPP = "P")
	{			
		Send ^f
		Sleep KeySleep
		SendInput %Year% PROPERTY TAX STATEMENT
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = Year . " PROPERTY TAX STATEMENT")
		{
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
				Sleep KeySleep
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		;For REPP of R
		Send ^f
		Sleep KeySleep
		SendRaw Book
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleep
		
		if(clipboard = "Book")
		{
			AccLookup := StrReplace(AccLookup, A_Space, "")
			Send {tab}
			Sleep KeySleep
			SendInput %AccLookup%
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendRaw Yearly Transaction History
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {tab 2}
			Sleep KeySleep
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			
			Send ^f
			Sleep KeySleep
			SendInput %Year% Tax Statement
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			
			if(clipboard = Year . " Tax Statement")
			{
				Sleep KeySleep
				Send {enter}
				Sleep KeySleepSlow
				AdobeSavePDF()
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}
	}
	return
}

RuthCounty(){
	Send +{tab}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep

	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {enter}
	Sleep PageSleep

	Send ^f
	Sleep KeySleep
	SendInput %PrevYear%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab 2}
	Sleep KeySleep
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	SendRaw Assessed Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	
	if(clipboard = "Assessed Value")
	{
	
	Sleep KeySleep
	Send {right 3}
	Sleep KeySleepSlow
	Send {shiftdown}{right}{shiftup}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep
	Send {right}
	Sleep KeySleep
	
		if(clipboard is number)
		{
			Send ^f
			Sleep KeySleep
			SendRaw View & Print Bill
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			
			;Turn off mouse cursor before print to remove cursor from PDF document
			Send {f7}
			Sleep KeySleep
			
			Send ^f
			Sleep KeySleep
			SendRaw Save PDF
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep		
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			SaveFile()
			InsertQuery()
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

OklahomaCounty(){
	Send ^f
	SendRaw No Records Available
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "No Records Available")
	{	
		Send ^f
		Sleep KeySleepSlow
		SendInput %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()	
	}
	else
	{
		ErrorNote()
	}
	return
}

SaltLakeCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Error
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Error")
	{
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

SedgwickCounty(){
	Send ^f
	Sleep KeySleepSlow
	SendRaw I accept the above terms
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send, {enter}
	Sleep, KeySleepSlow
	Sleep, KeySleepSlow
	
		Send ^f
		Sleep KeySleepSlow
		SendRaw Sorry, we could not find the specified property.
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
		
		if(clipboard <> "Sorry, we could not find the specified property.")
		{
			Send ^f
			Sleep KeySleep
			SendRaw Print
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send {enter}
			Sleep LongPageSleep
			Send {tab}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			Send ^w
		}
		else
		{
			ErrorNote()
		}		
	return
}

ShawneeCounty(){

	Send {shiftdown}{right 5}{shiftup}
	Sleep KeySleep	
	Send ^c
	
	if(clipboard <> "Error")
	{
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

StLouisCounty(){

	if(AccREPP = "P")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Account Number:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw No records were found matching the search input information
		Sleep KeySleep
		Send {esc}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
		
		if(clipboard <> "No records were found matching the search input information")
		{
		
			Sleep KeySleepSlow
			SendInput ^l{Raw}javascript:ShowPropertyData('%AccLookup%')
			Send {Enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendInput %Year%
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleep
			
			if(clipboard = Year)
			{
				Sleep KeySleepSlow
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
			}
			else
			{
				ErrorNote()
			}
			
			
		}
		else
		{
			ErrorNote()
		}
	}

	else
	{
		Send ^f
		Sleep KeySleep
		SendRaw Locator Number:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw No records were found matching the search input information
		Sleep KeySleep
		Send {esc}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
	
		if(clipboard <> "No records were found matching the search input information")
		{
		
			Sleep KeySleepSlow
			SendInput ^l{Raw}javascript:document.querySelectorAll("td")[2].onclick()
			Send {Enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendInput %Year%
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendRaw Tax info & Receipt
			Sleep KeySleep
			Send {esc}
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			AdobeSavePDF()
		}
		else
		{
			ErrorNote()
		}
	}
	return
}

TulsaCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number:
	Sleep KeySleep
	Send {esc}
	Sleep KeySleepSlow
	Send {tab 1}
	Sleep KeySleepSlow
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw View Details
	Sleep KeySleep
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "View Details")
	{
		Sleep KeySleepSlow
		Send, {enter}
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

;Come back to this county later; Incomplete currently
HernandoCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Collector - Appraiser Tax System
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	if(clipboard = "Collector - Appraiser Tax System")
	{
		Sleep KeySleepSlow
		Send {enter}
		Sleep PageSleep
		Sleep PageSleep
		Send ^f
		Sleep KeySleep
		SendRaw Property Search
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = "Property Search")
		{
			Sleep KeySleepSlow
			Send ^f
			Sleep KeySleep
			SendRaw Information Req.
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			Sleep KeySleepSlow
			
			if(clipboard = "Information Req.")
			{
				Sleep KeySleepSlow
				Send {tab}
				Sleep KeySleepSlow
				SendInput %AccLookup%
				Sleep KeySleepSlow
				Sleep PageSleep
				Send ^f
				Sleep KeySleep
				SendRaw Property View
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				Send {esc}
				Sleep KeySleep
				Send ^c
				Sleep KeySleepSlow
				
				if(clipboard = "Property View")
				{
					;Skip this county for now
				}
				else
				{
					ErrorNote()
				}
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

OrangeCounty(){
	Send ^f
	Sleep KeySleep
	SendInput Tax Year: %Year%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Tax Year: " . Year)
	{
		Sleep KeySleepSlow
		Send {tab}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep PageSleep
		Sleep LongPageSleep
		AdobeSavePDF()
		Sleep KeySleepSlow
		Send ^w
		Sleep KeySleepSlow
		Sleep KeySleepSlow
	}
	else
	{
		ErrorNote()
	}
	return
}

PalmBeachCounty(){
	Send ^f
	Sleep KeySleep
	
	if(AccREPP = "R")
	{
		SendRaw Search by Property Control Number
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Send {down 3}{enter}
		Sleep KeySleepSlow
		Send {tab}
		Sleep KeySleepSlow
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Sleep LongPageSleep
		Sleep LongPageSleep
	}
	else
	{
		SendRaw Search by Business
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send {tab}
		Sleep KeySleepSlow
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Sleep LongPageSleep
		Sleep LongPageSleep
	}

	Send ^f
	Sleep KeySleep
	SendRaw Tax Bills
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Tax Bills")
	{
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleep
		SendRaw Value Adjustment
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = "Value Adjustment")
		{
			Send ^l
			Sleep KeySleep
			SendRaw javascript:document.querySelector("span.tile-header-link").click()
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {enter}
			Sleep LongPageSleep
			Sleep KeySleepSlow
			Sleep KeySleepSlow
		}
		
		Sleep LongPageSleep
		Send ^l
		Sleep KeySleep
		SendRaw javascript:document.querySelector("span.tile-header-link").click()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleepSlow
		SendRaw Original
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep PageSleep
		Sleep PageSleep
		SaveFile()
		InsertQuery()	
	}
	else
	{
		ErrorNote()
	}
	return
}

PolkCounty(){
	Send ^f
	Sleep KeySleep
	SendInput Tax Year %Year%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Tax Year " . Year)
	{
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleep
		SendRaw Print Bill
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Sleep LongPageSleep
		Sleep LongPageSleep
		Sleep PageSleep
		SaveFile()
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
}

SarasotaCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Property Taxes
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Property Taxes")
	{
		Send {enter}
		Sleep KeySleep
		Sleep PageSleep
		Sleep PageSleep
		Send ^f
		Sleep KeySleep
		SendRaw Account Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		if(clipboard = "Account Number")
		{
			Send {enter}
			Sleep PageSleep
			Sleep PageSleep
			Sleep LongPageSleep
			Sleep LongPageSleep
			SendInput %AccLookup%
			Sleep KeySleepSlow
			Send {enter}
			Sleep PageSleep
			Sleep LongPageSleep
			Sleep LongPageSleep
			Send ^f
			Sleep KeySleep
			SendRaw Print Tax Bill
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			Sleep KeySleepSlow
			
			if(clipboard = "Print Tax Bill")
			{
				Sleep KeySleepSlow
				Send {enter}
				Sleep KeySleepSlow
				Send ^f
				Sleep KeySleep
				
				if(AccREPP = "P")
				{
					SendInput Personal %Year%
					Sleep KeySleepSlow
				}
				else
				{
					SendInput Real Estate %Year%
					Sleep KeySleepSlow
				}
				
				Sleep KeySleepSlow
				Send {esc}
				Sleep KeySleep
				Send ^c
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				
				if( clipboard = "Real Estate " . Year or clipboard = "Personal " . Year )
				{
					AdobeSavePDF()
					Sleep KeySleepSlow
					Send ^w
				}
				else
				{
					Sen := "Bill not current year."
					ErrorNote()
					Send ^w
				}
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

SeminoleCounty(){
	Send ^f
	Sleep KeySleep
	SendInput Assessed year: %Year%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	if(clipboard = "Assessed year: " . Year)
	{
		Send ^f
		Sleep KeySleep
		SendRaw Download
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep PageSleep
		Sleep LongPageSleep
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Send ^w
	}
	else
	{
		SEN := "*ATTENTION!* Bill not current year or Bill Lookup number needs modification."
		ErrorNote()
	}
	return
}

ClayCountyFL(){
	Send ^f
	Sleep KeySleep
	SendRaw Tax Search
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Tax Search")
	{
		Send {enter}
		Sleep KeySleep
		Sleep PageSleep
		Send ^f
		Sleep KeySleep
		SendRaw Account Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		if(clipboard = "Account Number")
		{
			Send {enter}
			Sleep PageSleep
			Sleep LongPageSleep
			SendInput %AccLookup%
			Sleep KeySleepSlow
			Send {enter}
			Sleep PageSleep
			Sleep LongPageSleep
			Sleep LongPageSleep
			Send ^f
			Sleep KeySleep
			SendRaw Tax Year
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			Sleep KeySleepSlow
			
			if(clipboard = "Tax Year")
			{
				Sleep KeySleepSlow
				Send {down 3}
				Sleep KeySleepSlow
				Send {shiftdown}{right 4}{shiftup}
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				Send ^c
				Sleep KeySleepSlow
				
				if(clipboard = Year)
				{
					Send ^f
					Sleep KeySleep
					SendRaw Print
					Sleep KeySleepSlow
					Send {esc}
					Sleep KeySleep
					Send {enter}
					Sleep LongPageSleep
					Sleep LongPageSleep
					Send ^p 
					Sleep KeySleep
					Send {enter}
					Sleep KeySleep	
					SaveFile()
					Sleep KeySleepSlow
					Sleep KeySleep
					InsertQuery()
					Send ^w
				}
				else
				{
					SEN := "Bill not current year."
					ErrorNote()
				}
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

PTAXWeb(){
	Send ^f
	Sleep KeySleep
	SendRaw Billing Address
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {tab}
	Sleep KeySleep
	clipboard := AccLookup
	Sleep KeySleepSlow
	Send ^v
	Sleep KeySleepSlow
	clipboard := 
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	SendInput %Year%
	Sleep KeySleepSlow
	Send {tab 2}
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send ^f
	Sleep KeySleep
	SendInput %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	if(clipboard = Year)
	{
		Send ^f
		Sleep KeySleep
		SendRaw PRINT BILL
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = "PRINT BILL")
		{
			Send {enter}
			Sleep LongPageSleep
			AdobeSavePDF()
			Send ^w
		}
		else
		{
			ErrorNote()
		}	
	}
	else
	{
		ErrorNote()
	}
	return
}

ITMWeb(){
	Send ^f
	Sleep KeySleep
	SendRaw Search Disclaimer
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Search Disclaimer")
	{
		Send {tab}
		Sleep KeySleep
		Send {enter}
		Sleep LongPageSleep
	}
	
	Send ^f
	Sleep KeySleep
	SendRaw SELECTED ACCOUNT NOT FOUND
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard <> "SELECTED ACCOUNT NOT FOUND")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Account Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {end}
		Sleep KeySleep
		Send {shiftdown}{left 4}{shiftup}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = Year)
		{
			AdobeSavePDF()
		}
		else
		{
			SEN := "*ATTENTION* Bill is not current year."
			ErrorNote()
		}
	}
	else
	{
		SEN := "*ATTENTION* Bill Account Lookup may need modification."
		ErrorNote()
	}
	return
}

VisualGovWebFL(){
	Send ^f
	Sleep KeySleep
	SendRaw Disclaimer
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	if(clipboard = "Disclaimer")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Yes, I understand and accept the above statement.
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep PageSleep
	}

	Send ^f
	Sleep KeySleep
	SendRaw Property Number
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	SendInput %AccLookup%
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {tab 3}
	Sleep KeySleepSlow
	SendInput %Year%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send ^l
	Sleep KeySleep
	SendRaw javascript:submitForm(0)
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send ^f
	Sleep KeySleep
	SendRaw Total 0 records found.
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard <> "Total 0 records found.")
	{
		Send ^l
		Sleep KeySleep
		SendRaw javascript:document.getElementsByClassName("tax-detail-link")[0].click()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep LongPageSleep
		Send {enter}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleep
		SendRaw Bill #
		Sleep KeySleepSlow
		Send {esc}
		Send KeySleep
		Send {end}
		Sleep KeySleepSlow
		Send {shiftdown}{left 4}{shiftup}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleepSlow
		
		if(clipboard = Year)
		{
			Send ^f
			Sleep KeySleep
			SendRaw Print Bill
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep PageSleep
			Send {esc}
			Sleep KeySleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
		}
		else
		{
			SEN := "*ATTENTION!* Bill not current year."
			ErrorNote()
		}
	}
	else
	{
		SEN := "No records found. Check account lookup on bill."
		ErrorNote()
	}
	return
}

StJohnsCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw This property could not be found or displayed.
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Send KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard <> "This property could not be found or displayed.")
	{
		Send ^f
		Sleep KeySleep
		SendInput Year: %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		if(clipboard = "Year: " .  Year)
		{
			Send ^f
			Sleep KeySleep
			SendRaw Print Bill / Receipt
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep PageSleep
			SaveFile()
			InsertQuery()
		}
		else
		{
			SEN := "Bill not current year"
			ErrorNote()
		}
	}
	else
	{
		SEN := "Bill not current year or bill account lookup needs review."
		ErrorNote()
	}
	return
}

ColumbiaCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Tax Search
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if(clipboard = "Tax Search")
	{
		Send {enter}
		Sleep KeySleep
		Sleep PageSleep
		Send ^f
		Sleep KeySleep
		SendRaw Account Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		if(clipboard = "Account Number")
		{
			Send {enter}
			Sleep PageSleep
			Sleep LongPageSleep
			Send ^a
			Sleep KeySleepSlow
			SendInput %AccLookup%
			Sleep KeySleepSlow
			Send {enter}
			Sleep PageSleep
			Sleep LongPageSleep
			Sleep LongPageSleep
			Send ^f
			Sleep KeySleep
			SendRaw Print Tax Bill
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send ^c
			Sleep KeySleepSlow
			
			if(clipboard = "Print Tax Bill")
			{
				Sleep KeySleepSlow
				Send {enter}
				Sleep KeySleepSlow
				Send ^f
				Sleep KeySleep
				
				if(AccREPP = "P")
				{
					SendInput Personal Property %Year%
					Sleep KeySleepSlow
				}
				else
				{
					SendInput Real Estate %Year%
					Sleep KeySleepSlow
				}
				
				Sleep KeySleepSlow
				Send {esc}
				Sleep KeySleep
				Send ^c
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				
				if( clipboard = "Real Estate " . Year or clipboard = "Personal Property " . Year )
				{
					Send ^p 
					Sleep KeySleep
					Send {enter}
					Sleep KeySleep	
					SaveFile()
					Sleep KeySleepSlow
					Sleep KeySleep
					InsertQuery()
					Sleep KeySleepSlow
					Send ^w
				}
				else
				{
					Sen := "Bill not current year."
					ErrorNote()
					Send ^w
				}
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		ErrorNote()
	}
	return
}

SmithCounty(){
    Sleep KeySleep
    Send ^f
    Sleep KeySleep
    SendInput %Year%
    Sleep KeySleep
    Sleep KeySleepSlow
    Send {esc}
    Sleep KeySleep
    Send ^c
    Sleep KeySleep
    
    if(clipboard =  Year)
    {
        Send ^f
        Sleep KeySleep
        SendRaw DUE AMOUNT
        Sleep KeySleep
        Send {esc}
        Sleep KeySleepSlow
        Send ^c
        Sleep KeySleep
        
            if(clipboard = "DUE AMOUNT")
            {
                Send ^f
                Sleep KeySleep
                SendRaw E-STATEMENT
                Sleep KeySleep
                Send {esc}
                Sleep KeySleep
                Send {enter}
                Sleep KeySleepSlow
                Sleep PageSleep
                Sleep PageSleep
                Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
                Sleep KeySleepSlow
                Send ^w
            }
            else
            {
                ErrorNote()
            }
    
    }
    else
    {
        ErrorNote()
    }
    return
}

TarrantCounty(){

	Sleep KeySleep
    Send ^f
    Sleep KeySleep
    SendInput %Year%
    Sleep KeySleep
    Sleep KeySleepSlow
    Send {esc}
    Sleep KeySleep
    Send ^c
    Sleep KeySleep
    
    if(clipboard =  Year)
    {
        Send ^f
        Sleep KeySleep
        SendRaw DUE AMOUNT
        Sleep KeySleep
        Send {esc}
        Sleep KeySleepSlow
        Send ^c
        Sleep KeySleep
        
            if(clipboard = "DUE AMOUNT")
            {
			
			Send {right 3}
			Send {shiftdown}{right}{shiftup}
			Sleep KeySleep
			Send ^c
			Sleep KeySleep
			
				if(clipboard <> 0)
				{
					
					Send ^f
					Sleep KeySleep
					SendRaw E-STATEMENT
					Sleep KeySleep
					Send {esc}
					Sleep KeySleep
					Send {enter}
					Sleep KeySleepSlow
					Sleep PageSleep
					Sleep PageSleep
					Send ^p 
					Sleep KeySleep
					Send {enter}
					Sleep KeySleep	
					SaveFile()
					Sleep KeySleepSlow
					Sleep KeySleep
					InsertQuery()
					Sleep KeySleepSlow
					Send ^w
				}
				
				else
				{
					ErrorNote()
				}
            }
            else
            {
                ErrorNote()
            }
    
    }
    else
    {
        ErrorNote()
    }
    return
}


DavidsonCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Search By
		Sleep KeySleep
		Send {esc}
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleep
		Send {down 4}
		Sleep KeySleep
		Send {tab 2}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleep
		Send {enter}
		Sleep PageSleep
		Sleep PageSleep
		
		Sleep KeySleep
		Send ^f
		Sleep KeySleep
		SendRaw View bill
		Sleep KeySleep
		Send {esc}
		Sleep KeySleep
		Send ^c
	    Sleep KeySleep
		
		if(clipboard = "View bill")
		{
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			Sleep PageSleep
			Sleep KeySleep
			Send ^f
			Sleep KeySleep
			SendRaw Print Page
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep
			Send +{tab}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			Sleep PageSleep
			Sleep PageSleep
			Sleep ProgramSleep
			SaveFile()
			InsertQuery()
		}
		else
		{
			ErrorNote()
		}
		return
		
		
		

}

MarionCounty(){

	Click, 1417, 830
	Sleep KeySleep
	Send {tab 2}
	SendInput %AccLookup%
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw No tax bills were found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "No tax bills were found")
	{
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			
			Click, 739, 832
			Sleep KeySleep
			Sleep KeySleepSlow
			Send {tab 2}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep	
			SendRaw View tax bill
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendInput %Year%
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
			Send ^c
			Sleep KeySleep
			
			if(clipboard = Year)
			{
				Sleep PageSleep
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
				Sleep KeySleepSlow
				Send ^w
			
			}
			else
			{
				ErrorNote()
			}			
			
	}
	else
	{
			ErrorNote()
	}
	return

}
PierceCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Pierce County Assessor-Treasurer
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Pierce County Assessor-Treasurer")
	{
		Sleep KeySleepSlow
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return

}

CameronCounty(){

 		Send ^f
		Sleep KeySleep
		SendRaw Original Tax Statement is not available. Please try again later.
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard <> "Original Tax Statement is not available. Please try again later.")
		{
		

			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			

		}
		else
		{
			ErrorNote()
		}
	return



}

CookCounty(){

	SendInput %AccLookup%
	Sleep KeySleep
	Send {enter}
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	Sleep PageSleep
	

		Send ^f
		Sleep KeySleep
		SendRaw Tax Year %PrevYear% Second Installment
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleep
		
		if(clipboard = "Tax Year 2023 Second Installment")
		{
		
			
			Sleep PageSleep
			Sleep PageSleep
			Send {enter}
			Sleep KeySleep
			Sleep ProgramSleep
			SaveFile()
			Sleep KeySleep
			InsertQuery()
			
			Sleep KeySleep
		}
		else
		{
			ErrorNote()
		}	
	
	return
}

MobileCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Server Error
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Server Error")
	{
		Send ^f
		Sleep KeySleep
		SendRaw ASSD. VALUE:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		
		if(clipboard = "ASSD. VALUE:")
		{
		
			Send {right 4}
			Sleep KeySleepSlow
			Send {shiftdown}(right}{right}{shiftup} ;weird issue on website where the two {right} is required even though manually only one right should only be needed
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleepSlow
			Send {right}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			
			if clipboard is number
			{
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
			}
			else
			{
				ErrorNote()
			}
		}
		else
		{
			ErrorNote()
		}		
	}
	else
	{
		ErrorNote()
	}
	return
}

NewOrleansCounty(){
	
	if(AccREPP = "R")
	{

		Send ^f
		Sleep KeySleep
		SendRaw Tax Bill Number:
		Sleep KeySleep
		Send {esc}
		Sleep KeySleep	
		Send {tab}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year% - tax
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = Year . " - tax")
		{
			Send ^f
			Sleep KeySleep
			SendRaw Print this page
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
			Send {enter}
			Sleep KeySleep
			Sleep ProgramSleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Send ^w
			Sleep KeySleep
			Sleep KeySleep
			InsertQuery()
			
		}
		else
		{
			ErrorNote()
		}
	}
	else
	{
		Send ^f
		Sleep KeySleep
		SendRaw Tax Bill Number:
		Sleep KeySleep
		Send {esc}
		Sleep KeySleep	
		Send {tab}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = Year)
		{
			Send ^f
			Sleep KeySleep
			SendRaw Print this page
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
			Send {enter}
			Sleep KeySleep
			Sleep ProgramSleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Send ^w
			Sleep KeySleep
			Sleep KeySleep
			InsertQuery()
			
		}
		else
		{
			ErrorNote()
		}
	
	
	}
	return
	
	




}

ClarkCountyNV(){
	
	Send ^f
	Sleep KeySleep
	SendRaw No record found for your selection
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

		if(clipboard <> "No record found for your selection")
		{
			Send ^f
			Sleep KeySleep
			SendRaw %Year%
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
			Send ^c
			Sleep KeySleep	
			
			if(clipboard = Year)
			{
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				InsertQuery()
				
			}
			else
			{
				ErrorNote()
			}
			
		}
		else
		{
				ErrorNote()
		}
		return
}

WakeCountyNC(){

	Send ^f
	Sleep KeySleep
	SendRaw %AccLookup%-%Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = %AccLookup% . "-" . %Year%)
		{
			
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			Send ^f
			Sleep KeySleep
			SendRaw Taxbill search
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep	
			Send {tab}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			
		}
		else
		{
			ErrorNote()
		}
return

}	

NuecesCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Print a current tax statement
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
		if(clipboard = "Print a current tax statement")
		{
			
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			Send ^f
			Sleep KeySleep
			SendRaw >> here <<
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep	
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			
		}
		else
		{
			ErrorNote()
		}
return

}

BIS(){
	Send, ^f
	Sleep, KeySleep
	SendRaw, Property Not Found
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
	
	;Look for Property Not Found, if found go to ErrorNote
	if(clipboard = "Property Not Found")
	{
		ErrorNote()
	}
	else
	{
		Send, ^f
		Sleep, KeySleep
		SendRaw, Assessed Value:
		Sleep, KeySleep
		Send, {esc}
		Sleep, KeySleep
		Send, {right 3}
		Sleep, KeySleep
		Send, {shiftdown}{right}{shiftup}
		Sleep, KeySleep
		Send, ^c
		Send, {right}
		Sleep, KeySleep
			
		if((clipboard is number) and (not InStr(clipboard, "/")))
		{
				Send ^p 
				Sleep KeySleep
				Send {enter}
				Sleep KeySleep	
				SaveFile()
				Sleep KeySleepSlow
				Sleep KeySleep
				Sleep KeySleep
				Sleep KeySleep
				Sleep KeySleep
				InsertQuery()
		}
		else
		{
			ErrorNote()
		}
	}
	return
}

KnoxvilleCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw current tax year:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	;Search for Assessed Value and navigate to value to determine if it is numeric or not
		Send, ^f
		SendRaw, Assessed Value
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		Send, {right 6}
		Send, {shiftdown}{right}{right}{right}{right}{right}{right}{right}{shiftup}
		Sleep, KeySleepSlow
		Send, ^c
		Send, {right}
		Sleep, KeySleep
			
		if(clipboard = Year)
		{
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			
		}
		else
		{
			ErrorNote()
		}
return

}

CypressCounty(){

		Send ^f
	Sleep KeySleep
	SendRaw current tax statement
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
		if(clipboard = "current tax statement")
		{
			
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			Send ^f
			Sleep KeySleep
			SendRaw >> here <<
			Sleep KeySleep
			Send {esc}
			Sleep KeySleep	
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			
		}
		else
		{
			ErrorNote()
		}
return


}

PiercePPCounty(){

	Send ^f
	Sleep KeySleepSlow
	SendRaw 2023 values for %Year% tax
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep	

		if(clipboard = "2023 values for " . %Year% . " tax")
		{
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
		}
		else
		{
				ErrorNote()
		}		
	return



}

ElpasoCounty(){
;use the alternateid
	Send ^f
	Sleep KeySleep
	SendRaw >> here <<
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
		if(clipboard = ">> here <<")
		{
			
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			Sleep KeySleep
			
			
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			Sleep KeySleep
			Sleep KeySleep
			Send, ^w
			
		}
		else
		{
			ErrorNote()
		}
return

}


BaltimoreCountyPP(){
		Send ^f
		Sleep KeySleep
		SendRaw tax year
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
	
			if(clipboard = Year)
			{

				Send ^f
				Sleep KeySleep
				SendRaw, tax amount
				Sleep, KeySleepSlow
				Send, {esc}
				Sleep, KeySleepSlow
				Send, {right 3}
				Send, {shiftdown}{right}{shiftup}
				Sleep, KeySleepSlow
				Send, ^c
				Send, {right}
				Sleep, KeySleep
					
					if((clipboard is number) and (not InStr(clipboard, "/")))
					{
						
					
						Send ^p 
						Sleep KeySleep
						Send {enter}
						Sleep KeySleep	
						SaveFile()
						Sleep KeySleepSlow
						Sleep KeySleep
						InsertQuery()
						Sleep KeySleep
						
					}
					else
					{
						ErrorNote()
					}
			}
			else
			{
				ErrorNote()
			}		
		


	
	return



}
PotterCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Not found
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard <> "not found")
		{
						Send ^p 
						Sleep KeySleep
						Send {enter}
						Sleep KeySleep	
						SaveFile()
						Sleep KeySleepSlow
						Sleep KeySleep
						InsertQuery()
						Sleep KeySleep
		
		}
		else
		{
			ErrorNote()
		}		
	return

}	

DurhamCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw tax year
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
	
			if(clipboard = Year)
			{

				Send ^f
				Sleep KeySleep
				SendRaw, total appraised land value
				Sleep, KeySleepSlow
				Send, {esc}
				Sleep, KeySleepSlow
				Send, {right 3}
				Send, {shiftdown}{right}{shiftup}
				Sleep, KeySleepSlow
				Send, ^c
				Send, {right}
				Sleep, KeySleep
					
					if((clipboard is number) and (not InStr(clipboard, "/")))
					{
						
					
						Send ^p 
						Sleep KeySleep
						Send {enter}
						Sleep KeySleep	
						SaveFile()
						Sleep KeySleepSlow
						Sleep KeySleep
						InsertQuery()
						Sleep KeySleep
						
					}
					else
					{
						ErrorNote()
					}
			}
			else
			{
				ErrorNote()
			}		
		


	
	return



}
ClarkCountyIL(){

		Send ^f
		Sleep KeySleep
		SendRaw %AccLookup%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
	
			if(clipboard = AccLookup)
			{
			
						Send ^f
						Sleep KeySleep
						SendRaw download
						Sleep KeySleepSlow
						Send {enter}
						Send {enter}				
						Sleep KeySleep
						Send {esc}
						Sleep KeySleep
						Send {enter}
						Sleep KeySleep
						Sleep KeySleep
						Sleep KeySleep
						Sleep KeySleep	
						SaveFile()
						Sleep KeySleepSlow
						Sleep KeySleep
						InsertQuery()
						Sleep KeySleep
						
					
			}
			else
			{
				ErrorNote()
			}		
		


	
	return

}

CuyahogaCounty(){


		Send {tab}
		Send {tab}
		Send {tab}
		Sleep KeySleep
		SendInput %AccLookup%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw tax by year
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send {enter}
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		
		
		Send ^f
		Sleep KeySleep
		SendRaw summary by tax year %PrevYear% pay %Year% 
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = "summary by tax year " . PrevYear . " pay " . Year)
		{
						Send ^f
						Sleep KeySleep
						SendRaw download this report
						Sleep KeySleepSlow
						Send {esc}
						Sleep KeySleep
						Send {enter}
						Sleep KeySleep
						Sleep KeySleep
						Sleep KeySleep
						Sleep KeySleep
		
			
						SaveFile()
						Sleep KeySleepSlow
						Sleep KeySleep
						InsertQuery()
						Sleep KeySleep
		
		}
		else
		{
			ErrorNote()
		}		
	return


}

FranklinCounty(){




}

AdobeSavePDF(){
	Sleep PageSleep
	
	;Turn off mouse cursor before print to remove cursor from PDF document
	Send {f7}
	Sleep KeySleep
	
	;Save Webpage as PDF	
	Send, ^+p
	Sleep, KeySleep
	Sleep PageSleep
	SendRaw, Adobe PDF
	Sleep, KeySleep
	Send, {enter}
	Sleep, KeySleepSlow
	Sleep, KeySleepSlow
	Sleep, KeySleepSlow	
	Sleep PageSleep
	Sleep PageSleep
	Sleep ProgramSleep
	SaveFile()
	InsertQuery()
}

SaveFile(){
	Sleep PageSleep
	
	;Turn off mouse cursor before print to remove cursor from PDF document
	Send {f7}
	Sleep KeySleep

	;If website works set SiteWorking column to "Yes"
	Col := 6
	if(SEN = "")
	{
		XL.ActiveSheet.Cells(Row, Col).Value := "Yes"
	}
	else
	{
		XL.ActiveSheet.Cells(Row, Col).Value := SEN
		SEN := ""
	}
	
	;Adjust Values for Excel sheet and get file save destination
	Col := 8
	SaveDirectory := XL.ActiveSheet.Cells(Row, Col).Value
	
	Sleep PageSleep
	SendInput, %SaveDirectory%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {left}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	;Row++
}

InsertQuery(){
	Col := 9
	;InsQry := SubStr(XL.ActiveSheet.Cells(Row, Col).Value, 2, StrLen(XL.ActiveSheet.Cells(Row, Col).Value)-2)
	InsQry := XL.ActiveSheet.Cells(Row, Col).Value
	clipboard := InsQry
	;WinActivate PVSLocal (tso) on PVSLocal - Interactive SQL
	WinActivate PVSData (tso) on PVSData - Interactive SQL
	;WinActivate Interactive SQL
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send ^v
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	SendInput Commit;
	Sleep KeySleepSlow
	Send {F9}
	Sleep KeySleepSlow
	Send ^a
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {Backspace}
	Sleep KeySleepSlow
	Send !{tab}
	Sleep KeySleepSlow
	Row++
}

ErrorNote(){
	;Turn of mouse cursor before print to remove cursor from PDF document
	Send {f7}
	Sleep KeySleep

	Col := 7
	;If website is dead automatically set SiteWorking column to "No"
	if(SEN = "")
	{
		XL.ActiveSheet.Cells(Row, Col).Value := "No"
	}
	else
	{
		XL.ActiveSheet.Cells(Row, Col).Value := SEN
		SEN := ""
	}
	Col := 7
	Row++
	Sleep, KeySleep
	return
}