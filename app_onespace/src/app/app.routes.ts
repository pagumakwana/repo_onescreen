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
import { AddmodifyuserComponent } from './adminmodeules/usermodule/addmodifyuser/addmodifyuser.component';
import { AddmodifylabelComponent } from './adminmodeules/labelmodule/addmodifylabel/addmodifylabel.component';
import { LabelmoduleComponent } from './adminmodeules/labelmodule/labelmodule.component';
import { TypemastermoduleComponent } from './adminmodeules/typemastermodule/typemastermodule.component';
import { AddmodifytypemasterComponent } from './adminmodeules/typemastermodule/addmodifytypemaster/addmodifytypemaster.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { CartComponent } from './cart/cart.component';
import { AddmodifyauthorityComponent } from './adminmodeules/authoritymodule/addmodifyauthority/addmodifyauthority.component';
import { AuthoritymoduleComponent } from './adminmodeules/authoritymodule/authoritymodule.component';
import { ProfilemoduleComponent } from './adminmodeules/profilemodule/profilemodule.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from './authmodule/_authservice/auth.guard';
import { ProductoptionvaluesComponent } from './adminmodeules/productoptionvalues/productoptionvalues.component';
import { AddmodifyvaluesComponent } from './adminmodeules/productoptionvalues/addmodifyvalues/addmodifyvalues.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: "full" },
    {
        path: 'auth',
        component: AuthmoduleComponent,
        title: 'Sign-in',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeModuleComponent,
                title: 'Home page',
            },
            {
                path: 'contactus',
                component: ContactusComponent,
                title: 'Contact Us',
            },
            {
                path: 'faqs',
                component: FaqsComponent,
                title: 'About Us',
            },
            {
                path: 'aboutus',
                component: AboutusComponent,
                title: 'About Us',
            },
            {
                path: 'cart',
                component: CartComponent,
                title: 'Cart',
            },
            {
                path: 'product',
                component: ProductComponent,
                title: 'Product',
            }]
    },
    {
        path: 'app',
        canActivate: [AuthGuard],
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
                path: 'manageuser/:user_id',
                component: AddmodifyuserComponent,
                title: 'Add Modify User',
            },
            {
                path: 'managecategory',
                component: CategorymoduleComponent,
                title: 'Manage Category'
            },
            {
                path: 'managecategory/:category_id',
                component: AddmodifycategoryComponent,
                title: 'Add Modify Category',
            },
            {
                path: 'manageproduct',
                component: ProductmoduleComponent,
                title: 'Manage Product'
            },
            {
                path: 'manageproduct/:product_id',
                component: AddmodifyproductComponent,
                title: 'Add Modify Product',
            },
            {
                path: 'managebanner',
                component: BannermoduleComponent,
                title: 'Manage Banner',
            },
            {
                path: 'managebanner/:banner_id',
                component: AddmodifybannerComponent,
                title: 'Add Modify Banner',
            },
            {
                path: 'managelabel',
                component: LabelmoduleComponent,
                title: 'Manage Label',
            },
            {
                path: 'managelabel/:label_id',
                component: AddmodifylabelComponent,
                title: 'Add Modify Label',
            },
            {
                path: 'managetypemaster',
                component: TypemastermoduleComponent,
                title: 'Manage Typemaster',
            },
            {
                path: 'managetypemaster/:typemaster_id',
                component: AddmodifytypemasterComponent,
                title: 'Add Modify Typemaster',
            },
            {
                path: 'manageauthority',
                component: AuthoritymoduleComponent,
                title: 'Manage Authority',
            },
            {
                path: 'manageauthority/:authority_id',
                component: AddmodifyauthorityComponent,
                title: 'Add Modify Authority',
            },
            {
                path: 'profile',
                component: ProfilemoduleComponent,
                title: 'Profile',
            },
            {
                path: 'managevalues',
                component: ProductoptionvaluesComponent,
                title: 'Manage Optionvalues',
            },
            {
                path: 'managevalues/:option_value_id',
                component: AddmodifyvaluesComponent,
                title: 'Add Modify Optionvalues',
            },
        ]
    },
];
