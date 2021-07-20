import { Component, ElementRef, ModuleWithComponentFactories, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import moment from 'moment';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  @ViewChild('chatbox') private chatbox: ElementRef;
 customerId:any; 
 getLoginSetStatus:Subscription;
 getRecievedMessagesSubscription:Subscription;
 getSamePageMessagesSubscription:Subscription;
 isGettingContacts:boolean = false;
 showNoContacts:boolean = false;
 isGettingMessages:boolean = false;
 showNoMessages:boolean = false;
 messages:any[] = [];
 contactData:any;
 messageControl:FormControl;
 contacts:any[] = [];
  constructor(
    private loginService:LoginService,
    private router:Router,
    private chatService:ChatService,
    private snackBar:MatSnackBar
  ) { }

  ngOnInit(): void {   
    this.messageControl = new FormControl('',Validators.required);
    this.customerId = localStorage.getItem("uid");
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res=>{
       if(res!="no"){
         this.onRecieveMessage(res);
       }
    });
    this.getSamePageMessagesSubscription = this.chatService.getSamePageMessagesStatus().subscribe(res=>{
      if(res){
        this.isGettingContacts = false;
        this.showNoContacts = false;
        this.isGettingMessages = false;
        this.showNoMessages = false;
        this.messages = [];
        this.contactData = null;
        this.contacts = [];
        this.getAllContacts();  
      }
    });
    this.getAllContacts();    
  }
  ngOnDestroy():void{
    this.getLoginSetStatus.unsubscribe();
    this.getRecievedMessagesSubscription.unsubscribe();
    this.getSamePageMessagesSubscription.unsubscribe();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getAllContacts(){
    this.isGettingMessages = true;
    this.isGettingContacts = true;
    this.chatService.getChatContactsByCustomerId(this.customerId).subscribe(res=>{
      this.isGettingContacts = false;
      if(res["success"]){
        this.contacts = res["data"];
      }else{
        this.showNoContacts = true;
      }
      this.checkRecievedContactData();
    },error=>{
      this.showNoContacts = true;
      this.isGettingContacts = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  checkRecievedContactData(){
    if(this.chatService.hasContactData()){
      this.showNoContacts = false;
      this.contactData =  this.chatService.getContactData();
      this.chatService.clearContactData();
      let index = this.contacts.findIndex(obj=>obj.vendorId == this.contactData.vendorId);
      if(index>-1){
        this.contactData = this.contacts[index];
        this.contacts.splice(index,1);
        this.contacts.unshift(this.contactData);
      }else{
        this.contacts.unshift(this.contactData);
      }      
      this.getMessages(this.contactData.vendorId);
    }else if(this.contacts.length){
      this.contactData = this.contacts[0];
      this.getMessages(this.contactData.vendorId);
    }else{
      this.isGettingMessages = false;
      this.showNoMessages = true;
    }
  }
  getMessages(vendorId:any){
    this.messages = [];
    this.showNoMessages = false;
    this.isGettingMessages = true;
    this.chatService.getMessagesByCustomerAndVendorId(this.customerId,vendorId).subscribe(res=>{
       this.isGettingMessages = false;
       if(res["success"]){
          this.messages = res["data"].reverse();
          this.chatService.hasRecievedMessage.next("no");
          this.scrollToBottom();
       }else{
         this.showNoMessages = true;
       }
    },error=>{
      this.isGettingMessages = false;
      this.showNoMessages = true;
      this.showSnackbar("Connection error!",true,"close");      
    });
  }
  getMessagesToUpdateUnreadCount(vendorId:any){
    this.chatService.getMessagesByCustomerAndVendorId(this.customerId,vendorId).subscribe(res=>{
      if(res["success"]){
        this.chatService.hasRecievedMessage.next("no");
      }
    });
  }
  loadChatroom(contact:any){
    this.contactData = contact;
    this.getMessages(contact.vendorId);
  }
  sendMessage(){
    if(this.messageControl.valid){
      let message = {
        customerId: Number(this.customerId),
        vendorId: Number(this.contactData.vendorId),
        senderId: this.customerId,
        recipientId: this.contactData.vendorId,
        content: this.messageControl.value,
        messageType:"TEXT"
      }; 
      if(this.chatService.sendMessage(message)){
        this.showNoMessages = false;
        let date = this.getFormattedDate();
        let index = this.contacts.findIndex(obj=>obj.vendorId == this.contactData.vendorId);
        this.contacts.splice(index,1);
        this.contactData["lastMessageTime"] = date;
        this.contactData["lastMessage"] = message.content;
        this.contacts.unshift(this.contactData);
        message["sentTime"] = date;
        this.messages.push(message);  
        this.messageControl.setValue(""); 
        setTimeout(()=>{
         this.chatService.hasRecievedMessage.next("no");
        },5000);
      }  
    }else{
      this.showSnackbar("No message to send!",true,"okay");
    }
  }
  onRecieveMessage(message:any){   
    if(message.senderId == this.contactData.vendorId){
      this.messages.push(message);
      this.getMessagesToUpdateUnreadCount(this.contactData.vendorId);
    }else{
      this.chatService.hasRecievedMessage.next("no");
    } 
    let index = this.contacts.findIndex(obj=>obj.vendorId == message.senderId);   
    let contact = this.contacts[index];
    contact["lastMessageTime"] = message.sentTime;
    contact["lastMessage"] = message.content;
    this.contacts.splice(index,1);
    this.contacts.unshift(contact); 
  }
  getImagePath(path:string){
    if((path)&&(path!="")){
      return encodeURIComponent(path);
    }
    return encodeURIComponent("default.jpg");
  }
  downloadChatQuote(filePath:string){
    if((filePath)&&(filePath!="")){
      window.open(
        'https://mynestonline.com/collection/images/chat-quotes/'+encodeURIComponent(filePath),
        '_blank'
      );
    }else{
      this.showSnackbar("No qoute found!",true,"close");
    }
  }
  checkLength(message:string){    
    if(message.length>15){
      return message.substring(0,15) +" ...";
    }
    return message;
 }
  getFormattedDate() {
    return moment().format("DD/MM/YYYY HH:mm:ss");
  }
  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 
  scrollToBottom(): void {
    try {
        this.chatbox.nativeElement.scrollTop = this.chatbox.nativeElement.scrollHeight;
    } catch(err) { 
      console.log("error on scroll to bottom : "+err);
    }                 
  }
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY HH:mm:ss");
    if(date.isSame(moment(),'day')){
      return "Today " + date.format('h:mm a');
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday " + date.format('h:mm a');
    }
    return date.format('Do MMM YYYY h:mm a');
  }
}
