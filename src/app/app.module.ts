import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

//Angular Material
import { AngularMaterialModule } from "../app/angular-modules/angular-material.module";
//BitChandise related page
import { BitchandiseLandingComponent } from './bitchandise-landing/bitchandise-landing.component';
import { LoginComponent } from './login/login.component';
import { NewNodeComponent } from './pages/nodes/new-node/new-node.component';
import { BlockchainViewComponent }  from './pages/blockchain-view/blockchain-view.component';
import { RegisterManufacturerComponent } from './pages/register-manufacturer/register-manufacturer.component';
import { NewManufacturerComponent } from './pages/register-manufacturer/new-manufacturer/new-manufacturer.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { UpdateItemComponent } from './pages/update-item/update-item.component';
import { TrackItemComponent } from './pages/track-item/track-item.component';
import { ViewAllCreatedItemsComponent } from './pages/view-all-created-items/view-all-created-items.component';

//Dylan Qr Code related imports
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    BitchandiseLandingComponent,
    LoginComponent,
    NewNodeComponent,
    BlockchainViewComponent,
    RegisterManufacturerComponent,
    NewManufacturerComponent,
    AddItemComponent,
    UpdateItemComponent,
    TrackItemComponent,
    ViewAllCreatedItemsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //Dylan's QRCode 
    ZXingScannerModule,
    NgxQRCodeModule,
    //Dylan's end
    RouterModule.forRoot(AppRoutes,{
    useHash: true,
    relativeLinkResolution: 'legacy',
}),
    AngularMaterialModule,
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
