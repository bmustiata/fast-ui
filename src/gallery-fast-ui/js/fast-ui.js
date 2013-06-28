/**
 *
 * @param parent
 * @param xmlContent
 * @param msg
 * @param globalConfig
 * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set.
 */
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};
