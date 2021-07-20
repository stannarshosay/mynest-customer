import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {  Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isProvidersLoaded:boolean = false;
  isProvidersDataSuccess:boolean = true;
  providers:any = "";
  pageNo:number = 0;
  config:any = {};
  getHasWishlistedOrRemovedSetStatus:Subscription;
  getLoginSetStatus:Subscription;
  constructor(
    private providersService:ProvidersService,
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private chatService:ChatService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getProviders(0,9);
    this.getHasWishlistedOrRemovedSetStatus = this.providersService.getHasWishlistedOrRemovedSetStatus().subscribe(res=>{
      if(res !== "data"){
        this.setWishlistRemovalFromNav(res);        
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
     this.getHasWishlistedOrRemovedSetStatus.unsubscribe();
  }
  setWishlistRemovalFromNav(vendorId:string){
    if(this.providers.find(obj => obj.vendorId === vendorId)){
    if((this.providers.length==1)&&(this.pageNo!=0)){
      this.pageNo = this.pageNo-1;  
    } 
    this.getProviders(this.pageNo,9);
   }
  }

  getProviders(pageNo:number,pageSize:number){
    this.providers = [];
    this.config["totalItems"] = 0;
    this.isProvidersDataSuccess = true;
    this.isProvidersLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.providersService.getWishlistedProviders(localStorage.getItem("uid"),pageNo,pageSize).subscribe(res =>{
      this.isProvidersLoaded = true;
      if(res["success"]){
        this.config["totalItems"] = res["data"]["totalElements"];
        this.providers = res["data"]["content"];
      }else{
        this.isProvidersDataSuccess = false;
      }
    });
  }
  toggleWishlist(provider:any,event:any){
    event.stopPropagation();
      this.showSnackbar("Please wait...",false,"");
      if(this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed){        
        this.providersService.removeFromWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){ 
            if((this.providers.length==1)&&(this.pageNo!=0)){
               this.pageNo = this.pageNo-1;  
            } 
            this.getProviders(this.pageNo,9);
            this.showSnackbar(provider.companyName +" removed !",true,"close");
            this.providersService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
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
    this.getProviders(this.pageNo,9);
  } 
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/provider/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  goToChatroom(provider:any,event:any){
    event.stopPropagation();
    let contactData = {
      lastMessage: "No messages yet",
      lastMessageSentBy: null,
      lastMessageTime: null,
      vendorId: provider.vendorId,
      vendorName: provider.companyName,
      profilePic: provider.logo    
    }; 
    this.chatService.setContactData(contactData);
    this.router.navigate(["/chatroom"]);
  }

}
