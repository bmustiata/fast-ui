interface ParserResult {
    /**
     * Variables detected.
     */
    variables: string[];
    /**
     * Widgets detected.
     */
    widgetDefinitions: WidgetDefinition[];
    /**
     * The HTML code resulted.
     */
    htmlContent: string;
}