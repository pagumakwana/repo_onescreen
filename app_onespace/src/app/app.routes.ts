import { Routes } from '@angular/router';
import { AdminmodeulesComponent } from './adminmodeules/adminmodeules.component';
import { DashboardmoduleComponent } from './adminmodeules/dashboardmodule/dashboardmodule.component';
import { UsermoduleComponent } from './adminmodeules/usermodule/usermodule.component';
import { AuthmoduleComponent } from './authmodule/authmodule.component';
import { HomeModuleComponent } from './home-module/home-module.component';
import { LayoutComponent } from './layout/layout.component';
import { CategorymoduleComponent } from './adminmodeules/categorymodule/categorymodule.component';
import { AddmodifycategoryComponent } from './adminmodeules/categorymodule/addmodifycategory/addmodifycategory.component';
import { ProductmoduleComponent } from './adminmodeules/productmodule/productmodule.component';
import { AddmodifyproductComponent } from './adminmodeules/productmodule/addmodifyproduct/addmodifyproduct.component';
import { BannermoduleComponent } from './adminmodeules/bannermodule/bannermodule.component';
import { AddmodifybannerComponent } from './adminmodeules/bannermodule/addmodifybanner/addmodifybanner.component';
import { WebdtableComponent } from './layout_template/webdtable/webdtable.component';

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
            },
            {
                path: 'managecategory',
                component: CategorymoduleComponent,
                title: 'Manage Category'
            },
            {
                path: 'managecategory/:category_id',
                component: AddmodifycategoryComponent,
                title: 'Manage User',
            },
            {
                path: 'manageproduct',
                component: ProductmoduleComponent,
                title: 'Manage Product',
                children: [
                    {
                        path: ':product_id',
                        component: AddmodifyproductComponent,
                    },
                ],
            },
            {
                path: 'managebanner',
                component: BannermoduleComponent,
                title: 'Manage Banner',
                children: [
                    {
                        path: ':banner_id',
                        component: AddmodifybannerComponent,
                    },
                ],
            }
        ]
    },
];
