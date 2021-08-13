import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  customerData:any;

  isGettingProfileDetails:boolean = false;
  isChanging:boolean = false;
  isUploading:boolean = false;
  changePasswordForm: FormGroup;

  profileProgress:number = 0;
  profilePreview = [];
  profileFile:File=null;
  getLoginSetStatus:Subscription;

  constructor(
    private customerService:CustomerService,
    private loginService:LoginService,
    private router:Router,
    private snackBar:MatSnackBar,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
    this.changePasswordForm = this.fb.group({
      password: ['', Validators.required],
      repassword:['',Validators.required]
    });
    this.getCustomerDetails();  
  }
  ngOnDestroy():void{
    this.getLoginSetStatus.unsubscribe();
  }
  getCustomerDetails(){
    this.isGettingProfileDetails = true;
    this.customerService.getDetailsByCustomerId(localStorage.getItem("uid")).subscribe(res=>{
      this.isGettingProfileDetails = false;
      if(res["success"]){
        this.customerData = res["data"];
        if((res["data"]["profilePic"])&&(res["data"]["profilePic"]!="")){
          this.profilePreview.push("https://mynestonline.com/collection/images/customer-profile/"+encodeURIComponent(res["data"]["profilePic"]));
        }
      }else{
        this.showSnackbar("Customer detail error!",true,"close");
      }
    },error=>{
      this.isGettingProfileDetails = false;
      this.showSnackbar("Connection error!",true,"close");
    });
  }
 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  } 
  changePassword(){
    if(this.changePasswordForm.valid){
      if(this.changePasswordForm.get("password").value==this.changePasswordForm.get("repassword").value){
        this.showSnackbar("Changing password...",false,"");
        this.isChanging = true;
        let formData = {};
        formData["newPassword"]=this.changePasswordForm.get("password").value;
        formData["userId"]=localStorage.getItem("uid");
        this.customerService.changePassword(formData).subscribe(res=>{
          this.isChanging = false;
          if(res["success"]){
            this.changePasswordForm.reset();
            this.showSnackbar("Password changed successfully!",true,"close");
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isChanging = false;
          this.showSnackbar("Connection error!",true,"close");
        });
      }else{
        this.showSnackbar("Password don't match!",true,"okay");
      }      
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }     
  }
  
  onProfileSelect(event:any){
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>500)&&(i==1))||(i==3)||(i==2)){
      this.showSnackbar("File size is larger than 500 KB",true,"okay");
    }else{
      this.profileFile = event.target.files[0];
      if(this.profileFile){  
        this.uploadProfilePic(event);
      }
    }
  }  
  uploadProfilePic(fileEvent:any){
    this.isUploading =true;
    this.showSnackbar("Please be patient! uploading profile pic...",true,"okay");
    const uploadData = new FormData();
    uploadData.append('profilePic', this.profileFile);
    this.customerService.uploadProfilePic(uploadData,localStorage.getItem("uid")).subscribe(
    (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.profilePreview = [];
          this.profileProgress = 1;
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.profileProgress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.isUploading = false;
          if(event.body["success"]){
            this.showSnackbar("Uploaded profile pic",true,"close");           
            this.customerService.hasChangedProfile.next(true); 
            this.profileFile = null;
            var reader = new FileReader();   
            reader.onload = (event:any) => {
              this.profilePreview.push(event.target.result);  
            } 
            reader.readAsDataURL(fileEvent.target.files[0]);
          }else{
            this.showSnackbar("Server error",true,"close");
          }
          setTimeout(() => {
            this.profileProgress = 0;
          }, 1500);
          break;
        default:
          this.profileProgress = 0;
          return `Unhandled event: ${event.type}`;
      }
    },error=>{
        this.profileProgress = 0;
        this.isUploading = false;
        this.showSnackbar("Connection Error!",true,"close");
    }); 
}

}
