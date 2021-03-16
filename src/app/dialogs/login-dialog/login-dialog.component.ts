import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { ProvidersService } from 'src/app/services/providers.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  isLogging:boolean = true;
  username = new FormControl("",Validators.required);
  password = new FormControl("",Validators.required);

  constructor(
    private snackBar: MatSnackBar,
    private loginService:LoginService,
    private providerService:ProvidersService,
    private chatService:ChatService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
  }

  login(){
    this.isLogging = false;
    if(this.username.valid&&this.password.valid){
      this.loginService.login(this.username.value,this.password.value).subscribe(res =>{
        this.isLogging = true;
        if(res["success"]){
          localStorage.setItem("uid",res["data"]["id"]);
          localStorage.setItem("username",res["data"]["username"]);
          localStorage.setItem("email",res["data"]["email"]);
          this.loginService.hasLoggedIn.next(true);
          this.providerService.hasWishlistedOrRemoved.next("data");
          this.chatService.hasRecievedMessage.next("no");
          this.chatService.hasRecievedNotification.next("no");
          this.dialogRef.close();
          this.showSnackbar(res["message"]);
        }else{
          this.showSnackbar("Oops! "+res["message"]);
        }
      },
      error=>{
        this.isLogging = true;
        this.showSnackbar("Oops! "+error["error"]["message"]);
      });
    }else{
      this.isLogging = true;
      this.showSnackbar("Oops! no credentials entered");
    }
  }

  showSnackbar(content:string){
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.panelClass = ['snackbar-styler'];
    this.snackBar.open(content, "close", config);
  }
  signup(){
    this.dialogRef.close("signup");    
  }
  forgotPassword(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ForgotPasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log("forgot password closed");
    });
  }
}
