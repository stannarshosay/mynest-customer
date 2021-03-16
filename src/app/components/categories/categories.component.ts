import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocationSelectorComponent } from 'src/app/dialogs/location-selector/location-selector.component';
import { CategoryService } from 'src/app/services/category.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  homeCategories=[];
  isCategoryLoaded:boolean = false;
  hasLocation:boolean = false;

  constructor(private categoryService:CategoryService,private locationService:LocationService,private router:Router,public dialog: MatDialog) {
    this.categoryService.getHomeCategories().subscribe(res => {this.isCategoryLoaded = true,this.homeCategories = res});
  }

  ngOnInit(): void {
    this.locationService.getLocationSetStatus().subscribe(res =>{
      this.hasLocation = res
    }); 
  }

  goToVendorListing(category:any){
    if(this.hasLocation){
      this.router.navigate(['providers/'+encodeURIComponent(category.categoryName)+"/"+category.categoryId]);
    }else{
      const dialogRef = this.dialog.open(LocationSelectorComponent);

      dialogRef.afterClosed().subscribe(result => {
        console.log('location dialog closed');
      });
    }
}

}
