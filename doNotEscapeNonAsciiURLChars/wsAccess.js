function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 var calledFromOwnCode = false;
 referenceResolver = {
  /*Called when a reference is resolved*/
  makeRelative: function (baseURL, childURL) {
            if(calledFromOwnCode){
                return null;
            }
          try {
            calledFromOwnCode = true;
            ret = Packages.ro.sync.basic.util.URLUtil.makeRelative(new Packages.java.net.URL(Packages.ro.sync.basic.util.URLUtil.uncorrect(baseURL.toString())), new Packages.java.net.URL(Packages.ro.sync.basic.util.URLUtil.uncorrect(childURL.toString()))); 
            calledFromOwnCode = false;
            return ret;
          } catch (e) {
            e.printStackTrace();
            calledFromOwnCode = false;
          }
          return null;
  }
 }
 pluginWorkspaceAccess.addRelativeReferencesResolver("file", new JavaAdapter(Packages.ro.sync.exml.workspace.api.util.RelativeReferenceResolver, referenceResolver));
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
