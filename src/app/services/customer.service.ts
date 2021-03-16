import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  public hasChangedProfile = new Subject<boolean>();
  constructor(
    private http:HttpClient
  ) { }
  getLogoChangeStatus():Observable<boolean>{
    return this.hasChangedProfile.asObservable();
  }
  postRequirement(fileFormData:any){
    return this.http.post("https://mynestonline.com/collection/api/custom-requirement",fileFormData);
  }
  getActiveRequirement(customerId:string){
    return this.http.post("https://mynestonline.com/collection/api/active-requirements?customerId="+customerId,null);
  }
  getClosedRequirements(customerId:string,pageNo:any,pageSize:any){
    return this.http.post("https://mynestonline.com/collection/api/get-closed-requirements?customerId="+customerId+"&pageNo="+pageNo+"&pageSize="+pageSize,null);
  }
  closeRequirement(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/close-requirement",paramData);
  }
  reportVendor(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/report-vendor",paramData);
  }
  getQuotesByRequirementId(requirementId:string){
    return this.http.post("https://mynestonline.com/collection/api/get-all-quotes?requirementId="+requirementId,null);
  }
  changePassword(paramData:any){
    return this.http.post("https://mynestonline.com/collection/api/change-pass",paramData);
  }
  getDetailsByCustomerId(customerId:string){
    return this.http.get("https://mynestonline.com/collection/api/customer-detail?customerId="+customerId);
  }
  uploadProfilePic(fileFormData:any,customerId:string){
    return this.http.post("https://mynestonline.com/collection/api/customer/add-profile-pic?customerId="+customerId,fileFormData,{
      reportProgress: true,
      observe: 'events'
    });
  }
}
