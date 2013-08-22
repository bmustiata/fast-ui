fast-ui
=======

Intro
------
FastUi is a YUI3 module that is focused on building UIs fast. It is inspired from frameworks like GWT and JSF2,
focused on a composition model that is easily described in an easy to understand XML.

This fits like a glove on top of the YUI3 architecture of widgets.

Description
-----------

FastUi is a YUI3 module that allows you to focus on the UI logic, and decouples the actual UI building (layout and I18N)
from JS code, by allowing you de declare it in a very simple to understand XML, and then just bind certain components to
the code.</p>

The YUI3 Widget and DOM Node architecture allows for seamless integration between simple DOM nodes (Y.Node elements) and
custom Widget classes.

Usage
-----
In order to use it, you simple need to use XML namespaces mapped to the actual JS namespaces that you want used. You
can use multiple namespaces, and the "fastui" namespace adds the extra power you need to work with those widgets
or nodes.
The "fastui" namespace contains element building configuration. (see the end of this page for details).</p>

The gallery-fast-ui adds two functions: fastUi and lazyUi.
```
    Y.fastUi = function(parent, xmlContent, msg, globalConfig) {..}
    // and
    Y.lazyUi = function(parent, xmlContent, msg, callback, globalConfig) {..}
```

Functionally they are about the same, except that lazyUi will create the ui only when needed. For example let's assume
that you have a dialog that you want shown only when the user clicks some button. Then you will create the dialog with lazyUi
and instantiate it as such:

```
    var ui = Y.lazyUi(parent, xmlContent, msg, function(_ui) {

        // here the _ui object is truly the object created by Y.fastUi, and not a proxy
        // like the case with lazyUi.

    }); // ui.dialog is exported

    // some callback
    someButton.on("click", function() {
        ui().dialog.show(); // only here does the dialog really gets created.
    });
```

Features
--------

### True UI Fast Creation
Many times when creating UIs you need to build them from a mixture of widgets (and HTML). FastUi makes creating
complex UIs a breeze, even if they are actually composed from multiple widgets (see the Full demo for a dialog, with a
tab panel and several buttons created in one go).

### I18N out of the box
FastUi takes its template and runs it against handlebars. If the <strong>msg</strong> parameter is set, it will
automatically replace the values. Furthermore, if the value is set in an attribute of a Widget, it will also get I18N
for free.

### Y.Node and Y.Widget Support
When creating elements, if they are marked using the <strong>ui:field</strong> attribute they will be automatically
exported into the resulting object, with objects of the corresponding type.</p>

### srcNode Support
When creating widgets FastUi normally creates a placeholder &lt;span&gt; and simply calls widget.render('#idOfSpan').
FastUi also supports creating a different element using <strong>ui:srcNode</strong> (for example ui:src="div" will
create a div element), and then passing the srcNode as an attribute to the constructor of the widget.

The FastUi Namespace - <div xmlns:ui="fastui">
----------------------------------------------
<table>
    <thead>
        <tr>
            <td>
                Name
            </td>
            <td>
                Applicability
            </td>
            <td>
                Description
            </td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                ui:srcNode
            </td>
            <td>
                Widget attribute
            </td>
            <td>
                A string that specifies the tagName of the element that should be created. This element will be passed
                as srcNode to the constructor of that widget.<br/>
                ```
                <Y:Button xmlns:Y="Y" xmlns:ui="fastui" ui:srcNode="span" label="\{{MY_BUTTON}}"/>
                ```
                in the end will call:
                ```
                new Y.Button({
                    srcNode : '#generated-id-for-that-span',
                    label : 'translated value for MY_BUTTON'
                });
                ```
            </td>
        </tr>
        <tr>
            <td>
                ui:field
            </td>
            <td>
                Widget attribute, Node attribute
            </td>
            <td>
                A string that represents the name of the Widget or Node that should be exported into the object
                returned by Y.fastUi function. So if the htmlCode is:
                ```
                <Y:Button xmlns:Y="Y" xmlns:ui="fastui" ui:field="myButton" label="\{{MY_BUTTON}}"/>
                ```
                then you can:
                ```
                var ui = Y.fastUi(parentElementWhereToRender, htmlCode);

                ui.myButton.on("click", function() {
                    alert('clicked');
                });
                ```
            </td>
        </tr>
        <tr>
            <td>
                ui:config
            </td>
            <td>
                Widget child
            </td>
            <td>
                By default attributes in the element are passed as strings. Sometimes it's important to send different
                types (number, regexp, etc), or even other built UIs.<br/>
                The ui:config element two attributes name (that is the constructor object key name) and type (default "js"),
                and can be also "ui", when it will be sent to parsing to fastUi, and the resulting root Node or Widget
                passed to the constructor argument.
                ```
                <Y:Panel ui:field="dialog" ui:srcNode="div" xmlns:Y="Y" xmlns:ui="fastui" headerContent="awesome title">
                    <ui:config name="width">400</ui:config>
                    <ui:config name="centered">true</ui:config>
                    <ui:config name="size">[400,300]</ui:config>
                    <ui:config name="bodyContent" type="ui">
                        <Y:TabView ui:srcNode="div">
                            <ul>
                                <li><a href="tab1">{HOME}</a></li>
                            </ul>
                        </Y:TabView>
                    </ui:config>
                </Y:Panel>
                ```
            </td>
        </tr>
        <tr>
            <td>
                ui:config-key
            </td>
            <td>
                Widget attribute
            </td>
            <td>
                A string that is the key in the configuration object of fastUi, that will be merged and passed to the
                constructor of that Widget.
                ```
                var ui = Y.fastUi(parentElement, "<Y:RandomStuff xmlns:Y='Y' xmlns:ui='fastui' ui:field='randomStuff' ui:config-key='myRandomConfig' config1='config1Value'/>", null, {
                    myRandomConfig : {
                        config2 : function() {
                            // some callback function.
                        }
                    }
                };
                ```
                This will have in turn the equivalent effect of calling for the creation:
                ```
                new Y.RandomStuff({
                    config1: 'config1Value',
                    config2 : function() {
                        // some callback function.
                    }
                });
                ```

                Of course in case you don't must send it to the constructor, the recommended way to do it is:
                ```
                var ui = Y.fastUi(...);
                ui.randomStuff.config2 = function() ...;
                ```
            </td>
        </tr>
    </tbody>
</table>