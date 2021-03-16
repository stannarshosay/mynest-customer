import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  getHomeCategories():Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/categories").pipe(
      map(res => res['data'])
    );      
  }
  getAllCategories():Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/categories");
  }
  getSubcategoriesByCategoryId(id:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/sub-category?categoryId="+id,null);     
  }
  getSubcategoryByVendorId(vendorId:string){
    return this.http.post("https://mynestonline.com/collection/api/sub-category-vendor?vendorId="+vendorId,null);
  }
}
