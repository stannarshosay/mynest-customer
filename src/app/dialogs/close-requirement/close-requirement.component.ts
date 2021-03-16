import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-close-requirement',
  templateUrl: './close-requirement.component.html',
  styleUrls: ['./close-requirement.component.css']
})
export class CloseRequirementComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("",Validators.required);
  isClosing:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CloseRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar,
    private customerService:CustomerService
  ) { }

  ngOnInit(): void {
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  closeRequirement(){
    if(this.reason.valid){
       this.isClosing = true;
       let paramData = {};
       paramData["requirementId"] = this.data.requirementId;
       paramData["closingNote"] = this.reason.value;
       this.customerService.closeRequirement(paramData).subscribe(res=>{
          this.isClosing = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isClosing = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
  }

}
