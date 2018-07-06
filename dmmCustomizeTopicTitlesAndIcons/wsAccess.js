function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    
    // Read the properties file that stores mappings from DITA class particle (e.g. "task/task") to icon file path
    var inputStream = null;
    var properties = null;
    try {
        inputStream = new Packages.java.io.FileInputStream(new Packages.java.io.File(new Packages.java.net.URI(jsDirURL + "/icons.properties")));
        properties = new Packages.java.util.Properties();
        properties.load(inputStream);
    }
    catch (err) {
        err.printStackTrace();
    }
    finally {
        if (inputStream) {
            try {
                inputStream.close();
            }
            catch (err) {
                err.printStackTrace();
            }
        }
    }
    
    // Editor change listener. Triggered when a DITA Map is opened in the DITA Maps Manager.
    edChangedListener = {
        
        editorOpened: function (editorLocation) {
            
            // Get the opened DITA Map
            editor = pluginWorkspaceAccess.getEditorAccess(editorLocation, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
            ditaMapPage = editor.getCurrentPage();
            
            // DITA map node renderer customizer
            customizer = {
                
                // Get rendering information for the topicrefs in the DITA Maps Manager
                getRenderingInformation: function (context) {
                    var renderingInfo = null;
                    var topicRefTargetInfo = context.getTopicRefTargetInfo();
                    if (topicRefTargetInfo && properties) {
                        // Get the "class" attribute's value for the current referred topic
                        clazz = topicRefTargetInfo.getProperty(Packages.ro.sync.exml.workspace.api.standalone.ditamap.TopicRefTargetInfo.CLASS_VALUE);
                        if (clazz) {
                            clazz = clazz.trim();
                            var iconPath = null;
                            var iterator = properties.keySet().iterator();
                            while (iterator.hasNext()) {
                                var key = iterator.next();
                                if (clazz.indexOf(key) !== -1) {
                                    // Keep the first icon
                                    iconPath = properties. get (key);
                                    break;
                                }
                            }
                            
                            // Set the custom icon
                            try {
                                if (iconPath) {
                                    var iconURI = new Packages.java.net.URI(jsDirURL + "/" + iconPath);
                                    var iconFile = new Packages.java.io.File(iconURI);
                                    if (iconFile.exists()) {
                                        renderingInfo = new Packages.ro.sync.exml.workspace.api.node.customizer.BasicRenderingInformation();
                                        renderingInfo.setIconPath(iconURI);
                                    }
                                }
                            }
                            catch (err) {
                                err.printStackTrace();
                            }
                        }
                    }
                    
                    return renderingInfo;
                },
                
                // Customize the topicref titles
                customizeComputedTopicrefTitle: function (topicref, targetTopicOrMap, defaultComputedTitle) {
                    var newComputedTitle = defaultComputedTitle;
                    var currentTopicref = topicref;
                    // Present profiling attributes set on the root element.
                    if (targetTopicOrMap.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_DOCUMENT) {
                        var rootElement = targetTopicOrMap.getRootElement();
                        if (rootElement.getType() == Packages.ro.sync.ecss.extensions.api.node.AuthorNode.NODE_TYPE_ELEMENT) {
                            var attrsCount = rootElement.getAttributesCount();
                            for (var i = 0; i < attrsCount; i++) {
                                var attrName = rootElement.getAttributeAtIndex(i);
                                if (attrName.equals("rev") || attrName.equals("audience") || attrName.equals("platform") || attrName.equals("product") || attrName.equals("props")) {
                                    // Interesting attribute...
                                    newComputedTitle = newComputedTitle + " [" + attrName + "='" + rootElement.getAttribute(attrName) + "']";
                                }
                            }
                        }
                    }
                    // Count chapters and present counter before chapter name.
                    var chapterCnt = countChapters(currentTopicref);
                    if (chapterCnt > 0) {
                        newComputedTitle = chapterCnt + " - " + newComputedTitle;
                    } else {
                        //Maybe this is the child topicref of a chapter, count this as well
                        var ancestorChapter = getAncestorChapter(currentTopicref);
                        if (ancestorChapter != null) {
                            chapterCnt = countChapters(ancestorChapter);
                            if (chapterCnt > 0) {
                                var cntAccumulator = "";
                                var current = currentTopicref;
                                while (current != null && current != ancestorChapter) {
                                    var subChapterCnt = countSiblings(current);
                                    if (subChapterCnt > 0) {
                                        cntAccumulator = subChapterCnt + "." + cntAccumulator;
                                    }
                                    current = current.getParent();
                                }
                                newComputedTitle = chapterCnt + "." + cntAccumulator + " - " + newComputedTitle;
                            }
                        }
                    }
                    // Maybe it's a resource-only topic
                    if (currentTopicref.getAttribute("processing-role") != null) {
                        var processingRoleValue = currentTopicref.getAttribute("processing-role").getValue();
                        if (processingRoleValue.equals('resource-only')) {
                            newComputedTitle = newComputedTitle + " [resource-only]";
                        }
                    }
                    return newComputedTitle;
                }
            }
            // Add customizer
            ditaMapPage.addNodeRendererCustomizer(new Packages.ro.sync.exml.workspace.api.editor.page.ditamap.DITAMapNodeRendererCustomizer(customizer));
        }
    }
    // Add editor change listener
    edChangedListener = new JavaAdapter(Packages.ro.sync.exml.workspace.api.listeners.WSEditorChangeListener, edChangedListener);
    pluginWorkspaceAccess.addEditorChangeListener(edChangedListener, Packages.ro.sync.exml.workspace.api.PluginWorkspace.DITA_MAPS_EDITING_AREA);
}

function applicationClosing(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}

function countChapters(topicref) {
    var cnt = 0;
    if (topicref != null) {
        if (typeof topicref.getName != "undefined" && "chapter".equals(topicref.getName())) {
            var parentOfTopicRef = topicref.getParent();
            cnt = 1;
            var nodes = parentOfTopicRef.getContentNodes();
            for (var i = 0; i < nodes.size(); i++) {
                if (nodes. get (i) == topicref) {
                    break;
                } else if (typeof nodes. get (i).getName != "undefined" && "chapter".equals(nodes. get (i).getName())) {
                    cnt = cnt + 1;
                }
            }
        }
    }
    return cnt;
}

function countSiblings(topicref) {
    var cnt = 0;
    if (topicref != null) {
        var parentOfTopicRef = topicref.getParent();
        cnt = 1;
        var nodes = parentOfTopicRef.getContentNodes();
        for (var i = 0; i < nodes.size(); i++) {
            if (nodes. get (i) == topicref) {
                break;
            } else {
                cnt = cnt + 1;
            }
        }
    }
    return cnt;
}

function getAncestorChapter(topicref) {
    var cnt = 0;
    if (topicref != null) {
        if (typeof topicref.getName != "undefined" && "chapter".equals(topicref.getName())) {
            return topicref;
        } else {
            return getAncestorChapter(topicref.getParent());
        }
    }
    return cnt;
}