import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { ChatService } from 'src/app/services/chat.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-view-qoutes',
  templateUrl: './view-qoutes.component.html',
  styleUrls: ['./view-qoutes.component.css']
})
export class ViewQoutesComponent implements OnInit {
  isGetting:boolean = false;
  isGettingSuccess:boolean = true;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  quotes:any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ViewQoutesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private chatService:ChatService,
    private customerService:CustomerService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.viewQuotes();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  viewQuotes(){
    this.isGetting = true;
    this.customerService.getQuotesByRequirementId(this.data.requirementId).subscribe(res=>{
      this.isGetting = false;
      if(res["success"]){
        this.quotes = res["data"];
      }else{
        this.isGettingSuccess = false;
      }
    },error=>{  
    this.isGetting = false;  
    this.isGettingSuccess = false;     
    this.showSnackbar("Connection error!",true,"close");
    });   
  }
  goToChatroom(event:any,qoute:any){
    event.stopPropagation();
    this.dialogRef.close();    
    let contactData = {
      lastMessage: "No messages yet",
      lastMessageSentBy: null,
      lastMessageTime: null,
      vendorId: qoute.vendorId,
      vendorName: qoute.companyName,
      profilePic: qoute.companyLogo    
    }; 
    this.chatService.setContactData(contactData);
    this.router.navigate(["/chatroom"]);
  }

  downloadQuote(quoteFileName:string){
    if((quoteFileName)&&(quoteFileName!="")){
      window.open(
        'https://mynestonline.com/collection/images/quotes/'+encodeURIComponent(quoteFileName),
        '_blank'
      );
    }else{
      this.showSnackbar("Oops! File is missing",true,"close");
    }
  }
}
