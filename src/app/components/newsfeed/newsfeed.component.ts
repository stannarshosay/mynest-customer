import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import moment from 'moment';
@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  newsId:string = "";
  news:any = "";
  isNewsfeedDataSuccess = true;
  isNewsfeedLoaded = false;
  constructor(
    private route:ActivatedRoute,
    private newsfeedService:NewsfeedService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.newsId = params.get('newsId'),
      this.getNewsfeedById()
    });
  }

  getNewsfeedById(){
    this.newsfeedService.getNewsfeedById(this.newsId).subscribe(res=>{
      this.isNewsfeedLoaded = true;
      if(res["success"]){
        this.news =res["data"];
      }else{
        this.isNewsfeedDataSuccess = false;
      }
    },
    error =>{
      this.isNewsfeedLoaded = true;
      this.isNewsfeedDataSuccess = false;
    });
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
