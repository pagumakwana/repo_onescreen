export interface contactusModel {
    fullname: string;
    email_id: string;
    message: string;
}
export class AuthModel {
    authToken: string;
    refreshToken: string;
    expiresIn: Date;

    constructor(authToken: string = '', refreshToken: string = '', expiresIn: Date = new Date()) {
        this.authToken = authToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
    }

    setAuth(auth: AuthModel) {
        this.authToken = auth.authToken;
        this.refreshToken = auth.refreshToken;
        this.expiresIn = auth.expiresIn;
    }
}

export interface userModel {
    flag?: string,
    fullname?: string,
    username?: string,
    email_id?: string,
    mobilenumber?: string,
    password?: string,
    repassword?: string,
    gender?: any,
    bio?: any,
    dob?: any,
    website?: string,
    society_id?: any,
    complex_id?: any,
    wing_id?: any,
    flat_id?: any,
    category_id?: any,
    category?: any,
    vendor_id?: any,
    contact_person_name?: any,
    lstusertype?: any,
    usertype_id?: any,
    lstsociety?: any,
    lstcomplex?: any,
    lstwing?: any,
    lstflat?: any,
    lstuserflatmap?: any,
    is_approved?: string,
    authority_id?: number,
    lstproject?: any,
    lstauthority?: any,
    lstvendor?: any,
    lstcategory?: any,
    user_id?: number,
    client_id?: number,
    project_id?: number,
    createdby?: number,
    createdname?: string,
    profilepicture?: any,
    isactive?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
        itemidentifier?: string
    }>
}
export interface requestOTP {
    Ref_OTP_ID?: any,
    Ref_User_ID?: any,
    OTP?: any,
    Flag?: any,
    Type?: any,
    IsValidate?: any,
}

export interface userModule {
    flag?: any,
    module_id?: any,
    module_parent_id?: any,
    module_identifier?: any,
    modulename?: any,
    moduleicon?: any,
    modulerouting?: any,
    modulepath?: any,
    lstcategory?: any,
    lstparentmodule?: any,
    category_id?: any,
    category?: any,
    user_id?: number,
    createdname?: string
}

export interface userAuthority {
    flag?: any,
    authority_id?: any,
    authority?: any,
    description?: any,
    lstmodule?: any,
    lstcontrol?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    isactive?: boolean,
}

export interface typeMaster {
    flag?: any,
    typemaster_id?: any,
    typemaster?: any,
    aliasname?: any,
    displayorder?: number,
    isactive?: boolean,
    description?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface categoryMaster {
    flag?: any,
    category_id?: any,
    parent_category_id?: any,
    category?: any,
    typemaster_id?: any,
    typemaster?: any,
    aliasname?: any,
    lstparentcategory?: any;
    lsttypemaster?: any;
    isfeatured?: any,
    displayorder?: any,
    isactive?: any,
    description?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
        itemidentifier?: string
    }>
}

export interface labelMaster {
    flag?: any,
    label_id?: any,
    label?: any,
    aliasname?: any,
    typemaster_id?: any,
    typemaster?: any,
    description?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface blog {
    flag?: any,
    blog_id?: any,
    title?: any,
    aliasname?: any,
    post?: any,
    iscommentallow?: any,
    lstcategory?: any;
    lstlabel?: any;
    schedule?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface clientMaster {
    flag?: any,
    client_id?: any,
    parent_client_id?: any,
    clientname?: any,
    personname?: any,
    email_id?: any,
    mobilenumber?: any,
    aliasname?: any,
    description?: any,
    user_id?: number,
    createdname?: string
    isactive?: boolean
}

export interface projectMaster {
    flag?: any,
    project_id?: any,
    projectname?: any,
    client_id?: any,
    clientname?: any,
    aliasname?: any,
    description?: any,
    user_id?: number,
    createdname?: string
    isactive?: boolean
}

export interface imageMaster {
    flag?: any,
    image_id?: any,
    title?: any,
    aliasname?: any,
    alt?: any,
    thumbnail?: any,
    description?: any,
    lstcategory?: Array<categoryMaster>;
    lstlabel?: Array<labelMaster>;
    lstgalleryimage?: Array<imageMaster>;
    typemaster_id?: any,
    typemaster?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface videoMaster {
    flag?: any,
    video_id?: any,
    title?: string,
    aliasname?: string,
    alt?: string,
    video_url?: string,
    isuploaded?: boolean,
    type?: string,
    description?: any,
    lstcategory?: Array<categoryMaster>;
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface controlDetails {
    flag?: any,
    control_id?: any,
    title?: any,
    syscontrolname?: any,
    aliasname?: any,
    module_id?: any,
    modulename?: any,
    description?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface recipeMaster {
    flag?: any,
    recipe_id?: number,
    cuisine_id?: number,
    cuisine?: string,
    title?: string,
    aliasname?: string,
    preparationtime?: any,
    servingtime?: any,
    totaltime?: any,
    serving?: any,
    calories?: any,
    isveg?: any,
    description?: any,
    lstcategory?: any;
    lstcuisine?: any;
    lstlabel?: any;
    lststep?: Array<{ step_id: number, stepdetails: string, videothumbnailurl: string, thumbnail: string }>;
    lstingredient?: Array<{ ingredient_id: number, ingredient: string }>;
    lstnutrition?: Array<{ nutrition_id: number, nutrition: string, nutrition_measure: string }>;
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
    isactive?: boolean,
    isfeatured?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}


export interface cuisineMaster {
    flag?: any,
    cuisine_id?: number,
    title?: string,
    aliasname?: string,
    description?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    isactive?: boolean,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface batchModel {
    flag?: any,
    batch_id?: any,
    title?: any,
    aliasname?: any,
    description?: any,
    thumbnail?: any,
    shortdescription?: any,
    cost?: any,
    price?: any,
    finalprice?: any,
    timing?: any,
    days?: any,
    agegroup?: any,
    enrolledstudent?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
    isactive?: any,
    isfeatured?: any,
    iscommentallow?: any,
    lstcategory?: Array<{
        batch_id: number,
        category_id: number,
        aliasname: string,
        category: string,
        isfeatured: boolean,
        batchcount: number
    }>;
    lstlabel?: Array<{
        batch_id: number,
        label_id: number,
        label: string,
    }>;
    lstinstructor?: any;
    lstfaq?: Array<{ question: string, answer: string }>;
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}


export class fileChoosenDataModel {
    fileArrayIdentifier?: any;
    file: any;
    thumb?: string;
    fileextension?: string;
    file_id?: any;
    ModuleID?: number;
    ModuleType?: string;
    fileidentifier?: string;
    subidentifier?: string;
    itemidentifier?: string;
    displayorder?: number;
    FileUploaderIndex?: number = 0;
}

export class fileConfigModel {
    fileValidationInfo?: {
        fileType?: Array<string>;
        size?: number;
    }
    isMulti?: boolean;
    fileidentifier?: string;
    ModuleType?: string;
    ModuleID: string | any;
    fileextension: string | any;
}

export class SaveModuleFileModel {
    file_id?: number;
    ModuleID?: number;
    ModuleType?: string;
    fileidentifier?: string;
    indexidentifier?: number;
    displayorder?: number;
    subidentifier?: string;
    itemidentifier?: string;
    files?: FileList | string | Array<any>;
}

export interface banner {
    flag?: any,
    banner_id?: any,
    title?: any,
    subtitle?: any,
    description?: any,
    url?: any,
    displayorder?: any,
    thumbnail?: any,
    type?: any,
    lsttypemaster?: any;
    lstcategory?: any;
    lstlabel?: any;
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
    schedule?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface contestMaster {
    flag?: any,
    contest_id?: number,
    title?: string,
    aliasname?: string,
    description?: any,
    startdate?: any,
    enddate?: any,
    resultdate?: any,
    isfeatured?: any,
    lstcategory?: any;
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface post {
    flag?: any,
    post_id?: any,
    title?: any,
    aliasname?: any,
    post?: any,
    typemaster_id?: any,
    typemaster?: any,
    thumbnail?: any,
    lstcategory?: any;
    lstlabel?: any;
    schedule?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}


export interface tourMaster {
    flag?: any,
    tour_id?: number,
    title?: string,
    aliasname?: string,
    description?: string,
    highlights?: string,
    tourinfo?: string,
    terms?: string,
    iscommentallow?: any,
    price?: any,
    finalprice?: any,
    days?: any,
    latitude?: number,
    longitude?: number,
    lstcategory?: any;
    lstgalleryimage?: any;
    lstlabel?: any;
    lstfaq?: Array<{ question: string, answer: string }>;
    lstincexc?: Array<{ title: string, is_exclusion: boolean }>;
    lstitinerary?: Array<{ title: string, description: string }>;
    isactive?: boolean,
    // ispublished?: boolean,
    isfeatured?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface enquiryModel {
    flag?: any,
    enquiry_id?: any,
    subject?: any,
    mobile_number?: any,
    module_id?: any,
    ref_id?: any,
    email_id?: any,
    fullname?: any,
    description?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}


export interface bookingMaster {
    flag?: any,
    booking_id?: number,
    booking_guid?: string,
    fullname?: string,
    mobile_number?: string,
    email_id?: string,
    travelling_date?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    lstpassenger?: Array<passengerDetails>
}

export interface passengerDetails {
    passenger_id?: number,
    booking_id?: number,
    fullname?: string,
    mobile_number?: string,
    email_id?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface menuStructure {
    module_id?: number,
    module_parent_id?: number,
    modulename?: string,
    modulerouting?: string,
    moduleicon?: string,
    children?: any,
    meuItems?: any
}
export interface menuBreadcum {
    module_id?: number,
    module_parent_id?: number,
    modulename?: string,
    modulerouting?: string,
    moduleicon?: string,
}


export interface anthology {
    flag?: any,
    anthology_id?: any,
    title?: any,
    aliasname?: any,
    post?: any,
    iscommentallow?: any,
    lstcategory?: any;
    lstlabel?: any;
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
        itemidentifier?: string
    }>
}

export interface societyModel {
    flag?: any,
    society_id?: number,
    parent_society_id?: number,
    category_id?: number,
    society_name?: string,
    society_address?: string,
    mobile_number?: string,
    email_id?: string,
    lstcategory?: any;
    lstsociety?: any;
    lstcountry?: any;
    lstcity?: any;
    lststate?: any;
    lstlocation?: any;
    country_id?: number;
    city_id?: number;
    state_id?: number;
    location_id?: number;
    pincode?: string;
    search?: any,
    usermaster_id?: any,
    usermasterdata_id?: any,
    usermasterdata_name?: any,
    usermasterdata_parent_id?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface complexModel {
    flag?: any,
    complex_id?: number,
    society_id?: number,
    complex_name?: string,
    complex_description?: string,
    lstsociety?: any;
    search?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface wingModel {
    flag?: any,
    wing_id?: number,
    society_id?: number,
    complex_id?: number,
    wing_name?: string,
    wing_description?: string,
    lstcomplex?: any;
    lstsociety?: any;
    search?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}


export interface flatModel {
    flag?: any,
    flat_id?: number,
    flat_name?: string,
    flat_description?: string,
    lstcomplex?: any;
    lstsociety?: any;
    lstwing?: any;
    society_id?: any,
    complex_id?: any,
    wing_id?: any,
    search?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface vehicleModel {
    flag?: any,
    vehicle_id?: number,
    vehicle_number?: string,
    vehicle_description?: string,
    society_id?: any,
    complex_id?: any,
    wing_id?: any,
    flat_id?: any,
    lstcomplex?: any,
    lstsociety?: any,
    lstwing?: any,
    lstflat?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface gateModel {
    flag?: any,
    gate_id?: number,
    gate_name?: string,
    gate_description?: string,
    society_id?: number,
    complex_id?: number,
    wing_id?: number,
    lstcomplex?: any;
    lstsociety?: any;
    lstwing?: any;
    isactive?: boolean,
    search?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface petModel {
    flag?: any,
    pet_id?: number,
    pet_name?: string,
    pet_description?: string,
    parentcategory_id?: number,
    category_id?: number,
    category?: string,
    society_id?: number,
    society_name?: string,
    complex_id?: number,
    complex_name?: string,
    wing_id?: number,
    wing_name?: string,
    flat_id?: number,
    flat_name?: string,
    lstsociety?: any;
    lstcomplex?: any;
    lstwing?: any;
    lstflat?: any;
    lstcategory?: any;
    lstparentcategory?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface noticeModel {
    flag?: any,
    notice_id?: number,
    notice_title?: string,
    notice_description?: string,
    category_id?: number,
    category?: string,
    society_id?: number,
    society_name?: string,
    complex_id?: number,
    complex_name?: string,
    wing_id?: number,
    wing_name?: string,
    flat_id?: number,
    flat_name?: string,
    resident_type_id?: number,
    resident_type?: string
    lstsociety?: any;
    lstcomplex?: any;
    lstwing?: any;
    lstflat?: any;
    lstresident?: any;
    lstcategory?: any;
    isactive?: boolean,
    send_email?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface MasterModel {
    flag?: any,
    ref_UserMaster_ID?: number,
    ref_UserMasterControl_ID?: number,
    usermaster_id?: number,
    parent_ids?: number
    usermaster_name?: string,
    lstusermaster?: any,
    usermaster_description?: string,
    is_mandatory?: boolean,
    has_parent?: boolean,
    allow_numeric?: boolean,
    allow_alphanumeric?: boolean,
    allow_specialcharacter?: boolean,
    special_character?: string,
    allow_negative_number?: boolean,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface MasterDataModel {
    flag?: any,
    usermasterdata_id?: number,
    usermasterdata_name?: string
    usermasterdata_parent_id?: number
    usermasterdata_description?: string,
    usermaster_id?: number,
    usermaster_name?: string,
    lstmasterdata?: any,
    lstparentmasterdata?: any,
    isDeleted?: boolean,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface triggerMaster {
    flag?: any,
    trigger_id?: number,
    trigger?: any,
    audience_id?: any,
    audience_title?: any,
    lstaudience?: any,
    event_id?: any,
    title?: any,
    lstevent?: any,
    trigger_audience_id?: any,
    trigger_event_id?: any,
    trigger_description?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface audiencemanagemaster {
    flag?: any;
    audience_id?: any,
    audience_title?: any,
    audience_description?: any,
    isactive?: boolean,
    usermasterdata_id?: number,
    usermasterdata_name?: string,
    country_id?: number;
    city_id?: number;
    state_id?: number;
    client_id?: number,
    lstcountry?: any,
    lststate?: any,
    lstcity?: any,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface supportMaster {
    flag?: any,
    support_id?: any,
    support_title?: any,
    society_id?: number,
    society_name?: string,
    complex_id?: number,
    complex_name?: string,
    wing_id?: string,
    wing_name?: string,
    flat_id?: number,
    flat_name?: string,
    category_id?: number,
    category_name?: string,
    parent_category_id?: string,
    parent_category?: string,
    priority?: string,
    status?: string,
    support_description?: any,
    isactive?: boolean,
    status_id?: number,
    assign_user_ids?: number,
    fullname?: string,
    priority_id?: string,
    lstsociety?: any,
    lstcomplex?: any,
    lstwing?: any,
    lstflat?: any,
    lstcategory?: any,
    lstassignuser?: any,
    lstpriority?: any,
    lststatus?: any,
    lstparent_category?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface responseModel {
    flag?: any,
    support_response_id?: any,
    support_id?: any,
    support_title?: any,
    support_description?: any,
    fullname?: any,
    profilepicture?: any,
    response?: any,
    category_id?: number,
    category?: any,
    lstsupportresponse?: any,
    lststatus?: any,
    status?: any,
    status_id?: number
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdby?: number,
    createdname?: string,
    createddatetime?: any,
}
export interface documentsMaster {
    flag?: any,
    documents_id?: any,
    documents_name?: any,
    category_id?: any,
    category?: any,
    documents_description?: any,
    lstcategory?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface accountHeaderModel {
    flag?: any,
    accountheader_id?: any,
    accountheader_title?: any,
    accountheader_description?: any,
    parent_accountheader_id?: any,
    parent_accountheader?: string,
    header_amount?: any,
    gst_rate?: any,
    isgst?: boolean,
    total_amount?: any,
    category_id?: any,
    category?: any,
    lstcategory?: any,
    lstaccountheader?: any,
    isactive?: boolean,
    society_id?: number,
    complex_id?: number,
    wing_id?: number,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface budgetModel {
    flag?: any,
    budget_id?: any,
    budget_title?: any,
    budget_description?: any,
    amount?: any,
    category_id?: any,
    category?: any,
    lstcategory?: any,
    financialyear_id?: any,
    financialyear?: any,
    lstfinancialyear?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface tenantModel {
    flag?: any,
    tenant_id?: number,
    startdate?: any,
    enddate?: any,
    remark?: string,
    society_id?: number,
    society_name?: string,
    complex_id?: number,
    complex_name?: string,
    wing_id?: number,
    wing_name?: string,
    flat_id?: number,
    flat_name?: string,
    tenant_user_id?: string,
    fullname?: string,
    lstsociety?: any;
    lstcomplex?: any;
    lstwing?: any;
    lstflat?: any;
    lstassignuser?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface financialyearModel {
    flag?: any,
    financialyear_id?: number,
    society_id?: number,
    society_name?: number,
    financialyear?: string,
    financialyear_description?: string,
    lstsociety?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
// export interface vendorModel {
//     flag?: any,
//     vendor_id?: number,
//     vendor_name?: string,
//     vendor_code?: any,
//     email_id?: string,
//     mobile_number?: string,
//     gst_number?: any,
//     pan_number?: any,
//     vendor_address?: string,
//     gst_rate?: string,
//     gsttax_id?: number,
//     gsttaxtype?: string,
//     department_id?: number,
//     department?: string,
//     lstgsttaxtype?: any,
//     lstdepartment?: any,
//     isactive?: boolean,
//     client_id?: number,
//     project_id?: number,
//     user_id?: number,
//     createdname?: string
// }
export interface modeModel {
    flag?: any,
    mode_id?: number,
    mode_name?: any,
    category_id?: any,
    category?: any,
    mode_description?: any,
    lstcategory?: any,
    isactive?: boolean,
    is_subject?: boolean,
    is_cc_bcc?: boolean,
    is_signature_support?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface apiModel {
    flag?: any,
    api_id?: any,
    api_name?: any,
    api_identifier?: any,
    api_url?: any,
    api_key?: any,
    secret_key?: any,
    category_id?: any,
    fullname?: any,
    lstserviceprovider?: any,
    tenant_id?: any,
    mode_id?: any,
    mode_name?: any,
    lstmode?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface senderModel {
    flag?: any,
    sender_id?: any,
    sender_name?: any,
    sender_unique_id?: any,
    password?: any,
    sender_identifier?: any,
    sender_description?: any,
    api_id?: any,
    api_name?: any,
    category_id?: any,
    lstapi?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface serviceModel {
    flag?: any,
    service_id?: any,
    service_name?: any,
    service_identifier?: any,
    service_discription?: any,
    mode_id?: any,
    mode_name?: any,
    lstmode?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface serviceproviderModel {
    flag?: string,
    serviceprovider_id?: number,
    fullname?: string,
    email_id?: string,
    mobilenumber?: string,
    validity?: any,
    uniquecode?: any,
    category_id?: any,
    subcategory_id?: any,
    company_id?: any,
    vendor_id?: any,
    usertype_id?: any,
    authority_id?: any,
    lstauthority?: any,
    lstcategory?: any,
    lstsubcategory?: any,
    lstcompany?: any,
    lstvendor?: any,
    lstusertype?: any,
    serviceprovider_address?: any,
    police_verification?: boolean,
    is_hireable?: boolean,
    is_visible?: boolean,
    is_frequentuser?: boolean,
    isactive?: boolean,
    user_id?: number,
    client_id?: number,
    project_id?: number,
    createdby?: number,
    createdname?: string,
    thumbnail?: any,
    pancard?: any,
    adharcard?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface companyModel {
    flag?: any,
    company_id?: any,
    company_name?: any,
    category_id?: any,
    category?: any,
    company_description?: any,
    mobile_no?: any,
    email_id?: any,
    lstcategory?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface templateModel {
    flag?: any,
    template_id?: any,
    mode_id?: any,
    template_name?: any,
    identifier?: any,
    contentformat_id?: any,
    contentformat?: any,
    event_id?: any,
    title?: any,
    template_description?: any,
    lstcontentformat?: any,
    lstevent?: any,
    lstmode?: any,
    isactive?: boolean,
    isattachment?: boolean,
    isembed?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface schedulerModel {
    flag?: any,
    scheduler_id?: any,
    scheduler_name?: any,
    time?: any,
    category_id?: any,
    category?: any,
    lstscheduler?: any,
    lstfrequency?: any,
    lstevents?: any,
    lstaudience?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}

export interface app_userapproved_model {
    app_user_id?: number,
    is_approved?: boolean,
    user_id?: number,
    createdname?: string

}

export interface userinoutMaster {
    flag?: any,
    request_id?: any,
    request_type?: any,
    ref_id?: any,
    approved_by?: any,
    approved_datetime?: any,
    is_frequent?: boolean,
    start_date?: any,
    end_date?: any,
    start_time?: any,
    end_time?: any,
    valid_for?: any,
    comment?: any,
    unique_code?: any,
    unique_identifier?: any,
    isactive?: boolean,
    isdeleted?: boolean
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: any,
    createddatetime?: any,
    updatedby?: any,
    updatedname?: any,
    updateddatetime?: any,

}
export interface notification {
    flag?: any,
    notification_id?: any,
    title?: any,
    description?: any,
    url?: any,
    thumbnail?: any,
    audience_id?: number,
    audience_title?: any,
    lstaudience?: any,
    category_id?: any,
    category?: any,
    lstcategory?: any,
    user_id?: any,
    isactive?: boolean,
    isdeleted?: boolean
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: any,
    createddatetime?: any,
    updatedby?: any,
    updatedname?: any,
    updateddatetime?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}
export interface invoiceModel {
    flag?: any,
    invoice_id?: number,
    invoice_period?: any,
    society_name?: any,
    fullname?: any,
    society_address?: any,
    complex_name?: any,
    wing_name?: any,
    flat_name?: any;
    invoice_amount?: any;
    gst_amount?: any;
    excluding_gst_amount?: any;
    batch_id?: number,
    batch_name?: string,
    lstbatch?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    invoice_date?: any,
    invoice_duedate?: any,
}

export interface invoicebatchModel {
    flag?: any,
    invoice_master_id?: number,
    invoice_period?: any,
    invoice_date?: any,
    invoice_duedate?: any,
    financialyear_id?: number,
    financialyear?: string,
    lstinvfinancialyear?: any;
    category_id?: any;
    category?: any;
    inv_template_id?: any;
    society_id?: any;
    society_name?: any;
    complex_id?: any;
    complex_name?: any;
    wing_id?: any;
    wing_name?: any;
    lstsociety?: any;
    lstcomplex?: any;
    lstwing?: any;
    lstfinancialmonth?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
}

export interface penaltyModel {
    flag?: any,
    penalty_id?: any,
    penalty_name?: any,
    hsn_code?: any,
    category_id?: any,
    category?: any,
    penalty_ledger_id?: any,
    penalty_ledger_name?: any,
    penalty_type_id?: any,
    penalty_type_name?: any,
    penalty_frequency_id?: any,
    penalty_frequency_name?: any,
    penalty_description?: any,
    lstpenaltyslab?: any,
    lstpenaltyledger?: any,
    isactive?: boolean,
    round_of?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface receiptModel {
    flag?: any,
    receipt_id?: any,
    party_name?: any,
    cheque_number?: any,
    bank_name?: any,
    email_id?: any,
    reference?: any,
    bank_branch?: any,
    amount?: any,
    date?: any,
    cheque_date?: any,
    invoice_number?: any,
    invoice_date?: any,
    invoice_duedate?: any,
    society_id?: any,
    society_name?: any,
    society_address?: any,
    complex_id?: any,
    complex_name?: any,
    wing_id?: any,
    wing_name?: any,
    flat_id?: any,
    flat_name?: any,
    receipt_description?: any,
    lstflat?: any,
    thumbnail?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>

}
export interface usersocietymapModel {
    user_id?: number,
    fullname?: string,
    email_id?: string,
    category_id?: any,
    category?: any,
    lstcategory?: any,
    society_ids?: any,
    complex_ids?: any,
    wing_ids?: any,
    support_type_ids?: any,
    lstusersociety?: any,
    lstusercomplex?: any,
    lstuserwing?: any,
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: number,
}

export interface userflatModel {
    user_id?: number,
    fullname?: string,
    email_id?: string,
    society_ids?: any,
    complex_ids?: any,
    wing_ids?: any,
    flat_ids?: any,
    lstsociety?: any,
    lstcomplex?: any,
    lstwing?: any,
    lstflat?: any
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: number,
}

export interface invoicelistModel {
    flag?: any,
    invoice_id?: number,
    invoice_date?: any,
    invoice_duedate?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    lstaccountheader?: any
}

export interface postModel {
    flag?: any,
    post_id?: any,
    title?: any,
    post?: any,
    schedule?: any,
    iscommentallow?: boolean,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    society_id?: number,
    complex_id?: number,
    wing_id?: number,
    user_id?: number,
    createdname?: string
    thumbnail?: any,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>
}

export interface keyModel {
    flag?: any,
    key_id?: number,
    category_id?: number,
    category?: number,
    template_id?: number,
    template_name?: string,
    templatekey_id?: number,
    lsttemplate?: any,
    key_title?: string,
    key_description?: string,
    lstkeycontentformat?: any;
    key_contentformat_id?: any,
    society_id?: number,
    complex_id?: number,
    wing_id?: number,
    isactive?: boolean,
    is_attachment?: boolean,
    is_embedimage?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface utilityModel {
    flag?: any,
    utility_id?: number,
    title?: string,
    entry_date?: any,
    consumed_unit?: any,
    meterreading?: any,
    budget_id?: any,
    budget_title?: any,
    category_id?: any,
    catgeory?: any,
    subcategory_id?: any,
    subcatgeory?: any,
    lstbudget?: any,
    lstcategory?: any,
    lstsubcategory?: any,
    description?: string,
    society_id?: number,
    complex_id?: number,
    wing_id?: number,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface get_user_by_flatModel {
    flag?: any,
    flat_id?: number,
    fullname?: string,
    mobilenumber?: any,
    email_id?: any
    society_name?: string,
    complex_name?: string,
    wing_name?: string,
    flat_name?: string,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface packageModel {
    flag?: any,
    package_id?: any,
    package_name?: any,
    total_communication?: any,
    extras?: any,
    category_id?: any,
    category?: any,
    serviceprovider_id?: any,
    lstserviceprovider?: any,
    mode_id?: any,
    mode_name?: any,
    lstmode?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface communicationconfigurationModel {
    flag?: any,
    configuration_id?: number,
    package_id?: number,
    package_name?: number,
    remaining_communication?: string,
    lstpackage?: any;
    serviceprovider_id?: any,
    com_serviceprovider?: any,
    mode_id?: any,
    mode_name?: any,
    lstserviceprovider?: any,
    lstmode?: any,
    isactive?: boolean,
    is_backup_enable?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface guardModel {
    flag?: any,
    message?: any,
    msg_id?: any,
    user_id?: any,
    isactive?: boolean,
    isdeleted?: boolean
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: any,
    createddatetime?: any,
    updatedby?: any,
    updatedname?: any,
    updateddatetime?: any,

}

export interface eventModel {
    flag?: any,
    event_id?: any,
    title?: any,
    identifier?: any,
    description?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface reminderModel {
    flag?: any,
    reminder_id?: any,
    title?: any,
    description?: any,
    identifier?: any,
    start_day?: any,
    end_day?: any,
    frequency_id?: any,
    frequency?: any,
    lstfrequency?: any,
    category_id?: any
    category?: any,
    lstbasedon?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}
export interface journalModel {
    flag?: any,
    journal_id?: number,
    title?: string,
    amount?: any,
    budget_id?: any,
    budget_title?: any,
    lstbudget?: any,
    financialyear_id?: any,
    financialyear?: any,
    lstfinancialyear?: any,
    category_id?: any,
    category?: any,
    lstfinancialmonth?: any,
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface moduledataModel {
    flag?: string,
    ref_ids?: string,
    user_id?: any,
    createdname?: any,
}
export interface portalconfigModel {
    flag?: any,
    config_id?: any,
    config_name?: any,
    config_value?: any,
    category_id?: any,
    config_type?: any,
    lstportalconfig?: any,
    description?: any,
    config_data?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string

}
export interface communicationlogs {
    flag?: any,
    request_id?: any,
    request_code?: any,
    product_id?: any,
    template_selector?: any,
    schedule_datetime?: any,
    is_scheduled?: boolean,
    recipients?: any,
    keys?: any,
    key_values?: any,
    attachment_url?: any,
    extras?: any,
    status?: any,
    isactive?: boolean,
    isdeleted?: boolean
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: any,
    createddatetime?: any,
    updatedby?: any,
    updatedname?: any,
    updateddatetime?: any,

}

export interface pendingqueue {
    flag?: any,
    request_id?: any,
    request_code?: any,
    product_id?: any,
    template_selector?: any,
    schedule_datetime?: any,
    is_scheduled?: boolean,
    recipients?: any,
    keys?: any,
    key_values?: any,
    attachment_url?: any,
    extras?: any,
    status?: any,
    isactive?: boolean,
    isdeleted?: boolean
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: any,
    createddatetime?: any,
    updatedby?: any,
    updatedname?: any,
    updateddatetime?: any,

}

export interface audienceusermapModel {
    user_id?: any,
    audience_id?: string,
    user_ids?: any,
    client_id?: number,
    project_id?: number,
    createdname?: string,
    createdby?: number,
}

export interface invoiceTemplateModel {
    flag?: any,
    inv_template_id?: number,
    financialyear_id?: number,
    financialyear?: string,
    lstinvfinancialyear?: any;
    category_id?: any;
    category?: any;
    society_id?: any;
    society_name?: any;
    complex_id?: any;
    complex_name?: any;
    wing_id?: any;
    wing_name?: any;
    lstsociety?: any;
    lstcomplex?: any;
    lstwing?: any;
    lstfinancialmonth?: any;
    accountheader_id?: any;
    accountheader_title?: any;
    lstaccountheaders?: any;
    invoice_accountheader_id?: any;
    isactive?: boolean,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdby?: any,
    createdname?: string,
}

export interface useramountModel {
    flat_id: any;
    accountheader_id: any;
    total_amount: any;
    template_accheader_id: any;
}


export interface productMaster {
    flag?: any,
    product_id?: any,
    product_name?: any,
    product_description?: any,
    isactive?: boolean,
    category_id?: any,
    category?: any,
    base_price?: any,
    route_category_id?: any,
    route_category?: any,
    property_category_id?: any,
    property_category?: any,
    brand_id?: any,
    brand_name?: any,
    lstcategory?: any,
    lstcategoryroute?: any,
    lstpropertycategoryroute?: any,
    lstattribute?: any,
    lstrepeattribute?: any,
    lsttimeattribute?: any,
    lstbrand?: any,
    thumbnail?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>

}

export interface brandsMaster {
    flag?: any,
    brand_id?: any,
    brand_name?: any,
    brand_description?: any,
    isactive?: boolean,
    thumbnail?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string,
    filemanager?: Array<{
        ref_id: number,
        file_id: number,
        filename: string,
        filepath: string,
        filetype: string,
        fileextension: string,
        filesize: number,
        fileidentifier: string,
        displayorder: string,
        module: string
    }>

}

export interface productoptionvalue {
    flag?: any,
    option_value_id?: any,
    option_value?: any,
    display_order?: any,
    option_type_id?: any,
    title?: any,
    lstoptiontype?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface productoptiontype {
    flag?: any,
    option_type_id?: any,
    title?: any,
    display_order?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface productoption {
    flag?: any,
    option_id?: any,
    option_type_id?: any,
    title?: any,
    product_id?: any,
    product_name?: any,
    optiontype_list?: any,
    lstproduct?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface couponModel {
    flag?: any,
    coupon_id?: any,
    coupon_code?: any,
    discount_value?: any,
    from_date?: any,
    to_date?: any,
    isdisable?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface orderDetails {
    flag?: any,
    order_id?: any,
    order_number?: any,
    payment_type?: any,
    payment_order_id?: any,
    payment_response?: any,
    isdisable?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    user_id?: number,
    createdname?: string
}

export interface userRegistration {
    flag?: any,
    user_id?: any,
    fullname?: any,
    email_id?: any,
    mobilenumber?: any,
    password?: any,
    client_id?: number,
    project_id?: number,
    createdby?: number,
    createdname?: string
}

export interface usercartMaster {
    flag?: any,
    cart_master_id?: any,
    user_id?: any,
    coupon_id?:number,
    coupon_code?:string,
    cart_total?:any,
    cart_subtotal?:any,
    cart_discount?:any,
    cart_tax?:any,
    lst_cart_product?: usercartmappingModel[];
    client_id?: number,
    project_id?: number,
    createdby?: number,
    createdname?: string
}

export interface usercartmappingModel {
    user_cart_mapping_id?: any,
    cart_master_id?: any,
    user_id?: any,
    fullname?: any,
    product_id?: any,
    product_name?: any,
    optionvalues?: any,
    total_amount?: any,
    attribute_amount?: any,
    base_amount?: any,
    lstvalues?: Array<{
        timeslot_category_id: number,
        timeslot_category: string,
        timeslot_price: any,
        from_date: string,
        to_date: string,
        route_category_id: number,
        route_category: string,
        product_id: number,
        product_name: string,
        repetition_category_id: number,
        repetition_category: string,
    }>,

}
export interface vendorModel {
    flag?: any,
    vendor_id?: any,
    contact_person_name?: any,
    company_name?: any,
    email_id?: any,
    mobile_no?: any,
    vendor_address?: any,
    isactive?: any,
    client_id?: number,
    project_id?: number,
    createdby?: number,
    createdname?: string
}
export interface razorpay_OrderAttribute {
    amount?: number,
    amount_due?: number,
    amount_paid?: number,
    payment_capture?: any,
    attempts?: number,
    created_at?: number,
    currency?: any,
    entity?: string,
    id?: string,
    notes?: any,
    offer_id?: string,
    receipt?: string,
    status?: string,
}

export interface razorpayPaymentResponse {
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    status: string
}

export interface user_coupon_model{
    flag?:any,
    coupon_cart_mapid?: any,
    coupon_id? :any
    cart_id? :any
    user_id? :any
    product_ids? :any,
    createdby?: number,
    createdname?: string
}