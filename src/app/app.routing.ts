import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BitchandiseLandingComponent } from "./bitchandise-landing/bitchandise-landing.component";
import { TableComponent } from "../app/pages/table/table.component";

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
  {
    path: 'landing',
    component: BitchandiseLandingComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
]
