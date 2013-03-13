function getNode(rootNode, id) {
    return rootNode.get("id") === id ?
        rootNode :
        rootNode.one("#" + id);
}

function getWidgetConfig(customWidget, rootNode, config) {
    var result = {};

    result = Y.merge(result, customWidget.config.properties);

    if (customWidget.config.globalConfig ) {
        result = Y.merge(result, config[ customWidget.config.globalConfig ]);
    }

    if (customWidget.config.srcNode) {
        result.srcNode = getNode(rootNode, customWidget.nodeId);
    }

    return result;
}

function updateVariables(widget, variables, result) {
    for (var key in variables) {
        if (widget.nodeId === variables[key]) {
            result[key] = widget;
            delete variables[key];
        }
    }
}

function getWidgetOrNode(node, createdWidgets) {
    var widget = createdWidgets[node.get("id")];

    return widget ? widget : node;
}

function getClass(fullName) {
    if (/^Y\./.test(fullName)) {
        var m = /^Y\.((.*)\.)?(.*?)$/.exec(fullName),
            packageName = m[2],
            className = m[3];

        if (packageName) {
            return Y.namespace(packageName)[className];
        } else {
            return Y[className];
        }
    }
}

function createWidget(rootNode, customWidget, config) {
    var Clazz = getClass(customWidget.fullName),
        result;

    result = new Clazz(getWidgetConfig(customWidget, rootNode[0], config));

    if (customWidget.config.srcNode) {
        result.render();
    } else {
        result.render( rootNode[0].one('#' + customWidget.nodeId) );
    }

    if (customWidget.nodeId === rootNode[0].get("id")) {
        rootNode[0] = result.get("boundingBox");
    }

    return result;
}

Y.fastUi = function(parent, xmlContent, msg, config) {
    var guiCreationContext = preXmlParse(xmlContent),
        widgets = guiCreationContext.widgets, // list of widgets that need to be created
        htmlCode = guiCreationContext.html, // html with widgets replaced as <span/>
        variables = guiCreationContext.variables, // variables that need to be returned by this function.
        translatedHtml = msg ? Y.substitute(htmlCode, msg) : htmlCode,
        rootNode, createdWidgets = {},// widgets map for back references.
        result, i, variable, node, newWidget;

    // looks like IE7/8 get confused when creating elements that are not closed.
    translatedHtml = translatedHtml.replace(/<([\w\d]+?)\s+([^>]+?)\/>/gm,"<$1 $2></$1>");

    // root node is array, in order to be able to update it.
    rootNode = [ Y.Node.create( translatedHtml ) ];


    if (parent) {
        parent.appendChild( rootNode[0] ); // all the rendering takes place inside the parent node.
    }

    result = {
        node : getWidgetOrNode( rootNode[0], createdWidgets )
    };

    for (i = widgets.length - 1; i >= 0; i--) {
        console.log("creating widget: " + widgets[i]);
        newWidget = createWidget(rootNode, widgets[i], config);
        createdWidgets[widgets[i].nodeId] = newWidget;

        updateVariables(newWidget, variables, result);
    }

    for (variable in variables) {
        node = rootNode[0].one('#' + variables[variable]);
        result[variable] = getWidgetOrNode( node, createdWidgets );
    }

    return result;
};
