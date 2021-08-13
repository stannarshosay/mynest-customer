import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(
    private http:HttpClient
  ) { }
  getHomeGalleryImagesByType(adType:string,isMobile:boolean){
    var url = "https://mynestonline.com/collection/api/admin-ad?adType="+adType;
    if(isMobile){
      url = url + "&platform=mobile";
    }
    return this.http.get(url);
  }
}
