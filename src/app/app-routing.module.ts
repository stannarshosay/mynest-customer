import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { HomeComponent } from './components/home/home.component';
import { NewsfeedComponent } from './components/newsfeed/newsfeed.component';
import { NewsfeedsComponent } from './components/newsfeeds/newsfeeds.component';
import { FaqComponent } from './components/faq/faq.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PostRequirementComponent } from './components/post-requirement/post-requirement.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProviderComponent } from './components/provider/provider.component';
import { ProvidersListComponent } from './components/providers-list/providers-list.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { LocationGuard } from './guards/location.guard';
import { LoginGuard } from './guards/login.guard';
import { ProvidersListSubComponent } from './components/providers-list-sub/providers-list-sub.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'providers/:categoryName/:categoryId', component: ProvidersListComponent ,canActivate:[LocationGuard]},
  { path: 'providers/:categoryName/:categoryId/:subCategory', component: ProvidersListSubComponent ,canActivate:[LocationGuard]},
  { path: 'provider/:vendorId', component: ProviderComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'newsfeed/:newsId', component: NewsfeedComponent },
  { path: 'newsfeeds', component: NewsfeedsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'chatroom', component: ChatroomComponent,canActivate:[LoginGuard]},
  { path: 'notifications', component: NotificationsComponent,canActivate:[LoginGuard]},
  { path: 'post-requirement', component: PostRequirementComponent,canActivate:[LoginGuard] },
  { path: 'profile-settings', component: ProfileSettingsComponent,canActivate:[LoginGuard] },
  { path: 'wishlist', component: WishlistComponent ,canActivate:[LoginGuard]},
  { path: 'requirements', component: RequirementsComponent ,canActivate:[LoginGuard]},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
