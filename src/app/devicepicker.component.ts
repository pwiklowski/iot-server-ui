import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Device } from './models.ts';





@Component({
  selector: 'device-picker',
  template: `<div class="tag-input" >
                <div class="tag-selected" #inputField>
                    <template ngFor let-item [ngForOf]="selectedItems">
                        <mdl-chip mdl-action-icon="cancel" (action-click)="remove(item)" mdl-label="{{ item | deviceAlias }}"></mdl-chip>
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
  encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class DevicePickerComponent{
    private items:Array<any> = [];
    private selectedItems:Array<any> = [];
    private allItems:Array<any> = [];
    private selectedItem = 0;

    private useSimpleSelectedItems = true;
    private allowCustomValues = true; //when custom values are used only simple selcted items are supported

    addedCallback;
    removedCallback;
    selectionChanged;

    public setItems(items){
        this.allItems = items;
    }

    setSelectedItems(items: Array<any>){
        console.log(items);
        this.selectedItems = items;
    }

    public filter(event, value, inputField){

        if (event.keyCode == 38) {//uparrow
            if (this.selectedItem == 0) return;
            this.selectedItem--;
            return;
        }else if(event.keyCode == 40){ //down arrow
            if (this.items.length -1 > this.selectedItem)
                this.selectedItem++;
            return;
        }else if(event.keyCode == 13){ //enter
            if (this.allowCustomValues){
                if (this.selectedItem == -1){
                    this.add(value.value); 
                }else{
                    this.add(this.items[this.selectedItem].text); 
                }
            }else{
                if (this.items.length == 0){
                    return;
                }
                this.add(this.items[this.selectedItem]); 
            }

            value.value = "";
        }

        if (this.allowCustomValues) this.selectedItem = -1;
        else this.selectedItem = 0;

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
        if (this.addedCallback != undefined) this.addedCallback(item);
        this.notifyDataChanged();
    }

    public remove(item):void {
        var index = this.selectedItems.indexOf(item);
        this.selectedItems.splice(index, 1);
        if (this.removedCallback != undefined) this.removedCallback(item);
        this.notifyDataChanged();
    }

    notifyDataChanged(){
        if (this.selectionChanged != undefined){
            this.selectionChanged(this.selectedItems);
        }
    }

}

