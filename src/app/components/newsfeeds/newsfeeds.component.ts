import { Component, OnInit } from '@angular/core';
import { NewsfeedService } from 'src/app/services/newsfeed.service';

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
    if(description.length>110){
      return description.substring(0,110) +" ...";
    }
    return description;
 }
 getImagePath(image:any){
  if((image)&&(image!="")){
    return encodeURIComponent(image);
  }
  return encodeURIComponent("default.jpg");
}
}
