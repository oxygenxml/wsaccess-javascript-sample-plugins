/* Example for working with the Author editing mode, started from: https://www.oxygenxml.com/forum/post49889.html#p49886 */
function applicationStarted(pluginWorkspaceAccess) {
    Packages.java.lang.System.err.println("Application started " + pluginWorkspaceAccess);
    
    /*Add listener called when right click is performed in the Author editing mode*/
    customizerObj = {
        customizeAuthorPopUpMenu: function (popUp, authorAccess) {
            try {
                /*Create menu items, the Javascript plugin creates Swing components (menu items in this case)
                 * because Oxygen is Java Swing based. */
                mi = new Packages.javax.swing.JMenuItem("AI Continue Writing");
                popUp.add(mi);
                actionPerfObj = {
                    actionPerformed: function (e) {
                        try {
							var controller = authorAccess.getDocumentController();
							var textFromDocStartToCaretPosition = controller.getContentCharSequence().subSequence(0, authorAccess.getEditorAccess().getCaretOffset()).toString().replace('\0', ' ').replace("\"", "\\\"").replace("\n", "\\n");
							Packages.java.lang.System.err.println("Before caret " + textFromDocStartToCaretPosition);
							var connection = new Packages.java.net.URL("https://.../completions/").openConnection();
                       	    connection.setRequestProperty("Content-Type", "application/json");
                       	    connection.setRequestProperty("accept", "application/json");
                       	    connection.setRequestProperty("Authorization", "...");
                    		connection.setRequestMethod("POST");
                    		 
                    		 var jsonToSend = "{\"prompt\": \"";
                    		 jsonToSend += textFromDocStartToCaretPosition;
                    		 jsonToSend += "\", \"temperature\": 1,\"n\": 1}";
                    		 Packages.java.lang.System.err.println("Sending " + jsonToSend);
                       		 connection.setDoOutput(true);
                      		 connection.connect();
                        	 var outputStreamWriter = new Packages.java.io.OutputStreamWriter(connection.getOutputStream(), "UTF-8");
                        	 outputStreamWriter.write(jsonToSend);
                        	 outputStreamWriter.flush();
                        	 outputStreamWriter.close();
                        	 
                        	 var objectMapper = new Packages.com.fasterxml.jackson.databind.ObjectMapper();
                        	 var inputStream = connection.getInputStream();
                        	 var receivedContent = objectMapper.readValue(inputStream, new Packages.java.util.HashMap().getClass());
                        	 inputStream.close();
                        	 Packages.java.lang.System.err.println("Received " + receivedContent);
                        	 var toInsert = receivedContent.get("choices")[0].get("message").get("content");
                        	 //Now insert in document
                        	 Packages.java.lang.System.err.println("To insert " + toInsert);
                        	 controller.insertText(authorAccess.getEditorAccess().getCaretOffset(), toInsert);
                        }
                        catch (e1) {
                            Packages.java.lang.System.err.println(e1);
                        }
                    }
                }
                mi.addActionListener(new JavaAdapter(Packages.java.awt.event.ActionListener, actionPerfObj));
            }
            catch (e1) {
                Packages.java.lang.System.err.println(e1);
            }
        }
    }
    //Add the popup menu customizer.
    pluginWorkspaceAccess.addMenusAndToolbarsContributorCustomizer(new JavaAdapter(Packages.ro.sync.exml.workspace.api.standalone.actions.MenusAndToolbarsContributorCustomizer, customizerObj));
}

function applicationClosing(pluginWorkspaceAccess) {
    /* The application is closing */
    Packages.java.lang.System.err.println("Application closing " + pluginWorkspaceAccess);
}