function applicationStarted(pluginWorkspaceAccess) {
    /*Add listener called when right click is performed in the text page*/
   customizerObj = {
    customizeTextPopUpMenu: function (popUp, textPage) {
      try {
        /*Create absolute reference*/
        mi = new Packages.javax.swing.JMenuItem("Determine Complex Layout Chars");
        popUp.add(mi);
        actionPerfObj = {
         actionPerformed: function (e) {
          try {
              var textStr = textPage.getDocument().getText(0, textPage.getDocument().getLength());
              var text = textStr.toCharArray();
              for(var i = 0; i < text.length; i++){
                var complexLayout = isComplexLayout(text, i, i + 1);
                if(complexLayout){
                    dpi = new Packages.ro.sync.document.DocumentPositionedInfo(i);
                    dpi.setLength(1);
                    dpi.setMessage(textStr.substr(i, 1));
                    dpi.setSystemID(textPage.getParentEditor().getEditorLocation());
                    Packages.ro.sync.exml.workspace.api.PluginWorkspaceProvider.getPluginWorkspace().getResultsManager().addResult("Complex Layout Chars", dpi, Packages.ro.sync.exml.workspace.api.results.ResultsManager.ResultType.GENERIC, true, false);
                }
              }
          } catch (e1) {
           Packages.java.lang.System.err.println(e1);
          }
         }
        }
        mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
       } catch (e1) {
        Packages.java.lang.System.err.println(e1);
       }
    }
   }

    //Add the popup menu customizer.
    pluginWorkspaceAccess.addMenusAndToolbarsContributorCustomizer(new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.actions.MenusAndToolbarsContributorCustomizer, customizerObj));
}

function isComplexLayout(chs, start, limit) {
  for (i = start; i < limit; i++) {
    if (chs[i] < 0x0300) {
      continue;
    }
    else if (isNonSimpleChar(chs[i])) {
      return true;
    }
  }
  return false;
}

function isNonSimpleChar(code) {
    if(code >= 0xD800 && code <= 0xDFFF){
    //D800 -> DFFF - surrogate chars
      return true;
    }
    if (code < 0x0300 || code > 0x206F) {
      return false;
    }
    else if (code <= 0x036f) {
      // Trigger layout for combining diacriticals 0x0300->0x036f
      return true;
    }
    else if (code < 0x0590) {
      // No automatic layout for Greek, Cyrillic, Armenian.
      return false;
    }
    
    else if (code <= 0x06ff) {
      // Hebrew 0590 - 05ff
      // Arabic 0600 - 06ff
      return true;
    }
    else if (code < 0x0900) {
      return false; // Syriac and Thaana
    }
    else if (code <= 0x0e7f) {
      // if Indic, assume shaping for conjuncts, reordering:
      // 0900 - 097F Devanagari
      // 0980 - 09FF Bengali
      // 0A00 - 0A7F Gurmukhi
      // 0A80 - 0AFF Gujarati
      // 0B00 - 0B7F Oriya
      // 0B80 - 0BFF Tamil
      // 0C00 - 0C7F Telugu
      // 0C80 - 0CFF Kannada
      // 0D00 - 0D7F Malayalam
      // 0D80 - 0DFF Sinhala
      // 0E00 - 0E7F if Thai, assume shaping for vowel, tone marks
      return true;
    }
    else if (code <  0x0f00) {
      return false;
    }
    else if (code <= 0x0fff) { // U+0F00 - U+0FFF Tibetan
      return true;
    }
    else if (code < 0x1100) {
      return false;
    }
    else if (code < 0x11ff) { // U+1100 - U+11FF Old Hangul
      return true;
    }
    else if (code < 0x1780) {
      return false;
    }
    else if (code <= 0x17ff) { // 1780 - 17FF Khmer
      return true;
    }
    else if (code < 0x200c) {
      return false;
    }
    else if (code <= 0x200d) { //  zwj or zwnj
      return true;
    }
    else if (code >= 0x202a && code <= 0x202e) { // directional control
      return true;
    }
    else if (code >= 0x206a && code <= 0x206f) { // directional control
      return true;
    }
    return (code >= 0xD800 &&
      code <= 0xDFFF);
}

function applicationClosing(pluginWorkspaceAccess) {
}
