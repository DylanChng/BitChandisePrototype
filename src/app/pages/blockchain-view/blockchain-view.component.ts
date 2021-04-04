import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NodesService } from '../nodes/nodes.service';

@Component({
  selector: 'app-blockchain-view',
  templateUrl: './blockchain-view.component.html',
  styleUrls: ['./blockchain-view.component.css']
})
export class BlockchainViewComponent implements OnInit {

  constructor(private dialog: MatDialog, private nodesService: NodesService) { }

  private nodesSub: Subscription;
  nodesList: any = [];
  selectedNode;

  private nodeDataSub: Subscription;
  nodeData;
  nodeTransactions = [];

  ngOnInit(): void {
    this.nodesService.getAllNodes();
    this.nodesSub = this.nodesService.getUpdatedNodeListObservable()
      .subscribe(nodes => {
        this.nodesList = nodes;
      }, err => {
        this.nodesList = [];
      })
  }

  ngOnDestroy () {
    this.nodesSub.unsubscribe();
  }

  nodeChanged(event){
    this.selectedNode = this.nodesList.filter((node) => node.nodeURL == event.value);
    this.selectedNode = this.selectedNode[0];
    this.nodesService.getNodeData(this.selectedNode.nodeURL);
    this.nodeDataSub = this.nodesService.getNodeDataListener()
      .subscribe(nodeData => {
        //console.log(nodeData);
        this.nodeData = nodeData;
        this.nodeTransactions = [];
        this.extractTransactions();
      })
  }
  
  extractTransactions(){
    this.nodeData.chain.forEach(block => {
      this.nodeTransactions.push(...block.transactions);
    });
  }
  
}
