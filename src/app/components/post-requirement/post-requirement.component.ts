import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-post-requirement',
  templateUrl: './post-requirement.component.html',
  styleUrls: ['./post-requirement.component.css']
})
export class PostRequirementComponent implements OnInit {
  @ViewChild('formDirective') private formDirective: NgForm;  
  @ViewChild('contactCheckbox') private contactCheckbox:ElementRef;
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";

  getLoginSetStatus:Subscription;
  isPosting:boolean = false;
  isGettingCategoryAndLocations:boolean = true;
  isGettingSubcategories:boolean = true;
  showContact:boolean = false;

  imagePreview = [];
  imageFile:File=null;

  categories:any = [];
  subCategories:any = [];
  locations:any = [];

  postRequirementForm: FormGroup;
  
  constructor(
    private snackBar:MatSnackBar,
    private loginService:LoginService,
    private router:Router,
    private fb:FormBuilder,
    private categoryService:CategoryService,
    private locationService:LocationService,
    private customerService:CustomerService
  ) { }

  ngOnInit(): void {
    this.postRequirementForm = this.fb.group({
      categoryId:['',Validators.required],
      subCategoryId:[''],
      locations:['',Validators.required],
      description:['',Validators.required],
      contact:[null]
    });
    this.getLoginSetStatus = this.loginService.getLoginSetStatus().subscribe(res =>{      
      if(!res){
        this.router.navigate(["home"]);
      }
    });
    this.getAllCategories();
    this.postRequirementForm.get("subCategoryId").disable();
    this.postRequirementForm.get("categoryId").valueChanges.subscribe(res=>{
      if(res){
        this.getSubcategories(res);
      }
    });
  }
  ngOnDestroy():void{
    this.getLoginSetStatus.unsubscribe();
  }
  getSubcategories(categoryId:any){
    this.subCategories = [];
    this.isGettingSubcategories = true;
    this.postRequirementForm.get("subCategoryId").disable();
    this.showSnackbar("Fetching subcategories!",true,"close");
    this.categoryService.getSubcategoriesByCategoryId(categoryId).subscribe(res=>{
       if(res["success"]){
          this.showSnackbar("Subcategories loaded!",true,"close");
          this.postRequirementForm.get("subCategoryId").enable();
          this.isGettingSubcategories = false;
          this.subCategories = res["data"];
       }else{
        this.showSnackbar("Unable to fetch subcategories!",true,"close");
       }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");
      console.log(error);
    });
  }
  getAllCategories(){
    this.categoryService.getAllCategories().subscribe(res=>{
      if(res["success"]){
        this.categories = res["data"];
        this.getAllLocations();
      }else{
        this.isGettingCategoryAndLocations = false;
        this.showSnackbar("Error fetching categories!",true,"close");
      }
    },error=>{
      this.isGettingCategoryAndLocations = false;
      this.showSnackbar("Error fetching categories!",true,"close");
    });    
  }
  getAllLocations(){
    this.locationService.getAllLocations().subscribe(res=>{
      this.isGettingCategoryAndLocations =false;
      if(res["success"]){
        this.locations = res["data"];
      }else{
        this.showSnackbar("Error fetching locations!",true,"close");
      }
    },error=>{
      this.isGettingCategoryAndLocations = false;
      this.showSnackbar("Error fetching locations!",true,"close");
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
  onImageSelect(event:any,fileInput:any){
    this.imagePreview = [];
    this.imageFile = event.target.files[0];  
    var reader = new FileReader();   
    reader.onload = (event:any) => {
      this.imagePreview.push(event.target.result);  
    } 
    reader.readAsDataURL(event.target.files[0]);
  }
  postRequirement(){
    if(!this.isGettingSubcategories){
     if(this.postRequirementForm.valid){
        this.isPosting = true;
        this.showSnackbar("Posting requirement...",false,"");
        let formData = {};
        formData = this.postRequirementForm.value;
        formData["customerId"] = localStorage.getItem("uid");
        if(formData["subCategoryId"]){
          formData["subCategoryName"] = this.subCategories.find(obj=>obj.subCategoryId == formData["subCategoryId"])["subCategoryName"];
        }else{
          delete formData["subCategoryId"];
        }
        const uploadData = new FormData();
        uploadData.append('requirementDTO',new Blob([JSON.stringify(formData)], { type: "application/json"}));
        if(this.imageFile){
          uploadData.append('file', this.imageFile);
        }
        this.customerService.postRequirement(uploadData,).subscribe(res=>{
          this.isPosting = false;
          if(res["success"]){
            this.showSnackbar("Requirement posted successfully!",true,"close");
            this.imagePreview = [];
            this.imageFile = null;
            this.postRequirementForm.get("subCategoryId").disable();            
            this.showContact = false;
            this.contactCheckbox.nativeElement.checked = false;
            this.formDirective.resetForm(); 
          }else{ 
            this.showSnackbar("Server error!",true,"close");
          }
        },error=>{
          this.isPosting = false;
          this.showSnackbar("Connection Error!",true,"close");
        }); 
     }else{
      this.showSnackbar("Please fill all required fields!",true,"close");
     }
    }else{
      this.showSnackbar("Please wait for subcategories to load!",true,"close");
    }
  }
  toggleShowContact(event:any){
    this.postRequirementForm.get("contact").setValue(null);
    this.showContact = event.target.checked;
  }
}
