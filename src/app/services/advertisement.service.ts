import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {

  constructor(
    private http:HttpClient
  ) { }
  getHomeGalleryImagesByType(adType:string){
    return this.http.get("https://mynestonline.com/collection/api/admin-ad?adType="+adType);
  }
}
