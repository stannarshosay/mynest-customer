import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  contactData:any = "";
  webSocketEndPoint: string = 'https://mynestonline.com/collection/ws';
  stompClient:any = null;
  public hasRecievedMessage = new Subject<any>();
  public hasRecievedNotification = new Subject<any>();
  public whenSamePageMessages = new Subject<any>();
  constructor(
    private http:HttpClient
  ) { }
  getContactData(){
    return this.contactData;
  }
  setContactData(contactData:any){
    this.contactData = contactData;
  }
  clearContactData(){
    this.contactData = "";
  }
  hasContactData(){
    return this.contactData == ""?false:true;
  }
  getChatContactsByCustomerId(customerId:any):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/all-chats/customer?customerId="+customerId);     
  } 
  getMessagesByCustomerAndVendorId(customerId:any,vendorId:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/messages?customerId="+customerId+"&vendorId="+vendorId,null);     
  }  
  getMessagesUnreadCount(userId:string):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/chat/count?userId="+userId); 
  }
  getRecievedMessages():Observable<any>{
    return this.hasRecievedMessage.asObservable();
  }
  getNotificationsUnreadCount(userId:string):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/notifications/count?userId="+userId); 
  }
  getAllNotifications(userId:string,pageNo:number,pageSize:number):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/get-notifications?userId="+userId+"&pageNo="+pageNo+"&pageSize="+pageSize); 
  }
  updateNotificationReadStatus(notificationIds:any):Observable<any>{
    return this.http.put("https://mynestonline.com/collection/api/notifications/update",notificationIds); 
  }
  getRecievedNotification():Observable<any>{
    return this.hasRecievedNotification.asObservable();
  }
  getSamePageMessagesStatus():Observable<any>{
    return this.whenSamePageMessages.asObservable();
  }
 


  //websocket
  connectAndSubscribeToWebsocket(){
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = () => {};
    let that = this;
    this.stompClient.connect({},function(frame:any) {
      that.stompClient.subscribe("/user/" + localStorage.getItem("uid") + "/queue/messages",function(message:any)
       {        
        console.log("message");
        that.hasRecievedMessage.next(JSON.parse(message["body"]));
        that.playMessageAudio();
       }       
     );   
     that.stompClient.subscribe("/user/" + localStorage.getItem("uid") + "/queue/notification",function(notification:any)
       {
        that.hasRecievedNotification.next(JSON.parse(notification["body"]));
        that.playNotificationAudio();
       }       
     ); 
    }, function(error:any){
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
          that.connectAndSubscribeToWebsocket();
      }, 5000);
    });
  }
  playMessageAudio(){
    let audio = new Audio();
    audio.src = "../../assets/sounds/message.wav";
    audio.load();
    audio.play();
  }
  playNotificationAudio(){
    let audio = new Audio();
    audio.src = "../../assets/sounds/notify.wav";
    audio.load();
    audio.play();
  }
  sendMessage(message:any):boolean{  
    if (this.stompClient !== null) {
      this.stompClient.send("/app/chat", {}, JSON.stringify(message));
      return true;
    }
    return false;
  }
  disconnectFromWebsocket(){
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected!");
  }
}
