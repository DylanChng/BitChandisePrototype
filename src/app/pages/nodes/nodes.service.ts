import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  constructor(private http: HttpClient, private bitchandiseService:BitchandiseService) { 
    this.newNodeListener.pipe(shareReplay(1))
    this.updatedNodeListListener.pipe(shareReplay(1))
  }

  private newNodeListener = new Subject();
  private updatedNodeListListener = new Subject();
  private nodesList: any = [];
  private nodesStatus: any = [];


  getNewNodeObservableListener(){
    return this.newNodeListener.asObservable();
  }

  getUpdatedNodeListObservable(){
    return this.updatedNodeListListener.asObservable();
  }

  getAllNodes(){
    this.http.get<{message:string, nodes: any}>("http://localhost:3000/nodes/getAll")
      .subscribe(nodes => {
          this.nodesList = nodes.nodes;
          
          for(let i = 0; i < this.nodesList.length; i++){
            this.nodesList[i]["status"] = "PENDING..."
          }
    
          this.updatedNodeListListener.next(this.nodesList);
      }, err => {
        console.log(err);
        console.log("Cannot get request");
      })
  }

  addNewNode(formData) {
    const newNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL,
      blockchainAPIPath: formData.blockchainAPIPath
    }

    this.http.post("http://localhost:3000/nodes/add", newNodeData)
      .subscribe(result => {
        //console.log(result);
        this.newNodeListener.next(result)
      },err => {
        this.newNodeListener.next(err)
      })
        
  }

  editNodeDetails(formData, nodeId){ 
    const updatedNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL,
      blockchainAPIPath: formData.blockchainAPIPath
    }

    this.http.put<{message: string}>("http://localhost:3000/nodes/update/" + nodeId,updatedNodeData)
      .subscribe(response => {
        response["updatedNode"] = {
          id: nodeId,
          nodeName: formData.nodeName,
          nodeURL: formData.nodeURL,
          blockchainAPIPath: formData.blockchainAPIPath
        }
        this.newNodeListener.next(response)
        
      }, err => {
        this.newNodeListener.next(err)
      })
  }

  deleteNode(nodeId){
    this.http.delete<{message: string}>("http://localhost:3000/nodes/delete/" + nodeId)
      .subscribe(response => {
        
        this.bitchandiseService.notification(response.message)
        this.nodesList = this.nodesList.filter(node => {          
          if(node._id !== nodeId) return node;
        })

        this.updatedNodeListListener.next(this.nodesList)
      },err => {
        this.bitchandiseService.notification(err.error.message,"red")
      })
  }

  initNode(node){
    if(node.status === "CONNECTED") {
      this.bitchandiseService.notification("The node is already online","red")
      return;
    }
    this.http.post("http://localhost:3000/nodes/execute", node)
      .subscribe((response:any) => {
        console.log(response);
        if(response.message === "Blockchain connection sucessful"){
          this.bitchandiseService.notification(response.message)
          for(let i=0; this.nodesList; i++){
            if(this.nodesList[i].nodeName === node.nodeName){
              this.nodesList[i].status = "CONNECTED"
              break;
            }
          }
        }else{
          this.bitchandiseService.notification(response.message,"red")
        }
      },err => {
        console.log(err);
        //Not working
        this.bitchandiseService.notification(err.message,"red") 

      }) 
  }

  testAllNodesConnection(nodesList){

   //let observableList = {};
   //let subscriptionList = []

   for(let i = 0; i < nodesList.length ; i++){
      this.http.get(`${nodesList[i].nodeURL}/testcon`)
        .subscribe(response => {
          //console.log(response);
          this.nodesStatus.push("CONNECTED")
        }, err => {
          //console.log(err);
          this.nodesStatus.push("DOWN")
        })
        .add(() => {
          if(this.nodesStatus.length === nodesList.length){

            for(let i = 0; i < this.nodesList.length; i++){
              this.nodesList[i]["status"] = this.nodesStatus[i]
            }
            () => this.updatedNodeListListener.next(this.nodesList)
          }
        })
    }
   

    /*
    console.log(observableList);
    
    forkJoin(observableList)
      .subscribe(response => {
        console.log(response);  
      }, err => {

      })

    */
  }

}
