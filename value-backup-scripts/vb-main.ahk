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
;SourceFile := "C:\Users\User1\OneDrive - Property Valuation Services (1)\Documents\Value_MasterScript" . FileSave

;Run, dbisql.exe


;Open Excel File
global XL := ComObjCreate("Excel.Application")
XL.Visible := TRUE
;XL.Workbooks.Open(SourceFile . ".csv")
XL.Workbooks.Open("C:\Users\User1\Desktop\Test.csv")
Sleep, EXEOpen

;Col Starts at AccountLookupString and  Row skips first Row of Excel sheet
;Set Row and Col, start Row at 1 if no header else 2 with header.
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

Loop, % RC
{	
	
	Col := 2
	global AccNum := XL.ActiveSheet.Cells(Row, Col).Value
	
	Col := 4
	AccWeb := XL.ActiveSheet.Cells(Row, Col).Value
	
	;Set CollectorID
	Col := 6
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
		Case 252:
			Sleep, PageSleep
			CollinCAD()
		Case 14366, 14363, 14368, 14367, 14370, 14365, 14369, 14364:
			Sleep, PageSleep
			CookCountyIL()	
		Case 79:
			Sleep, PageSleep
			HenryCounty()
		Case 67:
			Sleep, PageSleep
			CheerokeeCounty()		
		Case 782:
			Sleep, PageSleep
			FayetteCounty()	
		Case 725:
			Sleep, PageSleep
			ForsythCountyGA()	
		Case 77:
			Sleep, PageSleep
			HallCounty()
		Case 540:
			Sleep, PageSleep
			PauldingCounty()
		Case 70:
			Sleep, PageSleep
			CowetaCounty()
		Case 779:
			Sleep, PageSleep
			GlynnCounty()	
		Case 2029:
			Sleep, PageSleep
			JohnsonCountyIA()
		Case 211:
			Sleep, PageSleep
			DouglasCountyNE()
		Case 428:
			Sleep, PageSleep
			BullochCounty()
		Case 391:
			Sleep, PageSleep
			DekalbCounty()		
		Case 254:
			Sleep, PageSleep
			DallasCAD()
		Case 8512:
			Sleep, PageSleep
			SarpyCounty()
		Case 538:
			Sleep, PageSleep
			ClarkeCounty()
		Case 390:
			Sleep, PageSleep
			ClaytonCounty()	
		Case 260:
			Sleep, PageSleep
			REHarrisCAD()
		Case 276:
			Sleep, PageSleep
			SmithCAD()
		Case 278:
			Sleep, PageSleep
			TarrantCAD()
		;This will cover all URLs with "esearch"
		Case 257, 259, 263, 267, 271, 272, 275, 441, 552, 663, 735, 737, 1052, 11233, 11245, 11283, 11291, 11309, 11311, 11332:
			Sleep, PageSleep
			BIS()
		Case 11347, 11348, 11364, 11381, 11393, 11404, 11413, 11453, 11473, 261, 258, 11227, 279, 11244, 11426, 11265, 610:
			Sleep, PageSleep
			BIS()
		Case 553, 11370:
			Sleep, PageSleep
			PropDetailCAD()
		Case 11406:
			Sleep, PageSleep
			PotterRandallCAD()
		Case 55:
			Sleep PageSleep
			HillsTRIM()
		Case 60:
			Sleep PageSleep
			PalmTRIM()
		Case 618:
			Sleep PageSleep
			LeeTRIM()
		Case 601:
			Sleep PageSleep
			SanDiegoCAD()
		Case 29:
			;Will only go through if account number is 13 digits long
			;If not excel sheet will have special not saying account number did not meet required length
			AccNum := StrReplace(AccNum, "-", "")
			Length := StrLen(AccNum)
			if(Length = 13)
			{
				Sleep PageSleep
				SanBernardinoCAD()
			}
			else
			{
				SEN := "Account length incorrect"
				ErrorNote()
			}
		Case 213:
			Sleep PageSleep
			ClarkCAD()
		Case 175:
			Sleep PageSleep
			ClayCounty()	
		;This will cover all URLs with "propaccess" or "trueautomation"
		Case 210:
			Sleep PageSleep
			WakeCounty()
		Case 903:
			Sleep PageSleep
			PimaCounty()
		Case 109:
			Sleep PageSleep
			JohnsonCounty()	
		Case 111:
			Sleep PageSleep
			SedgwickCounty()
		Case 722:
			Sleep PageSleep
			MaricopaCounty()
		Case 283:
			Sleep PageSleep
			SaltLakeCounty()
		Case 1142:
			Sleep PageSleep
			PolkCounty()
		Case 898:
			Sleep PageSleep
			WilliamsonCounty()
		Case 13996:
			Sleep PageSleep
			PierceRECounty()
		Case 13959:
			Sleep PageSleep
			KingRECounty()
		Case 14041:
			Sleep PageSleep
			SpokaneCounty()
		Case 179:
			Sleep PageSleep
			JacksonCounty()
		Case 240:
			Sleep PageSleep
			HorryCounty()
		Case 14025:
			Sleep PageSleep
			CarbondaleTJCounty()
		Case 20:
			Sleep PageSleep
			MaricopaPPCounty()	
		Case 207:
			Sleep PageSleep
			NewHanoverCounty()
		Case 200:
			Sleep PageSleep
			BuncombleCounty()
		Case 206:
			Sleep PageSleep
			MecklenburgCounty()
		Case 533:
			Sleep PageSleep
			ShelbyCounty()
		Case 564:
			Sleep PageSleep
			BernalilloCounty()
		Case 187:
			Sleep PageSleep
			StlouisCounty()
		Case 424:
			Sleep PageSleep
			BrowardCounty()
		Case 686:
			Sleep PageSleep
			ShelbyCountyTN()
		Case 433:
			Sleep PageSleep
			ShawneeCounty()
		Case 229:
			Sleep PageSleep
			TulsaCounty()
		Case 112:
			Sleep PageSleep
			WyandotteCounty()
		Case 392:
			Sleep PageSleep
			FultonCounty()
		Case 250:
			Sleep PageSleep
			CameronCounty()
		Case 255, 11454, 273, 249, 264, 940, 11223, 11256, 11313, 11268, 956, 860, 651, 11222, 11327, 269, 11405, 11247, 6222:
			Sleep PageSleep
			TruAuto()
		Case 11451, 11314, 11241, 1022, 11224, 11472, 11464, 11292, 11279, 11264, 11243, 266, 11471, 11248, 11448, 11361, 11440, 652:
			Sleep PageSleep
			TruAuto()
		Case 622:
			Sleep PageSleep
			TruAuto()	
		Case 527:
			Sleep PageSleep
			DonaAnaCounty()
		Case 68:
			Sleep PageSleep
			CobbCounty()
		Case 35:
			Sleep PageSleep
			DenverCounty()
		Case 33:
			Sleep PageSleep
			ArapahoeCounty()
		Case 51:
			Sleep PageSleep
			MiamiDadeCounty()
		Case 52:
			Sleep PageSleep
			DuvalCounty()
		Case 476:
			Sleep PageSleep
			BrevardCounty()
		Case 49:
			Sleep PageSleep
			BayCounty()
		Case 59:
			Sleep PageSleep
			OrangeCountyFL()
		Case 228:
			Sleep PageSleep
			OklahomaCountyOK()
		Case 136:
			Sleep PageSleep
			EastBatonRPCounty()
		Case 201:
			Sleep PageSleep
			CatawbaCounty()
		Case 426:
			Sleep PageSleep
			HarrisonCounty()
		Case 142:
			Sleep PageSleep
			JeffersonParishCounty()
		Case 758:
			Sleep PageSleep
			MobileCounty()
		Case 66, 85, 799, 1903, 1777, 542, 767:
			Sleep PageSleep
			BibbCounty()	
		Case 11459:
			Sleep PageSleep
			WebbCounty()
		Case 65:
			Sleep PageSleep
			BartowCounty()	
		Case 937:
			Sleep PageSleep
			HoustonCounty()	
		Case 73:
			Sleep PageSleep
			DouglasCountyGA()	
		Case 11907:
			Sleep PageSleep
			PiercePPCounty()
		Case 280:
			Sleep PageSleep
			TravisCounty()
		Case 256:
			Sleep PageSleep
			ElPasoCounty()
		Case 11417:
			Sleep PageSleep
			RockwallCounty()
		Case 15:
			Sleep PageSleep
			PulaskiCounty()
		Case 530:
			Sleep PageSleep
			SpokanePPCounty()
		Case 7:
			Sleep PageSleep
			MadisonCounty()	
		Case 241:
			Sleep PageSleep
			DavidsonCounty()
		Case 14256:
			Sleep PageSleep
			FranklinRECounty()
		Case 62:
			Sleep PageSleep
			PolkFLCounty()
		Case 334:
			Sleep PageSleep
			HindsCounty()
		Case 63:
			Sleep PageSleep
			SarasotaCounty()
		Case 36:
			Sleep PageSleep
			DouglasCounty()
		Case 9369:
			Sleep PageSleep
			EddyCounty()
		Case 11329:
			Sleep PageSleep
			HoodCounty()
		Case 155:
			Sleep PageSleep
			StTammanyParishCounty()
		Case 354:
			Sleep PageSleep
			EscambiaCounty()
		Case 284:
			Sleep PageSleep
			UtahCounty()
		Case 683:
			Sleep PageSleep
			WashoeCounty()
		Case 177:
			Sleep PageSleep
			GreeneCounty()
		Case 149:
			Sleep PageSleep
			OuachitaCounty()
		Case 759:
			Sleep PageSleep
			CollierCounty()
		Case 202:
			Sleep PageSleep
			CumberlandCounty()
		Case 188:
			Sleep PageSleep
			StCharlesCounty()
		Case 393:
			Sleep PageSleep
			GwinnettCounty()
		Case 524:
			Sleep PageSleep
			JeffersonBirminghamCounty()
		Case 204:
			Sleep PageSleep
			GuilfordCounty()
		Case 673:
			Sleep PageSleep
			ForsythCounty()	
		Case 81:
			Sleep PageSleep
			MuscogeeCounty()
		Case 752:
			Sleep PageSleep
			ManateeCounty()	
		Case 757:
			Sleep PageSleep
			OsceolaCounty()	
		Case 50:
			Sleep PageSleep
			CharlotteCounty()
		Case 48:
			Sleep PageSleep
			AlachuaCounty()
		Case 625:
			Sleep PageSleep
			WaltonCounty()	
		Case 355:
			Sleep PageSleep
			ClayFLCounty()
		Case 1745:
			Sleep PageSleep
			StJohnFLCounty()
		Case 394:
			Sleep PageSleep
			RichmondCounty()
		Case 910:
			Sleep PageSleep
			MarionCounty()
		Case 1732:
			Sleep PageSleep
			NassauCounty()
		Case 58:
			Sleep PageSleep
			OkaloosaCounty()	
		Case 1724:
			Sleep PageSleep
			LevyCounty()
		Case 715:
			Sleep PageSleep
			ChathamCounty()
		Case 788:
			Sleep PageSleep
			FlaglerCounty()
		Case 1711:
			Sleep PageSleep
			HardeeCounty()
		Case 1707:
			Sleep PageSleep
			GilchristCounty()
		Case 1718:
			Sleep PageSleep
			JacksonFLCounty()
		Case 1716:
			Sleep PageSleep
			HolmesFLCounty()
		Case 466:
			Sleep PageSleep
			MartinFLCounty()
		Case 1296:
			Sleep PageSleep
			PolkARCounty()
		Case 1709:
			Sleep PageSleep
			GulfFLCounty()
		Case 1694:
			Sleep PageSleep
			CalhounFLCounty()
		Case 57:
			Sleep PageSleep
			MonroeFLCounty()
		Case 486:
			Sleep PageSleep
			PutnamFLCounty()
		Case 64:
			Sleep PageSleep
			SeminoleFLCounty()
		Case 54:
			Sleep PageSleep
			HighlandsFLCounty()
		Case 11:
			Sleep PageSleep
			ArkansasARCounty()
		Case 1243:
			Sleep PageSleep
			BentonARCounty()
		Case 16:
			Sleep PageSleep
			SalineARCounty()
		Case 1297:
			Sleep PageSleep
			PopeARCounty()
		Case 1259:
			Sleep PageSleep
			DallasARCounty()
		Case 1260:
			Sleep PageSleep
			DeshaARCounty()
		Case 1255:
			Sleep PageSleep
			CraigheadARCounty()	
		Case 1244:
			Sleep PageSleep
			BooneARCounty()
		Case 1307:
			Sleep PageSleep
			StFrancisARCounty()
		Case 548:
			Sleep PageSleep
			SebastianARCounty()
		Case 13:
			Sleep PageSleep
			FaulknerARCounty()	
		Case 1257:
			Sleep PageSleep
			CrittendenARCounty()
		Case 1242:
			Sleep PageSleep
			BaxterARCounty()
		Case 363:
			Sleep PageSleep
			ChicotARCounty()
		Case 1245:
			Sleep PageSleep
			BradleyARCounty()
		Case 164:
			Sleep PageSleep
			MarylandStateCounty()	
		Case 373:
			Sleep PageSleep
			PhillipsARCounty()
		Case 1253:
			Sleep PageSleep
			ColumbiaARCounty()
		Case 357:
			Sleep PageSleep
			SantaRosaCounty()
		Case 703:
			Sleep PageSleep
			VolusiaCounty()	
		Case 1699:
			Sleep PageSleep
			ColumbiaAFLCounty()
		Case 1689:
			Sleep PageSleep
			BakerCounty()
		Case 801:
			Sleep PageSleep
			LeonCounty()
		Case 1131:
			Sleep PageSleep
			GarlandCounty()
		Case 17:
			Sleep PageSleep
			WashingtonCounty()
		Case 14:
			Sleep PageSleep
			JeffersonARCounty()
		Case 392:
			Sleep PageSleep
			FultoCounty()			
		Case 392:
			Sleep PageSleep
			FultoCounty()
		Case 53:
			Sleep PageSleep
			HernandoCounty()
		Case 282:
			Sleep PageSleep
			DavisCountyUT()			
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

MsgBox, Script Complete!

CollinCAD(){
	Send, ^f
	Sleep, KeySleep
	SendRaw, Legal Description
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Send, {right}
	Sleep, KeySleepSlow
	
	if(clipboard = "Legal Description")
	{
		;Check for values
		Send, ^f
		Sleep, KeySleep
		SendInput, %Year% tax year is unavailable
		Sleep, KeySleep
		Send, {esc}
		Send, ^c
		Sleep, KeySleep
	
		;Check for above, if wording exists do not copy webpage as pdf else copy webpage as pdf
		if(clipboard = Year . " tax year is unavailable")
		{
			ErrorNote()	
		}
		else
		{
			;Search for Assessed Value and navigate to value to determine if it is numeric or not
			Send, ^f
			Sleep, KeySleep
			SendRaw, Assessed Value
			Sleep, KeySleep
			Send, {esc}
			Sleep, KeySleep
			Send, {right 3}
			Sleep, KeySleepSlow
			Send, {shiftdown}{right}{shiftup}
			Sleep, KeySleepSlow
			Send, ^c
			Send, {right}
			Sleep, KeySleep
			
			if((clipboard is number) and (not InStr(clipboard, "/")))
			{
				AdobeSavePDF()
			}
			else
			{
				ErrorNote()
			}
		}
	}
	else
	{
		ErrorNote()
	}
	return
}



ClayCounty(){
;javascript:document.getElementsByClassName("sorting_1")[0].click(
    Send ^f
	Sleep KeySleep
	SendRaw Containing
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	SendInput %AccNum%
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleepSlow
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	
	
	if(clipboard = AccNum)
	{
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
	
		Send ^f
		Sleep KeySleep
		SendRaw value
		Sleep KeySleepSlow
		Send {esc}
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
		
	}
	else
	{
		ErrorNote()
	}
	return


}




ClarkCAD(){
	Send ^f
	Sleep KeySleep
	SendRaw Business Personal Property Record
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw REAL PROPERTY ASSESSED VALUE
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	if((clipboard = "Business Personal Property Record") or (clipboard = "REAL PROPERTY ASSESSED VALUE"))
	{
		Send ^f
		Sleep KeySleep
		SendRaw Adjusted Assessed Value
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {right 2}
		Sleep KeySleepSlow
		Send {shiftdown}{right}{shiftup}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
		Send {left}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Total Assessed Value
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {right 2}
		Sleep KeySleepSlow
		Send {shiftdown}{right}{shiftup}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
		Send {left}
		Sleep KeySleepSlow
			
		if((clipboard is number) and (not InStr(clipboard,"`r")))
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

DallasCAD(){
	;Check for values
	Send, ^f
	Sleep, KeySleep
	SendInput, %Year% Proposed Values
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
	
	;Check for above, if wording exists do not copy webpage as pdf else copy webpage as pdf
	if(clipboard = Year . " Proposed Values")
	{
		clipboard := 
		;Check for value if it is numeric or not
		Send, ^f
		Sleep, KeySleep
		SendRaw, Market Value:
		Sleep, KeySleep
		Send, {esc}
		Sleep, KeySleep
		Send, {right 2}
		Sleep, KeySleep
		Send, {down 2}
		Sleep, KeySleepSlow
		Send, {home}
		Sleep, KeySleep
		Send, {right 2}
		Sleep, KeySleep
		Send, {shiftdown}{right}{shiftup}
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

HillsTRIM(){
	Send ^f
	Sleep KeySleep
	SendRaw INVALID ACCOUNT NUMBER PROVIDED
	Sleep KeySleep
	Send {esc}
	Send ^c
	Sleep KeySleep
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw Current TRIM statement not available
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Send ^c
	Sleep KeySleep
	
	if((clipboard <> "INVALID ACCOUNT NUMBER PROVIDED") or (clipboard <> "Current TRIM statement not available"))
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

DouglasCountyNE(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow	

	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Parcel Number")
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

LeeTRIM(){
	Send ^f
	Sleep KeySleep
	SendRaw No Trim notice available for this parcel
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {esc}
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "No Trim notice available for this parcel")
	{
		AdobeSavePDF()
	}
	else
	{
		ErrorNote()
	}
}

PalmTRIM(){
	Send ^f
	Sleep KeySleep
	SendRaw Server Error
	Sleep KeySleep
	Send {esc}
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Server Error")
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

PPHarrisCAD(){
	Send, ^f
	Sleep, KeySleep
	SendRaw, Description
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
		
	;Look for Description in TrueAutomation website
	if(clipboard = "Description")
	{
		;Check for values
		Send, ^f
		Sleep, KeySleep
		SendRaw, All Values Pending
		Sleep, KeySleep
		Send, {esc}
		Send, ^c
		Sleep, KeySleep
	
		;Check for above, if wording exists do not copy webpage as pdf else copy webpage as pdf
		if(clipboard <> "All Values Pending")
		{
			Sleep PageSleep
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
	return
}

REHarrisCAD(){
	Send, ^f
	Sleep, KeySleep
	SendRaw, 13-Digit Account Number
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Send, {right}
	Sleep, KeySleepSlow
	if(clipboard = "13-Digit Account Number")
	{
		Send, {tab 2}
		Sleep, KeySleep
		SendInput, %AccNum%
		Sleep, KeySleepSlow
		Send, {enter}
		Sleep, PageSleep
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		
		Send, ^f
		SendRaw, PLEASE TRY AGAIN
		Sleep, KeySleepSlow
		Send, {esc}
		Send, ^c
		Send, {right}
		Sleep, KeySleepSlow
		
		if(clipboard <> "PLEASE TRY AGAIN")
		{
			Send, ^f
			Sleep, KeySleepSlow
			SendRaw, All Values Pending
			Sleep, KeySleep
			Send, {esc}
			Send, ^c
			Send, {right}
			Sleep, KeySleepSlow
	
			;Check for above, if wording exists do not copy webpage as pdf else copy webpage as pdf
			if(clipboard <> "All Values Pending")
			{
				Send, ^f
				Sleep, KeySleep
				SendRaw, Print
				Sleep, KeySleep
				Send, {esc}
				Send, ^c
				Sleep, KeySleepSlow
			
				if(clipboard = "Print")
				{
					Send, {enter}
					Sleep, PageSleep
					Sleep, KeySleepSlow
					Send ^p 
					Sleep KeySleep
					Send {enter}
					Sleep KeySleep	
					SaveFile()
					Sleep KeySleepSlow
					Sleep KeySleep
					InsertQuery()
					Send, ^w
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
		PPHarrisCAD()
	}	
	return
}

SmithCAD(){
	Send, ^f
	Sleep, KeySleep
	SendRaw, Property Detail
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Send, {right}
	Sleep, KeySleep
	
	;Look for Property Detail in Smith website
	if(clipboard =  "Property Detail")
	{
		
		
		Send ^f
		Sleep KeySleep
		SendRaw Tax Year: %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = "Tax Year: " . Year)
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

TarrantCAD(){	
	
	
	Send, ^f
	Sleep, KeySleep
	SendRaw, value notice
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
	

	if(clipboard = "value notice")
	{
			
			Sleep, KeySleep
			Sleep, KeySleep
			Sleep, KeySleep
			Sleep KeySleep
			Send {enter}
			Sleep, KeySleep
			Sleep, KeySleep
			Sleep, KeySleep
			Sleep, KeySleep
			
			SaveFile()
			Sleep, KeySleep
			Sleep, KeySleep
			Sleep, KeySleep
		
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

PropDetailCAD(){
	Send, ^f
	Sleep, KeySleep
	SendInput, %Year% Assessed Value
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
	Send {right}
	Sleep, KeySleep
	
	Send, ^{home}
	Sleep, KeySleep
	
	Send, ^f
	Sleep, KeySleep
	SendInput, %Year% Market Value
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Sleep, KeySleep
	Send {right}
	Sleep, KeySleep
	
	if((clipboard = Year . " Assessed Value") or (clipboard = Year . " Market Value"))
	{
		Send, ^f
		SendRaw, Total Assessed Value
		Sleep, KeySleep
		Send, {esc}
		Sleep, KeySleep
		Send, {right 3}
		Sleep, KeySleep
		Send, {shiftdown}{right}{shiftup}
		Sleep, KeySleep
		Send, ^c
		Sleep, KeySleep
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
	
}

PotterRandallCAD(){
	;if(SearchAcc = "#C#")
	;{
	;	Send, {tab 5}
	;	SendInput, %AccNum%
	;}

	Send, ^f
	Sleep, KeySleep
	SendRaw, Legal Description
	Sleep, KeySleep
	Send, {esc}
	Send, ^c
	Send, {right}
	Sleep, KeySleep

	if(clipboard = "Legal Description")
	{
		Send, ^f
		Sleep, KeySleep
		SendRaw, Net Appraised
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

SanBernardinoCAD(){
	Sleep, PageSleep
	Send, ^f
	Sleep, KeySleep
	SendRaw, An error occurred
	Sleep, KeySleepSlow
	Send, {esc}
	Sleep, KeySleep 
	Send, ^c
	Sleep, KeySleep
	
	if(clipboard <> "An error occurred")
	{
		Sleep, PageSleep
		Send, {tab 8}
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {enter}
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		SaveFile()
		InsertQuery()
	}
	else
	{
		ErrorNote()
	}
	return
}

SanDiegoCAD(){
	;Check if SDA County website
	Send, ^f
	Sleep, KeySleep
	SendInput, %Year% Secured Assessment Roll
	Sleep, KeySleep
	Sleep, KeySleepSlow
	Send, {esc}
	Sleep, KeySleep
	Send, ^c
	Sleep, KeySleep
	
	if(clipboard = Year . " Secured Assessment Roll")
	{
		Send, {tab}
		Sleep, KeySleep
		Send, {enter}
		Sleep, KeySleep
		Send, {down 2}
		Sleep, KeySleepSlow
		Send, {tab}
		Sleep, KeySleep
		Send, {tab 2}
		Sleep, KeySleepSlow
		SendInput, %AccNum%
		Sleep, KeySleep
		Sleep, KeySleepSlow
		Send, {enter}		
		Sleep, KeySleep
		
		;Check if valid Parcel#
		clipboard := 
		Send, ^f
		Sleep, KeySleep
		SendRaw, No Property Found
		Sleep, KeySleep
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleep
		Send, ^c
		Sleep, KeySleep
		
		Send, ^f
		Sleep, KeySleep
		SendRaw, Invalid Parcel Number format
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleep
		Send, ^c
		Sleep, KeySleep
		
		if((clipboard <> "No Property Found") and (clipboard <> "Invalid Parcel Number format"))
		{
			Send, {tab}
			Sleep, KeySleepSlow
			Sleep, KeySleepSlow
			Send, {tab 4}
			Sleep, KeySleepSlow
			Send, {enter}
			Sleep, KeySleepSlow
			Sleep, KeySleepSlow
			Sleep, KeySleepSlow
			AdobeSavePDF()
			Send, ^w
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

TruAuto(){	

	
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
		SendRaw, Assessed Value:
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		Send, {right 5}
		Sleep, KeySleepSlow
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

WakeCounty(){

	
	
	Send ^f
	Sleep KeySleep
	SendRaw tax bill
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendInput %PrevYear%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = PrevYear)
	{
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleep
		SendRaw Tax Bill Search
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
		Sleep ProgramSleep
		Sleep ProgramSleep
		
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleep
		Send ^w
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

PimaCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Parcel:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleep
	Send {enter}
	Sleep ProgramSleep
	Sleep ProgramSleep
	Sleep ProgramSleep
	
	
	Send ^f
	Sleep KeySleep
	SendInput Parcel Number: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Parcel Number: " . AccNum)
	{
	
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Send {left}
		Sleep KeySleep
		Send {enter}
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

JohnsonCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Search for:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleep
	Send {enter}
	Sleep ProgramSleep
	Sleep ProgramSleep
	Sleep ProgramSleep
	
	
	Send ^f
	Sleep KeySleep
	SendInput Appraisal Information
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep

	if(clipboard = "Appraisal Information")
	{
		Sleep KeySleepSlow
		SendInput ^l{Raw}javascript:document.getElementsByClassName("buttonstyle")[0].click()
		Send {Enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Send {left}
		Sleep KeySleep
		Send {enter}
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
		SendRaw No properties were found for the specified search criteria.
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send ^c
		Sleep KeySleep
		
		if(clipboard <> "No properties were found for the specified search criteria.")
		{
			
			Send ^f
			Sleep KeySleep
			SendRaw Details
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send {enter}
			Sleep LongPageSleep
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			
			
			Send ^f
			Sleep KeySleepSlow
			SendRaw Property Details
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleep
			
			if(clipboard = "Property Details")
			{	
			
				Send ^f
				Sleep KeySleep
				SendRaw Print
				Sleep KeySleepSlow
				Send {esc}
				Sleep KeySleepSlow
				Send {enter}
				Sleep LongPageSleep
				Sleep KeySleepSlow
				Sleep KeySleepSlow
				Send {enter}
				Sleep KeySleepSlow
				SaveFile()
				Sleep KeySleepSlow
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

MaricopaCounty(){

	Send ^f
	Sleep KeySleepSlow
	SendRaw Parcel not found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send ^c
	Sleep KeySleep	

		if(clipboard <> "Parcel not found")
		{
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
		
			SaveFile()
			Send {left}
			Sleep KeySleep
			Send {enter}
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

SaltLakeCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw printer friendly version
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "printer friendly version")
	{
		Send {enter}
		Sleep KeySleepSlow
		Sleep LongPageSleep
		Sleep KeySleepSlow
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

PolkCounty(){

	

	
	Send ^f
	Sleep KeySleep
	SendRaw current values
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "current values")
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

WilliamsonCounty(){
	;IL
	Sleep ProgramSleep
	Sleep ProgramSleep
	Sleep ProgramSleep
	Send ^f
	Sleep KeySleep
	SendRaw PIN Number: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "PIN Number: " . AccNum)
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		
	}
	else
	{
		ErrorNote()
	}
	return



}

PierceRECounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw Assessment Details
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "Assessment Details")
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		
	}
	else
	{
		ErrorNote()
	}
	return

}

KingRECounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = AccNum)
	{
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		
	}
	else
	{
		ErrorNote()
	}
	return

}

SpokaneCounty(){


	Send ^f
	Sleep KeySleep
	SendRaw Parcel Assessment Notice for %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "Parcel Assessment Notice for " . Year)
	{
		Send ^f
		Sleep KeySleep
		SendRaw Printer Friendly
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Sleep ProgramSleep
		Sleep ProgramSleep
		
		Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w
		Sleep KeySleep
		
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
	SendInput %AccNum%
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
			Sleep KeySleepSlow
			InsertQuery()
		}
		else
		{
			ErrorNote()
		}

	return
}

HorryCounty(){

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
		Sleep KeySleep
		
	}
	else
	{
		ErrorNote()
	}
	return
	
}

CarbondaleTJCounty(){


	Send ^f
	Sleep KeySleep
	SendRaw Payable %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "Payable " . Year)
	{
		Send ^f
		Sleep KeySleep
		SendRaw Print tax bill
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
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
		Send ^w
		Sleep KeySleep
		
	}
	else
	{
		ErrorNote()
	}
	return
	


}

BexarCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw This year is not certified and ALL values will be represented with
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard <> "This year is not certified and ALL values will be represented with")
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

MaricopaPPCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw No records associated with this entry.
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard <> "No records associated with this entry.")
	{
		Send ^f
		Sleep KeySleep
		SendRaw %YEAR%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
			if(clipboard = YEAR)
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

NewHanoverCounty(){
	
	
	Sleep KeySleep	
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw PARID: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID: " . AccNum)
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

BuncombleCounty(){
	;need to remove dashes on the accountlookup for realestate
	Send ^f
	Sleep KeySleep
	SendRaw Sorry, the requested page has not been found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard <> "Sorry, the requested page has not been found")
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

MecklenburgCounty(){
	
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw ASSESSMENT DETAILS
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "ASSESSMENT DETAILS")
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

ShelbyCounty(){
	
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

BernalilloCounty(){
	if(AccREPP = "P")
	{
			
	Sleep KeySleep	
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw PARID
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID")
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
	else{
		Sleep KeySleep	
			Send {tab 1}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendRaw PARID:
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
			Send ^c
			Sleep KeySleep

			if(clipboard = "PARID:")
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
	return	


}

StlouisCounty(){
	
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
		SendInput %AccNum%
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
			Sleep KeySleepSlow
			Sleep KeySleepSlow
			Send ^l
			Sleep KeySleep
			SendRaw javascript:ShowPropertyData('%AccNum%')
			Sleep KeySleepSlow
			Send {Enter}
			Sleep KeySleepSlow
			
			Send ^f
			Sleep KeySleep
			SendRaw %Year% assessment values are not available at this time
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleep
			
				if(clipboard <> Year . " assessment values are not available at this time")
				{
					Sleep KeySleepSlow
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
		SendInput %AccNum%
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
			SendInput %Year% assessment information is currently not available
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleepSlow
			Send ^c
			Sleep KeySleep
			
				if(clipboard <> Year . " assessment information is currently not available")
				{
				
					Send ^f
					Sleep KeySleep
					SendRaw +
					Sleep KeySleepSlow
					Send {esc}
					Sleep KeySleepSlow
					Sleep KeySleep
					Send {enter}
					Sleep KeySleep
				
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
	return



}

BrowardCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Business Name
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send +{tab}
	Sleep KeySleep
	Send {left 1}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	
	Sleep KeySleepSlow
	SendInput ^l{Raw}javascript:document.getElementById("btnSearchTpp").click();
	Send {Enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	
	Send ^f
	Sleep KeySleep
	SendRaw Assessement Values
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Assessement Values")
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

ShelbyCountyTN(){
	if(AccREPP = "P")
	{
	Send ^f
	Sleep KeySleep
	SendRaw %Year% Assessment
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
		if(clipboard = Year . " Assessment")
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
	else{
	
	Send ^f
	Sleep KeySleep
	SendRaw Property Location and Owner Information
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
		if(clipboard = "Property Location and Owner Information")
		{
		
		Send ^f
		Sleep KeySleep
		SendRaw Print
		Sleep KeySleepSlow
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
		Sleep KeySleepSlow
		Sleep KeySleep
		Sleep KeySleepSlow
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
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
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^w
		
		}
		else
		{
			ErrorNote()
		}
	
	
	
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
		Send {left}
		Sleep KeySleep
		Send {enter}
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

TulsaCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw An error occurred while the server was processing your request
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "An error occurred while the server was processing your request")
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

WyandotteCounty(){

		
	Send ^f
	Sleep KeySleep
	SendRaw %Year% Appraised Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = Year . " Appraised Value")
	{
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		Send ^l
		Sleep KeySleep
		SendRaw javascript:OpenAppraisalCardPDF()
		Sleep KeySleep
		Send {Enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^s
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleepSlow
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

FultonCounty(){
	
	if(AccREPP = "R")
	{
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw total value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "total value")
		{
			Send ^f
			Sleep KeySleep
			SendRaw %Year% Assessment Notice
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep	
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
			Sleep KeySleep
			Sleep KeySleep
			Send ^w
		}
		else
		{
			ErrorNote()
		}
	
	}
	else{
	
		Send ^f
		Sleep KeySleep
		SendRaw Appraised values
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Appraised values")
		{
			Sleep KeySleepSlow
			Send {tab 2}
			Sleep KeySleepSlow
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
			 

		}
		else
		{
			ErrorNote()
		}
	}
	return
	
	
	
	
	


}
CameronCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw Status: Preliminary
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Status: Preliminary")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Property | %AccNum% 
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep ProgramSleep
		Sleep ProgramSleep
		Sleep ProgramSleep
		Sleep ProgramSleep
			
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

DonaAnaCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw Assessment History
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send {Enter}
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw Value summary
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Value summary")
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

CobbCounty(){
	if(AccREPP = "R")
	{
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Assessed values
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw, %Year%
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
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		

	}
	else
	{
		ErrorNote()
	}
	
	}
	else{
	
		Send ^f
		Sleep KeySleep
		SendRaw Appraised values
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Appraised values")
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
	return


}

DenverCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Assessment Year %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Assessment Year " . Year)
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

ArapahoeCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Assessed Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . " Assessed Value")
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

MiamiDadeCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw %Year%
	Sleep KeySleepSlow
	Send {enter}
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
	return

}


DuvalCounty(){
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendRaw %Year% Certified
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . " Certified")
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

BrevardCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Account: %AccNum% 
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Account: " . AccNum)
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

BayCounty(){

	
	Send ^f
	Sleep KeySleep
	SendRaw no data available for the following modules
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "no data available for the following modules")
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

OrangeCountyFL(){

	Send ^f
	Sleep KeySleep
	SendRaw No Record Found
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "No Record Found")
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

OklahomaCountyOK(){

	if(AccREPP = "R")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Real Acct #:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = AccNum)
		{
		
			Send {enter}
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
	}
	else{
		Send ^f
		Sleep KeySleep
		SendRaw Personal
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		
		
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = AccNum)
		{
		
			Send {enter}
			Sleep KeySleep
			Sleep KeySleep
			Send ^p 
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Send {left}
		Sleep KeySleep
		Send {enter}
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
	return


}

EastBatonRPCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw %Year% Assessment Listing
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . " Assessment Listing")
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

CatawbaCounty(){
	
	if(AccREPP = "R")
	{	
		Send ^f
		Sleep KeySleep
		SendRaw Assessed Total Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Assessed Total Value")
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
		Send {tab 1}
		Sleep KeySleep
		Send {down 1}.
		Sleep KeySleep
		Send {tab 1}
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {tab 3}
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%-%Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = "Assessed Total Value")
		{
		
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

		}
		else
		{
			ErrorNote()
		}
	
	}
	return


}

HarrisonCounty(){

	if(AccREPP = "R")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Landroll Information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . " Landroll Information")
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
	
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Official Personal Property Record For PPIN
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . " Official Personal Property Record For PPIN")
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
	return

}

JeffersonParishCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw Owner
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send +{tab}
	Sleep KeySleep
	Send {down 2}
	Sleep KeySleep
	Send {tab 1}
	Sleep KeySleep
	
	SendInput %AccLookup%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = AccNum)
	{
		Send {enter}
		Sleep KeySleepSlow	
		Send ^l
		Sleep KeySleep
		SendRaw javascript:PrintDiv()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

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
	SendRaw VALUES DISPLAYED ARE %Year% CERTIFIED VALUES
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "VALUES DISPLAYED ARE " . Year . " CERTIFIED VALUES")
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

WebbCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw N/A
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "N/A")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Property | %AccNum% 
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep ProgramSleep
		Sleep ProgramSleep
	
			
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

PiercePPCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Values for 2024 Tax
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . " Values for 2024 Tax")
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

TravisCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw N/A
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "N/A")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Property | %AccNum% 
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep ProgramSleep
		Sleep ProgramSleep
	
			
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

ElPasoCounty(){


	Send ^f
	Sleep KeySleep
	SendRaw Notice of Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Notice of Value")
	{
		Sleep KeySleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
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
		Send ^w
	}
	else
	{
		ErrorNote()
	}
	return

}

RockwallCounty(){


	Send ^f
	Sleep KeySleep
	SendRaw N/A
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "N/A")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Property | %AccNum% 
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {tab 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep ProgramSleep
		Sleep ProgramSleep
	
			
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

PulaskiCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Search Real Estate Records
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab 2}
	
	Sleep KeySleepSlow
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = AccNum)
	{
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
	
		Send ^f
		Sleep KeySleep
		SendRaw Reports
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
		Send {down 1}
		Sleep KeySleepSlow
		Send {tab 5}
		
		
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
		Send ^w
		
	}
	else
	{
		ErrorNote()
	}
	return
	
	


}
SpokanePPCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Search
	Sleep KeySleepSlow
	Send {enter 3}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleepSlow
	Send +{tab}
	
	Sleep KeySleepSlow
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw Printer Friendly
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Printer Friendly")
	{
		Send {enter}
		Sleep KeySleepSlow
		Sleep ProgramSleep
	
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
		Send ^w
		
	}
	else
	{
		ErrorNote()
	}
	return

}

MadisonCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw There was a problem retrieving the details for this parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "There was a problem retrieving the details for this parcel")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw %Year%
		Sleep KeySleepSlow
		Send {enter 3}
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



JeffersonARCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	
	Send ^f
	Sleep KeySleep
	SendRaw View
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Jefferson County Report
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Jefferson County Report")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {down 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return

}


		
WashingtonCounty(){

		
	Send ^f
	Sleep KeySleep
	SendRaw Parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	
	Send ^f
	Sleep KeySleep
	SendRaw View
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Washingston County Report
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Washingston County Report")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {down 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return


}			
			
			
DavidsonCounty(){
	
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	
	Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendRaw Assessment Year: %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Assessment Year: " . Year)
	{
		
		Send ^f
		Sleep KeySleep
		SendRaw Printable Property
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		
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


FranklinRECounty(){

	Send ^f
	Sleep KeySleep
	SendRaw I Agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	
	Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum% 
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = AccNum)
	{
		
		Send ^f
		Sleep KeySleep
		SendRaw Assessor
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Sleep KeySleep
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Market Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		if(clipboard = Year . " Market Value")
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

PolkFLCounty(){

	if(AccREPP = "P")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Value Summary (%Year%)
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Value Summary (" . Year . ")")
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
	else{
	;For REPP of R
	
			Send ^p 
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep	
			SaveFile()
			Sleep KeySleepSlow
			Sleep KeySleep
			InsertQuery()
	
	
	
	}
	return
}

HindsCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Assessed Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Assessed Value")
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

SarasotaCounty(){


	if(AccREPP = "P")
	{
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Assessed Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . " Assessed Value")
		{
			Send ^f
			Sleep KeySleep
			SendRaw %Year% TRIM
			Sleep KeySleepSlow
			Send {esc}
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
	else{
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Record Card
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . " Record Card")
		{
			
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
	return

}

DouglasCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw No Values available
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "No Values available")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
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

EddyCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw requested page
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep

	Send ^f
	Sleep KeySleep
	SendRaw Actual Value (%Year%)
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Actual Value (" . Year . ")")
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



HoodCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Property Year %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Property Year " . Year)
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

StTammanyParishCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = AccNum)
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

EscambiaCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Certified Roll Exemptions
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . "Certified Roll Exemptions")
	{
		Send ^f
		Sleep KeySleep
		SendRaw Printer Friendly Version
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send {enter}
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


UtahCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw search for
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw 2022 - 2022 Notice of Property Valuation and Tax Changes
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = Year . "-" . Year . " Notice of Property Valuation and Tax Changes")
	{
			
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

WashoeCounty(){
	;RP
	Send ^f
	Sleep KeySleep
	SendRaw %Year%/
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . "/")
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

GreeneCounty(){
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendRaw Market/Assessed Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Market/Assessed Value")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Market/Assessed Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return


}

OuachitaCounty(){

	
		
	Send ^f
	Sleep KeySleep
	SendRaw Parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	
	Send ^f
	Sleep KeySleep
	SendRaw View
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Ouachita Parish Report
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Ouachita Parish Report")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {down 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return


}	

CollierCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Search Database
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw I Accept
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Account
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendRaw Market Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Market Value")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
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

CumberlandCounty(){
	;for RE only remove any - and symbol to accountnumber
	Send ^f
	Sleep KeySleep
	SendRaw Total Appraised Land Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Total Appraised Land Value")
	{
	
		Send ^l
		Sleep KeySleep
		SendRaw javascript:newPRC()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
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

StCharlesCounty(){

	Sleep KeySleep
	SendRaw 10-Year Property Value History
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "10-Year Property Value History")
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

GwinnettCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw assessment notice.
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {tab}
	Sleep KeySleep
	Send {down}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendRaw There are no records matching this search criteria.
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "There are no records matching this search criteria.")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw %Year%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send ^c
		Sleep KeySleep
		
			if(clipboard =  Year)
			{
				
				
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

JeffersonBirminghamCounty(){

	Sleep KeySleep
	SendRaw 10-Year Property Value History
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "10-Year Property Value History")
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

GuilfordCounty(){

	
	

	Send ^f
	Sleep KeySleep
	SendRaw Tax Year: %Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = "Tax Year: " . Year)
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


ForsythCounty(){

	Send {tab 1}
	Sleep KeySleep
	Send {down}
	Sleep KeySleep	
	Send {tab 1}
	Sleep KeySleepSlow
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow


	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%-%Year%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	if(clipboard = AccNum . "-" . Year)
	{
	
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
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

MuscogeeCounty(){

Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}

	Send ^f
	Sleep KeySleep
	SendRaw PARID: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID: " . AccNum)
	{
				Send ^f
				Sleep KeySleep
				SendRaw Property values
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


ManateeCounty(){

	Sleep KeySleep
	SendRaw Date Filed:
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "Date Filed:")
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

OsceolaCounty(){
	
	
	if(AccREPP = "P")
	{
		Sleep KeySleep
		SendRaw Total Assessed Value:
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Total Assessed Value:")
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
	
	else{
	
		Send {tab 1}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow


		Send ^f
		Sleep KeySleep
		SendRaw Parcel Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send {tab 1}
		Sleep KeySleep
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		
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
			
		}
		else
		{
			ErrorNote()
		}
		
	
	}
	return

}	

CharlotteCounty(){
	
	if(AccREPP = "P")
	{	
		Send ^f
		Sleep KeySleep
		SendRaw Preliminary Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Preliminary Value")
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
	
	else{
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Value Summary
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  Year . "Value Summary")
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
	return
		
}

AlachuaCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "Valuation")
	{
		Send ^f
		Sleep KeySleep
		SendRaw %Year% TRIM Notice
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}		
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
		Send ^w 

	}
	else
	{
		ErrorNote()
	}
	return


}

JohnsonCountyIA(){
	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
    Sleep KeySleep
	SendRaw Assessed Land Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "Assessed Land Value")
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
WaltonCounty(){
	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
    Sleep KeySleep
	SendRaw %Year% TRIM Notice
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "TRIM Notice")
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

ClayFLCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  "Valuation")
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

StJohnFLCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw %Year% TRIM Notice
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "TRIM Notice")
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


RichmondCounty(){
	if(AccREPP = "R")
	{
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Valuation
		Sleep, KeySleepSlow
		Send {enter}
		Sleep, KeySleepSlow
		Send {enter}
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw, %Year%
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
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		

	}
	else
	{
		ErrorNote()
	}
	
	}
	else{
	
		Send ^f
		Sleep KeySleep
		SendRaw Appraised values
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Appraised values")
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
	return


}


MarionCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleep
	Send {enter}
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send ^c
	Sleep KeySleep
	

	if(clipboard =  AccNum)
	{
	
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year% Certified Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
				if(clipboard =  Year . "Certified Value")
				{
					Send ^f
					Sleep KeySleep
					SendRaw Print PRC
					Sleep KeySleepSlow
					Send {esc}
					Sleep KeySleep
					Send {enter					
					Sleep KeySleep
					
					Send {enter}
					Sleep KeySleep	
					SaveFile()
					Sleep KeySleepSlow
					Sleep KeySleep
					InsertQuery()
					Sleep KeySleep
					Sleep KeySleep
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

NassauCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Certified Values
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "Certified Values")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send +{tab}
		Sleep KeySleep
		Send {enter}
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
		Send ^w 
		 

	}
	else
	{
		ErrorNote()
	}
	return

}

OkaloosaCounty(){
	
	if(AccREPP = "R")
	{	
		Send ^f
		Sleep KeySleep
		SendRaw %Year% TRIM Notice
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  Year . "TRIM Notice")
		{
			Send ^f
			Sleep KeySleep
			SendRaw Click Here to view the %Year% TRIM Notice
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}			
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
			Send ^w

		}
		else
		{
			ErrorNote()
		}
	}
	
	else{
		Send ^f
		Sleep KeySleep
		SendRaw Valuation
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard =  "Valuation")
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
	return
		


}

LevyCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Preliminary Value
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "Preliminary Valuee")
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

FlaglerCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw %Year% TRIM Notice
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "TRIM Notice")
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

HardeeCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw Trim Notices
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard =  Year . "TRIM Notice")
	{
		
		Sleep KeySleep
		Send {tab}
		Sleep KeySleep
		Send {enter}
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
		Sleep KeySleep
		Send ^w 

	}
	else
	{
		ErrorNote()
	}
	return
	

}

GilchristCounty(){
	
	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Valuation")
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

JacksonFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw %Year% Certified Values
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = Year . "Certified Values")
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

HolmesFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Valuation")
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

MartinFLCounty(){


	Send ^f
	Sleep KeySleep
	SendRaw error
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "error")
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

PolkARCounty(){

	
		
	Send ^f
	Sleep KeySleep
	SendRaw Parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	
	Send ^f
	Sleep KeySleep
	SendRaw View
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Polk County Report
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Polk County Report")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {down 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return


}	


GulfFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Valuation")
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

CalhounFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}

	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Valuation")
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

MonroeFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw agree
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw Account #
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Send {tab 2}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep

	Send ^f
	Sleep KeySleep
	SendRaw Valuation
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Valuation")
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

PutnamFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw error
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard <> "error")
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

SeminoleFLCounty(){
	;RE only
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Information
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Parcel Information")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw Print Friendly
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleepSlow
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
		

	}
	else
	{
		ErrorNote()
	}
	return
}

HighlandsFLCounty(){
	if(AccREPP = "R")
	{	
		Send ^f
		Sleep KeySleep
		SendRaw sales
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
		
		
	}
	else{

		Send ^f
		Sleep KeySleep
		SendRaw location code
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab 3}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}

	}
	return


}

ArkansasARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Arkansas
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
		
	return


}

BentonARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Benton
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
		
	return
}	


SalineARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Saline
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return
}

PopeARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Pope
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return
}

DallasARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Dallas
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return
}

DeshaARCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw Desha
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return	
	
}

CraigheadARCounty(){

		Sleep KeySleep
		SendRaw Craighead
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return

}

BooneARCounty(){

		Sleep KeySleep
		SendRaw Boone
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Parcel Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab 2}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}

	return
}

StFrancisARCounty(){

		Sleep KeySleep
		SendRaw St. Francis
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return
}

SebastianARCounty(){

		Sleep KeySleep
		SendRaw Sebastian
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Parcel Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab 2}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}

	return
}

FaulknerARCounty(){

		Sleep KeySleep
		SendRaw Faulkner
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return

}

CrittendenARCounty(){

		Sleep KeySleep
		SendRaw Crittenden
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw Parcel Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab 2}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}

	return

}

BaxterARCounty(){

		Sleep KeySleep
		SendRaw Baxter
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return


}

ChicotARCounty(){

		Sleep KeySleep
		SendRaw Chicot
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return



}

BradleyARCounty(){
		
		Sleep KeySleep
		SendRaw Bradley
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return

}


MarylandStateCounty(){


		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Sleep KeySleep	

		Sleep KeySleep
		SendRaw Department ID
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send +{tab}
		Sleep KeySleepSlow
		Send {down 1}
		Sleep KeySleepSlow
		Send +{tab}
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep		
		Send {tab}
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		
		Send ^f
		Sleep KeySleep
		SendRaw Department ID Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Department ID Number")
		{
			
			
			Send ^f
			Sleep KeySleep
			SendRaw Annual report
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
			Sleep KeySleep

			Send ^f
			Sleep KeySleep
			SendRaw %Year%
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep
			Send {esc}
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
			Sleep KeySleep
			Send ^w
			Sleep KeySleep
			Send ^w 			
			

		}
		else
		{
			ErrorNote()
		}
	return
	
}

PhillipsARCounty(){

		Sleep KeySleep
		SendRaw Phillips
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw PPAN/Parcel Number
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return

}

ColumbiaARCounty(){

		Sleep KeySleep
		SendRaw Columbia
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleepSlow
		
		Send ^f
		Sleep KeySleep
		SendRaw information
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {tab}
		
		Sleep KeySleepSlow
		SendInput %AccNum%
		Sleep KeySleepSlow
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
		
		Send ^f
		Sleep KeySleep
		SendRaw %AccNum%
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = AccNum)
		{
		
			Sleep KeySleepSlow
			Send {enter}
			Sleep KeySleep	
			
			Send ^f
			Sleep KeySleep
			SendRaw Valuation
			Sleep KeySleepSlow
			Send {esc}
			Sleep KeySleep
			Send {enter}
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
			

		}
		else
		{
			ErrorNote()
		}
	return

}	


SantaRosaCounty(){

		Send ^f
		Sleep KeySleep
		SendRaw %Year% Certified
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . "Certified")
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

VolusiaCounty(){

	;Use alternate ID

 		Send ^f
		Sleep KeySleep
		SendRaw Assessed Value
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = "Assessed Value")
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

ColumbiaAFLCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {tab}
		
	Sleep KeySleepSlow
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
		
	if(clipboard = AccNum)
	{
		
		Send ^l
		Sleep KeySleep
		SendRaw javascript:Detail('1').onclick()
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {enter}
		Sleep LongPageSleep
		Sleep KeySleepSlow
		Sleep KeySleepSlow	
		
		Send ^f
		Sleep KeySleep
		SendRaw Print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {enter}		
		
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

BakerCounty(){

	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	Sleep KeySleepSlow
	Send {tab}
		
	Sleep KeySleepSlow
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
		
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
		
	if(clipboard = AccNum)
	{
		
		Send {enter}
		Sleep KeySleep	
		Sleep KeySleep
			
		
		Send ^f
		Sleep KeySleep
		SendRaw Print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Sleep KeySleepSlow
		Send {enter}		
		
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

LeonCounty(){

	;Use alternate ID

 		Send ^f
		Sleep KeySleep
		SendRaw %Year% Certified Taxable Values
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
		
		
		if(clipboard = Year . "Certified Taxable Values")
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

GarlandCounty(){

		
	Send ^f
	Sleep KeySleep
	SendRaw Parcel
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Parcel Number
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleep	
	Sleep KeySleep
	
	
	Send ^f
	Sleep KeySleep
	SendRaw View
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send {enter}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw Garland County Report
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	
	
	if(clipboard = "Garland County Report")
	{
	
		Send ^f
		Sleep KeySleep
		SendRaw print
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		Send {down 2}
		Sleep KeySleep
		Send {enter}
		Sleep KeySleep
		
		
		Send {enter}
		Sleep KeySleep	
		SaveFile()
		Sleep KeySleepSlow
		Sleep KeySleep
		InsertQuery()
		Sleep KeySleep
		Sleep KeySleep
		Send ^w

	}
	else
	{
		ErrorNote()
	}
	return

}

FultoCounty(){

	Send {tab}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw No Data
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw No Data
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
		
	if(clipboard = "No Data")
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
HernandoCounty(){

	Send {tab}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw No Data
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
		
	if(clipboard = "No Data")
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

DavisCountyUT(){

Send {tab}
	Sleep KeySleep
	Send {enter}
	
	Send ^f
	Sleep KeySleep
	SendRaw No Data
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
		
		
	if(clipboard = "No Data")
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

SarpyCounty(){

	Sleep KeySleep
	Send ^f
	Sleep KeySleep
	SendRaw Parcel:
	Sleep KeySleepSlow
	Sleep KeySleep
	Send {esc}
	Sleep KeySleep
	Send {tab}
	Sleep KeySleep
	
	SendInput %AccNum%
	Sleep KeySleep
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	
	Send ^f
	Sleep KeySleep
	SendRaw %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	Sleep KeySleep
	if(clipboard = AccNum)
	{
		Sleep KeySleep
		Send ^f
		Sleep KeySleep
		SendRaw property card
		Sleep KeySleepSlow
		Sleep KeySleep
		Send {esc}
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
		Sleep KeySleep
			

	}
	else
	{
		ErrorNote()
	}
	return
	
}	

ChathamCounty(){


		
	Sleep KeySleep	
	Send {tab 1}
	Sleep KeySleep
	Send {enter}
	Sleep KeySleep
	Sleep KeySleepSlow
	
	Send ^f
	Sleep KeySleep
	SendRaw PARID: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID: " . AccNum)
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


BibbCounty(){

;2nd document to be follow when the string to insert is available
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
		
	return

}
BartowCounty(){

	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Assessed land value
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
		
	return



}

CowetaCounty(){
	
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
		
	return

}

HallCounty(){

	if(AccREPP = "R")
	{
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
	else{
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Appraised value
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
	return

}

HoustonCounty(){
	if(AccREPP = "P")
	{
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Appraised value
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
		
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
	return
}

ForsythCountyGA(){


	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Assessed value
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
		return
}
ClarkeCounty(){


	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep
	
	
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
		return

}
BullochCounty(){
	
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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
		
	return


}

ClaytonCounty(){

	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}

	Send ^f
	Sleep KeySleep
	SendRaw PARID: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID: " . AccNum)
	{
				Send ^f
				Sleep KeySleep
				SendRaw Assessed values
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
DekalbCounty(){

	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}

	Send ^f
	Sleep KeySleep
	SendRaw PARID: %AccNum%
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "PARID: " . AccNum)
	{
				Send ^f
				Sleep KeySleep
				SendRaw Appraised value
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

GlynnCounty(){

	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}

	Send ^f
	Sleep KeySleep
	SendRaw value information
	Sleep KeySleepSlow
	Send {esc}
	Sleep KeySleep	
	Send ^c
	Sleep KeySleep

	if(clipboard = "value information")
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
DouglasCountyGA(){
	
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Sleep, KeySleepSlow
		Send, {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, valuation
		Sleep, KeySleepSlow
		Send, {esc}
		Sleep, KeySleepSlow
		
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
		return

}

HenryCounty(){


if(AccREPP = "R")
	{
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {esc}
	
		Send ^f
		Sleep KeySleep
		SendRaw, Total assessment
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
		
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Appraised value
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
	return




}

FayetteCounty(){

		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Assessed value
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

	
	return
}

PauldingCounty(){
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Sleep KeySleepSlow
		Send {esc}
		
		Send ^f
		Sleep KeySleep
		SendRaw, Current value
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

	
	return




}

CookCountyIL(){
		
		
		Send ^f
		Sleep KeySleep
		SendRaw %Year% board of review certified
		Sleep KeySleepSlow
		Send {esc}
		Sleep KeySleep	
		Send ^c
		Sleep KeySleep
	
			if(clipboard = Year . " board of review certified")
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

CheerokeeCounty(){

Send ^f
		Sleep KeySleep
		SendRaw, total value
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

	
	return


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
	Col := 7
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
	Col := 9
	SaveDirectory := XL.ActiveSheet.Cells(Row, Col).Value
	
	Sleep PageSleep
	SendInput, %SaveDirectory%
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Send {enter}
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	Sleep KeySleepSlow
	
	
	;Row++
}

InsertQuery(){
	Col := 11
	;InsQry := SubStr(XL.ActiveSheet.Cells(Row, Col).Value, 2, StrLen(XL.ActiveSheet.Cells(Row, Col).Value)-2)
	InsQry := XL.ActiveSheet.Cells(Row, Col).Value
	clipboard := InsQry
	;WinActivate PVSLocal (tso) on PVSLocal - Interactive SQL
	WinActivate PVSData (tso) on PVSData - Interactive SQL
	;WinActivate Interactive SQL
	Sleep KeySleepSlow
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