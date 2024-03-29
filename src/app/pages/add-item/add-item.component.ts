import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { NgForm } from "@angular/forms";
import { ItemService } from "./item.service";
import { Item } from '../../model/item.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";

import { NodesService } from '../nodes/nodes.service';
import { AuthService } from 'app/auth/auth.service';
import { isNoSubstitutionTemplateLiteral } from 'typescript';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  //declarations
  theNodeURL = "http://localhost:3002";
  minDate = new Date();
  maxDate = new Date();
  expDate = new FormControl();
  createdDate = new Date();
  itemList = [];
  theStringId;

  columnName: string[] = ['itemId', 'itemName', 'description','status',
  'remarks', 'location','expiryDate', 'collectionDate', 'manufacturer'];
  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public theItemId: Guid;


  constructor(public itemService: ItemService, private nodesService: NodesService, private authService:AuthService, private bitchandise: BitchandiseService) {
    // const today = new Date();
    // const month = today.getMonth();
    // const year = today.getFullYear();

    // this.additem = new FormGroup({
    //   start: new FormControl(new Date(year, month, 13)),
    //   end: new FormControl(new Date(year, month, 16))

    // });

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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //methods
  async recordNewItem(formData: NgForm){
    if(formData.invalid){
      return
    }
    //generate UUID
    this.theItemId = Guid.create();
    this.theStringId = this.theItemId.toString();

    const newItem: Item = {
      itemId: this.theStringId,
      itemName: formData.value.itemName,
      description: formData.value.description,
      status: formData.value.status,
      comment: formData.value.remark,
      location: formData.value.location,
      expiryDate: this.expDate.value,
      createdDate: this.createdDate,
      madeBy: this.authService.getCurrentUser().name,
    };
    //console.log(newItem.createdDate.toLocaleString('default', { month: 'long' }));
    //console.log(newItem);
    await this.nodesService.addNewItem(newItem);
    var msg = "New Item Has Been Added";
      let toastHTMLtemplate = `
        <div class="container-fluid">
          <span data-notify="icon" class="nc-icon nc-bell-55"></span>
          <span data-notify="message">
              ${msg}
          </span>
        </div>
        `
        this.bitchandise.notification(toastHTMLtemplate,"green",1000);
    //this.nodesService.mining();
    //this.itemService.addItem(newItem);
    console.log(newItem);
    //alert("Added a New Item.");
    //formData.resetForm();
    this.retrieveMyItems();
  }

  // refreshTable(){
  //   this.paginator._changePageSize(this.paginator.pageSize);
  //   this.dataSource.paginator = this.paginator;
  // }

  // generateQR(itemId :Item){
  //   <ngx-qrcode [qrc-value]="theItemId"> </ngx-qrcode>
  // }

  //extraction
  extractMyTransactions(theCurrUser){
    this.nodeData.chain.forEach(block => {
      this.nodeTransactions.push(...block.transactions);
    });
    console.log("All Trans", this.nodeTransactions);
    var i;
    for(i=0; i<this.nodeTransactions.length; i++){
      console.log(theCurrUser);
      console.log(this.nodeTransactions[i].madeBy);
      if(this.nodeTransactions[i].madeBy == theCurrUser){
        //my item only list
        this.itemList.push(this.nodeTransactions[i]);
      }
    };
    //console.log(this.nodeTransactions);
    console.log("man trans",this.itemList);

    this.dataSource.data = this.itemList;
    console.log(this.dataSource.data);
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
