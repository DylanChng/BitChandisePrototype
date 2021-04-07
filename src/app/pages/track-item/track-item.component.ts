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

//import { AuthService } from 'app/auth/auth.service';
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
  timelineList = [];
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

  constructor(public itemService: ItemService, private nodesService: NodesService) { }

  private nodesSub: Subscription;
  nodesList: any = [];
  //selectedNode;

  private nodeDataSub: Subscription;
  nodeData;
  nodeTransactions = [];
  ngOnInit(): void {
    //initiation
    this.nodesService.getAllNodes();
    this.nodesSub = this.nodesService.getUpdatedNodeListObservable()
      .subscribe(nodes => {
        this.nodesList = nodes;
      }, err => {
        this.nodesList = [];
      })
    //initiate
    this.retrieveAllItems();
  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.theInfo =  $event;
    this.theItem = this.findItemIdScanner($event);

  }

  public enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
    this.theInfo = "Place The QR Code Directly To Your Camera.";
  }

   //retrieve the specific item
   findItemId(formData: NgForm){
    var i;
    for(i=0; i<this.nodeTransactions.length; i++){
      //console.log(this.itemList[i]);
      if(this.nodeTransactions[i].itemId == formData.value.theItemId){
        //if matched 
        //add into the edit item array
        this.editedItemList.push(this.nodeTransactions[i]);
      }
      //console.log("Mathced Items",this.editedItemList);
    };
    //after loop

    if(this.editedItemList.length > 0){
      //console.log(this.editedItemList);
      //var theLastIndex = this.editedItemList.length;
      this.theInfo = "Successfully Found The Item";
        //set the latest item to display
        this.timelineList = this.editedItemList;
        console.log("this is is!",this.timelineList);
        
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
    for(i=0; i<this.nodeTransactions.length; i++){
      //console.log(this.itemList[i]);
      if(this.nodeTransactions[i].itemId == item){
        //if matched 
        //add into the edit item array
        this.editedItemList.push(this.nodeTransactions[i]);
      }
      //console.log("Mathced Items",this.editedItemList);
    };
    //after loop

    if(this.editedItemList.length > 0){
      //console.log(this.editedItemList);
      //var theLastIndex = this.editedItemList.length;
      this.theInfo = "Successfully Found The Item";
        //set the latest item to display
        this.timelineList = this.editedItemList;
        console.log("this is is!",this.timelineList);
        
      return this.theRetrievedItem;
    }else{
      console.log('Item Not Found');
      this.theRetrievedItem = null;
      this.theInfo = "Sorry Try Again";
      this.enableScanner();
    }
  }

  //extraction
  extractAllTransactions(){
    this.nodeData.chain.forEach(block => {
      this.nodeTransactions.push(...block.transactions);
    });
    console.log("all trans", this.nodeTransactions);
  }

  //retrieve my items
  retrieveAllItems(){
    this.nodesService.getNodeData(this.theNodeURL);
    this.nodeDataSub = this.nodesService.getNodeDataListener()
      .subscribe(nodeData => {
        //console.log(nodeData);
        this.nodeData = nodeData;
        this.nodeTransactions = [];
        this.extractAllTransactions();
      })
  }

}
