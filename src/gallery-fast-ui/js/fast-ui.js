function FastUi(parent, xmlContent, msg, globalConfig) {
    var parseResult = new TemplateParser().parse(xmlContent),
        widgetDefinitions = parseResult.widgetDefinitions,
        variables = parseResult.variables,
        htmlContent = parseResult.htmlContent,
        createdWidgets = {},
        newWidget, i, key, nodeId;

    this.rootNode = rootNode;
    this.parseResult = parseResult;
    this.bindings = []; // a map between ID of elements in the output HTML, and target widget configs.

    this.rootNode = this.createNode(htmlContent, msg);

    if (parent) {
        parent.appendChild(this.rootNode);
    }

    for (i = widgetDefinitions.length-1; i >= 0; i--) {
        newWidget = this.createWidget(widgetDefinitions[i], globalConfig);
        createdWidgets[widgetDefinitions[i].nodeId] = newWidget;

        this.updateBindings(newWidget);
    }

    // the rest of the variables reference just nodes
    for (key in variables) {
        if (variables.hasOwnProperty(key)) {
            nodeId = variables[key];
            this.bindings[key] = this.rootNode.one('#' + nodeId);
        }
    }
}

FastUi.prototype.updateBindings = function(widget) {
    var key, variables = this.parseResult.variables;

    for (key in variables) {
        if (variables[key] === widget.nodeId) {
            this.bindings[key] = widget;
            delete variables[key];
        }
    }
};

FastUi.prototype.createNode = function(htmlContent, msg) {
    var translatedHtml = msg ? Y.Lang.sub(htmlContent, msg) : htmlContent;

    // looks like IE7/8 get confused when creating elements that are not closed.
    translatedHtml = translatedHtml.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

    return Y.Node.create(translatedHtml);
};

FastUi.prototype.createWidget = function(widget, globalConfig) {
    var ClassConstructor = this.getClassConstructor(widget.className),
        classConfig = this.getClassConfig(widget.config, globalConfig),
        classInstance = new ClassConstructor(classConfig),
        placeHolderElement;

    // the widget will render it's content on the 'srcNode', if it has one
    if (widget.config.srcNode) {
        classInstance.render();
    } else {
        placeHolderElement = this.rootNode.one('#' + widget.nodeId);
        classInstance.render(placeHolderElement);
    }

    if (widget.nodeId === this.rootNode.get("id")) {
        this.rootNode = classInstance.get("boundingBox");
    }

    return classInstance;
};

FastUi.prototype.getClassConstructor = function(fullyQualifiedName) {
    if (/^Y\./.test(fullyQualifiedName)) {
        var matches = /^Y\.((.*)\.)?(.*?)$/.exec(fullyQualifiedName),
            packageName = matches[2],
            className = matches[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
};

FastUi.prototype.getClassConfig = function(widgetConfig, globalConfig) {
    var widgetGlobalConfig, finalConfig = {};

    // widgetConfig.srcNode gets in
    finalConfig = Y.merge(finalConfig, widgetConfig.properties);

    if (globalConfig && widgetConfig.globalConfigKey) {
        widgetGlobalConfig = globalConfig[widgetConfig.globalConfigKey];

        finalConfig = Y.merge(finalConfig, widgetGlobalConfig);
    }

    return finalConfig;
};

Y.FastUi = FastUi;
