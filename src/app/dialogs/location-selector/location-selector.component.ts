import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent implements OnInit {
  color:string = "rgba(255,255,255,0.2)";
  darkColor:string = "rgba(0,0,0,0.1)";
  locationList = [];
  isLoaded:boolean = false;
  constructor(public dialogRef: MatDialogRef<LocationSelectorComponent>,private locationService:LocationService) { }

  ngOnInit(): void {
    this.locationService.getLocations().subscribe(res => {
      this.locationList = res,
      this.isLoaded = true;
    });
  }

  saveLocation(location:any){
    localStorage.setItem("locId",location.locationId);
    localStorage.setItem("loc",location.district);
    this.locationService.hasLocation.next(true);
    this.dialogRef.close();
  }

}
