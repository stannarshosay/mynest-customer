//flexlayout module
import { FlexLayoutModule } from '@angular/flex-layout';

//Material modules
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';

//common

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { ProvidersListComponent } from './components/providers-list/providers-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProviderComponent } from './components/provider/provider.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { LocationSelectorComponent } from './dialogs/location-selector/location-selector.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoginDialogComponent } from './dialogs/login-dialog/login-dialog.component';
import { NewsfeedComponent } from './components/newsfeed/newsfeed.component';
import { NewsfeedsComponent } from './components/newsfeeds/newsfeeds.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PostRequirementComponent } from './components/post-requirement/post-requirement.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { CloseRequirementComponent } from './dialogs/close-requirement/close-requirement.component'; 
import { LightboxModule } from 'ngx-lightbox';
import { ReportVendorComponent } from './dialogs/report-vendor/report-vendor.component';
import { ViewQoutesComponent } from './dialogs/view-qoutes/view-qoutes.component';
import { SignupComponent } from './dialogs/signup/signup.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { LoginOtpComponent } from './dialogs/login-otp/login-otp.component';
import { FaqComponent } from './components/faq/faq.component';
import { ProvidersListSubComponent } from './components/providers-list-sub/providers-list-sub.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProvidersListComponent,
    ProviderComponent,
    CategoriesComponent,
    LocationSelectorComponent,
    LoginDialogComponent,
    NewsfeedComponent,
    NewsfeedsComponent,
    WishlistComponent,
    PostRequirementComponent,
    RequirementsComponent,
    CloseRequirementComponent,
    ReportVendorComponent,
    ViewQoutesComponent,
    SignupComponent,
    ChatroomComponent,
    NotificationsComponent,
    ProfileSettingsComponent,
    ForgotPasswordComponent,
    LoginOtpComponent,
    FaqComponent,
    ProvidersListSubComponent     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    LightboxModule,
    FlexLayoutModule,
    MatRippleModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    MatStepperModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
