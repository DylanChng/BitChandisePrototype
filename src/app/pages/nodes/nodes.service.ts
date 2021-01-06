import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitchandiseService } from 'app/shared/global-service/bitchandise.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodesService {

  constructor(private http: HttpClient, private bitchandiseService:BitchandiseService) { }

  private newNodeObservable = new Subject();
  private updatedNodeListObservable = new Subject();
  private nodesList;

  getNewNodeObservableListener(){
    return this.newNodeObservable.asObservable();
  }

  getUpdatedNodeListObservable(){
    return this.updatedNodeListObservable.asObservable();
  }

  getAllNodes(){
    this.http.get<{message:string, nodes: any}>("http://localhost:3000/nodes/getAll")
      .subscribe(nodes => {
          this.nodesList = nodes.nodes;
          this.updatedNodeListObservable.next(this.nodesList);
      })
  }

  addNewNode(formData) {
    const newNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL
    }

    this.http.post("http://localhost:3000/nodes/add", newNodeData)
      .subscribe(result => {
        //console.log(result);
        this.newNodeObservable.next(result)
      },err => {
        this.newNodeObservable.next(err)
      })
        
  }

  editNodeDetails(formData, nodeId){ 
    const updatedNodeData = {
      nodeName: formData.nodeName,
      nodeURL: formData.nodeURL
    }

    this.http.put<{message: string}>("http://localhost:3000/nodes/update/" + nodeId,updatedNodeData)
      .subscribe(response => {
        response["updatedNode"] = {
          id: nodeId,
          nodeName: formData.nodeName,
          nodeURL: formData.nodeURL
        }
        this.newNodeObservable.next(response)
        
      }, err => {
        this.newNodeObservable.next(err)
      })
  }

  deleteNode(nodeId){
    this.http.delete<{message: string}>("http://localhost:3000/nodes/delete/" + nodeId)
      .subscribe(response => {
        
        this.bitchandiseService.notification(response.message)
        this.nodesList = this.nodesList.filter(node => {          
          if(node._id !== nodeId) return node;
        })

        this.updatedNodeListObservable.next(this.nodesList)
      },err => {
        this.bitchandiseService.notification(err.error.message,"red")
      })
  }
}
