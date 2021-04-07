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

import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';

@Component({
  selector: 'app-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.css']
})
export class UpdateItemComponent implements OnInit {
  //QR related
  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';

  //declarations
  itemList = [];
  editedItemList = [];
  theNodeURL = "http://localhost:3001";
  minDate = new Date();
  maxDate = new Date();
  expDate = new FormControl();
  colDate = new FormControl();
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

  constructor(public itemService: ItemService, private nodesService: NodesService, private authService:AuthService, private bitchandise: BitchandiseService) {
  }

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
      this.retrieveMyItems();

  }

  public scanSuccessHandler($event: any) {
    this.theRetrievedItem = null;
    this.scannerEnabled = false;
    this.theInfo =  $event;
    this.theItem = this.findItemIdScanner($event);

  }

  public enableScanner() {
    this.theRetrievedItem = null;
    this.scannerEnabled = !this.scannerEnabled;
    this.theInfo = "Place The QR Code Directly To Your Camera.";
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  //methods

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
      var msg = "Item Does Not Exist";
      let toastHTMLtemplate = `
        <div class="container-fluid">
          <span data-notify="icon" class="nc-icon nc-bell-55"></span>
          <span data-notify="message">
              ${msg}
          </span>
        </div>
        `
        this.bitchandise.notification(toastHTMLtemplate,"red",1000);
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
      var msg = "Item Does Not Exist";
      let toastHTMLtemplate = `
        <div class="container-fluid">
          <span data-notify="icon" class="nc-icon nc-bell-55"></span>
          <span data-notify="message">
              ${msg}
          </span>
        </div>
        `
        this.bitchandise.notification(toastHTMLtemplate,"red",1000);
      this.theRetrievedItem = null;
      this.theInfo = "Sorry Try Again";
      this.enableScanner();
    }
  }

  // populateForm(element: any){
  //   this.formDescription.setValue(this.theRetrievedItem.description.toString());
  //   this.formComment.setValue(this.theRetrievedItem.comment.toString());
  // };

   //methods
   async updateItem(formData: NgForm){

    var createdDate = new Date();
    if(formData.invalid){
      return
    }
    const newItem: Item = {
      itemId: this.theRetrievedItem.itemId,
      itemName: this.theRetrievedItem.itemName,
      description: this.theRetrievedItem.description,
      status: formData.value.status,
      comment: this.theRetrievedItem.comment,
      location: formData.value.location,
      expiryDate: this.theRetrievedItem.expiryDate,
      createdDate: createdDate,
      madeBy: this.theRetrievedItem.madeBy,
    };

    await this.nodesService.addNewItem(newItem);
    //this.nodesService.mining();
    //this.itemService.addItem(newItem);
    console.log(newItem);
    //alert("Added a New Item.");
    formData.resetForm();
    this.retrieveMyItems();
    this.theRetrievedItem = null;
  }

  generateQR(itemId :Item){
    //<ngx-qrcode [qrc-value]="theItemId"> </ngx-qrcode>
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
