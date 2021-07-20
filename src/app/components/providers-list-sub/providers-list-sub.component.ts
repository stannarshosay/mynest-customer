import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { SignupComponent } from 'src/app/dialogs/signup/signup.component';
import { CategoryService } from 'src/app/services/category.service';
import { ChatService } from 'src/app/services/chat.service';
import { LocationService } from 'src/app/services/location.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-providers-list-sub',
  templateUrl: './providers-list-sub.component.html',
  styleUrls: ['./providers-list-sub.component.css']
})
export class ProvidersListSubComponent implements OnInit {
  @ViewChildren("filterCheckboxes") filterCheckboxes: QueryList<ElementRef>;

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  categoryId:string = "";
  categoryName:string = "";
  serviceAd:string = encodeURIComponent("default.jpg");
  providers:any = "";
  subCategories:any = [];
  config:any = {};
  adLink:any = null;
  subQuery:any = null;
  hasLoggedIn:boolean = false;
  isProvidersLoaded:boolean = false;
  isSubcategoryLoaded:boolean = false;
  isProvidersDataSuccess:boolean = true;
  isSubcategoryDataSuccess:boolean = true;
  canDefineSubArray:boolean = false;
  getHasWishlistedOrRemovedSetStatus:Subscription;
  getLoginSetStatus:Subscription;
  getLocationSetStatus:Subscription;
  constructor(
    private route : ActivatedRoute,
    private providersService:ProvidersService,
    private categoryService:CategoryService,
    private locationService:LocationService,
    private loginService:LoginService,
    private chatService:ChatService,
    private router:Router,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void { 
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId');
      this.categoryName = decodeURIComponent(params.get('categoryName'));  
      this.subQuery = decodeURIComponent(params.get('subCategory'));  
      this.getSubcategories(this.categoryId);
    });
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().pipe(skip(1)).subscribe(res =>{
       if(res){
        this.getSubcategories(this.categoryId);
        this.setServiceAd();
       }
    });
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().pipe(skip(1)).subscribe(res=>{  
        this.hasLoggedIn = res;    
        this.getSubcategories(this.categoryId);
    });
    this.getHasWishlistedOrRemovedSetStatus = this.providersService.getHasWishlistedOrRemovedSetStatus().subscribe(res=>{
      if(res !== "data"){
        this.setWishlistRemovalFromNav(res);        
      }
    });
  }
  ngOnDestroy():void{
    this.getHasWishlistedOrRemovedSetStatus.unsubscribe();
    this.getLocationSetStatus.unsubscribe();
    this.getLoginSetStatus.unsubscribe();
  }
  setServiceAd(){
    let paramData={};
    if(localStorage.getItem("loc")){
      paramData["categoryId"] = this.categoryId;
      paramData["district"] = localStorage.getItem("loc");
      this.providersService.getServiceAds(paramData).subscribe(res=>{
        if(res["success"]){
          this.serviceAd = encodeURIComponent(res["data"]["adPicturePath"]);
          this.adLink = encodeURIComponent(res["data"]["website"]);
        }else{
          this.serviceAd = encodeURIComponent("default.jpg");
        }
      },error=>{
        this.serviceAd = encodeURIComponent("default.jpg");
      });
    }else{    
      this.serviceAd = encodeURIComponent("default.jpg");
    }
  }
  setWishlistRemovalFromNav(vendorId:string){
     if(this.providers.find(obj => obj.vendorId === vendorId)){
      this.providers.find(obj => obj.vendorId === vendorId).wishListed = false;
    }
  } 
  getSubcategories(id:any){
      //data is null for no elements else success = true;
      this.categoryService.getSubcategoriesByCategoryId(id).subscribe(res=>{
        this.isSubcategoryLoaded = true,
        this.canDefineSubArray = true,
        this.checkSubcategoriesRecieved(res)        
      });
  }
  getAdLink(){
    if((this.adLink)&&(this.adLink!="")){
      if (!/^http[s]?:\/\//.test(this.adLink)) {
          this.adLink = 'https://'+this.adLink;
      }
      window.open(
        this.adLink,
        '_blank'
      );
    }
  }
  checkSubcategoriesRecieved(response:any){
      if(response){
        if(response["success"]){
          this.subCategories = response["data"];
          setTimeout(()=>{
            if(!(this.subQuery == "undefined")){ 
                this.filterCheckboxes.map(element=>{
                  if(element.nativeElement.name == this.subQuery){
                    element.nativeElement.checked = true;
                  }
                  return element;
                });
            }
            this.getProviders(0,9);
          }); 
        }else{
          this.isSubcategoryDataSuccess =false;
          this.canDefineSubArray = false;
        }
      }else{
        this.isSubcategoryDataSuccess =false;
        this.canDefineSubArray = false;
      }
  }
  getProviders(pageNo:number,pageSize:number){
    this.providers = [];
    this.config["totalItems"] = 0;
    this.isProvidersDataSuccess = true;
    this.isProvidersLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    let data = {};
    data["categoryId"] = this.categoryId;
    data["district"] = localStorage.getItem("loc");
    if(this.canDefineSubArray){
      let subArray:string[] = [];
      this.filterCheckboxes.forEach((element) => {
        if(element.nativeElement.checked){
          subArray.push(element.nativeElement.name);
        }
      });
      data["subCategories"]  = subArray;
    }
    if(localStorage.getItem("uid")){
      data["customerId"] = localStorage.getItem("uid");
    }
    this.providersService.getProviders(data,pageNo,pageSize).subscribe(res =>{
      this.isProvidersLoaded = true,
      this.checkProvidersRecieved(res)      
    });
  }
  checkProvidersRecieved(serverData:any){
     if(serverData["success"]){
      this.providers = serverData["data"]["content"];
      this.config["totalItems"] = serverData["data"]["totalElements"];
     }else{
       this.isProvidersDataSuccess = false;
     }
  }
  uncheckAllFilters(){
    this.filterCheckboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.getProviders(0,9);
  }
  pageChange(newPage: number){
    this.getProviders(newPage-1,9);
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  toggleWishlist(provider:any,event:any){
    event.stopPropagation();
    if(this.hasLoggedIn){
      this.showSnackbar("Please wait...",false,"");
      if(this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed){
        this.providersService.removeFromWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
            this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed = false;
            this.showSnackbar(provider.companyName +" removed !",true,"close");
            this.providersService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
        });        
      }else{
        this.providersService.addToWishlist(provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
          if(res["success"]){
             this.providers.find(obj => obj.vendorId === provider.vendorId).wishListed = true;
             this.showSnackbar(provider.companyName +" wishlisted !",true,"close");
             this.providersService.hasWishlistedOrRemoved.next("data");
          }else{
            this.showSnackbar("Server error !",true,"close");
          }
        },
        error=>{
          this.showSnackbar("Connection error !",true,"close");
        });        
      }
    }else{
      const dialogRef = this.dialog.open(LoginDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if(result=="signup"){
          const dialogRef = this.dialog.open(SignupComponent);
        }
      });
    }
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
    if(this.hasLoggedIn){
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
    }else{
      const dialogRef = this.dialog.open(LoginDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if(result=="signup"){
          const dialogRef = this.dialog.open(SignupComponent);
        }
      });
    }
  }
}
