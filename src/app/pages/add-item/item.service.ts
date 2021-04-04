import { Injectable } from '@angular/core';
import { Item } from '../../model/item.model';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemList: Item[] = [

  ]
  private updatedItems = new Subject<Item[]>();

  constructor() {}

  //methods
  getItems(){
    return this.itemList;
  }

  getItemsListener(){
    return this.updatedItems.asObservable();
  }

  addItem(item: Item){
    let newItem = item;
    this.itemList.push(newItem);
  }

}
