import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-report-vendor',
  templateUrl: './report-vendor.component.html',
  styleUrls: ['./report-vendor.component.css']
})
export class ReportVendorComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  reason = new FormControl("",Validators.required);
  isReporting:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReportVendorComponent>,
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
  reportVendor(){
    if(this.reason.valid){
       this.isReporting = true;
       let paramData = {};
       paramData["reportedVendorId"] = this.data.vendorId;
       paramData["reportingCustomerId"] = localStorage.getItem("uid");
       paramData["reason"] = this.reason.value;
       this.customerService.reportVendor(paramData).subscribe(res=>{
          this.isReporting = false;
          if(res["success"]){
            this.dialogRef.close(true);
          }else{
            this.showSnackbar("Server error!",true,"close");
          }
       },error=>{  
        this.isReporting = false;       
        this.showSnackbar("Connection error!",true,"close");
       });
    }else{
      this.showSnackbar("Please specify a reason",true,"close");
    }
  }

}
