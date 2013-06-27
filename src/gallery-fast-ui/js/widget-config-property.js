/**
 *
 * @param name
 * @param value
 * @param type type can be any of : string (default if it's an attribute), ui (default if it's an ui:config element),
 *              or js.
 * @constructor
 */
function WidgetConfigProperty(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
}

WidgetConfigProperty.prototype.evaluateValue = function(config) {
    if ("string" === this.type) {
        return this.value;
    } else if ("ui" === this.type) {
        return Y.fastUi(null, this.value, null, config)._rootNode;
    } else if ("js" === this.type) {
        return eval(this.value);
    }
};
