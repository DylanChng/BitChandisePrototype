import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { Item } from '../../model/item.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Guid } from "guid-typescript";
import { NodesService } from '../nodes/nodes.service';
import { AuthService } from 'app/auth/auth.service';
import { isNoSubstitutionTemplateLiteral } from 'typescript';

@Component({
  selector: 'app-view-all-created-items',
  templateUrl: './view-all-created-items.component.html',
  styleUrls: ['./view-all-created-items.component.css']
})
export class ViewAllCreatedItemsComponent implements OnInit {
  //declarations
  theNodeURL = "http://localhost:3001";
  itemList = [];
  theStringId;

  columnName: string[] = ['itemId', 'itemName', 'description','status',
  'remarks', 'location','expiryDate', 'createdDate', 'manufacturer', 'qrcode'];
  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public theItemId: Guid;

  constructor(private nodesService: NodesService, private authService:AuthService) { }

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

  refreshTable(){
    this.paginator._changePageSize(this.paginator.pageSize);
    this.dataSource.paginator = this.paginator;
  }

  generateQR(itemId :Item){
   // <ngx-qrcode [qrc-value]="theItemId"> </ngx-qrcode>
  }

  //extraction
  extractMyTransactions(theCurrUser){
    this.nodeData.chain.forEach(block => {
      this.nodeTransactions.push(...block.transactions);
    });
    console.log("nodetran", this.nodeTransactions);
    var i;
    for(i=0; i<this.nodeTransactions.length; i++){
      console.log(theCurrUser);
      console.log(this.nodeTransactions[i].madeBy);
      if(this.nodeTransactions[i].madeBy == theCurrUser){
        //my item only list
        this.itemList.push(this.nodeTransactions[i]);
      }
    };
    console.log(this.nodeTransactions);
    console.log(this.itemList);

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
