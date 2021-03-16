import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public hasLocation = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) {
    if(localStorage.getItem("locId")){
      this.hasLocation.next(true);
    }
  }
 
  getLocations():Observable<any>{
    return this.http.get("https://mynestonline.com/collection/api/locations").pipe(
      map(res => res['data'])
     );
  }
  getAllLocations(){
    return this.http.get("https://mynestonline.com/collection/api/locations");
  }

  getLocationSetStatus():Observable<boolean>{
    return this.hasLocation.asObservable();
  }



}
