
export class ApiConstant {
    public static common = {
        subscribe: "usermanagement/subscribe",
        getsubscriber: "usermanagement/getsubscriber",
        getcontactus: "usermanagement/getcontactus",
        getclient: "manageclient/getclient",
        client: "manageclient/client",
        getproject: "projectmanagement/getproject",
        project: "projectmanagement/project",
        removefile: "common/removefile",
        uploadfile: "common/fileupload",
        getnotice: "common/getnotice",
        managenotice: "common/managenotice",
        getsupport: "common/getsupport",
        managesupport: "common/managesupport",
        getsupportresponse: "common/getsupportresponse",
        managesupportresponse: "common/managesupportresponse",
        getdocuments: "common/getdocuments",
        managedocuments: "common/managedocuments",
        getserviceprovider: "common/getserviceprovider",
        manageserviceprovider: "common/manageserviceprovider",
        getcompany: "common/getcompany",
        managecompany: "common/managecompany",
        getnotification: "common/getnotification",
        managenotification: "common/managenotification",
        getpost: "common/getpost",
        managepost: "common/managepost",
        update_moduledata: "common/update_moduledata",
        getdashboardwidget: "common/getdashboardwidget",
        getwalletwidget: "common/getwalletwidget"
    }
    public static customer = {
        signIn: "usermanagement/SignIn",
        SignUp: "usermanagement/SignUp",
        registerCustomer: "usermanagement/SignUp",
        validateUser: "Admin/usermanagement/ValidateUser",
        forgotPassword: "Admin/usermanagement/ForgotPassword",
        requestOTP: "Admin/usermanagement/RequestOTP",
        registerGuest: "Admin/usermanagement/RegisterGuest",
        user: "usermanagement/manageuser",
        getuserdetail: "usermanagement/getuserdetail",
        getusertoken: "usermanagement/getusertoken",
        getpet: "usermanagement/getpet",
        managepet: "usermanagement/managepet",
        gettenant: "usermanagement/gettenant",
        managetenant: "usermanagement/managetenant",
        appuser_approved_reject: "usermanagement/appuser_approved_reject",
        managecommuserdetail: "usermanagement/managecommuserdetail",
        getcommuserdetail: "usermanagement/getcommuserdetail",
        manage_delete_record: "usermanagement/manage_delete_record",
        create_order: "product/create_order",
        verify_order: "product/verify_order",
        getcontactdetails: "usermanagement/getcontactdetails",
        managecontactdetails: "usermanagement/managecontactdetails",
        update_userdetails: "usermanagement/update_userdetails"


    }
    public static config = {
        getuserconfig: "config/getuserconfig",
        getmodule: "config/getmodule",
        managemodule: "config/managemodule",
        authority: "config/authority",
        getauthority: "config/getauthority",
        controls: "config/controls",
        getcontrols: "config/getcontrols",
        getauthoritycontrols: "config/getauthoritycontrols",
        getauthoritymoduls: "config/getauthoritymodule",
        getfinancialyear: "config/getfinancialyear",
        managefinancialyear: "config/managefinancialyear",
        getportalconfig: "config/getportalconfig",
        manageportalconfig: "config/manageportalconfig"
    }

    public static mastermanagement = {
        typemaster: "MasterManagement/typemaster",
        gettypemaster: "MasterManagement/gettypemaster",
        category: "MasterManagement/category",
        getcategory: "MasterManagement/getcategory",
        label: "MasterManagement/labelmaster",
        getlabel: "MasterManagement/getlabelmaster",
        getusermaster: "MasterManagement/UserMaster",
        managemaster: "MasterManagement/UserMaster ",
        getusermasterdata: "MasterManagement/UserMasterData",
        managemasterdata: "MasterManagement/UserMasterData",

    }

    public static communication = {

        getmode: "communication/getmode",
        managemode: "communication/managemode",
        getapi: "communication/getapi",
        manageapi: "communication/manageapi",
        getsender: "communication/getsender",
        managesender: "communication/managesender",
        getservice: "communication/getservice",
        manageservice: "communication/manageservice",
        gettemplate: "communication/gettemplate",
        managetemplate: "communication/managetemplate",
        getscheduler: "communication/getscheduler",
        managescheduler: "communication/managescheduler",
        getaudience: "communication/getaudience",
        manageaudience: "communication/manageaudience",
        getkey: "communication/getkey",
        managekey: "communication/managekey",
        getpackage: "communication/getpackage",
        managepackage: "communication/managepackage",
        getconfiguration: "communication/getconfiguration",
        manageconfiguration: "communication/manageconfiguration",
        getguard: "communication/getguard",
        getevent: "communication/getevent",
        manageevent: "communication/manageevent",
        getreminder: "communication/getreminder",
        managereminder: "communication/managereminder",
        gettrigger: "communication/gettrigger",
        managetrigger: "communication/managetrigger",
        manageaudienceuserdetail: "communication/manageaudienceuserdetail",
        getaudienceuserdetail: "communication/getaudienceuserdetail",


    }
    public static postmanagement = {
        getblogs: "postmanagement/getblogs",
        blog: "postmanagement/blog",
        getanthology: "postmanagement/getanthology",
        anthology: "postmanagement/anthology",
        getarticles: "postmanagement/getarticles",
        managearticle: "postmanagement/managearticle",
        getforum: "postmanagement/getforum",
        manageforum: "postmanagement/manageforum",
        dilkiboligetpost: "postmanagement/dilkiboligetpost",
        dilkibolipost: "postmanagement/dilkibolipost",
    }
    public static batchmanagement = {
        getbatch: "batchmanagement/getbatch",
        managebatch: "batchmanagement/batch",
        getinstructor: "batchmanagement/getinstructor",
    }
    public static managegallery = {
        getimagefile: "gallerymanagement/getimagefile",
        imagefile: "gallerymanagement/imagefile",
        getvideo: "gallerymanagement/getvideo",
        video: "gallerymanagement/video",
    }
    public static managerecipe = {
        getrecipe: "recipemanagement/getrecipe",
        recipe: "recipemanagement/recipe",
        getcuisine: "recipemanagement/getcuisine",
        cuisine: "recipemanagement/cuisine",
        getcategorywithrecipe: "recipemanagement/getcategorywithrecipecount",
    }
    public static managebanner = {
        getbanner: "bannermanagement/getbanner",
        managebanner: "bannermanagement/managebanner",
    }
    public static contest = {
        managecontest: "contest/managecontest",
        getcontest: "contest/getcontest",
    }
    public static managetour = {
        managetour: "tourmanagement/managetour",
        gettour: "tourmanagement/gettour",
        getcategorywithtourcount: "tourmanagement/getcategorywithtourcount",
        getbookinginfo: "tourmanagement/getbookinginfo",
        bookinginfo: "tourmanagement/bookinginfo",
    }
    public static enquiry = {
        manageenquiry: "enquirymanagement/manageenquiry",
        getenquiry: "enquirymanagement/getenquiry",
    }
    public static society = {
        managesociety: "societymanagement/managesociety",
        getsociety: "societymanagement/getsociety",
        get_assigned_society: "societymanagement/get_assigned_society",
        managecomplex: "societymanagement/managecomplex",
        getcomplex: "societymanagement/getcomplex",
        get_assigned_complex: "societymanagement/get_assigned_complex",
        managewing: "societymanagement/managewing",
        getwing: "societymanagement/getwing",
        get_assigned_wing: "societymanagement/get_assigned_wing",
        manageflat: "societymanagement/manageflat",
        getflat: "societymanagement/getflat",
        getgate: "societymanagement/getgate",
        managegate: "societymanagement/managegate",
        getvehicle: "societymanagement/getvehicle",
        managevehicle: "societymanagement/managevehicle",
        get_user_byflat: "societymanagement/get_user_byflat",

    }

    public static account = {
        getaccountheaders: "account/getaccountheaders",
        manageaccountheaders: "account/manageaccountheaders",
        getbudget: "account/getbudget",
        managebudget: "account/managebudget",
        getinvoice: "account/getinvoice",
        getinvoicepenalty: "account/getinvoicepenalty",
        getbatch: "account/getbatch",
        managebatch: "account/managebatch",
        getpenalty: "account/getpenalty",
        managepenalty: "account/managepenalty",
        getreceipt: "account/getreceipt",
        managereceipt: "account/managereceipt",
        getutility: "account/getutility",
        getbudgetkpi: "account/get_budget_kpi",
        get_journal_kpi: "account/get_journal_kpi",
        get_journal_detail_kpi: "account/get_journal_detail_kpi",
        manageutility: "account/manageutility",
        getjournal: "account/getjournal",
        managejournal: "account/managejournal",
        manageinvoicetemplate: "account/manageinvoicetemplate",
        getinvoicetemplate: "account/getinvoicetemplate",
        getheaderflat: "account/getheaderflat",
        updateInvoiceHeaderAmount: "account/updateInvoiceHeaderAmount",
        get_generalreceipt: "account/get_generalreceipt"

    }
    public static importdata = {

        categorydata: "import/ImportCategory",
        import_society: "import/import_society",
        import_complex: "import/import_complex",
        import_wing: "import/import_wing",
        import_flat: "import/import_flat",
        import_gate: "import/import_gate",
        import_vehicle: "import/import_vehicle",
        import_manageuser: "import/import_manageuser",
        import_pets: "import/import_pets",
        import_committee: "import/import_committee",
        import_company: "import/import_company",
        import_serviceprovider: "import/import_serviceprovider",
        import_vendor: "import/import_vendor",
        import_category: "import/import_category",
        import_typemaster: "import/import_typemaster",
        import_template: "import/import_template",
        import_key: "import/import_key",
        import_event: "import/import_event",
        import_journal: "import/import_journal",
        import_control: "import/import_control",
        import_module: "import/import_module",
        import_usermasterdata: "import/import_usermasterdata",
    }

    public static reports = {
        getinoutreport: "Report/getinoutreport",
        gethelpdeskWidget: "Report/gethelpdeskWidget",
        getinvoiceWidget: "Report/getinvoiceWidget",
        getserviceproviderWidget: "Report/getserviceproviderWidget",
        getguardmsgWidget: "Report/getguardmsgWidget",
        getcommunicatonlogs: "Report/getcommunicatonlogs",
        getpendingqueue: "Report/getpendingqueue",
        getactivedeactiveWidget: "Report/getactivedeactiveWidget",
        getactivesocietyWidget: "Report/getactivesocietyWidget"
    }

    public static product = {
        managebrand: "product/managebrand",
        getbrand: "product/getbrand",
        manageproduct: "product/manageproduct",
        getproduct: "product/getproduct",
        get_product_enquiry: "product/get_product_enquiry",
        modify_enquiry: "product/modify_enquiry",
        manage_enquiry: "product/manage_enquiry",
        productoptiontypes: "product/productoptiontypes",
        manageproductoptiontypes: "product/manageproductoptiontypes",
        productoptionvalues: "product/productoptionvalues",
        manageproductoptionvalues: "product/manageproductoptionvalues",
        manageproductoptions: "product/manageproductoptions",
        getcoupon: "product/getcoupon",
        managecoupon: "product/managecoupon",
        getproductoptions: "product/getproductoptions",
        getoptionvalue: "product/getoptionvalue",
        getorderdertails: "product/getorderdertails",
        add_to_cart: "product/add_to_cart",
        getusercartdetail: "product/getusercartdetail",
        getvendor: "product/getvendor",
        managevendor: "product/managevendor",
        getcouponcart: "product/getcouponcart",
        apply_coupon: "product/apply_coupon",
        move_to_order: "product/move_to_order",
        get_pendingmediaupload: "product/get_pendingmediaupload",
        media_status_update: "product/media_status_update",
        media_upload: "product/media_upload",
        remove_cart: "product/remove_cart",
        mobile_verification: "product/mobile_verification",
        getwithdrawal_request: "product/getwithdrawal_request",
        getwallet_transaction: "product/getwallet_transaction",
        wallet_withdrawal_req: "product/wallet_withdrawal_req",
        getwalletmaster: "product/getwalletmaster",
        getinvoicedetails: "product/getinvoicedetails",
        update_to_cart: "product/update_to_cart"
    }
}