function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    var editorOpenListener = {
        editorOpened: function (editorLocation) {
            var editorAccess = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.standalone.StandalonePluginWorkspace.MAIN_EDITING_AREA);
            if (editorAccess.getDocumentTypeInformation() != null) {
                //It's an XML document
                var content = readContent(editorAccess.createContentReader());
                content = content.replaceAll("(<!DOCTYPE .*?>)", "<!--DOCTYPE DECL:$1-->");
                Packages.java.lang.System.err.println("\nFile = " + editorLocation);
                try {
                    var transformer = pluginWorkspaceAccess.getXMLUtilAccess().createXSLTTransformer(
                    new Packages.javax.xml.transform.stream.StreamSource(jsDirURL + "/open.xsl"),
                    null,
                    Packages.ro.sync.exml.workspace.api.util.XMLUtilAccess.TRANSFORMER_SAXON_ENTERPRISE_EDITION, false);
                    var sw = new Packages.java.io.StringWriter();
                    var streamRes = new Packages.javax.xml.transform.stream.StreamResult(sw);
                    transformer.transform(new Packages.javax.xml.transform.stream.StreamSource(new Packages.java.io.StringReader(content), editorAccess.getEditorLocation().toString()), streamRes);
                    sw.close();
                    var newContent = sw.toString();
                    newContent = newContent.replaceAll("<!--DOCTYPE DECL:(.*?)-->", "\n$1\n");
                    editorAccess.reloadContent(new Packages.java.io.StringReader(newContent));
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
                        
                        var content = readContent(editorAccess.createContentReader());
                        content = content.replaceAll("(<!DOCTYPE .*?>)", "<!--DOCTYPE DECL:$1-->");
                        
                        var transformer = pluginWorkspaceAccess.getXMLUtilAccess().createXSLTTransformer(
                        new Packages.javax.xml.transform.stream.StreamSource(jsDirURL + "/save.xsl"), null,
                        Packages.ro.sync.exml.workspace.api.util.XMLUtilAccess.TRANSFORMER_SAXON_ENTERPRISE_EDITION, false);
                        var sw = new Packages.java.io.StringWriter();
                        var streamRes = new Packages.javax.xml.transform.stream.StreamResult(sw);
                        transformer.transform(new Packages.javax.xml.transform.stream.StreamSource(new Packages.java.io.StringReader(content), editorAccess.getEditorLocation().toString()), streamRes);
                        sw.close();
                        var newContent = sw.toString();
                        newContent = newContent.replaceAll("<!--DOCTYPE DECL:(.*?)-->", "\n$1\n");                        
                        
                        var writer = new Packages.java.io.OutputStreamWriter(editorAccess.getEditorLocation().openConnection().getOutputStream(), editorAccess.getEncodingForSerialization());
                        writer.write(newContent);
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

function readContent(reader){
    br = new Packages.java.io.BufferedReader(reader);
    line = null;
    stringBuilder = new Packages.java.lang.StringBuilder();

    try {
      while((line = br.readLine()) != null) {
        stringBuilder.append(line);
        stringBuilder.append("\n");
      }
    } finally {
      try {
        reader.close();
      } catch (e) {
        e.print();
      }
    }
    return stringBuilder.toString();
}