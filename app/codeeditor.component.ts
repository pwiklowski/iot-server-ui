import { Component, Directive, Renderer } from '@angular/core';

declare var CodeMirror: any;

@Directive({
    selector: '[codeeditor]'
})
export class CodeEditorDirective {
    editor: any;

    constructor(private _renderer: Renderer) {}

    ngAfterViewInit() {
        CodeMirror.commands.autocomplete = function(cm) {
            CodeMirror.showHint(cm, CodeMirror.javascriptHint);
        }
        this.editor = CodeMirror.fromTextArea(
            this._renderer.selectRootElement('[codeeditor]'),
            {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                styleActiveLine: true,
                mode: { name: 'javascript', json: true }
            } 
        );

    }
}
