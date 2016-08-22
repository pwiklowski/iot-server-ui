import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from '@angular/common';
import { Device } from './models.ts';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';


@Pipe({
    name: 'sanitizeHtml'
})
class SanitizeHtml implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizationService){}  

   transform(v: string) : SafeHtml {
      return this._sanitizer.bypassSecurityTrustHtml(v); 
   } 
} 



@Component({
  selector: 'device-picker',
  template: `<div class="tag-input" >
                <div class="tag-selected" #inputField>
                    <template ngFor let-item [ngForOf]="selectedItems">
                        <div [innerHtml]="item.inputHtml | sanitizeHtml" class="tag-selected-item"></div>
                        <div class="tag-delete-container">
                            <div class="tag-delete" (click)="remove(item)"></div>
                        </div>
                    </template>

                    <input class="tag-input-field" #value (keyup)="filter($event, value, inputField)">
                    <div class="tag-dropdown-container">
                         <div class="tag-dropdown">
                            <div class="tag-dropdown-item" [class.tag-dropdown-selected]="i==selectedItem" *ngFor="let item of items;let i=index; " 
                                    [innerHtml]="item.listHtml | sanitizeHtml" (click)="add(item)">
                            </div>
                         </div>
                     </div>
                </div>
             </div>
  `,
  styles: [`
      .tag-dropdownmenu-selected {}
      .tag-input { border: 1px solid #DDD; background-color: white; 100%; height: 40px; display:flex; flex-direction: row;}
      .tag-input-field { font-size: 30px; flex: 1 1 auto; order: 100}
      .tag-selected { flex: 1 1 auto;  display:flex; flex-direction: row; }
      .tag-selected-item { flex: 0 0 auto; }
      .tag-dropdown{ z-index: 1000;background-color: white; position:absolute; top:100%;}
      .tag-dropdown-container { position: relative; }
      .tag-delete-container { position:relative; }
      .tag-delete { position:absolute; right:10px; }
      `],
  directives: [NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [SanitizeHtml],
  encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class DevicePickerComponent{
    private items:Array<any> = [];
    private selectedItems:Array<any> = [];
    private allItems:Array<any> = [];
    private selectedItem = 0;

    public setItems(items){
        this.allItems = items;
    }

    public filter(event, value, inputField){
        console.log(event);
        console.log("filter " + value);

        if (event.keyCode == 38){//uparrowh
            if (this.selectedItem == 0) return;
            this.selectedItem--;
            return;
        }else if(event.keyCode == 40){ //down arrow
            if (this.items.length -1 > this.selectedItem)
                this.selectedItem++;
            return;
        }else if(event.keyCode == 13){ //enter
            if (this.items.length == 0){
                return;
            }

            this.add(this.items[this.selectedItem]); 
            value.value = "";

        }

        this.selectedItem = 0;
        this.items = [];
        
        if (value.value == "") return;

        this.allItems.forEach(item=>{
            if (item.content.toLowerCase().indexOf(value.value.toLowerCase()) !== -1){
                this.items.push(item);
            }
        });

    }

    public add(item){
        this.selectedItems.push(item);
        console.log('added id' + item.id);
    }

    public remove(item):void {
        console.log('removed ', item.id);
        var index = this.selectedItems.indexOf(item);
        this.selectedItems.splice(index, 1);
    }
}

