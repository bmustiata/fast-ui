/**
 * Renders the xmlContent into the parent, using the msg for translation, and globalConfig for other widget configurations.
 * @param parent
 * @param xmlContent
 * @param [msg]
 * @param [globalConfig]
 * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set.
 */
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};

/**
 * @param parent
 * @param xmlContent
 * @param [msg]
 * @param [globalConfig]
 * @returns {Function}
 */
Y.lazyUi = function(parent, xmlContent, msg, globalConfig) {
    var ui;

    return function() {
        if (!!ui) {
            return ui;
        }

        return ui = Y.fastUi(parent, xmlContent, msg, globalConfig);
    }
};