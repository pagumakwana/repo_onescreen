using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.Common
{
    public class Constant
    {
        public const string AddModifyUserMaster = "[dbo].[AddModifyUserMaster]";
        public const string GetUserMasterList = "[dbo].[GetUserMasterList]";
        public const string GetUserMasterDataList = "[dbo].[GetUserMasterDataList]";
        public const string GetParentUserMasterList = "[dbo].[GetParentUserMasterList]";
        public const string AddModifyUserMasterData = "[dbo].[AddModifyUserMasterData]";

        public const string SetCommunicationDetails = "[dbo].[SetCommunicationDetails]";
        public const string AddUserDeviceDetails = "[dbo].[AddUserDeviceDetails]";
        public const string CreateUpdateTemplate = "[Communication].[CreateUpdateTemplate]";
        public const string CreateUpdateTemplateKey = "[Communication].[CreateUpdateTemplateKey]";
        public const string ProcessCommunicationData = "[dbo].[ProcessCommunicationData]";
        public const string CreateClientRequest = "[Communication].[CreatedRequest]";
        public const string ValidateClientRequest = "[Communication].[USP_ValidateClientRequest]";
        public const string removefile = "[dbo].[removefile]";
        //public const string getnotification = "[dbo].[getnotification]";
        //public const string managenotification = "[dbo].[managenotification]";
        public const string mapfilemanager = "[dbo].[mapfilemanager]";


        public const string mapfilemanagerrecipe = "[dbo].[mapfilemanagerrecipe]";

        //START :: COMMON
        public const string managenotice = "[dbo].[managenotice]";
        public const string mapnoticesociety = "[dbo].[mapnoticesociety]";
        public const string mapnoticewing = "[dbo].[mapnoticewing]";
        public const string mapnoticecomplex = "[dbo].[mapnoticecomplex]";
        public const string mapnoticeflat = "[dbo].[mapnoticeflat]";

        public const string getnotice = "[dbo].[getnotice]";
        public const string mapnoticecategory = "[dbo].[mapnoticecategory]";
        public const string getsupport = "[dbo].[getsupport]";
        public const string managesupport = "[dbo].[managesupport]";

        public const string getsupportresponse = "[dbo].[getsupportresponse]";
        public const string managesupportresponse = "[dbo].[managesupportresponse]";

        public const string getdocuments = "[dbo].[getdocuments]";
        public const string managedocuments = "[dbo].[managedocuments]";
        public const string mapdocumentcategory = "[dbo].[mapdocumentcategory]";

        //public const string getvendor = "[dbo].[getvendor]";
        //public const string managevendor = "[dbo].[managevendor]";

        public const string getserviceprovider = "[dbo].[getserviceprovider]";
        public const string manageserviceprovider = "[dbo].[manageserviceprovider]";

        public const string managecompany = "[dbo].[managecompany]";
        public const string mapcompanycategory = "[dbo].[mapcompanycategory]";
        public const string getcompany = "[dbo].[getcompany]";

        public const string getpost = "[dbo].[getpost]";
        public const string managepost = "[dbo].[managepost]";

        public const string getnotification = "[dbo].[getnotification]";
        public const string managenotification = "[dbo].[managenotification]";
        public const string update_moduledata = "[dbo].[update_moduledata]";
        public const string getdashboardwidget = "[dbo].[getdashboardwidget]";
        public const string getwalletwidget = "[dbo].[getwalletwidget]";
        //END :: COMMON

        //START :: BannerManagemet
        public const string getbanner = "[dbo].[getbanner]";
        public const string managebanner = "[dbo].[managebanner]";
        public const string mapbannercategory = "[dbo].[mapbannercategory]";
        public const string mapbannerlabel = "[dbo].[mapbannerlabel]";
        public const string mapbannertype = "[dbo].[mapbannertype]";
        //END::BannerManagemet

        //Start :: Import
        //public const string import_society = "[dbo].[import_society]";
        //public const string import_complex = "[dbo].[import_complex]";
        //public const string import_wing = "[dbo].[import_wing]";
        //public const string import_flat = "[dbo].[import_flat]";
        //public const string import_gate = "[dbo].[import_gate]";
        //public const string import_vehicle = "[dbo].[import_vehicle]";
        public const string import_manageuser = "[dbo].[import_manageuser]";
        //public const string import_pets = "[dbo].[import_pets]";
        //public const string import_company = "[dbo].[import_company]";
        //public const string import_serviceprovider = "[dbo].[import_serviceprovider]";
        //public const string import_vendor = "[dbo].[import_vendor]";
        public const string import_category = "[dbo].[import_category]";
        public const string import_typemaster = "[dbo].[import_typemaster]";
        //public const string import_template = "[dbo].[import_template]";
        //public const string import_key = "[dbo].[import_key]";
        //public const string import_event = "[dbo].[import_event]";
        //public const string import_journal = "[dbo].[import_journal]";
        public const string import_control = "[dbo].[import_control]";
        public const string import_module = "[dbo].[import_module]";
        public const string import_usermasterdata = "[dbo].[import_usermasterdata]";
        //public const string import_committee = "[dbo].[import_committee]";
        //END ::Import

        //START :: UserManagement
        public const string SignUp = "[dbo].[SignUp]";
        public const string usersignin = "[dbo].[usersignin]";
        public const string ForgotPassword = "[dbo].[ForgotPassword]";
        public const string validateuser = "[dbo].[validateuser]";
        public const string RequestOTP = "[dbo].[RequestOTP]";
        public const string managesubscribe = "[dbo].[managesubscribe]";
        public const string getsubscriber = "[dbo].[getsubscriber]";
        //public const string managecontactus = "[dbo].[managecontactus]";
        //public const string getcontactus = "[dbo].[getcontactus]";
        public const string manageuser = "[dbo].[manageuser]";
        public const string getuserdetail = "[dbo].[getuserdetail]";
        public const string getuserconfig = "[dbo].[getuserconfig]";
        public const string mapauthorityuser = "[dbo].[mapauthorityuser]";
        public const string mapprojectuser = "[dbo].[mapprojectuser]";
        public const string updateprofilepicture = "[dbo].[updateprofilepicture]";
        public const string requestfriend = "[dbo].[requestfriend]";
        public const string approvedrequest = "[dbo].[approvedrequest]";
        public const string getusertoken = "[dbo].[getusertoken]";
        public const string manage_delete_record = "[dbo].[manage_delete_record]";
        public const string user_approved_reject = "[dbo].[user_approved_reject]";

        public const string getcontactdetails = "[dbo].[getcontactdetails]";
        public const string managecontactdetails = "[dbo].[managecontactdetails]";
        public const string Update_Userdetails = "[dbo].[Update_Userdetails]";
        public const string mapuserproduct = "[dbo].[mapuserproduct]";

        //END :: UserManagement

        //START :: Client Management
        public const string clientmaster = "[dbo].[clientmaster]";
        public const string getclients = "[dbo].[getclients]";
        //END :: Client Management

        //START :: Projects Management
        public const string projectmaster = "[dbo].[projectmaster]";
        public const string getprojects = "[dbo].[getprojects]";
        //END :: Projects Management

        //START :: ADD MODIFY ContentType
        public const string TypeMaster = "[dbo].[TypeMaster]";
        public const string GetTypeMaster = "[dbo].[GetTypeMaster]";
        //END :: ADD MODIFY NEWS

        //START :: ADD MODIFY Category
        public const string managecategory = "[dbo].[managecategory]";
        public const string getcategory = "[dbo].[getcategory]";
        public const string mapfilemanagercategory = "[dbo].[mapfilemanagercategory]";
        //END :: ADD MODIFY Category

        //START :: ADD MODIFY Label
        public const string labelmaster = "[dbo].[labelmaster]";
        public const string getlabelmaster = "[dbo].[getlabelmaster]";
        //END :: ADD MODIFY Category

        //START :: CONFIGURATION
        public const string manageusermodule = "[dbo].[manageusermodule]";
        public const string GetUserModule = "[dbo].[GetUserModule]";
        public const string manageauthority = "[dbo].[manageauthority]";
        public const string getauthority = "[dbo].[getauthority]";
        public const string managecontrol = "[dbo].[managecontrol]";
        public const string getcontrols = "[dbo].[getcontrols]";
        public const string getauthoritycontrols = "[dbo].[getauthoritycontrols]";
        public const string mapauthoritymodule = "[dbo].[mapauthoritymodule]";
        public const string mapauthoritycontrol = "[dbo].[mapauthoritycontrol]";
        public const string getauthoritymodule = "[dbo].[getauthoritymodule]";

        public const string getfinancialyear = "[dbo].[getfinancialyear]";
        public const string managefinancialyear = "[dbo].[managefinancialyear]";
        public const string mapfinancialyearsociety = "[dbo].[mapfinancialyearsociety]";

        public const string getportalconfig = "[dbo].[getconfig]";
        public const string manageportalconfig = "[dbo].[manageconfig]";

        //END :: CONFIGURATION

        //START :: ADD MODIFY FILEMASTER
        public const string masterfile = "[dbo].[masterfile]";
        //END :: ADD MODIFY FILEMASTER

        //START :: PRODUCT
        public const string getproduct = "[dbo].[getproduct]";
        public const string getbrand = "[dbo].[getbrand]";
        public const string manageproduct = "[dbo].[manageproduct]";
        public const string managebrand = "[dbo].[managebrand]";
        public const string manageproductoptiontypes = "[dbo].[manageproductoptiontypes]";
        public const string manageroductoptionvalues = "[dbo].[manageroductoptionvalues]";
        public const string getproductoptiontypes = "[dbo].[getproductoptiontypes]";
        public const string getproductoptionvalues = "[dbo].[getproductoptionvalues]";
        public const string manageproductoption = "[dbo].[manageproductoption]";
        public const string getcoupon = "[dbo].[getcoupon]";
        public const string managecoupon = "[dbo].[managecoupon]";
        public const string getproductoption = "[dbo].[getproductoption]";
        public const string mapproductoption = "[dbo].[mapproductoption]";
        public const string getoptionvalue = "[dbo].[getoptionvalue]";
        public const string mapproductattribute = "[dbo].[mapproductattribute]";
        public const string mapuserproductcomm = "[dbo].[mapuserproductcomm]";
        public const string managecartmaster = "[dbo].[managecartmaster]";
        public const string removecart = "[dbo].[removecart]";
        public const string manageproductcart = "[dbo].[manageproductcart]";
        public const string getorderdertails = "[dbo].[getorderdertails]";
        public const string mapusercart = "[dbo].[mapusercart]";
        public const string getusercartdetail = "[dbo].[getusercartdetail]";
        public const string getvendor = "[dbo].[getvendor]";
        public const string managevendor = "[dbo].[managevendor]";
        public const string manageordermaster = "[dbo].[manageordermaster]";
        public const string mapuserorder = "[dbo].[mapuserorder]";
        public const string mapuserorderproduct = "[dbo].[mapuserorderproduct]";
        public const string getcoupon_cart = "[dbo].[getcoupon_cart]";
        public const string user_coupon_mapping = "[dbo].[user_coupon_mapping]";
        public const string get_pendingmediaupload = "[dbo].[get_pendingmediaupload]";
        public const string media_status_approved = "[dbo].[media_status_approved]";
        public const string media_upload = "[dbo].[media_upload]";
        public const string mobile_verify = "[dbo].[mobile_verify]";
        public const string getconfig = "[dbo].[getconfig]";
        public const string getwallet_withdrawal_req = "[dbo].[getwallet_withdrawal_req]";
        public const string getwallettransaction = "[dbo].[getwallettransaction]";
        public const string wallet_withdrawal_req = "[dbo].[wallet_withdrawal_req]";
        public const string getwalletmaster = "[dbo].[getwalletmaster]";
        public const string getinvoicedetails = "[dbo].[getinvoicedetails]";
        public const string update_commision = "[dbo].[update_commision]";
        public const string update_to_cart = "[dbo].[update_to_cart]";
        public const string getorderproduct = "[dbo].[getorderproduct]";
        public const string move_to_cart = "[dbo].[move_to_cart]";
        //END :: PRODUCT

        public const string getprimedate = "[dbo].[getprimedate]";
        public const string manageprimedate = "[dbo].[manageprimedate]";
        public const string raise_quote = "[dbo].[raise_quote]";
        public const string mapquotationproduct = "[dbo].[mapquotationproduct]";
        public const string getquotedetails = "[dbo].[getquotedetails]";
    }
}
