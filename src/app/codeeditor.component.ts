import { Component, Directive, Renderer } from '@angular/core';
import { Device } from './models';

declare var CodeMirror: any;

@Directive({
    selector: '[codeeditor]'
})
export class CodeEditorDirective {
    editor: any;

    constructor(private _renderer: Renderer) {}

    devices;
    deviceIds = [];
    deviceNames = [];

    setDevices(devices: Array<Device>){
        this.editor.devices = devices;
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
        this.editor.setSize("100%", 250);

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
                {"obj" : "Event", "properties" : ["source", "resource", "value"] },
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
                return str.toLowerCase().indexOf(it.toLowerCase()) != -1;
            }


            function getDeviceResources(editor, deviceId){
                var list = [];

                for (let i=0; i<editor.devices.length; i++){
                    if(editor.devices[i].id == deviceId){
                        return editor.devices[i].variables;
                    }
                }


                return 
            }

            CodeMirror.showHint(cm, (editor, options) => {
                let list = [];
                var token = getCoffeeScriptToken(editor, cm.getCursor());
                var start = token.start;

                console.log(token);

                let cursor = cm.getCursor();
                console.log(cursor);

                if (token.type == "string"){

                    if (match(token.string, "id:") && match(token.string, "/")) {
                        let s1 = token.string.indexOf("id:");
                        let s = token.string.indexOf("/");
                        
                        let id = token.string.substring(s1+3, s-s1+1);
                        console.log(id);

                        list = getDeviceResources(editor, id);

                        token.start += (s );
                    } else if (match(token.string,"id:")){

                        var id = token.string.replace("id:", "").replace(new RegExp('"', 'g'),'');
                        console.log(id);

                        for (let i=0; i<editor.devices.length; i++){
                            console.log(editor.devices[i].id + " - " + id);
                            if(match(editor.devices[i].id, id))
                            {
                                list.push(editor.devices[i].id);
                                console.log(editor.devices[i].id);
                            }
                        }

                        token.start +=4;
                    } else if (match(token.string, "name:")) {
                        list = editor.deviceNames;
                        token.start +=1;
                    } else if (match(token.string, '""')) {
                        list.push("id:");
                        list.push("name:");
                        token.start +=1;
                    }

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
