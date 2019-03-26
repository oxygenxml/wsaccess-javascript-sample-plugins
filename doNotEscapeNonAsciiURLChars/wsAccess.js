function applicationStarted(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
 referenceResolver = {
  /*Called when a reference is resolved*/
  makeRelative: function (baseURL, childURL) {
          try {
            if(!baseURL.toString().endsWith("/")) {
              lastIndexOfSlash = baseURL.getPath().lastIndexOf('/');
              baseURL = new Packages.java.net.URL(baseURL.getProtocol(), baseURL.getHost(), baseURL.getPort(), baseURL.getPath().substring(0, lastIndexOfSlash + 1));
            }
            return  Packages.java.net.URI.create(Packages.ro.sync.basic.util.URLUtil.uncorrect(baseURL.toString())).relativize(new Packages.java.net.URI(Packages.ro.sync.basic.util.URLUtil.uncorrect(childURL.toString()))).toString();
          } catch (e) {
            e.printStackTrace();
          }
          return null;
  }
 }
 pluginWorkspaceAccess.addRelativeReferencesResolver("file", new JavaAdapter(Packages.ro.sync.exml.workspace.api.util.RelativeReferenceResolver, referenceResolver));
}

function applicationClosing(pluginWorkspaceAccess) {
 Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}
