import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public hasLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) {
    if(localStorage.getItem("uid")){
      this.hasLoggedIn.next(true);
    }
  }

  login(username:string,password:string):Observable<any>{
    let params = {};
    params["username"] = username;
    params["password"] = password;
    return this.http.post("https://mynestonline.com/collection/api/authenticate/customer",params);
  }

  getLoginSetStatus():Observable<boolean>{
    return this.hasLoggedIn.asObservable();
  }
  registerAsCustomer(requestData:any):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/register/customer",requestData);
  }
  forgotPasswordOfCustomer(email:string,role:string):Observable<any>{
    return this.http.post("https://mynestonline.com/collection/api/forgot-pass?role="+role+"&email="+email,null);
  }
  
}
