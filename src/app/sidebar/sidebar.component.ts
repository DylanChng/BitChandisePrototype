import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    /*
    { path: '/dashboard',     title: 'Dashboard',               icon:'nc-bank',       class: '' },
    { path: '/icons',         title: 'Icons',                   icon:'nc-diamond',    class: '' },
    { path: '/maps',          title: 'Maps',                    icon:'nc-pin-3',      class: '' },
    { path: '/notifications', title: 'Notifications',           icon:'nc-bell-55',    class: '' },
    { path: '/user',          title: 'User Profile',            icon:'nc-single-02',  class: '' },
    { path: '/table',         title: 'Table List',              icon:'nc-tile-56',    class: '' },
    { path: '/typography',    title: 'Typography',              icon:'nc-caps-small', class: '' },
    */
    { path: '/nodes',         title: 'BitChandise Nodes',       icon:'nc-tv-2',       class: '' },
    { path: '/blockchain',    title: 'Blockchain',              icon:'nc-app',        class: '' },
    { path: '/register',      title: 'Manufacturers',           icon:'nc-single-02',  class: '' },
    //{ path: '/upgrade',       title: 'Upgrade to PRO',          icon:'nc-spaceship',  class: '' },
    { path: '/addItem',           title: 'Add Item',                  icon:'nc-simple-add', class: '' },
    { path: '/updateItem',        title: 'Update Item',               icon:'nc-refresh-69', class: '' },
    { path: '/viewCreatedItems',  title: 'View All Items',            icon:'nc-app',        class: '' },
    { path: '/tracking',             title: 'Track Item',                icon:'nc-globe-2',    class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {

    constructor(private authService:AuthService) {}
    user = this.authService.getCurrentUser();
    //adminPath = ["/nodes","/blockchain","register"];
    //manufacturerPath = ["/nodes","/blockchain","register"];

    public menuItems: any[];
    ngOnInit() {
        //this.menuItems = ROUTES.filter(menuItem => menuItem);
        if(this.user.userType == "admin"){
            this.menuItems = [
                { path: '/nodes',         title: 'BitChandise Nodes',       icon:'nc-tv-2',       class: '' },
                { path: '/blockchain',    title: 'Blockchain',              icon:'nc-app',        class: '' },
                { path: '/register',      title: 'Manufacturers',           icon:'nc-single-02',  class: '' },
            ]
        }else if(this.user.userType == "manufacturer"){
            this.menuItems = [
                { path: '/addItem',           title: 'Add Item',                  icon:'nc-simple-add', class: '' },
                { path: '/updateItem',        title: 'Update Item',               icon:'nc-refresh-69', class: '' },
                { path: '/viewCreatedItems',  title: 'View All Items',            icon:'nc-app',        class: '' },
              { path: '/tracking',             title: 'Track Item',                icon:'nc-globe-2',    class: '' },
            ]
        }
    }
}   
