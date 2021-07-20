import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isNotificationsLoaded:boolean = false;
  isNotificationsDataSuccess:boolean = true;
  notifications:any[] = [];
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};
  getRecievedNotificationSubscription:Subscription;
  getLoginSetStatus:Subscription;
  constructor(
    private chatService:ChatService,
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getNotifications(this.pageNo,this.pageSize);
    this.getRecievedNotificationSubscription = this.chatService.getRecievedNotification().subscribe(res=>{
      if(res !== "no"){        
        this.getNotifications(this.pageNo,this.pageSize);        
      }
    });
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
  }
  ngOnDestroy():void{
     this.getLoginSetStatus.unsubscribe();
     this.getRecievedNotificationSubscription.unsubscribe();
  }
  getNotifications(pageNo:number,pageSize:number){
    this.notifications = [];
    this.config["totalItems"] = 0;
    this.isNotificationsDataSuccess = true;
    this.isNotificationsLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.chatService.getAllNotifications(localStorage.getItem("uid"),pageNo,pageSize).subscribe(res =>{
      this.isNotificationsLoaded = true;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.notifications = res["data"]["content"];
        this.updateReadStatus();
      }else{
        this.isNotificationsDataSuccess = false;
      }
    });
  }
  goToRespectivePage(notificationType:string,referenceId:any){
      switch(notificationType){
        case "NEW_QUOTE":{
          this.router.navigateByUrl("/requirements");
          break;
        }
        case "VENDOR_REPORT_ACCEPTED":{
          this.router.navigateByUrl("/home");
          break;
        }
        case "VENDOR_REPORT_REJECTED":{
          this.router.navigateByUrl("/home");
          break;
        }      
      }
  }
  updateReadStatus(){
    let paramData = {};
    paramData["notificationIds"] = this.notifications.filter((obj)=>{
      if(!obj.readStatus)
      return obj;
    }).map((obj)=>{
      return obj.notificationId;
    });
    if(paramData["notificationIds"].length){
      this.chatService.updateNotificationReadStatus(paramData).subscribe(res=>{
          this.chatService.hasRecievedNotification.next("no"); 
      },error=>{
        this.showSnackbar("Status update connection error!",true,"close");
      });
    }
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getNotifications(this.pageNo,this.pageSize);
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
