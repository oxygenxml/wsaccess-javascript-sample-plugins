function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    var editorOpenListener = {
        editorOpened: function (editorLocation) {
            var editorAccess = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.standalone.StandalonePluginWorkspace.MAIN_EDITING_AREA);
            if (editorAccess.getDocumentTypeInformation() != null) {
                //It's an XML document
                var content = Packages.ro.sync.basic.io.IOUtil.read(editorAccess.createContentReader()).toString();
                var doctypeDeclaration = "";
                var indexOfDoctype = content.indexOf("<!DOCTYPE");
                if (indexOfDoctype != -1) {
                    doctypeDeclaration = content.substring(indexOfDoctype, content.indexOf(">", indexOfDoctype) + 1);
                }
                Packages.java.lang.System.err.println("\nFile = " + editorLocation + " DOCTYPE " + doctypeDeclaration);
                try {
                    var transformer = pluginWorkspaceAccess.getXMLUtilAccess().createXSLTTransformer(
                    new Packages.javax.xml.transform.stream.StreamSource(jsDirURL + "/open.xsl"),
                    null,
                    Packages.ro.sync.exml.workspace.api.util.XMLUtilAccess.TRANSFORMER_SAXON_ENTERPRISE_EDITION, false);
                    var sw = new Packages.java.io.StringWriter();
                    var streamRes = new Packages.javax.xml.transform.stream.StreamResult(sw);
                    transformer.transform(new Packages.javax.xml.transform.stream.StreamSource(editorAccess.createContentReader(), editorAccess.getEditorLocation().toString()), streamRes);
                    sw.close();
                    var newContent = sw.toString();
                    indexOfDoctype = newContent.indexOf("<!DOCTYPE");
                    if (indexOfDoctype != -1) {
                        //The XSLT generated its own doctype declaration, use that instead of the original DOCTYPE declaration
                        doctypeDeclaration = "";
                    }
                    editorAccess.reloadContent(new Packages.java.io.StringReader(
                    //Preserve the old doctype declaration
                    doctypeDeclaration +
                    newContent));
					//And set it as not modified
					editorAccess.setModified(false);
                }
                catch (e1) {
                    e1.printStackTrace();
                }
            }
            
            //Radu's comment, also add the save listener here:
            var saveListener = {
                //Editor is about to be saved
                editorSaved: function (operationType) {
                    try {
                        Packages.java.lang.System.err.println("\nSaved");
                        var file = pluginWorkspaceAccess.getUtilAccess().locateFile(editorAccess.getEditorLocation());
                        var lastModified = -1;
                        if (file != null) {
                            lastModified = file.lastModified();
                        }
                        
                        var doctypeDeclaration = "";
                        var indexOfDoctype = content.indexOf("<!DOCTYPE");
                        if (indexOfDoctype != -1) {
                            doctypeDeclaration = content.substring(indexOfDoctype, content.indexOf(">", indexOfDoctype) + 1);
                        }
                        
                        var transformer = pluginWorkspaceAccess.getXMLUtilAccess().createXSLTTransformer(
                        new Packages.javax.xml.transform.stream.StreamSource(jsDirURL + "/save.xsl"), null,
                        Packages.ro.sync.exml.workspace.api.util.XMLUtilAccess.TRANSFORMER_SAXON_ENTERPRISE_EDITION, false);
                        var sw = new Packages.java.io.StringWriter();
                        var streamRes = new Packages.javax.xml.transform.stream.StreamResult(sw);
                        transformer.transform(new Packages.javax.xml.transform.stream.StreamSource(editorAccess.createContentReader(), editorAccess.getEditorLocation().toString()), streamRes);
                        sw.close();
                        var newContent = sw.toString();
                        indexOfDoctype = newContent.indexOf("<!DOCTYPE");
                        if (indexOfDoctype != -1) {
                            //The XSLT generated its own doctype declaration, use that instead of the original DOCTYPE declaration
                            doctypeDeclaration = "";
                        }
                        
                        
                        var writer = new Packages.java.io.OutputStreamWriter(editorAccess.getEditorLocation().openConnection().getOutputStream(), editorAccess.getEncodingForSerialization());
                        writer.write(doctypeDeclaration + newContent);
                        writer.close();
                        if (lastModified != -1) {
                            //Reset the last modified flag
                            file.setLastModified(lastModified);
                        }
                    }
                    catch (e1) {
                        e1.printStackTrace();
                    }
                }
            };
            
            saveListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorListener, saveListener);
            editorAccess.addEditorListener(saveListener);
        }
    };
    editorOpenListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, editorOpenListener);
    pluginWorkspaceAccess.addEditorChangeListener(editorOpenListener, Packages.ro.sync.exml.workspace.api.PluginWorkspace.MAIN_EDITING_AREA);
}


function applicationClosing(pluginWorkspaceAccess) {
}