/**
 * A parser result is the result after an XML parsing with more work in
 * store to be done by the FastUiBuilder.
 *
 *
 * It contains a list with the variables that are needed to be filled in, all the widgets that are still to be
 * created, and the htmlContent with the widget references removed, and replaced by either &lt;span&gt;s (default),
 * or elements with the type of whatever was specified in the ui:srcNode attribute.
 *
 * @constructor
 */
function ParserResult() {
    /**
     * Variables detected.
     */
    this.variables = [];

    /**
     * Widgets detected.
     */
    this.widgetDefinitions = [];

    /**
     * The HTML code resulted.
     */
    this.htmlContent = [];
}
