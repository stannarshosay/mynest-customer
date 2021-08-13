import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { LocationSelectorComponent } from 'src/app/dialogs/location-selector/location-selector.component';
import { AdvertisementService } from 'src/app/services/advertisement.service';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isGettingHomeTopImages:boolean = true;
  isGettingHomeBottomImages:boolean = true;
  showTopImages:boolean = true;
  showBottomImages:boolean = true;
  topAds:any[] = [];
  bottomAds:any[] = [];
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  homeCategories=[];
  homeNewsfeeds = [];
  isNewsfeedLoaded:boolean = false;
  isNewsfeedAvailable:boolean = true;
  isCategoryLoaded:boolean = false;
  hasLocation:boolean = false;
  getLocationSetStatus:Subscription;
  constructor(
    private categoryService:CategoryService,
    private locationService:LocationService,
    private newsfeedService:NewsfeedService,
    private adService:AdvertisementService,
    private router:Router,
    public dialog: MatDialog,
    private deviceService:DeviceDetectorService 
    ) {
    this.categoryService.getHomeCategories().subscribe(res => {this.isCategoryLoaded = true,this.homeCategories = res.slice(0,10)});
    this.newsfeedService.getNewsfeeds(0,9).subscribe(res=>{
      this.isNewsfeedLoaded = true;
      if(res["success"]){
        this.homeNewsfeeds = res["data"]["content"];
      }else{
        this.isNewsfeedAvailable = false;
      }
    },
    error =>{
      this.isNewsfeedLoaded = true;
      this.isNewsfeedAvailable = false;
    });
  }

  ngOnInit(): void {
    this.getLocationSetStatus = this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res
    }); 
    if(this.deviceService.isMobile()||this.deviceService.isTablet()){
      this.getHomeAds("HOME_BANNER",true,true);
      this.getHomeAds("HOME_BANNER_BOTTOM",false,true);
    }else{
      this.getHomeAds("HOME_BANNER",true,false);
      this.getHomeAds("HOME_BANNER_BOTTOM",false,false);
    }   
  }
  ngOnDestroy():void{
    this.getLocationSetStatus.unsubscribe();
  }
  mainBannerOptions: OwlOptions = {
    autoplay:true,
    autoplaySpeed:1000,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    items: 1,
    stagePadding: 0,
    dots: true,
    margin:0,
    navSpeed: 700,
    navText: ['Previous', 'Next'],
    // responsive: {
    //   0: {
    //     items: 1 
    //   },
    //   400: {
    //     items: 2
    //   },
    //   740: {
    //     items: 3
    //   },
    //   940: {
    //     items: 4
    //   }
    // },
    nav: false           
  }
  newsFeedsOptions: OwlOptions = {
    autoplay:false,
    autoplaySpeed:3000,
    loop: false,
    rewind:true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    items: 3,
    dots: true,
    navSpeed: 700,
    navText: [ '<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>' ],
    nav: true,
    responsive: {
      0: {
        items: 1,
        nav:false
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },          
  }
  // serviceProviderOptions: OwlOptions = {
  //   loop: true,
  //   autoplay: true,
  //   mouseDrag: false,
  //   nav: true,
  //   dots: false,
  //   items:6,
  //   margin: 30,
  //   autoplayTimeout: 55000,
  //   autoplaySpeed: 1000,
  //   responsive: {
  //       0: {
  //           items: 1,
  //           nav: false
  //       },
  //       721: {
  //           items: 3,
  //       },
  //       991: {
  //           items: 4,
  //       },
  //       1200: {
  //           items: 5,
  //       },
  //       1440: {
  //           items: 6,
  //       },
  //       1750: {
  //           items: 6
  //       }
  //   },
  //   navText: [ '<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>' ]
  // }
  getHomeAds(adType:string,isTop:boolean,isMobile:boolean){     
    this.adService.getHomeGalleryImagesByType(adType,isMobile).subscribe(res=>{
      if(isTop){
        this.isGettingHomeTopImages = false;
      }else{
        this.isGettingHomeBottomImages = false;
      }
      if(res["success"]){
        if(isTop){
          this.topAds = res["data"];
        }else{
          this.bottomAds = res["data"];
        }
      }else{
        if(isTop){
          this.showTopImages = false;
        }else{
          this.showBottomImages =false;
        }
      }
    },error=>{
      if(isTop){
        this.isGettingHomeTopImages = false;
      }else{
        this.isGettingHomeBottomImages = false;
      }
    })
  }
  getAdLink(adLink:any){
    if((adLink)&&(adLink!="")){
      if (!/^http[s]?:\/\//.test(adLink)) {
          adLink = 'https://'+adLink;
      }
      window.open(
        adLink,
        '_blank'
      );
    }
  }
  goToVendorListing(category:any){
      if(this.hasLocation){
        this.router.navigate(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId]);
      }else{
        const dialogRef = this.dialog.open(LocationSelectorComponent);

        dialogRef.afterClosed().subscribe(result => {
          console.log('location dialog closed');
        });
      }
  }
  checkLength(description:string){    
     if(description.length>95){
       return description.substring(0,95) +" ...";
     }
     return description;
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
  getShareLink(id:any){    
    return encodeURIComponent("https://mynestonline.com/customer/newsfeed/"+id);
  }
  getEncoded(data:any){
    return encodeURIComponent(data);
  }
  getBeautifiedDate(dateString:string){
    let date = moment(dateString, "DD/MM/YYYY");
    if(date.isSame(moment(),'day')){
      return "Today";
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday";
    }
    return date.format('Do MMM YYYY');
  }
}
