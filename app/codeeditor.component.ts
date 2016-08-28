import { Component, Directive, Renderer } from '@angular/core';
import { Device } from './models';

declare var CodeMirror: any;

@Directive({
    selector: '[codeeditor]'
})
export class CodeEditorDirective {
    editor: any;

    constructor(private _renderer: Renderer) {}

    deviceIds = [];
    deviceNames = [];

    setDevices(devices: Array<Device>){
        console.log("devices" + devices);
        devices.forEach(device => {
            this.editor.deviceNames.push(device.name);
            this.editor.deviceIds.push(device.id);
        });
    }

    setContent(content){
        this.editor.setValue(content);
    }

    getValue(){
        return this.editor.getValue();
    }

    ngAfterViewInit() {

        this.editor = CodeMirror.fromTextArea(
            this._renderer.selectRootElement('[codeeditor]'),
            {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                styleActiveLine: true,
                autoCloseBrackets: true,
                theme: "monokai",
                matchBrackets: true,
                mode: { name: 'javascript', json: true }
            } 
        );

        this.editor.deviceNames = this.deviceNames;
        this.editor.deviceIds = this.deviceIds;

        function getCoffeeScriptToken(editor, cur) {
            var token = editor.getTokenAt(cur);
            if (cur.ch == token.start + 1 && token.string.charAt(0) == '.') {
              token.end = token.start;
              token.string = '.';
              token.type = "property";
            }
            else if (/^\.[\w$_]*$/.test(token.string)) {
              token.type = "property";
              token.start++;
              token.string = token.string.replace(/\./, '');
            }
            return token;
        }

        CodeMirror.commands.autocomplete = function(cm) {

            let suggestions = [
                {"obj" : "Server",
                 "properties" : ["getValue(", "setValue("]
                },
                {"obj" : "Device", "properties" : ["id(", "name("] },
                {"obj" : "name(", "properties" : [] },
                {"obj" : "id(", "properties" : [] },

            ];

            function getSuggestedProperties(name) {
                for (let i=0; i<suggestions.length; i++){
                    if(suggestions[i].obj == name){
                        return suggestions[i].properties;
                    }
                }
                return null;
            }

            function match(str, it) {
                return str.indexOf(it) != -1;
            }

            CodeMirror.showHint(cm, (editor, options) => {
                let list = [];
                var token = getCoffeeScriptToken(editor, cm.getCursor());
                var start = token.start;

                console.log(token);

                let cursor = cm.getCursor();

                if (token.type == "string"){
                    let prevToken =  getCoffeeScriptToken(editor, CodeMirror.Pos(cursor.line, cursor.ch -2));

                    console.log(prevToken);
                    console.log(editor);

                    if (prevToken.string == "id")
                        list = editor.deviceIds;
                    else if (prevToken.string == "name")
                        list = editor.deviceNames;
                    
                    token.start +=1;
                } else if (token.type == null || token.type == "variable"){
                    for (let i=0; i<suggestions.length; i++){
                        if (match(suggestions[i].obj, token.string))
                            list.push(suggestions[i].obj);
                    }
                } else if (token.type == "property"){
                    let prevToken =  getCoffeeScriptToken(editor, CodeMirror.Pos(cursor.line, cursor.ch -1));
                    let propertiesSuggestions : Array<string> = getSuggestedProperties(prevToken.string);

                    if(propertiesSuggestions != null){
                        for (let i=0; i<propertiesSuggestions.length; i++){
                            if (match(propertiesSuggestions[i], token.string == "." ? "" : token.string))
                                list.push(propertiesSuggestions[i]);
                        }
                    }

                    if (token.string == "."){
                        token.start +=1;
                    }
                }

                return {list: list, from:CodeMirror.Pos(cursor.line, token.start), to: cm.getCursor()};
                
            });
        }

    }
}
