import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { NgForm } from "@angular/forms";
import { ItemService } from "../add-item/item.service";
import { Item } from '../../model/item.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";

import { AuthService } from 'app/auth/auth.service';
import { NodesService } from '../nodes/nodes.service';

@Component({
  selector: 'app-track-item',
  templateUrl: './track-item.component.html',
  styleUrls: ['./track-item.component.css']
})
export class TrackItemComponent implements OnInit {
  //QR related
  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';

  //declarations
  itemList = [];
  editedItemList = [];
  theNodeURL = "http://localhost:3001";
  theRetrievedItem;

  //form 
  // formDescription = new FormControl('');
  // formComment = new FormControl('');
  // formCollectionDate = new FormControl('');
  //subs
  //private itemSub: Subscription;
  //scanner 
  
  theInfo:string = "";
  theItem;

  scannerEnabled: boolean = false;

  constructor(public itemService: ItemService, private nodesService: NodesService, private authService:AuthService) { }

  private nodesSub: Subscription;
  nodesList: any = [];
  //selectedNode;

  private nodeDataSub: Subscription;
  nodeData;
  nodeTransactions = [];
  ngOnInit(): void {
  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.theInfo =  $event;

  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.theInfo = "Place The QR Code Directly To Your Camera.";
  }

   //retrieve the specific item
   findItemId(formData: NgForm){
    //console.log(formData.value);
    var i;
    for(i=0; i<this.itemList.length; i++){
      //console.log(this.itemList[i]);
      if(this.itemList[i].itemId == formData.value.theItemId){
        this.editedItemList.push(this.itemList[i]);
      }
    };
     //after loop

     if(this.editedItemList.length > 0){
      //console.log(this.editedItemList);
      var theLastIndex = this.editedItemList.length;
      this.theInfo = "Successfully Found The Item";
        //set the latest item to display
        this.theRetrievedItem = this.editedItemList[theLastIndex - 1 ];
        console.log("this is is!",this.theRetrievedItem[theLastIndex - 1]);
        
      return this.theRetrievedItem;
    }else{
      console.log('Item Not Found');
      this.theRetrievedItem = null;
      this.theInfo = "Sorry Try Again";
      this.enableScanner();
    }
  }

  findItemIdScanner(item: String){
    var i;
    for(i=0; i<this.itemList.length; i++){
      //console.log(this.itemList[i]);
      if(this.itemList[i].itemId == item){
        //if matched 
        //add into the edit item array
        this.editedItemList.push(this.itemList[i]);
      }
      //console.log("Mathced Items",this.editedItemList);
    };
    //after loop

    if(this.editedItemList.length > 0){
      //console.log(this.editedItemList);
      var theLastIndex = this.editedItemList.length;
      this.theInfo = "Successfully Found The Item";
        //set the latest item to display
        this.theRetrievedItem = this.editedItemList[theLastIndex - 1 ];
        console.log("this is is!",this.theRetrievedItem[theLastIndex - 1]);
        
      return this.theRetrievedItem;
    }else{
      console.log('Item Not Found');
      this.theRetrievedItem = null;
      this.theInfo = "Sorry Try Again";
      this.enableScanner();
    }
  }

  //extraction
  extractMyTransactions(theCurrUser){
    this.nodeData.chain.forEach(block => {
      this.nodeTransactions.push(...block.transactions);
    });
    console.log("nodetran", this.nodeTransactions);
    var i;
    for(i=0; i<this.nodeTransactions.length; i++){
      //console.log(theCurrUser);
      //console.log(this.nodeTransactions[i].madeBy);
      if(this.nodeTransactions[i].madeBy == theCurrUser){
        //my item only list
        this.itemList.push(this.nodeTransactions[i]);
      }
    };
    //console.log(this.nodeTransactions);
    //console.log(this.itemList);
  }

  //retrieve my items
  retrieveMyItems(){
    this.nodesService.getNodeData(this.theNodeURL);
    this.nodeDataSub = this.nodesService.getNodeDataListener()
      .subscribe(nodeData => {
        //console.log(nodeData);
        this.nodeData = nodeData;
        this.nodeTransactions = [];
        this.extractMyTransactions(this.authService.getCurrentUser().name);
      })
  }

}
