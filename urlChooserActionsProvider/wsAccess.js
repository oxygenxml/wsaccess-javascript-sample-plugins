function applicationStarted(pluginWorkspaceAccess) {
customizer = {
   	customizeBrowseActions :function (existingBrowseActions, chooser) {
   	
       	    specialLocationAction = {
       	     actionPerformed: function (e) {
                try{
                   chooser.urlChosen(new Packages.java.net.URL(pluginWorkspaceAccess.getUtilAccess().expandEditorVariables("${pdu}", null)));
                } catch(ex){
                    //Ignore
                    ex.printStackTrace();
                }
       	     }
       	    }
   	     locationActionSwing = new JavaAdapter(Packages.javax.swing.AbstractAction, Packages.java.awt.event.ActionListener, specialLocationAction);
   	     locationActionSwing.putValue("Name", "Path To Project");
   	     locationActionSwing.putValue("SmallIcon", Packages.ro.sync.ui.Icons.getIcon(Packages.ro.sync.ui.Icons.SETTINGS));
   	     existingBrowseActions.add(locationActionSwing);
   	}
  }
 pluginWorkspaceAccess.addInputURLChooserCustomizer(new Packages.ro.sync.exml.workspace.api.standalone.InputURLChooserCustomizer(customizer));
}
function applicationClosing(pluginWorkspaceAccess) {
}
