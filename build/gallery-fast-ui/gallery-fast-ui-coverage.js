if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-fast-ui/gallery-fast-ui.js",
    code: []
};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].code=["YUI.add('gallery-fast-ui', function (Y, NAME) {","","/**"," *"," * @param name"," * @param value"," * @param type type can be any of : string (default if it's an attribute), ui (default if it's an ui:config element),"," *              or js."," * @constructor"," */","function WidgetConfigProperty(name, value, type) {","    this.name = name;","    this.value = value;","    this.type = type;","}","/**"," *"," * @param nodeId The ID in the DOM where the node should be inserted."," * @param className The full name of the class to be instantiated, e.g. Y.Button"," * @param config WidgetConfig The configuration for that widget that will be sent on construction."," * @constructor"," */","function WidgetDefinition(nodeId, className, config) {","    this.nodeId = nodeId;","    this.className = className;","    this.config = config;","}","function WidgetConfig(properties, globalConfigKey, srcNode) {","    this.properties = !!properties ? properties : {};","    this.globalConfigKey = globalConfigKey;","    this.srcNode = srcNode;","}","","WidgetConfig.prototype.addProperty = function(name, value, type) {","    type = !!type ? type : \"string\";","","    this.properties[name] = new WidgetConfigProperty(name, value, type);","};","","/**"," * Builds a WidgetConfig from the DOM element given."," */","WidgetConfig.buildFromElement = function(id, element, configNodes) {","    var widgetConfig = new WidgetConfig();","","    readConfigFromAttributes(id, widgetConfig, element);","    readConfigFromElements(widgetConfig, configNodes);","","    return widgetConfig;","};","","/**"," * Read values that should be passed to the config from the attributes of the element."," * @param {string} id - unique ID in the DOM."," * @param {WidgetConfig} widgetConfig"," * @param element"," */","function readConfigFromAttributes(id, widgetConfig, element) {","    var attributeName, attributeValue, attributeNamespace, i;","","    for (i = 0; i < element.attributes.length; i++) {","        var attribute = element.attributes[i];","","        attributeName = attribute.localName || attribute.baseName;","        attributeValue = attribute.value;","        attributeNamespace = !!attribute.namespaceURI ? attribute.namespaceURI : null;","","        if (attributeName === \"config-key\" && attributeNamespace === \"fastui\") {","            widgetConfig.globalConfigKey = attributeValue;","            continue;","        }","","        if (attributeName === \"srcNode\" && attributeNamespace === \"fastui\") {","            widgetConfig.srcNode = attributeValue;","            widgetConfig.addProperty(\"srcNode\", \"#\" + id);","","            continue;","        }","","        if (attributeName === \"id\" || !!attributeNamespace) {","            continue;","        }","","        widgetConfig.addProperty(attributeName, attributeValue);","    }","}","","/**"," * Read the values that should be passed to the config from &lt;ui:config&gt; elements."," * @param widgetConfig"," * @param configNodes"," */","function readConfigFromElements(widgetConfig, configNodes) {","    var configNode, name, value, type, i;","","    for (i = 0; i < configNodes.length; i++) {","        configNode = configNodes[i];","","        name = configNode.getAttribute(\"name\");","        type = configNode.getAttribute(\"type\");","        type = !!type ? type : \"js\"; // the default type for config elements is \"js\"","","        value = extractContents(configNode, type);","","        widgetConfig.addProperty(name, value, type);","    }","}","","/**"," * Extract the contents from the element depending on the type of the node."," */","function extractContents(xmlNode, type) {","    if (\"ui\" === type) {","        return getUiNodeAsString(xmlNode);","    } else if (\"js\" === type) {","        return getJsNodeAsString(xmlNode);","    }","    return getStringNodeAsString(xmlNode);","}","","/**"," * Returns the contents of the node, and wrap it in a span, since multiple nodes could exist."," * @param xmlNode"," */","function getUiNodeAsString(xmlNode) {","    var i,","        result = \"<span>\";","","    for (i = 0; i < xmlNode.childNodes.length; i++) {","        result += Y.XML.format(xmlNode.childNodes[i]);","    }","","    result += \"</span>\";","","    return result;","}","","/**"," * Returns the contents of the JS node as a string."," * @param xmlNode"," * @returns {*}"," */","function getJsNodeAsString(xmlNode) {","    return xmlNode.textContent || xmlNode.text;","}","","/**"," * Returns the contents of the String node as a string."," * @param xmlNode"," * @returns {*}"," */","function getStringNodeAsString(xmlNode) {","    return xmlNode.textContent || xmlNode.text;","}","","/**"," * Parses a XML template, and finds out what variables need to be filled in into the response,"," * what widgets need to be created, and gets from the XML a HTML template that uses just regular"," * DOM elements, deferring the build of the widges to the {FastUiBuilder}."," *"," * @constructor"," */","function TemplateParser() {","    this.variables = [];","    this.widgets = [];","    this.htmlContent = \"\";","}","","TemplateParser.prototype.parse = function (xmlContent) {","    var xmlDoc = Y.XML.parse(xmlContent);","","    this.traverseElement(xmlDoc.firstChild);","","    this.htmlContent = Y.XML.format(xmlDoc.firstChild);","","    return {","        variables: this.variables,","        widgetDefinitions: this.widgets,","        htmlContent: this.htmlContent","    };","};","","/**"," * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions."," * @param element Start element."," */","TemplateParser.prototype.traverseElement = function (element) {","    var i, childElement, configNodes = [];","","    for (i = 0; i < element.childNodes.length; i++) {","        childElement = element.childNodes[i];","        // IE up to 8 incorrectly counts comment nodes","        if (childElement.nodeType === 1) {","            // if it's a configuration node, store it for widget config, and prepare to remove it from the final template.","            if (this.isConfigElement(childElement)) {","                configNodes.push(childElement);","                continue; // don't traverse the configuration node.","            }","","            this.traverseElement(childElement);","        }","    }","","    // remove the configuration node from the final template.","    for (i = 0; i < configNodes.length; i++) {","        element.removeChild( configNodes[i] );","    }","","    var widgetId = this.getId(element);","","    this.registerVariable(element, widgetId);","    this.checkWidget(element, widgetId, configNodes);","};","","TemplateParser.prototype.registerVariable = function(element, widgetId) {","    var uiField = this.getAttribute(element, 'field', 'fastui');","","    if (uiField) {","        this.variables[uiField] = widgetId;","    }","};","","TemplateParser.prototype.isConfigElement = function(element) {","    var elementName = element.localName || element.baseName;","","    return element.namespaceURI &&","        element.namespaceURI === \"fastui\" &&","        elementName === \"config\";","};","","TemplateParser.prototype.checkWidget = function(element, widgetId, configNodes) {","    // there is a namespace URI, we need to create a WidgetDefinition","    if (!element.namespaceURI) {","        return;","    }","","    var elementName = element.localName || element.baseName,","        placeHolderElement,","        fullClassName = element.namespaceURI + \".\" + elementName,","        widget = new WidgetDefinition(","            widgetId,","            fullClassName,","            WidgetConfig.buildFromElement(widgetId, element, configNodes)","        );","","    placeHolderElement = this.createPlaceHolderElement(element, widgetId);","","    this.widgets.push(widget);","","    element.parentNode.replaceChild(placeHolderElement, element);","};","","","TemplateParser.prototype.getAttribute = function(element, attributeName, namespaceURI) {","    var i, attribute, attrName;","","    if (!element.attributes) {","        return null;","    }","","    namespaceURI = !!namespaceURI ? namespaceURI : null;","","    for (i = 0; i < element.attributes.length; i++) {","        attribute = element.attributes[i];","        attrName = attribute.localName || attribute.baseName;","","        if (attrName === attributeName &&","            attribute.namespaceURI === namespaceURI) {","            return attribute.value;","        }","    }","","    return null;","};","","TemplateParser.prototype.getId = function(element) {","    var id = this.getAttribute(element, 'id');","","    // if the element does not have an id, we create one","    if (!id) {","        id = Y.guid('fast-ui-');","    }","","    return id;","};","","TemplateParser.prototype.getElementType = function(element) {","    var srcNodeType = this.getAttribute(element, \"srcNode\", \"fastui\");","","    return srcNodeType ? srcNodeType : \"span\";","};","","TemplateParser.prototype.createPlaceHolderElement = function(sourceElement, widgetId) {","    var document = sourceElement.ownerDocument,","        elementType = this.getElementType(sourceElement),","        newElement = document.createElement(elementType),","        child;","","    newElement.setAttribute('id', widgetId);","","    while (!!(child = sourceElement.firstChild)) {","        sourceElement.removeChild(child);","        newElement.appendChild(child);","    }","","    return newElement;","};","","/**"," * @private"," * @param element"," * @param name"," * @param value"," */","TemplateParser.prototype.setAttribute = function(element, name, value) {","    Y.one(element).setAttribute(name, value);","};","/**"," * @param {Element} parent       Where should the built UI be appended after it's built."," * @param {string} xmlContent   The UI that is supposed to be built."," * @param {object} msg          I18N messages, that will be substituted in the XML."," * @param {object} globalConfig Configuration for various UI elements."," * @constructor"," */","function FastUiBuilder(parent, xmlContent, msg, globalConfig) {","    this.parent = !!parent ? Y.one(parent) : null;","    this.xmlContent = xmlContent;","    this.msg = msg;","    this.globalConfig = globalConfig;","","    this.bindings = []; // a map between ID of elements in the output HTML, and target widget configs.","}","","/**"," * Creates all the DOM elements and widgets that were in this.xmlContent."," *"," * @this {FastUiBuilder}"," * @returns {object} A map of widgets or dom elements that were created, that were marked with the ui:field attribute."," */","FastUiBuilder.prototype.parse = function() {","    var parseResult = this._parseXmlTemplate(),","        variables = parseResult.variables,","        widgetDefinitions = parseResult.widgetDefinitions,","        newWidget,","        key,","        nodeId,","        i;","","    this.rootNode = this.createRootNode(parseResult);","    this.createdWidgets = {}; // // so far no widgets are yet created.","","    this.result = {};","","    // build the widgets and keep track of the created widgets.","    for (i = widgetDefinitions.length - 1; i >= 0; i--) {","        newWidget = this.__createWidget(widgetDefinitions[i]);","        this.createdWidgets[widgetDefinitions[i].nodeId] = newWidget;","    }","","    for (key in variables) {","        if (variables.hasOwnProperty(key)) {","            nodeId = variables[key];","            this.result[key] = this._getWidgetOrNode(nodeId);","        }","    }","","    this.result._rootNode = this.rootNode;","","    if (this.parent) {","        this.parent.appendChild(this.rootNode);","    } else {","        Y.one(\"body\").removeChild( this.rootNode );","    }","","    return this.result;","};","","FastUiBuilder.prototype._parseXmlTemplate = function() {","    var translatedXml = this.msg ? Y.Lang.sub(this.xmlContent, this.msg) : this.xmlContent;","","    return new TemplateParser().parse(translatedXml);","};","","FastUiBuilder.prototype.createRootNode = function(parseResult) {","    var htmlContent = parseResult.htmlContent,","        closedNodeHtmlBugFix = htmlContent.replace(/<([\\w\\d]+?)\\s+([^>]+?)\\/>/gm,\"<$1 $2></$1>\");","","    var rootNode = Y.Node.create(closedNodeHtmlBugFix);","","    Y.one(\"body\").appendChild(rootNode);","","    return rootNode;","};","","FastUiBuilder.prototype._getWidgetOrNode = function(nodeId, createdWidgets) {","    var widget = this.createdWidgets[nodeId];","","    return widget ? widget : this.rootNode.one(\"#\" + nodeId);","};","","FastUiBuilder.prototype.updateBindings = function(variables, widget, nodeId) {","    var key;","","    for (key in variables) {","        if (variables[key] === nodeId) {","            this.bindings[key] = widget;","            delete variables[key];","        }","    }","};","","FastUiBuilder.prototype._createWidget = function(widget) {","    var ClassConstructor = this._getClassConstructor(widget.className),","        classConfig = this.getClassConfig(widget.config),","        classInstance = new ClassConstructor(classConfig),","        placeHolderElement;","","    // the widget will render it's content on the 'srcNode', if it has one","    if (widget.config.srcNode) {","        classInstance.render();","    } else {","        placeHolderElement = this._findElement(widget.nodeId);","        classInstance.render(placeHolderElement);","    }","","    if (widget.nodeId === this.rootNode.get(\"id\")) {","        this.rootNode = classInstance.get(\"boundingBox\");","    }","","    return classInstance;","};","","FastUiBuilder.prototype._findElement = function(id) {","    if (this.rootNode.get(\"id\") === id) {","        return this.rootNode;","    } else {","        return this.rootNode.one(\"#\" + id);","    }","};","","FastUiBuilder.prototype._getClassConstructor = function(fullyQualifiedName) {","    if (/^Y\\./.test(fullyQualifiedName)) {","        var matches = /^Y\\.((.*)\\.)?(.*?)$/.exec(fullyQualifiedName),","            packageName = matches[2],","            className = matches[3];","","        if (packageName) {","            return Y.namespace(packageName)[className];","        } else {","            return Y[className];","        }","    }","};","","FastUiBuilder.prototype.getClassConfig = function(widgetConfig) {","    var widgetGlobalConfig, finalConfig = {};","","    // widgetConfig.srcNode gets in","    mix(finalConfig, this._evaluateProperties(widgetConfig.properties));","","    if (this.globalConfig && widgetConfig.globalConfigKey) {","        widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];","","        mix(finalConfig, widgetGlobalConfig);","    }","","    return finalConfig;","};","","FastUiBuilder.prototype._evaluateProperties = function(propertiesMap) {","    var key,","        result = {};","","    for (key in propertiesMap) {","        if (propertiesMap.hasOwnProperty(key)) {","            result[key] = this.evaluatePropertyValue(","                propertiesMap[key],","                null","            );","        }","    }","","    return result;","};","","FastUiBuilder.prototype.evaluatePropertyValue = function(widgetConfigProperty, config) {","    if (\"string\" === widgetConfigProperty.type &&","        \"srcNode\" === widgetConfigProperty.name) {","","        return this.rootNode.one(widgetConfigProperty.value);","    }","","    if (\"string\" === widgetConfigProperty.type) {","        return widgetConfigProperty.value;","    } else if (\"ui\" === widgetConfigProperty.type) {","        var builtUi = Y.fastUi(null, widgetConfigProperty.value, null, config);","","        mix(this.result, builtUi);","","        return builtUi._rootNode;","    } else if (\"js\" === widgetConfigProperty.type) {","        return eval(widgetConfigProperty.value);","    }","};","","/**"," * Add one or more items passed as arguments into the target."," */","function mix(target) {","    var i, key;","","    for (i = 1; i < arguments.length; i++) {","        for (key in arguments[i]) {","            if (arguments[i].hasOwnProperty(key)) {","                target[key] = arguments[i][key];","            }","        }","    }","}/**"," *"," * @param parent"," * @param xmlContent"," * @param msg"," * @param globalConfig"," * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set."," */","Y.fastUi = function(parent, xmlContent, msg, globalConfig) {","    return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();","};","","}, '@VERSION@', {\"requires\": [\"datatype-xml\", \"node\", \"widget\", \"yui-base\"]});"];
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].lines = {"1":0,"11":0,"12":0,"13":0,"14":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"31":0,"34":0,"35":0,"37":0,"43":0,"44":0,"46":0,"47":0,"49":0,"58":0,"59":0,"61":0,"62":0,"64":0,"65":0,"66":0,"68":0,"69":0,"70":0,"73":0,"74":0,"75":0,"77":0,"80":0,"81":0,"84":0,"93":0,"94":0,"96":0,"97":0,"99":0,"100":0,"101":0,"103":0,"105":0,"112":0,"113":0,"114":0,"115":0,"116":0,"118":0,"125":0,"126":0,"129":0,"130":0,"133":0,"135":0,"143":0,"144":0,"152":0,"153":0,"163":0,"164":0,"165":0,"166":0,"169":0,"170":0,"172":0,"174":0,"176":0,"187":0,"188":0,"190":0,"191":0,"193":0,"195":0,"196":0,"197":0,"200":0,"205":0,"206":0,"209":0,"211":0,"212":0,"215":0,"216":0,"218":0,"219":0,"223":0,"224":0,"226":0,"231":0,"233":0,"234":0,"237":0,"246":0,"248":0,"250":0,"254":0,"255":0,"257":0,"258":0,"261":0,"263":0,"264":0,"265":0,"267":0,"269":0,"273":0,"276":0,"277":0,"280":0,"281":0,"284":0,"287":0,"288":0,"290":0,"293":0,"294":0,"299":0,"301":0,"302":0,"303":0,"306":0,"315":0,"316":0,"325":0,"326":0,"327":0,"328":0,"329":0,"331":0,"340":0,"341":0,"349":0,"350":0,"352":0,"355":0,"356":0,"357":0,"360":0,"361":0,"362":0,"363":0,"367":0,"369":0,"370":0,"372":0,"375":0,"378":0,"379":0,"381":0,"384":0,"385":0,"388":0,"390":0,"392":0,"395":0,"396":0,"398":0,"401":0,"402":0,"404":0,"405":0,"406":0,"407":0,"412":0,"413":0,"419":0,"420":0,"422":0,"423":0,"426":0,"427":0,"430":0,"433":0,"434":0,"435":0,"437":0,"441":0,"442":0,"443":0,"447":0,"448":0,"450":0,"455":0,"456":0,"459":0,"461":0,"462":0,"464":0,"467":0,"470":0,"471":0,"474":0,"475":0,"476":0,"483":0,"486":0,"487":0,"490":0,"493":0,"494":0,"495":0,"496":0,"498":0,"500":0,"501":0,"502":0,"509":0,"510":0,"512":0,"513":0,"514":0,"515":0,"527":0,"528":0};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].functions = {"WidgetConfigProperty:11":0,"WidgetDefinition:23":0,"WidgetConfig:28":0,"addProperty:34":0,"buildFromElement:43":0,"readConfigFromAttributes:58":0,"readConfigFromElements:93":0,"extractContents:112":0,"getUiNodeAsString:125":0,"getJsNodeAsString:143":0,"getStringNodeAsString:152":0,"TemplateParser:163":0,"parse:169":0,"traverseElement:187":0,"checkVariable:215":0,"isConfigElement:223":0,"checkWidget:231":0,"getAttribute:254":0,"getId:276":0,"getElementType:287":0,"createPlaceHolderElement:293":0,"setAttribute:315":0,"FastUiBuilder:325":0,"parse:340":0,"parseXmlTemplate:378":0,"createRootNode:384":0,"getWidgetOrNode:395":0,"updateBindings:401":0,"createWidget:412":0,"findElement:433":0,"getClassConstructor:441":0,"getClassConfig:455":0,"evaluateProperties:470":0,"evaluatePropertyValue:486":0,"mix:509":0,"fastUi:527":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].coveredLines = 219;
_yuitest_coverage["build/gallery-fast-ui/gallery-fast-ui.js"].coveredFunctions = 37;
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 1);
YUI.add('gallery-fast-ui', function (Y, NAME) {

/**
 *
 * @param name
 * @param value
 * @param type type can be any of : string (default if it's an attribute), ui (default if it's an ui:config element),
 *              or js.
 * @constructor
 */
_yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 11);
function WidgetConfigProperty(name, value, type) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "WidgetConfigProperty", 11);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 12);
this.name = name;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 13);
this.value = value;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 14);
this.type = type;
}
/**
 *
 * @param nodeId The ID in the DOM where the node should be inserted.
 * @param className The full name of the class to be instantiated, e.g. Y.Button
 * @param config WidgetConfig The configuration for that widget that will be sent on construction.
 * @constructor
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 23);
function WidgetDefinition(nodeId, className, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "WidgetDefinition", 23);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 24);
this.nodeId = nodeId;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 25);
this.className = className;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 26);
this.config = config;
}
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 28);
function WidgetConfig(properties, globalConfigKey, srcNode) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "WidgetConfig", 28);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 29);
this.properties = !!properties ? properties : {};
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 30);
this.globalConfigKey = globalConfigKey;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 31);
this.srcNode = srcNode;
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 34);
WidgetConfig.prototype.addProperty = function(name, value, type) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "addProperty", 34);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 35);
type = !!type ? type : "string";

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 37);
this.properties[name] = new WidgetConfigProperty(name, value, type);
};

/**
 * Builds a WidgetConfig from the DOM element given.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 43);
WidgetConfig.buildFromElement = function(id, element, configNodes) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "buildFromElement", 43);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 44);
var widgetConfig = new WidgetConfig();

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 46);
readConfigFromAttributes(id, widgetConfig, element);
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 47);
readConfigFromElements(widgetConfig, configNodes);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 49);
return widgetConfig;
};

/**
 * Read values that should be passed to the config from the attributes of the element.
 * @param {string} id - unique ID in the DOM.
 * @param {WidgetConfig} widgetConfig
 * @param element
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 58);
function readConfigFromAttributes(id, widgetConfig, element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "readConfigFromAttributes", 58);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 59);
var attributeName, attributeValue, attributeNamespace, i;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 61);
for (i = 0; i < element.attributes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 62);
var attribute = element.attributes[i];

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 64);
attributeName = attribute.localName || attribute.baseName;
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 65);
attributeValue = attribute.value;
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 66);
attributeNamespace = !!attribute.namespaceURI ? attribute.namespaceURI : null;

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 68);
if (attributeName === "config-key" && attributeNamespace === "fastui") {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 69);
widgetConfig.globalConfigKey = attributeValue;
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 70);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 73);
if (attributeName === "srcNode" && attributeNamespace === "fastui") {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 74);
widgetConfig.srcNode = attributeValue;
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 75);
widgetConfig.addProperty("srcNode", "#" + id);

            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 77);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 80);
if (attributeName === "id" || !!attributeNamespace) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 81);
continue;
        }

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 84);
widgetConfig.addProperty(attributeName, attributeValue);
    }
}

/**
 * Read the values that should be passed to the config from &lt;ui:config&gt; elements.
 * @param widgetConfig
 * @param configNodes
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 93);
function readConfigFromElements(widgetConfig, configNodes) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "readConfigFromElements", 93);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 94);
var configNode, name, value, type, i;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 96);
for (i = 0; i < configNodes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 97);
configNode = configNodes[i];

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 99);
name = configNode.getAttribute("name");
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 100);
type = configNode.getAttribute("type");
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 101);
type = !!type ? type : "js"; // the default type for config elements is "js"

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 103);
value = extractContents(configNode, type);

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 105);
widgetConfig.addProperty(name, value, type);
    }
}

/**
 * Extract the contents from the element depending on the type of the node.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 112);
function extractContents(xmlNode, type) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "extractContents", 112);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 113);
if ("ui" === type) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 114);
return getUiNodeAsString(xmlNode);
    } else {_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 115);
if ("js" === type) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 116);
return getJsNodeAsString(xmlNode);
    }}
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 118);
return getStringNodeAsString(xmlNode);
}

/**
 * Returns the contents of the node, and wrap it in a span, since multiple nodes could exist.
 * @param xmlNode
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 125);
function getUiNodeAsString(xmlNode) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getUiNodeAsString", 125);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 126);
var i,
        result = "<span>";

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 129);
for (i = 0; i < xmlNode.childNodes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 130);
result += Y.XML.format(xmlNode.childNodes[i]);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 133);
result += "</span>";

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 135);
return result;
}

/**
 * Returns the contents of the JS node as a string.
 * @param xmlNode
 * @returns {*}
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 143);
function getJsNodeAsString(xmlNode) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getJsNodeAsString", 143);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 144);
return xmlNode.textContent || xmlNode.text;
}

/**
 * Returns the contents of the String node as a string.
 * @param xmlNode
 * @returns {*}
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 152);
function getStringNodeAsString(xmlNode) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getStringNodeAsString", 152);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 153);
return xmlNode.textContent || xmlNode.text;
}

/**
 * Parses a XML template, and finds out what variables need to be filled in into the response,
 * what widgets need to be created, and gets from the XML a HTML template that uses just regular
 * DOM elements, deferring the build of the widges to the {FastUiBuilder}.
 *
 * @constructor
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 163);
function TemplateParser() {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "TemplateParser", 163);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 164);
this.variables = [];
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 165);
this.widgets = [];
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 166);
this.htmlContent = "";
}

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 169);
TemplateParser.prototype.parse = function (xmlContent) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "parse", 169);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 170);
var xmlDoc = Y.XML.parse(xmlContent);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 172);
this.traverseElement(xmlDoc.firstChild);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 174);
this.htmlContent = Y.XML.format(xmlDoc.firstChild);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 176);
return {
        variables: this.variables,
        widgetDefinitions: this.widgets,
        htmlContent: this.htmlContent
    };
};

/**
 * Recursively traverses the XML document, binding variables and instantiating widgetDefinitions.
 * @param element Start element.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 187);
TemplateParser.prototype.traverseElement = function (element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "traverseElement", 187);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 188);
var i, childElement, configNodes = [];

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 190);
for (i = 0; i < element.childNodes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 191);
childElement = element.childNodes[i];
        // IE up to 8 incorrectly counts comment nodes
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 193);
if (childElement.nodeType === 1) {
            // if it's a configuration node, store it for widget config, and prepare to remove it from the final template.
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 195);
if (this.isConfigElement(childElement)) {
                _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 196);
configNodes.push(childElement);
                _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 197);
continue; // don't traverse the configuration node.
            }

            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 200);
this.traverseElement(childElement);
        }
    }

    // remove the configuration node from the final template.
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 205);
for (i = 0; i < configNodes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 206);
element.removeChild( configNodes[i] );
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 209);
var widgetId = this.getId(element);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 211);
this.registerVariable(element, widgetId);
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 212);
this.checkWidget(element, widgetId, configNodes);
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 215);
TemplateParser.prototype.registerVariable = function(element, widgetId) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "checkVariable", 215);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 216);
var uiField = this.getAttribute(element, 'field', 'fastui');

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 218);
if (uiField) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 219);
this.variables[uiField] = widgetId;
    }
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 223);
TemplateParser.prototype.isConfigElement = function(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "isConfigElement", 223);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 224);
var elementName = element.localName || element.baseName;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 226);
return element.namespaceURI &&
        element.namespaceURI === "fastui" &&
        elementName === "config";
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 231);
TemplateParser.prototype.checkWidget = function(element, widgetId, configNodes) {
    // there is a namespace URI, we need to create a WidgetDefinition
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "checkWidget", 231);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 233);
if (!element.namespaceURI) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 234);
return;
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 237);
var elementName = element.localName || element.baseName,
        placeHolderElement,
        fullClassName = element.namespaceURI + "." + elementName,
        widget = new WidgetDefinition(
            widgetId,
            fullClassName,
            WidgetConfig.buildFromElement(widgetId, element, configNodes)
        );

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 246);
placeHolderElement = this.createPlaceHolderElement(element, widgetId);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 248);
this.widgets.push(widget);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 250);
element.parentNode.replaceChild(placeHolderElement, element);
};


_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 254);
TemplateParser.prototype.getAttribute = function(element, attributeName, namespaceURI) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getAttribute", 254);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 255);
var i, attribute, attrName;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 257);
if (!element.attributes) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 258);
return null;
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 261);
namespaceURI = !!namespaceURI ? namespaceURI : null;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 263);
for (i = 0; i < element.attributes.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 264);
attribute = element.attributes[i];
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 265);
attrName = attribute.localName || attribute.baseName;

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 267);
if (attrName === attributeName &&
            attribute.namespaceURI === namespaceURI) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 269);
return attribute.value;
        }
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 273);
return null;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 276);
TemplateParser.prototype.getId = function(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getId", 276);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 277);
var id = this.getAttribute(element, 'id');

    // if the element does not have an id, we create one
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 280);
if (!id) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 281);
id = Y.guid('fast-ui-');
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 284);
return id;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 287);
TemplateParser.prototype.getElementType = function(element) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getElementType", 287);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 288);
var srcNodeType = this.getAttribute(element, "srcNode", "fastui");

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 290);
return srcNodeType ? srcNodeType : "span";
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 293);
TemplateParser.prototype.createPlaceHolderElement = function(sourceElement, widgetId) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "createPlaceHolderElement", 293);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 294);
var document = sourceElement.ownerDocument,
        elementType = this.getElementType(sourceElement),
        newElement = document.createElement(elementType),
        child;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 299);
newElement.setAttribute('id', widgetId);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 301);
while (!!(child = sourceElement.firstChild)) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 302);
sourceElement.removeChild(child);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 303);
newElement.appendChild(child);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 306);
return newElement;
};

/**
 * @private
 * @param element
 * @param name
 * @param value
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 315);
TemplateParser.prototype.setAttribute = function(element, name, value) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "setAttribute", 315);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 316);
Y.one(element).setAttribute(name, value);
};
/**
 * @param {Element} parent       Where should the built UI be appended after it's built.
 * @param {string} xmlContent   The UI that is supposed to be built.
 * @param {object} msg          I18N messages, that will be substituted in the XML.
 * @param {object} globalConfig Configuration for various UI elements.
 * @constructor
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 325);
function FastUiBuilder(parent, xmlContent, msg, globalConfig) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "FastUiBuilder", 325);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 326);
this.parent = !!parent ? Y.one(parent) : null;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 327);
this.xmlContent = xmlContent;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 328);
this.msg = msg;
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 329);
this.globalConfig = globalConfig;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 331);
this.bindings = []; // a map between ID of elements in the output HTML, and target widget configs.
}

/**
 * Creates all the DOM elements and widgets that were in this.xmlContent.
 *
 * @this {FastUiBuilder}
 * @returns {object} A map of widgets or dom elements that were created, that were marked with the ui:field attribute.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 340);
FastUiBuilder.prototype.parse = function() {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "parse", 340);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 341);
var parseResult = this._parseXmlTemplate(),
        variables = parseResult.variables,
        widgetDefinitions = parseResult.widgetDefinitions,
        newWidget,
        key,
        nodeId,
        i;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 349);
this.rootNode = this.createRootNode(parseResult);
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 350);
this.createdWidgets = {}; // // so far no widgets are yet created.

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 352);
this.result = {};

    // build the widgets and keep track of the created widgets.
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 355);
for (i = widgetDefinitions.length - 1; i >= 0; i--) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 356);
newWidget = this._createWidget(widgetDefinitions[i]);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 357);
this.createdWidgets[widgetDefinitions[i].nodeId] = newWidget;
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 360);
for (key in variables) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 361);
if (variables.hasOwnProperty(key)) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 362);
nodeId = variables[key];
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 363);
this.result[key] = this._getWidgetOrNode(nodeId);
        }
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 367);
this.result._rootNode = this.rootNode;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 369);
if (this.parent) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 370);
this.parent.appendChild(this.rootNode);
    } else {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 372);
Y.one("body").removeChild( this.rootNode );
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 375);
return this.result;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 378);
FastUiBuilder.prototype._parseXmlTemplate = function() {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "parseXmlTemplate", 378);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 379);
var translatedXml = this.msg ? Y.Lang.sub(this.xmlContent, this.msg) : this.xmlContent;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 381);
return new TemplateParser().parse(translatedXml);
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 384);
FastUiBuilder.prototype.createRootNode = function(parseResult) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "createRootNode", 384);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 385);
var htmlContent = parseResult.htmlContent,
        closedNodeHtmlBugFix = htmlContent.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 388);
var rootNode = Y.Node.create(closedNodeHtmlBugFix);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 390);
Y.one("body").appendChild(rootNode);

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 392);
return rootNode;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 395);
FastUiBuilder.prototype._getWidgetOrNode = function(nodeId, createdWidgets) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getWidgetOrNode", 395);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 396);
var widget = this.createdWidgets[nodeId];

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 398);
return widget ? widget : this.rootNode.one("#" + nodeId);
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 401);
FastUiBuilder.prototype.updateBindings = function(variables, widget, nodeId) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "updateBindings", 401);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 402);
var key;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 404);
for (key in variables) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 405);
if (variables[key] === nodeId) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 406);
this.bindings[key] = widget;
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 407);
delete variables[key];
        }
    }
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 412);
FastUiBuilder.prototype._createWidget = function(widget) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "createWidget", 412);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 413);
var ClassConstructor = this._getClassConstructor(widget.className),
        classConfig = this._getClassConfig(widget.config),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 419);
if (widget.config.srcNode) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 420);
classInstance.render();
    } else {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 422);
placeHolderElement = this._findElement(widget.nodeId);
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 423);
classInstance.render(placeHolderElement);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 426);
if (widget.nodeId === this.rootNode.get("id")) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 427);
this.rootNode = classInstance.get("boundingBox");
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 430);
return classInstance;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 433);
FastUiBuilder.prototype._findElement = function(id) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "findElement", 433);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 434);
if (this.rootNode.get("id") === id) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 435);
return this.rootNode;
    } else {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 437);
return this.rootNode.one("#" + id);
    }
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 441);
FastUiBuilder.prototype._getClassConstructor = function(fullyQualifiedName) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getClassConstructor", 441);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 442);
if (/^Y\./.test(fullyQualifiedName)) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 443);
var matches = /^Y\.((.*)\.)?(.*?)$/.exec(fullyQualifiedName),
            packageName = matches[2],
            className = matches[3];

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 447);
if (packageName) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 448);
return Y.namespace(packageName)[className];
        } else {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 450);
return Y[className];
        }
    }
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 455);
FastUiBuilder.prototype._getClassConfig = function(widgetConfig) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "getClassConfig", 455);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 456);
var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 459);
mix(finalConfig, this._evaluateProperties(widgetConfig.properties));

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 461);
if (this.globalConfig && widgetConfig.globalConfigKey) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 462);
widgetGlobalConfig = this.globalConfig[widgetConfig.globalConfigKey];

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 464);
mix(finalConfig, widgetGlobalConfig);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 467);
return finalConfig;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 470);
FastUiBuilder.prototype._evaluateProperties = function(propertiesMap) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "evaluateProperties", 470);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 471);
var key,
        result = {};

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 474);
for (key in propertiesMap) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 475);
if (propertiesMap.hasOwnProperty(key)) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 476);
result[key] = this.evaluatePropertyValue(
                propertiesMap[key],
                null
            );
        }
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 483);
return result;
};

_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 486);
FastUiBuilder.prototype.evaluatePropertyValue = function(widgetConfigProperty, config) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "evaluatePropertyValue", 486);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 487);
if ("string" === widgetConfigProperty.type &&
        "srcNode" === widgetConfigProperty.name) {

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 490);
return this.rootNode.one(widgetConfigProperty.value);
    }

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 493);
if ("string" === widgetConfigProperty.type) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 494);
return widgetConfigProperty.value;
    } else {_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 495);
if ("ui" === widgetConfigProperty.type) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 496);
var builtUi = Y.fastUi(null, widgetConfigProperty.value, null, config);

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 498);
mix(this.result, builtUi);

        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 500);
return builtUi._rootNode;
    } else {_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 501);
if ("js" === widgetConfigProperty.type) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 502);
return eval(widgetConfigProperty.value);
    }}}
};

/**
 * Add one or more items passed as arguments into the target.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 509);
function mix(target) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "mix", 509);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 510);
var i, key;

    _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 512);
for (i = 1; i < arguments.length; i++) {
        _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 513);
for (key in arguments[i]) {
            _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 514);
if (arguments[i].hasOwnProperty(key)) {
                _yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 515);
target[key] = arguments[i][key];
            }
        }
    }
}/**
 *
 * @param parent
 * @param xmlContent
 * @param msg
 * @param globalConfig
 * @returns {object} A map of DOM elements or Widgets that had the with ui:field attribute set.
 */
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 527);
Y.fastUi = function(parent, xmlContent, msg, globalConfig) {
    _yuitest_coverfunc("build/gallery-fast-ui/gallery-fast-ui.js", "fastUi", 527);
_yuitest_coverline("build/gallery-fast-ui/gallery-fast-ui.js", 528);
return new FastUiBuilder(parent, xmlContent, msg, globalConfig).parse();
};

}, '@VERSION@', {"requires": ["datatype-xml", "node", "widget", "yui-base"]});
