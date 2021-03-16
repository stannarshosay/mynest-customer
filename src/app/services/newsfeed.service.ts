import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {
  constructor(private http:HttpClient) { }

  getNewsfeeds(pageNo:number,pageSize:number):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/newsfeeds?pageNo="+pageNo+"&pageSize="+pageSize);
  }
  getNewsfeedById(id:any):Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/newsfeed/"+id);
  }
}
