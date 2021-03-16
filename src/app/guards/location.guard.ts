import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationGuard implements CanActivate {
  constructor(private locationService:LocationService,
    private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let hasLocation:boolean = false; 
    this.locationService.getLocationSetStatus().subscribe(status => hasLocation = status);
    if(!hasLocation){
      this.router.navigate(['home']);
    }
    return hasLocation;
  }
  
}
