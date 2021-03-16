import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CloseRequirementComponent } from 'src/app/dialogs/close-requirement/close-requirement.component';
import { ViewQoutesComponent } from 'src/app/dialogs/view-qoutes/view-qoutes.component';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class RequirementsComponent implements OnInit {
  
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  selectedTab:number = 0;
  pageNo:number = 0;
  pageSize:number = 9;
  config:any = {};

  isGettingActiveRequirements:boolean = true;
  isGettingClosedrequirements:boolean = true;

  isGettingActiveRequirementsSuccess:boolean = true;
  isGettingClosedrequirementsSuccess:boolean = true;

  activeRequirements:any[] = [];
  closedRequirements:any[] = [];
  categories:any[] = [];

  getLoginSetStatus:Subscription;
  constructor(
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private router:Router,
    private customerService:CustomerService,
    private categoryService:CategoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
    this.getCategories();    
  }
  ngOnDestroy():void{
    this.getLoginSetStatus.unsubscribe();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getCategories(){
    this.categoryService.getAllCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getActiveRequirements();
        this.getClosedRequirements(0,this.pageSize);
      }
    },error=>{
      this.showSnackbar("Server error",true,"close");
    });
  }
  getActiveRequirements(){
    this.isGettingActiveRequirements = true;
    this.customerService.getActiveRequirement(localStorage.getItem("uid")).subscribe(res=>{
      this.isGettingActiveRequirements = false;
      if(res["success"]){
        this.activeRequirements = res["data"];
        this.activeRequirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });
      }else{
        this.isGettingActiveRequirementsSuccess = false;
      }
    },error=>{
      this.isGettingActiveRequirements = false;
      this.isGettingActiveRequirementsSuccess = false;
    });
  }
  getClosedRequirements(pageNo:number,pageSize:number){
    this.isGettingClosedrequirements = true;
    this.config["totalItems"] = 0;
    this.config["currentPage"] = pageNo+1;
    this.config["itemsPerPage"] = pageSize;
    this.customerService.getClosedRequirements(localStorage.getItem("uid"),this.pageNo,this.pageSize).subscribe(res=>{
      this.isGettingClosedrequirements = false;
      if(res["success"]){
        this.closedRequirements = res["data"]["content"];
        this.closedRequirements.map(obj=>{
          let categoryName = this.categories.filter(category=>{
            return category.categoryId == obj.categoryId;
          })[0]["categoryName"];
          return obj.categoryId = categoryName;
        });   
        this.config["totalItems"] = res["data"]["totalElements"];     
      }else{
        this.isGettingClosedrequirementsSuccess = false;
      }
    },error=>{
      this.isGettingClosedrequirements = false;
      this.isGettingActiveRequirementsSuccess = false;
    });
  }
  closeRequirement(requirementId:string){
    const dialogRef = this.dialog.open(CloseRequirementComponent,{
      data:{
        requirementId:requirementId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //only required if status can be changed to active
        // if((this.closedRequirements.length==1)&&(this.pageNo!=0)){
        //   this.pageNo = this.pageNo-1;  
        // } 
        this.getActiveRequirements();
        this.getClosedRequirements(this.pageNo,this.pageSize);
        this.showSnackbar("Requirement closed successfully!",true,"close");
      }
    });
  } 
  viewAllQoutes(requirementId:string,event:any){
    event.stopPropagation();
    event.preventDefault();
    const dialogRef = this.dialog.open(ViewQoutesComponent,{
      data:{
        requirementId:requirementId
      }
    });    
  }
  pageChange(newPage: number){
    this.pageNo = newPage-1;
    this.getClosedRequirements(this.pageNo,this.pageSize);
  }
  getImagePath(image:any){
    if((image)&&(image!="")){
      return encodeURIComponent(image);
    }
    return encodeURIComponent("default.jpg");
  }
}
