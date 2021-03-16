import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  public hasWishlistedOrRemoved = new BehaviorSubject<string>("data");

  constructor(private http:HttpClient) {}

  getProviders(params:any,pageNo:number,pageSize:number):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/category-vendors?pageNo="+pageNo+"&pageSize="+pageSize,params);
  }
  getProviderById(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/vendor-profile?vendorId="+vendorId,null);
  }
  addToWishlist(vendorId:string,customerId:string):Observable<any>{
     let params = {};
     params["wishId"] = null;
     params["vendorId"] = vendorId;
     params["customerId"] = customerId;
     params["createdDate"] = null;
     return this.http.post("https://mynestonline.com/collection/api/wishlist",params);
  }
  removeFromWishlist(vendorId:string,customerId:string):Observable<any>{
    return this.http.delete("https://mynestonline.com/collection/api/wishlist?customerId="+customerId+"&vendorId="+vendorId);
  }
  getWishlistedProviders(customerId:string,pageNo:number,pageSize:number){
    return this.http.post("https://mynestonline.com/collection/api/wishlist-total?customerId="+customerId+"&pageNo="+pageNo+"&pageSize="+pageSize,null);
  }
  getHasWishlistedOrRemovedSetStatus():Observable<string>{
    return this.hasWishlistedOrRemoved.asObservable();
  }
  getGalleryImages(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/gallery-images?vendorId="+vendorId,null);
  }
  getServiceAds(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/service-listing-ad",paramData);
  }
}
