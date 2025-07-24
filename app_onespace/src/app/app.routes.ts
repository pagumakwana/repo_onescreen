import { Routes } from '@angular/router';
import { AdminmodeulesComponent } from './adminmodeules/adminmodeules.component';
import { DashboardmoduleComponent } from './adminmodeules/dashboardmodule/dashboardmodule.component';
import { UsermoduleComponent } from './adminmodeules/usermodule/usermodule.component';
import { AuthmoduleComponent } from './authmodule/authmodule.component';
import { HomeModuleComponent } from './home-module/home-module.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: "full" },
    {
        path: 'auth',
        component: AuthmoduleComponent,
        title: 'Sing-in',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeModuleComponent,
                title: 'Home page',
            },]
    },
    {
        path: 'app',
        component: AdminmodeulesComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: "full" },
            {
                path: 'dashboard',
                component: DashboardmoduleComponent,
                title: 'Dashboard',
            },
            {
                path: 'manageuser',
                component: UsermoduleComponent,
                title: 'Manage User',
            }]
    },
];
