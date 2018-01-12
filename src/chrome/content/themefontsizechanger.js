﻿	Components.utils.import("resource://gre/modules/Services.jsm");

	var ThemeFontSizeChanger = {
		addonGUID:'{d9990772-0e04-4731-b98e-98e62085837f}', // Keep in sync with em:id in install.rdf
		THUNDERBIRD_ID:"{3550f703-e582-4d05-9a08-453d09bdfdc6}", // Thunderbird
		FIREFOX_ID:"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}", // Firefox/Basilisk/Waterfox
		PALEMOON_ID:"{8de7fcbb-c55c-4fbe-bfc5-fc555c87dbc4}", // Pale Moon
    addonLiteralName:"Theme Tweaker", // Keep in sync with em:name in install.rdf
    addonShortName:"TTweak", // Short name used on toolbarbutton label (when enabled)
		appInfo:Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo),		
		themefontsizechangerFirstRun:function (event) {
			getBrowser().removeEventListener('DOMContentLoaded', ThemeFontSizeChanger.themefontsizechangerFirstRun, true);
			var themefontsizechangerprefsinstance = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			Components.utils.import("resource://gre/modules/AddonManager.jsm");  
			AddonManager.getAddonByID(ThemeFontSizeChanger.addonGUID, function(addon) {  
				var themefontsizechangerprefsinstance = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var themefontsizechangerversion = themefontsizechangerprefsinstance.getCharPref("extensions.themetweaker.currentversion");
				var themefontsizechangernewversion = addon.version;
				if (themefontsizechangerversion != themefontsizechangernewversion) {
					themefontsizechangerprefsinstance.setCharPref("extensions.themetweaker.currentversion", themefontsizechangernewversion);
				}
			}); 			
		},
		enableThemeFontSizeChanger:function(event){
			if(event.button==1||event.button==2) return;		
		},		
		mainWindowLoadHandler:function(event){
			ThemeFontSizeChanger.requestAppendToolbar();
			ThemeFontSizeChanger.addAddonListener();
			ThemeFontSizeChanger.abbreviateToolbarButtonText();
			window.setTimeout(function(){ThemeFontSizeChanger.addStylesForMacFix("window");},1)
			ThemeFontSizeChanger.hideToolsMenu();
			
		},
		showOptions:function(event, command, args){
			//window.openDialog("chrome://themetweaker/content/options.xul", null, "centerscreen,chrome");

			var optionsURL = "chrome://themetweaker/content/options.xul";
			// The following code is from extensions.js (Add-ons manager) :)
			var windows = Components.classes['@mozilla.org/appshell/window-mediator;1']
					.getService(Components.interfaces.nsIWindowMediator)
					.getEnumerator(null);
			while (windows.hasMoreElements()) {
				var win = windows.getNext();
				if (win.document.documentURI == optionsURL) {
					win.focus();
					win.execArguments([command, args]);
					return([win, true]);
				}
			}

			var modal = false;

			//var features = "chrome,titlebar,toolbar,centerscreen" + (modal ? ",modal" : ",dialog=no");//original
			var features = "chrome,titlebar,toolbar,centerscreen,resizable" + (modal ? ",modal" : ",dialog=yes");//modified to yes to be dialog
			
			// var args after features
			return([openDialog(optionsURL, "", features, command, args), false]);		
		},
		handleStatusClick: function(event) {
			//window.openDialog("chrome://themetweaker/content/options.xul", null, "centerscreen,chrome");
			ThemeFontSizeChanger.showOptions();
			return;
			if (event.target.id == "themefontsizechanger-statusbar") {
				if (event.button == 2 || event.button == 1) {
					document.getElementById(event.target.getAttribute("popup")).openPopup(event.target, "before_start");
				} 
			}
		},
		abbreviateToolbarButtonText: function(event) {
			if(ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.abbreviatetoolbarbuttontext")) document.getElementById("themefontsizechanger-toolbarbutton").setAttribute("label",ThemeFontSizeChanger.addonShortName);
		},	
		getContextCSS:function(fontcolor,backgrouncolor){

			if(fontcolor=="-moz-use-system-font" && backgrouncolor=="-moz-use-system-font") return "";

			var rawcss="@namespace url(http://www.w3.org/1999/xhtml);\n@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\n\n.menu-accel-container { display: none !important; }\n\nmenupopup, context-menu, menupopup > menu > menupopup,\n#BMB_bookmarksPopup .arrowscrollbox-scrollbox, #bookmarksMenuPopup\n{ -moz-appearance: none !important;\nmax-height: 800px !important;\noverflow-y: auto !important; }\n\n#bookmarksMenuPopup .arrowscrollbox-scrollbox\n{ overflow-y: auto !important;\npadding-bottom: 10px !important; }\n\nmenupopup, context-menu, menupopup > menu > menupopup\n,#context-navigation{ -moz-appearance: none!important; \nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nfont-size: 13px !important;\nborder-radius: 2px !important; \npadding: 0 !important;\n}\n\n.menu-right\n{ margin: -5px 0 !important; }\n\nmenupopup menu,\nmenupopup menuitem, \npanel, popup > menu, .splitmenu-menuitem, \n#PlacesChevronPopup .menu-iconic.bookmark-item, #interclue-state-popup menuitem\n{ -moz-appearance: none !important;\nborder: 1px solid transparent !important; \nfont-size: 13px !important; \ncolor: /*FONTCOLOR*/ !important;\n}\n\nmenupopup .popup-internal-box,\n#appmenuPrimaryPane menupopup .popup-internal-box,\n#appmenuSecondaryPane menupopup .popup-internal-box,\n#appmenuPrimaryPane menupopup,\n#appmenuSecondaryPane,\n.menuitem-iconic.interclue-selected\n{ padding: 3px !important;\nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nborder: 1px solid rgba(10,10,10, .5) !important; }\n\nmenubar > menu:hover, menubar > menu:focus,  \n.splitmenu-menu:hover, .splitmenu-menuitem:hover, \nmenupopup menuitem:hover, menupopup menu:hover, \npopup menu:hover, popup menuitem:hover,\nmenuitem:hover,\nmenupopup > menu:hover,menupopup > menu:focus, \npopup > menu:focus, popup > menu:hover,\n#appmenuPrimaryPane menu:hover,\n#appmenuSecondaryPane menu:hover,\n#appmenu_webDeveloper:hover, \n#appmenu_charsetMenu:hover,\n#nightly-appmenu:hover,\n#mmsearchpopupsearchengine menuitem:hover,\n.menuitem-iconic.menu-iconic.mmsearch_freesearch.mmsearch_freesearch-group:hover\n{ -moz-appearance: none !important;\nbackground: /*FONTCOLOR*/ no-repeat !important;\nborder-radius: 3px !important;\nborder: 1px solid rgba(10,10,10,.1) !important; \ncolor: /*BACKGROUNDCOLOR*/ !important;\n}\n\nmenu[_moz-menuactive=\"true\"],\nmenuitem[_moz-menuactive=\"true\"],\n.splitmenu-menuitem[_moz-menuactive=\"true\"]\n{ background-color: transparent !important;\nbox-shadow: none !important; }\n\nmenupopup, popup, context-menu\n{ border: 1px solid transparent !important; }\n\nmenu.menu-iconic > .menu-iconic-left,\nmenuitem.menuitem-iconic > .menu-iconic-left,\n.splitmenu-menuitem[iconic=\"true\"] > .menu-iconic-left\n{ -moz-appearance: none !important;\npadding-top: 0px !important;}\n\n#appmenu-popup .popup-internal-box\n{\nborder: none !important; }\n\n#appmenuPrimaryPane,\n#appmenuSecondaryPane\n{\nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nbox-shadow: inset rgba(0,0,0, 0.3) 1px 6px 16px 2px  !important;\nborder-radius: 3px !important;\nborder: 1px solid rgba(0,0,0,.3) !important; }\n\n#appmenu-popup menu>.menu-right\n{ padding: 0 !important;\nmargin-left: -2px !important; }\n\n.splitmenu-menuitem, .splitmenu-menu\n{ -moz-appearance: none !important; \nbackground: none !important;\n}\n\n.splitmenu-menu:hover, .splitmenu-menuitem:hover{ \n background: /*FONTCOLOR*/ no-repeat !important;\n color: /*BACKGROUNDCOLOR*/ !important;\n}\n\n/*GLOBAL CASCADE WORKAROUNDS*/\nmenubar > menu:hover > *,  \n.splitmenu-menu:hover > *, .splitmenu-menuitem:hover > *, \nmenupopup menuitem:hover > *, menupopup menu:hover > *, \npopup menu:hover > *, popup menuitem:hover > *,\nmenuitem:hover > *,\nmenupopup > menu:hover > *, popup > menu:hover > *,\n#appmenuPrimaryPane menu:hover > *,\n#appmenuSecondaryPane menu:hover > *,\n#appmenu_webDeveloper:hover > *, \n#appmenu_charsetMenu:hover > *,\n#nightly-appmenu:hover > *,\n#mmsearchpopupsearchengine menuitem:hover > *,\n.menuitem-iconic.menu-iconic.mmsearch_freesearch.mmsearch_freesearch-group:hover > * { \n color: /*BACKGROUNDCOLOR*/ !important;\n}\n\n#appmenu_webDeveloper:hover {\nborder: none !important;\n}";

			/*FONTCOLOR*/
			if(fontcolor=="-moz-use-system-font") rawcss=rawcss.replace(/color: \/\*FONTCOLOR\*\/ !important;/g,"").replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"");
			else {

				rawcss=rawcss.replace(/color: \/\*FONTCOLOR\*\/ !important;/g,"color: "+fontcolor+" !important;");
				
				if(backgrouncolor=="-moz-use-system-font") rawcss=rawcss.replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"");
				else rawcss=rawcss.replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"background: "+fontcolor+" no-repeat !important;");
				
			}

			/*BACKGROUNDCOLOR*/
			if(backgrouncolor=="-moz-use-system-font") rawcss=rawcss.replace(/background: \/\*BACKGROUNDCOLOR\*\/ no-repeat !important;/g,"").replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"");
			else {

				rawcss=rawcss.replace(/background: \/\*BACKGROUNDCOLOR\*\/ no-repeat !important;/g,"background: "+backgrouncolor+" no-repeat !important;");
				
				if(fontcolor=="-moz-use-system-font") rawcss=rawcss.replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"");
				else rawcss=rawcss.replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"color: "+backgrouncolor+" !important;");

			}

			return rawcss;

		},
		getThreadPaneCSS:function(threadpanebackgroundcolor,fontcolor){

			if(threadpanebackgroundcolor=="-moz-use-system-font") return "";

			var isMac = ThemeFontSizeChanger.checkMac();
			if(isMac) var rawcss="#folderTree,#threadTree,#agenda-listbox,.calendar-task-tree {background-color: "+threadpanebackgroundcolor+" !important;} treechildren:-moz-tree-cell-text,treechildren:-moz-tree-cell-text(selected),treechildren:-moz-tree-cell-text(selected, focus),treechildren::-moz-tree-row,treechildren::-moz-tree-row(selected),treechildren::-moz-tree-row(selected, focus) {background-color: "+threadpanebackgroundcolor+" !important;color: "+fontcolor+" !important;}";
			else var rawcss="#folderTree,#threadTree,#agenda-listbox,.calendar-task-tree {background-color: "+threadpanebackgroundcolor+" !important;}";

			return rawcss;

		},
		getMacThunderbirFixCSS:function(size,fontfamily){

			var rawsizecss, rawfontfamilyss;

			if(size=="-moz-use-system-font") rawsizecss="";

			rawsizecss="treechildren:-moz-tree-row {height:"+Math.ceil(parseInt(size)*1.2)+"px !important;}";

			if(fontfamily=="-moz-use-system-font") rawfontfamilyss="";

			var rawfontfamilyss="treechildren:-moz-tree-cell-text,treechildren:-moz-tree-cell-text(selected),treechildren:-moz-tree-cell-text(selected, focus),treechildren::-moz-tree-row,treechildren::-moz-tree-row(selected),treechildren::-moz-tree-row(selected, focus) {font-family: "+fontfamily+" !important;";

			return rawsizecss+rawfontfamilyss;

		},
		changeZoomLevel:function(value){
			document.getElementById("tfsc-zoom").disabled=true;
			ThemeFontSizeChanger.setPrefValue("layout.css.devPixelsPerPx",value);
			window.setTimeout(function(){document.getElementById("tfsc-zoom").disabled=false;},500);
		},		
		changeCustomSize:function(event){
			if(document.getElementById("tfsc-size-customsize-textbox").value<=6.0) {
				var prompt = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
				prompt.alert(null, "Theme Font & Size Changer", "Value can not be less than 6 pixels.");
				return;
			}
			document.getElementById("tfsc-size-customsize-textbox").disabled=true;
			document.getElementById("tfsc-size-customsize").value=document.getElementById("tfsc-size-customsize-textbox").value;
			document.getElementById("tfsc-size").selectedIndex=1;
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.customfontsize",document.getElementById("tfsc-size-customsize-textbox").value);
			window.setTimeout(function(){document.getElementById("tfsc-size-customsize-textbox").disabled=false;},500);			
		},
		changeCustomFontColor:function(event){
			event.currentTarget.ownerDocument.getElementById("tfsc-color-customcolor").value=event.currentTarget.value;
			event.currentTarget.ownerDocument.getElementById("tfsc-color").selectedIndex=1;
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.customcolor",event.currentTarget.value);
			ThemeFontSizeChanger.changeFontSize();
		},		
		changeCustomBackgroundColor:function(event){
			event.currentTarget.ownerDocument.getElementById("tfsc-backgroundcolor-custombackgroundcolor").value=event.currentTarget.value;
			event.currentTarget.ownerDocument.getElementById("tfsc-backgroundcolor").selectedIndex=1;
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.custombackgroundcolor",event.currentTarget.value);
			ThemeFontSizeChanger.changeTheme(event.currentTarget.value);
		},		
		changeThreadCustomBackgroundColor:function(event){
			event.currentTarget.ownerDocument.getElementById("tfsc-threadpanebackgroundcolor-customthreadpanebackgroundcolor").value=event.currentTarget.value;
			event.currentTarget.ownerDocument.getElementById("tfsc-threadpanebackgroundcolor").selectedIndex=1;
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.customthreadpanebackgroundcolor",event.currentTarget.value);
			ThemeFontSizeChanger.changeFontSize();
		},		
		changeFontSize:function (value){

			var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
			var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);

			var currentfontsize = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontsize");			
			var currentfontfamily = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontfamily");
			var currentfontstyle = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontstyle");
			var currentfontweight = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontweight");	
			var currentfontcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontcolor");	
			var currentbackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentbackgroundcolor");
										
			var currentthreadpanebackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentthreadpanebackgroundcolor");							
			var oldcss = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+'* {'
			+(currentfontsize=="-moz-use-system-font" ? "" : 'font-size: '+ currentfontsize + "px"+' !important;')
			+(currentfontfamily=="-moz-use-system-font" ? "" : "font-family:" + currentfontfamily + ' !important;')
			+(currentfontstyle=="-moz-use-system-font" ? "" : "font-style:" + currentfontstyle + ' !important;')
			+(currentfontweight=="-moz-use-system-font" ? "" : "font-weight:" + currentfontweight + ' !important;')	
			+(currentfontcolor=="-moz-use-system-font" ? "" : "color:" + currentfontcolor + ' !important;')	
												
			+'}';

			if(ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.contextmenuenabled")) var oldcontextCSS=ThemeFontSizeChanger.getContextCSS(currentfontcolor,currentbackgroundcolor);
			else var oldcontextCSS="";
			
			var oldthreadPaneCSS=ThemeFontSizeChanger.getThreadPaneCSS(currentthreadpanebackgroundcolor,currentfontcolor);
			
			var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
			.getService(Components.interfaces.nsIXULAppInfo);		
			var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"]
			                           .getService(Components.interfaces.nsIXULRuntime);
			                           
			if(xulRuntime.OS=="Darwin" && appInfo.name=="Thunderbird") var oldmacThunderbirFixCSS=ThemeFontSizeChanger.getMacThunderbirFixCSS(currentfontsize,currentfontfamily);
			else var oldmacThunderbirFixCSS="";			

			var olduri = ios.newURI('data:text/css,' + encodeURIComponent(oldcss + oldcontextCSS + oldthreadPaneCSS + oldmacThunderbirFixCSS), null, null);
			if(sss.sheetRegistered(olduri, sss.AGENT_SHEET)) {
				sss.unregisterSheet(olduri, sss.AGENT_SHEET);
			}

			var css = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+'* {'
			+(document.getElementById("tfsc-size").selectedItem.value=="-moz-use-system-font" ? "" : 'font-size: '+ document.getElementById("tfsc-size").selectedItem.value + "px"+' !important;')
			+(document.getElementById("tfsc-fonts").selectedItem.value=="-moz-use-system-font" ? "" : "font-family:" + document.getElementById("tfsc-fonts").selectedItem.value+' !important;')
			+(document.getElementById("tfsc-style").selectedItem.value=="-moz-use-system-font" ? "" : "font-style:" + document.getElementById("tfsc-style").selectedItem.value+' !important;')
			+(document.getElementById("tfsc-weight").selectedItem.value=="-moz-use-system-font" ? "" : "font-weight:" + document.getElementById("tfsc-weight").selectedItem.value+' !important;')
			+(document.getElementById("tfsc-color").value=="-moz-use-system-font" ? "" : "color:" + document.getElementById("tfsc-color").value+' !important;')														
			+'}';

			var fontcolor = document.getElementById("tfsc-color").value;
			var backgroundcolor = document.getElementById("tfsc-backgroundcolor").selectedItem.value;
			var threadpanebackgroundcolor = document.getElementById("tfsc-threadpanebackgroundcolor").selectedItem.value;
			var size=document.getElementById("tfsc-size").selectedItem.value;
			var fontfamily=document.getElementById("tfsc-fonts").selectedItem.value;
			
			if(document.getElementById("tfsc-contextmenuenabled").checked) var contextCSS=ThemeFontSizeChanger.getContextCSS(fontcolor,backgroundcolor);
			else var contextCSS="";
			
			var threadPaneCSS=ThemeFontSizeChanger.getThreadPaneCSS(threadpanebackgroundcolor,fontcolor);
			
			if(xulRuntime.OS=="Darwin" && appInfo.name=="Thunderbird") var macThunderbirFixCSS=ThemeFontSizeChanger.getMacThunderbirFixCSS(size,fontfamily);
			else var macThunderbirFixCSS="";

			var uri = ios.newURI('data:text/css,' + encodeURIComponent(css + contextCSS + threadPaneCSS + macThunderbirFixCSS), null, null);
			if (!sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
				sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
			}
			
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentfontsize",document.getElementById("tfsc-size").selectedItem.value);
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentfontfamily",document.getElementById("tfsc-fonts").selectedItem.value);
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentfontstyle",document.getElementById("tfsc-style").selectedItem.value);
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentfontweight",document.getElementById("tfsc-weight").selectedItem.value);	
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentfontcolor",document.getElementById("tfsc-color").selectedItem.value);	
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentbackgroundcolor",document.getElementById("tfsc-backgroundcolor").selectedItem.value);	
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentthreadpanebackgroundcolor",document.getElementById("tfsc-threadpanebackgroundcolor").selectedItem.value);	
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.contextmenuenabled",document.getElementById("tfsc-contextmenuenabled").checked);	
			
			ThemeFontSizeChanger.addStylesForMacFix();
			ThemeFontSizeChanger.addStylesForWin7();

			if(window.opener){
				window.setTimeout(function(){
					window.sizeToContent();
					var windowWidth=window.outerWidth;		
					var windowHeight=window.outerHeight;
					var screenWidth=screen.width;		
					var screenHeight=screen.height;
					window.moveTo((screenWidth-windowWidth)/2, (screenHeight-windowHeight)/2);			
				},1);				
			}

		},
		prefInstance:Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
		getPrefValue:function(pref){
			var type=ThemeFontSizeChanger.prefInstance.getPrefType(pref);
			if(type==32) return ThemeFontSizeChanger.prefInstance.getCharPref(pref);
			else if(type==128) return ThemeFontSizeChanger.prefInstance.getBoolPref(pref);
			else if(type==64) return ThemeFontSizeChanger.prefInstance.getIntPref(pref);
		},
		setPrefValue:function(pref,value){
			var type=ThemeFontSizeChanger.prefInstance.getPrefType(pref);
			if(type==32) ThemeFontSizeChanger.prefInstance.setCharPref(pref,value);
			else if(type==128) ThemeFontSizeChanger.prefInstance.setBoolPref(pref,value);
			else if(type==64) ThemeFontSizeChanger.prefInstance.setIntPref(pref,value);
		},
		updateCheckedState:function(event){

			var currentzoomlevel = ThemeFontSizeChanger.getPrefValue("layout.css.devPixelsPerPx") == "-1.0" ? 1.00 : ThemeFontSizeChanger.getPrefValue("layout.css.devPixelsPerPx");
			document.getElementById("tfsc-zoom").value=currentzoomlevel;		
		
			var currentfontsize = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontsize");
			var customfontsize = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.customfontsize");
			
			/*var accFontSizeMenuitems = document.getElementById("themefontsizechanger-statusbarpanel-menu").getElementsByTagName("menuitem");

			var gh=accFontSizeMenuitems[0];	
			
			for (var i=0;i<accFontSizeMenuitems.length;i++) {
			
				if(accFontSizeMenuitems[i].getAttribute("value")==currentfontsize) {

					gh=accFontSizeMenuitems[i];

				}
				
			}	

			document.getElementById("themefontsizechanger-statusbarpanel-menu").parentNode.selectedItem=gh;*/

			document.getElementById("tfsc-size-customsize").value=customfontsize;	
			document.getElementById("tfsc-size-customsize-textbox").value=customfontsize;			
			
			if(currentfontsize=="-moz-use-system-font") document.getElementById("tfsc-size").selectedIndex=0;
			else {
				document.getElementById("tfsc-size").selectedIndex=1;					
			}		
			
	
			
			
			var currentfontfamily = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontfamily");		
			
			var popup=document.getElementById("tfsc-fonts").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentfontfamily) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}	

			document.getElementById("tfsc-fonts").selectedItem=gh;
				
			
			
			var currentfontstyle = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontstyle");		
			
			var popup=document.getElementById("tfsc-style").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentfontstyle) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}	

			document.getElementById("tfsc-style").selectedItem=gh;
			
			
			var currentfontweight = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontweight");		
			
			var popup=document.getElementById("tfsc-weight").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentfontweight) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}	

			document.getElementById("tfsc-weight").selectedItem=gh;	
			
			
			var currentfontcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontcolor");		
			var customcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.customcolor");		

			/*var popup=document.getElementById("tfsc-color").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentfontcolor) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}
			
			document.getElementById("tfsc-color").selectedItem=gh;*/
			document.getElementById("tfsc-color-customcolor").value=(currentfontcolor=="-moz-use-system-font") ? customcolor : currentfontcolor;
			document.getElementById("tfsc-color-customcolor-colorpicker").value=(currentfontcolor=="-moz-use-system-font") ? customcolor : currentfontcolor;
			if(currentfontcolor=="-moz-use-system-font") document.getElementById("tfsc-color").selectedIndex=0;
			else {
				document.getElementById("tfsc-color").selectedIndex=1;					
			}

	
			var currentbackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentbackgroundcolor");		
			var custombackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.custombackgroundcolor");		

			/*var popup=document.getElementById("tfsc-backgroundcolor").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentbackgroundcolor) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}
			
			document.getElementById("tfsc-backgroundcolor").selectedItem=gh;*/
			
			document.getElementById("tfsc-backgroundcolor-custombackgroundcolor").value=(currentbackgroundcolor=="-moz-use-system-font") ? custombackgroundcolor : currentbackgroundcolor;
			document.getElementById("tfsc-backgroundcolor-custombackgroundcolor-colorpicker").value=(currentbackgroundcolor=="-moz-use-system-font") ? custombackgroundcolor : currentbackgroundcolor;
			if(currentbackgroundcolor=="-moz-use-system-font") document.getElementById("tfsc-backgroundcolor").selectedIndex=0;
			else {
				document.getElementById("tfsc-backgroundcolor").selectedIndex=1;					
			}		
			


				

			var currentthreadpanebackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentthreadpanebackgroundcolor");
			var customthreadpanebackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.customthreadpanebackgroundcolor");
			
			/*var popup=document.getElementById("tfsc-threadpanebackgroundcolor").getElementsByTagName("menupopup")[0];
			
			var accFontFamilyMenuitems = popup.getElementsByTagName("menuitem");

			var gh=accFontFamilyMenuitems[0];	
			
			for (var i=0;i<accFontFamilyMenuitems.length;i++) {
			
				if(accFontFamilyMenuitems[i].getAttribute("value")==currentthreadpanebackgroundcolor) {

					gh=accFontFamilyMenuitems[i];

				}
				
			}
			
			document.getElementById("tfsc-threadpanebackgroundcolor").selectedItem=gh;*/

			document.getElementById("tfsc-threadpanebackgroundcolor-customthreadpanebackgroundcolor").value=(currentthreadpanebackgroundcolor=="-moz-use-system-font") ? customthreadpanebackgroundcolor : currentthreadpanebackgroundcolor;	
			document.getElementById("tfsc-threadpanebackgroundcolor-customthreadpanebackgroundcolor-colorpicker").value=(currentthreadpanebackgroundcolor=="-moz-use-system-font") ? customthreadpanebackgroundcolor : currentthreadpanebackgroundcolor;			
			
			if(currentthreadpanebackgroundcolor=="-moz-use-system-font") document.getElementById("tfsc-threadpanebackgroundcolor").selectedIndex=0;
			else {
				document.getElementById("tfsc-threadpanebackgroundcolor").selectedIndex=1;					
			}		
			

		

			/*document.getElementById("tfsc-color").value=currentfontcolor;
			document.getElementById("tfsc-color").style.background=currentfontcolor;*/					

			var contextmenuenabled = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.contextmenuenabled");
			document.getElementById("tfsc-contextmenuenabled").checked=contextmenuenabled;
			
		},
		onpanelshowing:function(event){
		var isMac = ThemeFontSizeChanger.checkMac();
		if(ThemeFontSizeChanger.appInfo.ID==ThemeFontSizeChanger.FIREFOX_ID || ThemeFontSizeChanger.appInfo.ID==ThemeFontSizeChanger.PALEMOON_ID) document.getElementById("tfsc-threadpanebackgroundcolor-groupbox").hidden=true;
		//ThemeFontSizeChanger.buildFontList(null,'serif',document.getElementById('tfsc-fonts'));
		ThemeFontSizeChangerFonts._rebuildFonts();
		//ThemeFontSizeChanger.changeColorPickerColorMenuitem();
		ThemeFontSizeChanger.updateCheckedState();
		ThemeFontSizeChanger.addFontStyles();

		var dialogHeight=parseInt(screen.height*0.8);
		var dialogWidth=parseInt(screen.width*0.8);
		document.getElementById("themefontsizechangeroptionsdialog").style.maxHeight=dialogHeight+"px";
		document.getElementById("themefontsizechangeroptionsdialog").style.maxWidth=dialogWidth+"px";
		//window.moveTo((screen.width-dialogWidth)/2, (screen.height-dialogHeight)/2);
		
		},
		onpanelclosing:function(event){
		ThemeFontSizeChanger.removeFontStyles();
		},		
		changeColorPickerColorMenuitem:function(){
			var themefontsizechangerpickercolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.picker.color");
			document.getElementById("themefontsizechanger-fontcolor-custom-menuitem").setAttribute("label",themefontsizechangerpickercolor);
			document.getElementById("themefontsizechanger-fontcolor-custom-menuitem").setAttribute("value",themefontsizechangerpickercolor);
			var themefontsizechangerpickerbackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.picker.backgroundcolor");
			document.getElementById("themefontsizechanger-backgroundcolor-custom-menuitem").setAttribute("label",themefontsizechangerpickerbackgroundcolor);
			document.getElementById("themefontsizechanger-backgroundcolor-custom-menuitem").setAttribute("value",themefontsizechangerpickerbackgroundcolor);	
			var themefontsizechangerpickerthreadpanebackgroundcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.picker.threadpanebackgroundcolor");
			document.getElementById("themefontsizechanger-threadpanebackgroundcolor-custom-menuitem").setAttribute("label",themefontsizechangerpickerthreadpanebackgroundcolor);
			document.getElementById("themefontsizechanger-threadpanebackgroundcolor-custom-menuitem").setAttribute("value",themefontsizechangerpickerthreadpanebackgroundcolor);			
		},
		removeMacFix:function(requester){

			var macfix=ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.macfix");	
			var currentfontcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontcolor");
							
			var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
			var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);

			var oldcss = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+"#TabsToolbar{height:"+macfix+" !important;background-position:0 "+macfix+" !important;}.textbox-input-box {height:auto !important;}html|*.textbox-input:-moz-placeholder,html|*.textbox-textarea:-moz-placeholder{color:"+currentfontcolor+" !important;}";			
			var olduri = ios.newURI('data:text/css,' + encodeURIComponent(oldcss), null, null);
			if(sss.sheetRegistered(olduri, sss.AGENT_SHEET)) {
				sss.unregisterSheet(olduri, sss.AGENT_SHEET);
			}

		},
		assignMacFix:function(requester){

		var w = ((requester == "window") ? window : window.opener);
			try{var tabheight=w.getComputedStyle(w.document.getElementsByClassName("tabbrowser-tab")[0], null).getPropertyValue("height");}catch(e){return;}
			var TabsToolbarheight=w.getComputedStyle(w.document.getElementById("TabsToolbar"), null).getPropertyValue("height");
			if(tabheight!=TabsToolbarheight){
				//assign the css
			
			var macfix=ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.macfix");	
			var currentfontcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentfontcolor");
							
			var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
			var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);

			var oldcss = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+"#TabsToolbar{height:"+macfix+" !important;background-position:0 "+macfix+" !important;}.textbox-input-box {height:auto !important;}html|*.textbox-input:-moz-placeholder,html|*.textbox-textarea:-moz-placeholder{color:"+currentfontcolor+" !important;}";			
			var olduri = ios.newURI('data:text/css,' + encodeURIComponent(oldcss), null, null);
			if(sss.sheetRegistered(olduri, sss.AGENT_SHEET)) {
				sss.unregisterSheet(olduri, sss.AGENT_SHEET);
			}

			var css = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+"#TabsToolbar{height:"+tabheight+" !important;background-position:0 "+tabheight+" !important;}.textbox-input-box {height:auto !important;}html|*.textbox-input:-moz-placeholder,html|*.textbox-textarea:-moz-placeholder{color:"+currentfontcolor+" !important;}";	
			var uri = ios.newURI('data:text/css,' + encodeURIComponent(css), null, null);
			if (!sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
				sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
			}
			
			ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.macfix",tabheight);	
					
			}
		},
		
		addStylesForMacFix: function(requester){

			ThemeFontSizeChanger.isMac = ThemeFontSizeChanger.checkMac();
			var isThemeDefault = ThemeFontSizeChanger.getPrefValue("general.skins.selectedSkin") == "classic/1.0";
			if(ThemeFontSizeChanger.isMac && isThemeDefault){
				ThemeFontSizeChanger.removeMacFix(requester ? requester : null);
				ThemeFontSizeChanger.assignMacFix(requester ? requester : null);
			}

		},
		
		addStylesForWin7: function(requester){

			ThemeFontSizeChanger.isMac = ThemeFontSizeChanger.checkMac();
			var isThemeDefault = ThemeFontSizeChanger.getPrefValue("general.skins.selectedSkin") == "classic/1.0";
			if(!ThemeFontSizeChanger.isMac && isThemeDefault && window.opener && window.opener.TabsInTitlebar){
				window.opener.TabsInTitlebar.allowedBy("sizemode",false);
				window.opener.TabsInTitlebar.allowedBy("sizemode",true);
			}

		},
				
		checkMac : function() {
			var dir = false;
			try {
				var dirService = Components.classes["@mozilla.org/file/directory_service;1"].  
							  getService(Components.interfaces.nsIProperties);   
				dir = dirService.get("UsrDsk", Components.interfaces.nsIFile);
			} catch(e) {}
			return dir;
		},
		
		isMac: false,
		
		showPicker:function(event, command, args){
		
			document.getElementById("themefontsizechanger-statusbar-panel").setAttribute("assignedelement",event.target.id);
		
			//window.openDialog("chrome://themetweaker/content/options.xul", null, "centerscreen,chrome");

			var optionsURL = "chrome://themetweaker/content/picker/picker.xul";
			// The following code is from extensions.js (Add-ons manager) :)
			var windows = Components.classes['@mozilla.org/appshell/window-mediator;1']
					.getService(Components.interfaces.nsIWindowMediator)
					.getEnumerator(null);
			while (windows.hasMoreElements()) {
				var win = windows.getNext();
				if (win.document.documentURI == optionsURL) {
					win.focus();
					win.execArguments([command, args]);
					return([win, true]);
				}
			}

			var modal = true;

			//var features = "chrome,titlebar,toolbar,centerscreen" + (modal ? ",modal" : ",dialog=no");//original
			var features = "chrome,titlebar,toolbar,centerscreen" + (modal ? ",modal" : ",dialog=yes");//modified to yes to be dialog
			
			// var args after features
			return([open(optionsURL, "", features, command, args), false]);		
		},
		
		colorPickerRevertBack: function() {
	
					
				var currentelement=document.getElementById(document.getElementById("themefontsizechanger-statusbar-panel").getAttribute("assignedelement"));

				var value=	currentelement.getAttribute("elementvalue");
		
				var currentcolor = ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.current"+value);
				
			  	currentelement.parentNode.parentNode.selectedItem = (currentcolor=="-moz-use-system-font") ? currentelement.previousSibling.previousSibling.previousSibling.previousSibling : currentelement.previousSibling.previousSibling;
				
		},
			
		addAddonListener:function(){

var beingUninstalled;  
  
let listener = {  
  onInstalling: function(addon) {  
    if (addon.id == ThemeFontSizeChanger.addonGUID) {  
      beingUninstalled = true;  

 if(ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.currentversion")==addon.version) 			      ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.reinstall",true);
 
    }  
  },  
  onUninstalling: function(addon) {  
    if (addon.id == ThemeFontSizeChanger.addonGUID) {  
      beingUninstalled = true;  
		
		const Cc = Components.classes;
		const Ci = Components.interfaces;
		const Cr = Components.results;
		const Cu = Components.utils;
		
		// modules that come with Firefox
		Cu.import("resource://gre/modules/XPCOMUtils.jsm");
		// LightweightThemeManager may not be not available (Firefox < 3.6 or Thunderbird)
		try { Cu.import("resource://gre/modules/LightweightThemeManager.jsm"); }
		catch (e) { LightweightThemeManager = null; }
		
		 
		LightweightThemeManager.currentTheme=null
		ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentbackgroundcolor","-moz-use-system-font");	

    }  
  },  
  onOperationCancelled: function(addon) {  
    if (addon.id == ThemeFontSizeChanger.addonGUID) {  
      beingUninstalled = (addon.pendingOperations & AddonManager.PENDING_UNINSTALL) != 0;  
      // alert("canceled")
    }  
  }  
}  
  
try {  
  Components.utils.import("resource://gre/modules/AddonManager.jsm");  
  AddonManager.addAddonListener(listener);  
} catch (ex) {} 
		
		},
		
		addonReinstall:function (event) {
			
		},
		
changeTheme:function(backgroundcolor) {

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;


// modules that come with Firefox
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
// LightweightThemeManager may not be not available (Firefox < 3.6 or Thunderbird)
try { Cu.import("resource://gre/modules/LightweightThemeManager.jsm"); }
catch (e) { LightweightThemeManager = null; }


if(backgroundcolor=="-moz-use-system-font") {
 
	LightweightThemeManager.currentTheme=null
	//ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentbackgroundcolor",document.getElementById("tfsc-backgroundcolor").selectedItem.value);	
	
	ThemeFontSizeChanger.changeFontSize(null);
	
	return;

}
//textcolor is removed
var CP= {

accentcolor:
	backgroundcolor,
	
custom:
	true,
	
footerURL:
	"resource://themefontsizechanger/chrome/content/spacer.gif",
	
headerURL:
	"resource://themefontsizechanger/chrome/content/spacer.gif",
	
id:
	"100000",
	
name:
	ThemeFontSizeChanger.addonLiteralName + " LightWeightTheme"
	 
}	

try{

PersonaService.previewPersona(CP)
PersonaService.changeToPersona(CP);

}
catch(err) {

LightweightThemeManager.previewTheme(CP)
LightweightThemeManager.setLocalTheme(CP);

}

//ThemeFontSizeChanger.setPrefValue("extensions.themetweaker.currentbackgroundcolor",document.getElementById("tfsc-backgroundcolor").selectedItem.value);	

ThemeFontSizeChanger.changeFontSize(null);

},

		askColorPickerElementValue:function(event){
		
			return document.getElementById(document.getElementById("themefontsizechanger-statusbar-panel").getAttribute("assignedelement")).getAttribute("elementvalue");

		},
		
		handleColorPick: function(selectedcolor) {
		
			var currentelement=document.getElementById(document.getElementById("themefontsizechanger-statusbar-panel").getAttribute("assignedelement"));
			
			currentelement.previousSibling.previousSibling.setAttribute("label",selectedcolor);
			currentelement.previousSibling.previousSibling.setAttribute("value",selectedcolor);
			currentelement.parentNode.parentNode.selectedItem=currentelement.previousSibling.previousSibling;
			
			//currentelement.firstChild.style.backgroundColor=selectedcolor;
			//FirefoxReader.enableFIREFOXREADER();
			
		},
		requestAppendToolbar:function(){
			var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			var themefontsizechangertbadded = themefontsizechangerprefsinstance.getBoolPref("extensions.themetweaker.tbadded");
			if(!themefontsizechangertbadded) {
				ThemeFontSizeChanger.appendToToolbar(); 
				themefontsizechangerprefsinstance.setBoolPref("extensions.themetweaker.tbadded",true);
			}	
		},		
	    appendToToolbar: function() {
			if (!window.CustomizableUI) {	
				// Get the current navigation bar button set (a string of button IDs) and append
				// ID of the Firebug start button into it.
				var startButtonId =  "themefontsizechanger-toolbarbutton";
				var navBarId = "nav-bar";
				var navBar = document.getElementById(navBarId);
				var currentSet = navBar.currentSet;
		
				// Append only if the button is not already there.
				var curSet = currentSet.split(",");
				if (curSet.indexOf(startButtonId) == -1)
				{
					navBar.insertItem(startButtonId);
					navBar.setAttribute("currentset", navBar.currentSet);
					document.persist("nav-bar", "currentset");
		
					try
					{
						// The current global scope is not browser.xul.
						top.BrowserToolboxCustomizeDone(true);
					}
					catch (e)
					{
		   
					}
					
				}
		
				// Don't forget to show the navigation bar - just in case it's hidden.
				// Dom.collapse(navBar, false);
				//document.persist(navBarId, "collapsed");
	        }
			else {
				var ids=["themefontsizechanger-toolbarbutton"];
				var add=1;
				for (var i=0;i<ids.length;i++) {
					if(add){
						if(!window.CustomizableUI.getPlacementOfWidget(ids[i])){
							window.CustomizableUI.addWidgetToArea(ids[i], CustomizableUI.AREA_NAVBAR);
						}
					}
					else{
						window.CustomizableUI.removeWidgetFromArea(ids[i]);                      
					}
				}
			}			
	    },
	
	addFontStyles:function(){
	
		/*var a=document.getElementById("tfsc-fonts").getElementsByClassName("tfmi");
		
		var css="";
		
		for (var i=0;i<a.length;i++) {
	
			css+=".tfmi:nth-of-type("+(i+2)+") * {font-family:'"+a[i].getAttribute("label")+"' !important;}\n";
		
		}*/
		
		var css=ThemeFontSizeChangerFonts.allFontsCSS;
	
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	
		var uri = ios.newURI('data:text/css,' + encodeURIComponent(css), null, null);
		if (!sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
		}	
	
	},    
	
	removeFontStyles:function(){
	
		/*var a=document.getElementById("tfsc-fonts").getElementsByClassName("tfmi");
		
		var css="";
		
		for (var i=0;i<a.length;i++) {
	
			css+=".tfmi:nth-of-type("+(i+2)+") * {font-family:'"+a[i].getAttribute("label")+"' !important;}\n";
		
		}*/
		
		var css=ThemeFontSizeChangerFonts.allFontsCSS;
	
		var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	
		var uri = ios.newURI('data:text/css,' + encodeURIComponent(css), null, null);
		if(sss.sheetRegistered(uri, sss.AGENT_SHEET)) {
			sss.unregisterSheet(uri, sss.AGENT_SHEET);
		}		
	
	},
		
		hideToolsMenu:function(event){
			document.getElementById("themefontsizechanger-tools-menuitem").hidden=ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.hidetoolsmenu");
		},   
		
		hideAppMenu:function(event){
			if(document.getElementById("themefontsizechanger-appmenu-menuitem")) document.getElementById("themefontsizechanger-appmenu-menuitem").hidden=ThemeFontSizeChanger.getPrefValue("extensions.themetweaker.hideappmenu");
		}	    				
 	}
	
	var ThemeFontSizeChangerFonts = {
		_rebuildFonts: function () {

			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			var branch = prefs.getBranch("font.language.");
			var langGroupPref = branch.getComplexValue("group",Components.interfaces.nsIPrefLocalizedString).data;		

			ThemeFontSizeChangerFonts._selectDefaultLanguageGroup(langGroupPref,ThemeFontSizeChangerFonts._readDefaultFontTypeForLanguage(langGroupPref) == "serif");
			
		},
		_selectDefaultLanguageGroup: function (aLanguageGroup, aIsSerif){
			const kFontNameFmtSerif         = "font.name.serif.%LANG%";
			const kFontNameFmtSansSerif     = "font.name.sans-serif.%LANG%";
			const kFontNameListFmtSerif     = "font.name-list.serif.%LANG%";
			const kFontNameListFmtSansSerif = "font.name-list.sans-serif.%LANG%";
			const kFontSizeFmtVariable      = "font.size.variable.%LANG%";

			var prefs = [{ format   : aIsSerif ? kFontNameFmtSerif : kFontNameFmtSansSerif,
						   type     : "fontname",
						   element  : "defaultFont",
						   fonttype : aIsSerif ? "serif" : "sans-serif" },
						 { format   : aIsSerif ? kFontNameListFmtSerif : kFontNameListFmtSansSerif,
						   type     : "unichar",
						   element  : null,
						   fonttype : aIsSerif ? "serif" : "sans-serif" },
						 { format   : kFontSizeFmtVariable,
						   type     : "int",
						   element  : "defaultFontSize",
						   fonttype : null }];
			var preferences = document.getElementById("contentPreferences");
			for (var i = 0; i < prefs.length; ++i) {
			  var preference = document.getElementById(prefs[i].format.replace(/%LANG%/, aLanguageGroup));
			  if (!preference) {
				/*preference = document.createElement("preference");
				var name = prefs[i].format.replace(/%LANG%/, aLanguageGroup);
				preference.id = name;
				preference.setAttribute("name", name);
				preference.setAttribute("type", prefs[i].type);
				preferences.appendChild(preference);*/
			  }

			  if (!prefs[i].element)
				continue;

			  //var element = document.getElementById(prefs[i].element);
			  var passelement=document.getElementById("tfsc-fonts");
			  var element = passelement;
			  if (element) {
				//element.setAttribute("preference", preference.id);

				if (prefs[i].fonttype)
				  //FontBuilder.buildFontList(aLanguageGroup, prefs[i].fonttype, element);
				   ThemeFontSizeChangerFonts.buildFontList(aLanguageGroup, prefs[i].fonttype, element);

				//preference.setElementValue(element);
			  }
			}
		},
		_readDefaultFontTypeForLanguage: function (aLanguageGroup){
			const kDefaultFontType = "font.default.%LANG%";
			var defaultFontTypePref = kDefaultFontType.replace(/%LANG%/, aLanguageGroup);
			var preference = document.getElementById(defaultFontTypePref);
			if (!preference) {  
				/*preference = document.createElement("preference");
				preference.id = defaultFontTypePref;
				preference.setAttribute("name", defaultFontTypePref);
				preference.setAttribute("type", "string");
				preference.setAttribute("onchange", "gContentPane._rebuildFonts();");
				document.getElementById("contentPreferences").appendChild(preference);*/
			}
			//return preference.value;
			return ThemeFontSizeChanger.getPrefValue(defaultFontTypePref);
		},
		_enumerator: null,
		get enumerator (){
			if (!ThemeFontSizeChangerFonts._enumerator) {
				ThemeFontSizeChangerFonts._enumerator = Components.classes["@mozilla.org/gfx/fontenumerator;1"].createInstance(Components.interfaces.nsIFontEnumerator);
			}
			return ThemeFontSizeChangerFonts._enumerator;
		},
		_allFonts: null,
		allFontsCSS:null,
		buildFontList: function (aLanguage, aFontType, aMenuList) {
			// Reset the list

			while (aMenuList.hasChildNodes())
			  {aMenuList.removeChild(aMenuList.firstChild);}

			var defaultFont = null;
			// Load Font Lists
			var fonts = ThemeFontSizeChangerFonts.enumerator.EnumerateFonts(aLanguage, aFontType, { } );

			if (fonts.length > 0)
			  {defaultFont = ThemeFontSizeChangerFonts.enumerator.getDefaultFont(aLanguage, aFontType);}
			else {
			  fonts = ThemeFontSizeChangerFonts.enumerator.EnumerateFonts(aLanguage, "", { });
			  if (fonts.length > 0)
				{defaultFont = ThemeFontSizeChangerFonts.enumerator.getDefaultFont(aLanguage, "");}
			}

			if (!ThemeFontSizeChangerFonts._allFonts)
			  ThemeFontSizeChangerFonts._allFonts = ThemeFontSizeChangerFonts.enumerator.EnumerateAllFonts({});

			// Build the UI for the Default Font and Fonts for this CSS type.
			var popup = document.createElement("menupopup");
			var separator;
						
			if (fonts.length > 0) {
				
				/*
				if (defaultFont) {
					var bundlePreferences = document.getElementById("bundlePreferences");
					var label = bundlePreferences.getFormattedString("labelDefaultFont", [defaultFont]);
					var menuitem = document.createElement("menuitem");
					menuitem.setAttribute("label", label);
					menuitem.setAttribute("value", ""); // Default Font has a blank value
					popup.appendChild(menuitem);

					separator = document.createElement("menuseparator");
					popup.appendChild(separator);
				}
				*/

				{//Default
					var menuitem2 = document.createElement("menuitem");
					menuitem2.setAttribute("label", document.getElementById("themefontsizechangeroptions-strings").getString("themefontsizechangeroptions.FontDefault"));
					menuitem2.setAttribute("value", "-moz-use-system-font"); 
					popup.appendChild(menuitem2);

					separator = document.createElement("menuseparator");
					popup.appendChild(separator);
				  
				}	

				var css="";
				
				for (var i = 0; i < fonts.length; ++i) {
					var font=fonts[i];
					menuitem = document.createElement("menuitem");
					menuitem.setAttribute("value", font);
					menuitem.setAttribute("label", font);
					menuitem.setAttribute("class", "tfmi");					
					popup.appendChild(menuitem);

					css+=".tfmi:nth-of-type("+(i+2)+") * {font-family:'"+font+"' !important;}\n";
					
				}
				
				ThemeFontSizeChangerFonts.allFontsCSS=css;
				
			}

			// Build the UI for the remaining fonts. 
			if (ThemeFontSizeChangerFonts._allFonts.length > fonts.length) {
			  // Both lists are sorted, and the Fonts-By-Type list is a subset of the
			  // All-Fonts list, so walk both lists side-by-side, skipping values we've
			  // already created menu items for. 
			  var builtItem = separator ? separator.nextSibling : popup.firstChild;
			  var builtItemValue = builtItem ? builtItem.getAttribute("value") : null;

			  for (i = 0; i < ThemeFontSizeChangerFonts._allFonts.length; ++i) {
				if (ThemeFontSizeChangerFonts._allFonts[i] != builtItemValue) {
				  menuitem = document.createElement("menuitem");
				  menuitem.setAttribute("value", ThemeFontSizeChangerFonts._allFonts[i]);
				  menuitem.setAttribute("label", ThemeFontSizeChangerFonts._allFonts[i]);
				  menuitem.setAttribute("class", "tfmi");				  
				  popup.appendChild(menuitem);
				}
				else {
				  builtItem = builtItem.nextSibling;
				  builtItemValue = builtItem ? builtItem.getAttribute("value") : null;
				}
			  }
			}

			aMenuList.appendChild(popup);   
			
		}
	}
	
