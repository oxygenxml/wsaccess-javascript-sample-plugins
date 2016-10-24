function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 referenceResolver = {
  /*Called when a reference is resolved*/
  makeRelative: function (baseURL, childURL) {
    return childURL != null ? Packages.ro.sync.util.URLUtil.clearUserInfo(childURL).toString() : null;
  }
 }
 pluginWorkspaceAccess.addRelativeReferencesResolver("https", new JavaAdapter(Packages.ro.sync.exml.workspace.api.util.RelativeReferenceResolver, referenceResolver));
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
