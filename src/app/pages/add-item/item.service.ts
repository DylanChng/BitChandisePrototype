import { Injectable } from '@angular/core';
import { Item } from '../../model/item.model';
import { Subject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ItemService {
  
  private itemList: Item[] = [
    // {itemId: "i001", itemName: "iphone",description: "hello", status:"in transit", remarks:"fragile", location:"japan", expiryDate: new Date(), collectionDate: new Date(), madeBy: "Sdn Bhs"},
    // {itemId: "i002", itemName: "s",description: "hello", status:"in transit", remarks:"fragile", location:"japan", expiryDate: new Date(), collectionDate: new Date(), madeBy: "Sdn Bh2"},
    // {itemId: "i003", itemName: "x",description: "hello", status:"in transit", remarks:"fragile", location:"japan", expiryDate: new Date(), collectionDate: new Date(), madeBy: "Sdn Bh3"},
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

  // removeTempTransaction(item: Item){
  //   this.itemList.forEach((element,index)=>{
  //     if(element.itemId==item.itemId) this.itemList.splice(index,1);
  //  });
  // }
    
}
