# Editor variable which expands to the project selected URLs

The plugin adds a resolver which expands in Oxygen the **${projectSelectedResources}**
editor variable to a string containing URL representations of all project files separated by ";".

As an usage example, assume you have an XSLT stylesheet like this:

            <xsl:stylesheet version="2.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
                <xsl:param name="projectedSelectedURLs"/>
                <xsl:template match="/">
                    <xsl:analyze-string select="$projectedSelectedURLs" regex=";">
                        <xsl:non-matching-substring>
                            <xsl:message>URL <xsl:value-of select="."/></xsl:message>
                        </xsl:non-matching-substring>
                    </xsl:analyze-string>
                    <root/>
                </xsl:template>
            </xsl:stylesheet>
            
 In Oxygen you can create a transformation scenario of type XSLT using the XSLT location
 both for the input XML and XSLT paths. In the Parameters list you can add the parameter **projectedSelectedURLs** having the
 value **${projectSelectedResources}** and run the XSLT. 
