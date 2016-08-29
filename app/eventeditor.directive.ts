import { Component, Directive, Renderer } from '@angular/core';

declare var CodeMirror: any;

@Directive({
    selector: '[eventeditor]'
})
export class EventEditorDirective {
    editor: any;

    constructor(private _renderer: Renderer) {}

    setValue(content){
        this.editor.setValue(content);
    }

    getValue(){
        return this.editor.getValue();
    }

    ngAfterViewInit() {

        this.editor = CodeMirror.fromTextArea(
            this._renderer.selectRootElement('[eventeditor]'),
            {
                lineNumbers: true,
                styleActiveLine: true,
                autoCloseBrackets: true,
                theme: "monokai",
                matchBrackets: true,
                mode: "application/ld+json",
            } 
        );
    }
}
