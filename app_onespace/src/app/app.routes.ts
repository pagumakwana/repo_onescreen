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
import { AddmodifyoptionComponent } from './adminmodeules/productoptionvalues/addmodifyoption/addmodifyoption.component';
import { UserregistrationComponent } from './userregistration/userregistration.component';
import { VendormoduleComponent } from './adminmodeules/vendormodule/vendormodule.component';
import { AddmodifyvendorComponent } from './adminmodeules/vendormodule/addmodifyvendor/addmodifyvendor.component';
import { SignupmoduleComponent } from './authmodule/signupmodule/signupmodule.component';
import { ManageordersComponent } from './adminmodeules/manageorders/manageorders.component';
import { OrdermoduleComponent } from './adminmodeules/ordermodule/ordermodule.component';
import { ThankyoumoduleComponent } from './thankyoumodule/thankyoumodule.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { WallettransactionComponent } from './adminmodeules/wallettransaction/wallettransaction.component';
import { ControlmoduleComponent } from './adminmodeules/controlmodule/controlmodule.component';
import { ManagecontrolComponent } from './adminmodeules/controlmodule/managecontrol/managecontrol.component';
import { FourzerofourComponent } from './fourzerofour/fourzerofour.component';
import { NoconnectionComponent } from './noconnection/noconnection.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DisputeAndCancellationPolicyComponent } from './dispute-and-cancellation-policy/dispute-and-cancellation-policy.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { ScreenbookingComponent } from './adminmodeules/screenbooking/screenbooking.component';
import { OrderPolicyComponent } from './order-policy/order-policy.component';
import { CancellationAndRefundComponent } from './cancellation-and-refund/cancellation-and-refund.component';
import { PrimedatetimemoduleComponent } from './adminmodeules/primedatetimemodule/primedatetimemodule.component';
import { ContactusmoduleComponent } from './adminmodeules/contactusmodule/contactusmodule.component';
import { PortalconfigComponent } from './adminmodeules/portalconfig/portalconfig.component';
import { PricingmoduleComponent } from './pricingmodule/pricingmodule.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: "full" },
    {
        path: 'auth',
        component: AuthmoduleComponent,
        title: 'Sign-in | Onescreen',
    },
    {
        path: 'signup',
        component: SignupmoduleComponent,
        title: 'Sign-up | Onescreen',
    },
    {
        path: 'noconnection',
        component: NoconnectionComponent,
        title: 'Internet connection | Onescreen',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeModuleComponent,
                title: 'Home page | Onescreen',
            },
            {
                path: 'contactus',
                component: ContactusComponent,
                title: 'Contact Us | Onescreen',
            },
            {
                path: 'faqs',
                component: FaqsComponent,
                title: 'About Us | Onescreen',
            },
            {
                path: 'aboutus',
                component: AboutusComponent,
                title: 'About Us | Onescreen',
            },
            {
                path: 'cart',
                component: CartComponent,
                title: 'Cart | Onescreen',
            },
            {
                path: 'cart/:batch_id',
                component: CartComponent,
                title: 'Cart | Onescreen',
            },
            {
                path: 'product',
                component: ProductComponent,
                title: 'Product | Onescreen',
            },
            {
                path: 'userregistration',
                component: UserregistrationComponent,
                title: 'User Registration | Onescreen',
            },
            {
                path: 'thankyou/:order_id',
                component: ThankyoumoduleComponent,
                title: 'Thanks You | Onescreen',
            },
            {
                path: 'privacy_policy',
                component: PrivacyPolicyComponent,
                title: 'Privacy Policy | Onescreen',
            },
            {
                path: 'shipping_policy',
                component: OrderPolicyComponent,
                title: 'Shipping Policy | Onescreen',
            },
            {
                path: 'dispute_and_cancellation_policy',
                component: DisputeAndCancellationPolicyComponent,
                title: 'Disput and Cancellation Policy | Onescreen',
            },
            {
                path: 'terms_and_condition',
                component: TermsAndConditionComponent,
                title: 'Terms and Conditions | Onescreen',
            },
            {
                path: 'cancelation_and_refund',
                component: CancellationAndRefundComponent,
                title: 'Cancelation and Refund | Onescreen',
            },
            {
                path: 'invoice/:order_id',
                component: InvoiceComponent,
                title: 'Thanks You | Onescreen',
            },
            {
                path: 'pricing',
                component: PricingmoduleComponent,
                title: 'Pricing | Onescreen',
            },
        ]
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
                title: 'Dashboard | Onescreen',
            },
            {
                path: 'manageuser',
                component: UsermoduleComponent,
                title: 'Manage User | Onescreen',
            },
            {
                path: 'manageuser/:user_id',
                component: AddmodifyuserComponent,
                title: 'Add Modify User | Onescreen',
            },
            {
                path: 'managecategory',
                component: CategorymoduleComponent,
                title: 'Manage Categor | Onescreeny'
            },
            {
                path: 'managecategory/:category_id',
                component: AddmodifycategoryComponent,
                title: 'Add Modify Category | Onescreen',
            },
            {
                path: 'manageproduct',
                component: ProductmoduleComponent,
                title: 'Manage Produc | Onescreent'
            },
            {
                path: 'manageproduct/:product_id',
                component: AddmodifyproductComponent,
                title: 'Add Modify Product | Onescreen',
            },
            {
                path: 'managebanner',
                component: BannermoduleComponent,
                title: 'Manage Banner | Onescreen',
            },
            {
                path: 'managebanner/:banner_id',
                component: AddmodifybannerComponent,
                title: 'Add Modify Banner | Onescreen',
            },
            {
                path: 'managelabel',
                component: LabelmoduleComponent,
                title: 'Manage Label | Onescreen',
            },
            {
                path: 'managelabel/:label_id',
                component: AddmodifylabelComponent,
                title: 'Add Modify Label | Onescreen',
            },
            {
                path: 'managetypemaster',
                component: TypemastermoduleComponent,
                title: 'Manage Typemaster | Onescreen',
            },
            {
                path: 'managetypemaster/:typemaster_id',
                component: AddmodifytypemasterComponent,
                title: 'Add Modify Typemaster | Onescreen',
            },
            {
                path: 'manageauthority',
                component: AuthoritymoduleComponent,
                title: 'Manage Authority | Onescreen',
            },
            {
                path: 'manageauthority/:authority_id',
                component: AddmodifyauthorityComponent,
                title: 'Add Modify Authority | Onescreen',
            },
            {
                path: 'profile',
                component: ProfilemoduleComponent,
                title: 'Profile | Onescreen',
            },
            {
                path: 'managevalues',
                component: ProductoptionvaluesComponent,
                title: 'Manage Optionvalues | Onescreen',
            },
            {
                path: 'managevalues/:option_value_id',
                component: AddmodifyvaluesComponent,
                title: 'Add Modify Optionvalues | Onescreen',
            },
            {
                path: 'manageoption',
                component: AddmodifyoptionComponent,
                title: 'Add Modify Optionvalues | Onescreen',
            },
            {
                path: 'manageoption/:option_id',
                component: AddmodifyoptionComponent,
                title: 'Add Modify Optionvalues | Onescreen',
            },
            {
                path: 'managevendor',
                component: VendormoduleComponent,
                title: 'Manage Vendor | Onescreen',
            },
            {
                path: 'managevendor/:vendor_id',
                component: AddmodifyvendorComponent,
                title: 'Add Modify Vendor | Onescreen',
            },
            {
                path: 'uploadmedia',
                component: ManageordersComponent,
                title: 'Media Uplaod | Onescreen',
            },
              {
                path: 'uploadmedia/:order_id',
                component: ManageordersComponent,
                title: 'Media Uplaod | Onescreen',
            },
            {
                path: 'orders',
                component: OrdermoduleComponent,
                title: 'Orders | Onescreen',
            },
            {
                path: 'wallet',
                component: WallettransactionComponent,
                title: 'wallet | Onescreen',
            },
            {
                path: 'invoice/:order_id',
                component: InvoiceComponent,
                title: 'Thanks You | Onescreen',
            },
            {
                path: 'control',
                component: ControlmoduleComponent,
                title: 'Controls | Onescreen',
            },
            {
                path: 'control/:control_id',
                component: ManagecontrolComponent,
                title: 'Controls | Onescreen',
            },
            {
                path: 'booking',
                component: ScreenbookingComponent,
                title: 'ScreenBooking | Onescreen',
            },
            {
                path: 'primedate',
                component: PrimedatetimemoduleComponent,
                title: 'Prime Date | Onescreen',
            },
            {
                path: 'enquiry',
                component: ContactusmoduleComponent,
                title: 'Contact Enquiry Date | Onescreen',
            },
            {
                path: 'portalconfig',
                component: PortalconfigComponent,
                title: 'Portal Config | Onescreen',
            },
        ]
    },
    { path: '**', component: FourzerofourComponent }
];
