Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};