import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('terms') terms:ElementRef;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  showSpinner:boolean = false;
  isSubmitted:boolean = false;
  signupForm = this.fb.group({
    username:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
    password:['',Validators.required],
    rePassword:['',Validators.required]
  });

  constructor(
    private loginService:LoginService,
    private chatService:ChatService,
    private providerService:ProvidersService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    public dialogRef: MatDialogRef<SignupComponent>,
    private dialog:MatDialog
  ) {

   }

  onSubmit(termsStatus:any){
    this.isSubmitted = true;
      if(this.signupForm.valid){
        if(this.signupForm.get("password").value==this.signupForm.get("rePassword").value){
          if(termsStatus){
              let requestData = this.signupForm.value;
              delete requestData["rePassword"];
              this.register(requestData);
          }else{
            this.showSnackbar("Please agree to terms and conditions",true,"okay");
          }        
        }else{
          this.showSnackbar("Passwords don't match",true,"okay");
        }      
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }
  register(data:any){
    this.showSpinner = true;
    this.loginService.registerAsCustomer(data).subscribe(res=>{
      this.showSpinner = false;
       if(res["success"]){
         localStorage.setItem("uid",res["data"]["id"]);
         localStorage.setItem("username",res["data"]["username"]);
         localStorage.setItem("email",this.signupForm.get("email").value);
         this.loginService.hasLoggedIn.next(true);
         this.providerService.hasWishlistedOrRemoved.next("data");
         this.chatService.hasRecievedMessage.next("no");
         this.chatService.hasRecievedNotification.next("no");
         this.showSnackbar("Successfully registered",true,"close");
         this.dialogRef.close();
       }else{
         this.showSnackbar(res["message"],true,"close");
       }
    },error=>{
      this.showSpinner = false;
      this.showSnackbar("Internal Server error",true,"close");
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
    
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void{
  }

  login(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(LoginDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result=="signup"){
        const dialogRef = this.dialog.open(SignupComponent);
      }
    });
  }

}
