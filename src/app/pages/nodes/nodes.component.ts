import { Component, OnInit, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewNodeComponent } from './new-node/new-node.component';
import { NodesService } from './nodes.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent implements OnInit {

  constructor(private dialog: MatDialog, private nodesService: NodesService) { }

  private nodesSub: Subscription;
  nodesList: any;

  ngOnInit(): void {
    this.nodesService.getAllNodes();
    this.nodesSub = this.nodesService.getUpdatedNodeListObservable()
      .subscribe(nodes => {
        this.nodesList = nodes;
      }, err => {
        this.nodesList = []
      })
  }

  addNodeDialog(){
    const title = "Add New Node";
    const mode = "Add"

    const newNodeDialogRef = this.dialog.open(NewNodeComponent, {
      width: "90%",
      maxWidth: "400px",
      height: "auto",
      maxHeight: "450px",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        title: title,
        mode: mode
      }
    })

    newNodeDialogRef.afterClosed().subscribe(newNode =>{
      if(newNode) this.nodesList.push(newNode)
    })
  }

  initNode(node){
    this.nodesService.initNode(node);
  }

  editNodeDialog(node){
    const title = "Edit Node";
    const mode = "Edit"

    const newNodeDialogRef = this.dialog.open(NewNodeComponent, {
      width: "90%",
      maxWidth: "400px",
      height: "auto",
      maxHeight: "450px",
      closeOnNavigation: true,
      disableClose: true,
      data: {
        title: title,
        mode: mode,
        node: node
      }
    })

    newNodeDialogRef.afterClosed().subscribe(updatedNode =>{
      for(let i = 0; i < this.nodesList.length; i++){
        if(this.nodesList[i]._id === updatedNode.id){
          this.nodesList[i].nodeName = updatedNode.nodeName;
          this.nodesList[i].nodeURL = updatedNode.nodeURL;
          this.nodesList[i].blockchainAPIPath = updatedNode.blockchainAPIPath;
          break;
        }
      }
    })
  }

  onDeleteNode(nodeId){
    this.nodesService.deleteNode(nodeId);
  }
}
