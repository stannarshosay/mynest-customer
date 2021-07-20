import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from 'src/app/services/category.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { Lightbox } from 'ngx-lightbox';
import { LightboxConfig } from 'ngx-lightbox';
import { ReportVendorComponent } from 'src/app/dialogs/report-vendor/report-vendor.component';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';
import { SignupComponent } from 'src/app/dialogs/signup/signup.component';
import { ChatService } from 'src/app/services/chat.service';
import { LocationService } from 'src/app/services/location.service';
declare var jQuery: any;

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isGettingGalleryImages:boolean = false;
  vendorId:string;
  serviceAd:string = encodeURIComponent("default.jpg");
  hasLoggedIn:boolean = false;
  adLink:any = null;
  getLoginSetStatus:Subscription;
  getLocationSetStatus:Subscription;
  provider:any = {};
  services:any = [];
  imageGallery = [];
  constructor(
    private route:ActivatedRoute,
    private providerService:ProvidersService,
    private categoryService:CategoryService,
    private locationService:LocationService,
    private snackBar:MatSnackBar,
    private lightbox:Lightbox,
    private lightboxConfig:LightboxConfig,
    public dialog: MatDialog,
    private metaService:Meta,
    private loginService:LoginService,
    private chatService:ChatService,
    private router:Router
  ) { 
    this.lightboxConfig.disableScrolling = true;
    this.lightboxConfig.showImageNumberLabel = true;
    this.lightboxConfig.wrapAround = true;
    this.lightboxConfig.showZoom = true;
    this.lightboxConfig.alwaysShowNavOnTouchDevices = true;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vendorId = params.get('vendorId');      
    });
    this.getGalleryImages();
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res=>{  
      this.hasLoggedIn = res;    
    });
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().subscribe(res =>{
      if(res){
        this.getProvider();
        this.getOfferedServices();
      }
   });
   this.getProvider();
   this.getOfferedServices();
  }
  ngOnDestroy():void{
    this.getLoginSetStatus.unsubscribe();
    this.getLocationSetStatus.unsubscribe();
  }
  setServiceAd(){
    if(localStorage.getItem("loc")){
      let paramData={};
      paramData["categoryId"] = this.services[0].categoryId;
      paramData["district"] = localStorage.getItem("loc");
      this.providerService.getServiceAds(paramData).subscribe(res=>{
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
  getGalleryImages(){
    this.isGettingGalleryImages = true;
    this.providerService.getGalleryImages(this.vendorId).subscribe(res=>{
      this.isGettingGalleryImages = false;
      if(res["success"]){
        this.imageGallery = res["data"].map(image=>{
          let imageObject = {};
          imageObject["src"] = "https://mynestonline.com/collection/images/gallery/"+image;
          imageObject["thumb"] = "https://mynestonline.com/collection/images/gallery/"+image;
          return imageObject;
        });
        if(this.imageGallery.length<3){
          this.pushDefaultGalleryImages(3-this.imageGallery.length);
        }
      }else{
        this.pushDefaultGalleryImages(3);
      }
    },error=>{
      this.isGettingGalleryImages = false;
      this.showSnackbar("Error fetching gallery images",true,"close");
    })
  }
  getWishlistStatus(){
    if(localStorage.getItem("uid")){
    this.providerService.getWishlistStatus(localStorage.getItem("uid"),this.vendorId).subscribe(res=>{
        if(res["success"]){           
          this.provider["wishListed"] = true;              
        }else{
          this.provider["wishListed"] = false;  
        }
    },
    error=>{
      this.showSnackbar("No vendor details found for this ID",true,"close");
    });    
  }else{
    this.provider["wishListed"] = false;
  } 
}
toggleWishlist(event:any){
  event.stopPropagation();
  if(this.hasLoggedIn){
    this.showSnackbar("Please wait...",false,"");
    if(this.provider.wishListed){
      this.providerService.removeFromWishlist(this.provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
        if(res["success"]){
          this.provider.wishListed = false;
          this.showSnackbar(this.provider.companyName +" removed !",true,"close");
          this.providerService.hasWishlistedOrRemoved.next("data");
        }else{
          this.showSnackbar("Server error !",true,"close");
        }
      },
      error=>{
        this.showSnackbar("Connection error !",true,"close");
      });        
    }else{
      this.providerService.addToWishlist(this.provider.vendorId,localStorage.getItem("uid")).subscribe(res=>{
        if(res["success"]){
           this.provider.wishListed = true;
           this.showSnackbar(this.provider.companyName +" wishlisted !",true,"close");
           this.providerService.hasWishlistedOrRemoved.next("data");
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
  pushDefaultGalleryImages(index:number){
    for(var i = 0;i<index;i++){
      const image = {          
        src: "https://mynestonline.com/collection/images/gallery/default.jpg",
        thumb: "https://mynestonline.com/collection/images/gallery/default.jpg"         
      };
      this.imageGallery.push(image);
    }
  }
  getProvider(){
     this.providerService.getProviderById(this.vendorId).subscribe(res=>{
          if(res["success"]){
             this.provider = res["data"];
             this.updateMetaInformation();
             this.getWishlistStatus();
          }else{
            this.showSnackbar("No vendor details found for this ID",true,"close");
          }
     },
     error=>{
       this.showSnackbar("No vendor details found for this ID",true,"close");
     });     
  }
  getOfferedServices(){
    this.categoryService.getSubcategoryByVendorId(this.vendorId).subscribe(res=>{
      if(res["success"]){
         this.services = res["data"];
         this.setServiceAd();
      }else{
        this.showSnackbar("No services found for this vendor",true,"close");
      }
    },
    error=>{
      this.showSnackbar("No services found for this vendor",true,"close");
    });
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

  updateMetaInformation(){
    this.metaService.updateTag({ name: 'title', content: "Mynest | "+this.provider.companyName });
    this.metaService.updateTag({ name: 'description', content: this.provider.about });
    this.metaService.updateTag({ property: 'og:url', content: "https://mynestonline.com/provider/"+this.provider.vendorId });
    this.metaService.updateTag({ property: 'og:title', content: "Mynest | "+this.provider.companyName });
    this.metaService.updateTag({ property: 'og:image', content: "https://mynestonline.com/collection/images/company-profile/"+this.getImagePath(this.provider.profilePic)});
    this.metaService.updateTag({ property: 'og:description', content: this.provider.about });

  }

  providerSingleOptions:OwlOptions = {
    loop: true,
    autoplay: true,
    rewind: true,
    nav: true,
    dots: false,
    items: 3,
    autoplayHoverPause: true,
    autoplayTimeout: 5500,
    autoplaySpeed: 2000,
    responsive: {
        0: { items: 1, },
        421: { items: 1, },
        768: { items: 3, }
    },
    navText: [ '<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>' ]         
  }
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/provider/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  checkBrochure(path:any){
    if((path)&&(path!="")){
      window.open(
        'https://mynestonline.com/collection/images/brochure/'+encodeURIComponent(path),
        '_blank'
      );
    }else{
      this.showSnackbar("No brochure uploaded by vendor",true,"close");
    }    
  }
  getDetailLink(url:any){
    if((url)&&(url!="")){
      if (!/^http[s]?:\/\//.test(url)) {
          url = 'https://'+url;
      }
      window.open(
        url,
        '_blank'
      );
    }else{
      this.showSnackbar("No details provided by vendor",true,"close");
    } 
  }
  reportVendor(){
    if(this.hasLoggedIn){
      const dialogRef = this.dialog.open(ReportVendorComponent,{
        data:{
          vendorId:this.vendorId
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.showSnackbar("Reported vendor successfully!",true,"close");
        }
      });
    }else{
      const dialogRef = this.dialog.open(LoginDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if(result=="signup"){
          const dialogRef = this.dialog.open(SignupComponent);
        }
      });
    }
  }

  goToChatroom(event:any){
    event.stopPropagation(); 
    if(this.hasLoggedIn){   
      let contactData = {
        lastMessage: "No messages yet",
        lastMessageSentBy: null,
        lastMessageTime: null,
        vendorId: this.provider.vendorId,
        vendorName: this.provider.companyName,
        profilePic: this.provider.logo    
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
  
  openGallery(index: number): void {
    this.lightbox.open(this.imageGallery, index, this.lightboxConfig);
  }
 
  close(): void {
    this.lightbox.close();
  }
  
}
