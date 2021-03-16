import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocationSelectorComponent } from 'src/app/dialogs/location-selector/location-selector.component';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { SignupComponent } from 'src/app/dialogs/signup/signup.component';
import { CategoryService } from 'src/app/services/category.service';
import { ChatService } from 'src/app/services/chat.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  username = "User";
  customerProfile:string = encodeURIComponent("default.jpg");
  wishlistCount:string = "";
  messageCount:string = "";
  notificationCount:string = "";
  searchCategories=[];
  navWishlistProviders:any = "";
  navMessages:any = "";
  navNotifications:any = "";
  isCategoryLoaded:boolean = false;
  isNavWishlistLoaded:boolean = false;
  isNavMessagesLoaded:boolean = false;
  isNavNotificationsLoaded:boolean = false;
  isTyping:boolean = true;
  isLoggedIn:boolean = false;
  searchCategoryControl = new FormControl("",Validators.required);
  filteredSearchCategories:Observable<any[]>;

  hasLocation:boolean = false;
  locationText:string = "Select location";
  getLocationSetStatus:Subscription;
  getLoginSetStatus:Subscription;
  getProfileChangeStatus:Subscription;
  getRecievedMessagesSubscription:Subscription;
  getRecievedNotificationsSubscription:Subscription;
  getHasWishlistedOrRemovedSetStatus:Subscription;
  constructor(private router:Router,public dialog: MatDialog,
              private locationService : LocationService,
              private categoryService:CategoryService,
              private loginService:LoginService,
              private chatService:ChatService,
              private customerService:CustomerService,
              private providerService :ProvidersService,
              private snackBar: MatSnackBar) { 
    this.categoryService.getHomeCategories().subscribe(res => {
      this.isCategoryLoaded = true,
      this.isTyping = false,
      this.searchCategories = res
    });
  }
  
  ngOnInit(): void {
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res,
      this.locationText = this.hasLocation?localStorage.getItem("loc"):"Select location"
      if(!this.hasLocation){
        this.locationSelector();
      }
    }); 
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{
      this.isLoggedIn = res;
      if(this.isLoggedIn){
        this.username = localStorage.getItem("username");
        this.setCustomerProfilePic();
        this.chatService.connectAndSubscribeToWebsocket();
      }else{
        this.customerProfile = encodeURIComponent("default.jpg");
        this.username = "User";
        this.chatService.disconnectFromWebsocket();
      }
    });
    this.getRecievedMessagesSubscription = this.chatService.getRecievedMessages().subscribe(res =>{
        this.isNavMessagesLoaded = false;
        this.navMessages = "";
        if(this.isLoggedIn){
          this.setMessageUnreadCount();
          this.setMessagesNav();
        }else{
          this.customerProfile = encodeURIComponent("default.jpg");
        }
    });
    this.getProfileChangeStatus = this.customerService.getLogoChangeStatus().subscribe(res =>{      
      if(res){
        this.setCustomerProfilePic();
      }
    });
    this.getRecievedNotificationsSubscription = this.chatService.getRecievedNotification().subscribe(res =>{
      this.isNavNotificationsLoaded = false;
      this.navNotifications = "";
      if(this.isLoggedIn){
        this.setNotificationUnreadCount();
        this.setNotificationsNav();
      }else{
        this.notificationCount = "";
        this.isNavNotificationsLoaded = true;
      }
    });
    this.getHasWishlistedOrRemovedSetStatus = this.providerService.getHasWishlistedOrRemovedSetStatus().subscribe(res =>{
      this.isNavWishlistLoaded = false;
      this.navWishlistProviders = "";
      if(this.isLoggedIn){
        this.setWishlistNav();     
      }else{
        this.wishlistCount = "";
        this.isNavWishlistLoaded = true;
      }
    });
    this.filteredSearchCategories = this.searchCategoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ); 
    if(this.isLoggedIn){
      this.setMessageUnreadCount();
      this.setMessagesNav();
      this.setNotificationUnreadCount();
      this.setNotificationsNav();
    }else{
      this.messageCount = "";
      this.isNavMessagesLoaded = true;
      this.notificationCount = "";
      this.isNavNotificationsLoaded = true;
    }    
  }
   ngOnDestroy():void{
     this.getLoginSetStatus.unsubscribe();
     this.getLocationSetStatus.unsubscribe();
     this.getHasWishlistedOrRemovedSetStatus.unsubscribe();
     this.getRecievedMessagesSubscription.unsubscribe();
     this.getRecievedNotificationsSubscription.unsubscribe();
   }
  locationSelector(){
    const dialogRef = this.dialog.open(LocationSelectorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('location dialog closed');
    });
  }

  private _filter(value: string): string[] {
    return this.searchCategories.filter(option => option.categoryName.toLowerCase().includes(value.toLowerCase()));
  }
  setCustomerProfilePic(){
    this.customerService.getDetailsByCustomerId(localStorage.getItem("uid")).subscribe(res=>{
      if(res["success"]){
        if((res["data"]["profilePic"])&&(res["data"]["profilePic"]!="")){
          this.customerProfile = encodeURIComponent(res["data"]["profilePic"]);
        }
      }else{
        this.showSnackbar("Customer detail error!",true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
    });
  }
  goToCategories(){
    if(this.searchCategoryControl.valid){
      if(this.hasLocation){
        let category = this.searchCategories.filter(obj => obj.categoryName == this.searchCategoryControl.value)[0];
        if(category){
         this.router.navigate(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId]);
        }else{
          this.searchCategoryControl.setValue('');
          this.showSnackbar("Please select from available categories",true,"close");       
        }
      }else{
        this.locationSelector();
      }
    }else{
      this.showSnackbar("Oops! nothing to search for",true,"close");
    }
  }

  toggleTyping(){
    this.isTyping = true;
    setTimeout(()=>{
      this.isTyping = false;
    },1000);
  }
  openLoginDialog(){
    const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result=="signup"){
        const dialogRef = this.dialog.open(SignupComponent);
      }
    });
  }
  goToPostRequirement(){
    if(this.isLoggedIn){
      this.router.navigate(["/post-requirement"]);
    }else{
      this.openLoginDialog();
    }
  }
  goToRequirements(){
    if(this.isLoggedIn){
      this.router.navigate(["/requirements"]);
    }else{
      this.openLoginDialog();
    }
  }
  logout(){
    localStorage.setItem("uid","");
    localStorage.setItem("username","");
    localStorage.setItem("email","");
    this.loginService.hasLoggedIn.next(false);
    this.providerService.hasWishlistedOrRemoved.next("data");
    this.chatService.hasRecievedMessage.next("no");
    this.chatService.hasRecievedNotification.next("no");
    this.showSnackbar("Logout Successful!",true,"close");
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  setWishlistNav(){
      this.providerService.getWishlistedProviders(localStorage.getItem("uid"),0,5).subscribe(res=>{
        this.isNavWishlistLoaded = true;
        if(res["success"]){
          this.wishlistCount = res["data"]["totalElements"]>50?"50+":res["data"]["totalElements"];
          this.navWishlistProviders = res["data"]["content"];
        }else{
          this.wishlistCount = "";
          this.navWishlistProviders = "";
        }
      });    
  }
  setMessageUnreadCount(){
    this.chatService.getMessagesUnreadCount(localStorage.getItem("uid")).subscribe(res=>{
      if(res["success"]){
        this.messageCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
      }
    }); 
}
setMessagesNav(){
  this.chatService.getChatContactsByCustomerId(localStorage.getItem("uid")).subscribe(res=>{
    this.isNavMessagesLoaded = true;
    if(res["success"]){
      this.navMessages = res["data"].slice(0,5);
    }else{
      this.messageCount = "";
      this.navMessages = "";
    }
  });   
}
setNotificationUnreadCount(){
  this.chatService.getNotificationsUnreadCount(localStorage.getItem("uid")).subscribe(res=>{
    if(res["success"]){
      this.notificationCount = res["data"] == 0?"":res["data"]>50?"50+":res["data"];
    }
  }); 
}
setNotificationsNav(){
  this.chatService.getAllNotifications(localStorage.getItem("uid"),0,5).subscribe(res=>{
    this.isNavNotificationsLoaded = true;
    if(res["success"]){
      this.navNotifications = res["data"]["content"];
    }else{
      this.notificationCount = "";
      this.navNotifications = "";
    }
  });   
}
  removeWishlist(provider:any,event:any){
    event.stopPropagation();
    this.showSnackbar("Please wait...",false,"");
        this.providerService.removeFromWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
            this.showSnackbar(provider.companyName +" removed !",true,"close");
            this.providerService.hasWishlistedOrRemoved.next(provider.vendorId);
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
    });    
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  checkLength(message:string){    
    if(message.length>15){
      return message.substring(0,15) +" ...";
    }
    return message;
 }
 goToChatroom(provider:any){  
  this.chatService.setContactData(provider);
  this.router.navigate(["/chatroom"]);
}

}