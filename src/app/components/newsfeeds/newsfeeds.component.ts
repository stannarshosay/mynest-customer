import { Component, OnInit } from '@angular/core';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';

@Component({
  selector: 'app-newsfeeds',
  templateUrl: './newsfeeds.component.html',
  styleUrls: ['./newsfeeds.component.css']
})
export class NewsfeedsComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  config:any = {};
  newsfeeds:any[] = [];
  isNewsfeedsDataSuccess = true;
  isNewsfeedsLoaded = false;
  constructor(
    private newsfeedService:NewsfeedService
  ) { }

  ngOnInit(): void {
    this.getNewsfeeds(0,6);
  }
  pageChange(newPage: number){
    this.getNewsfeeds(newPage-1,6);
  } 
  getNewsfeeds(pageNo:any,pageSize:any){
    this.newsfeeds = [];
    this.config["totalItems"] = 0;
    this.isNewsfeedsDataSuccess = true;
    this.isNewsfeedsLoaded = false;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;    
    this.newsfeedService.getNewsfeeds(pageNo,pageSize).subscribe(res=>{
      this.isNewsfeedsLoaded = true;
      if(res["success"]){
        this.newsfeeds =res["data"]["content"];
        this.config["totalItems"] = res["data"]["totalElements"];
      }else{
        this.isNewsfeedsDataSuccess = false;
      }
    },
    error =>{
      this.isNewsfeedsLoaded = true;
      this.isNewsfeedsDataSuccess = false;
    });
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
