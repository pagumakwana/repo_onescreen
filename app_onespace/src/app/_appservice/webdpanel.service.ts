import { Injectable } from '@angular/core';
import { BaseServiceHelper } from './baseHelper.service';
import { ApiConstant } from '../_appmodel/apiconstant';
import { userModel, userModule, userAuthority, typeMaster, categoryMaster, labelMaster, blog, clientMaster, projectMaster, imageMaster, videoMaster, recipeMaster, controlDetails, cuisineMaster, banner, contestMaster, post, tourMaster, enquiryModel, batchModel, anthology, AuthModel, societyModel, complexModel, wingModel, flatModel, MasterModel, MasterDataModel, noticeModel, gateModel, supportMaster, documentsMaster, vehicleModel, petModel, accountHeaderModel, budgetModel, financialyearModel, tenantModel, companyModel, app_userapproved_model, modeModel, apiModel, senderModel, vendorModel, serviceproviderModel, serviceModel, templateModel, schedulerModel, invoiceModel, penaltyModel, receiptModel, usersocietymapModel, audiencemanagemaster, responseModel, postModel, keyModel, utilityModel, packageModel, communicationconfigurationModel, notification, eventModel, journalModel, reminderModel, triggerMaster, moduledataModel, portalconfigModel, audienceusermapModel, invoiceTemplateModel, useramountModel, productMaster, brandsMaster, productoptiontype, productoptionvalue, productoption, couponModel, userRegistration, usercartMaster, razorpayPaymentResponse, razorpay_OrderAttribute, user_coupon_model } from '../_appmodel/_model';
import { map, Observable, of } from 'rxjs';

@Injectable(
    { providedIn: 'root' }
)
export class WebDService {

    constructor(private _base: BaseServiceHelper) {

    }
    removeFile(file_id: any) {
        return this._base._apiService.post(`${ApiConstant.common.removefile}?file_id=${file_id}`);
    }
    registerCustomer(_customer: any) {
        return this._base._apiService.post(ApiConstant.customer.registerCustomer, _customer);
    }
    // loginCustomer(username: string, password: string) {
    //     return this._base._apiService.get(`${ApiConstant.customer.signIn}?userName=${username}&password=${password}`);
    // }
    loginCustomer(username: string, password: string): Observable<any> {
        return this._base._apiService.get(`${ApiConstant.customer.signIn}?userName=${username}&password=${password}`).pipe(
            map((result: any) => {
                const user = result?.[0];
                return user;
            })
        );
    }
    validateUser(UserCode: string) {
        var params = "?UserCode=" + UserCode;
        return this._base._apiService.get(ApiConstant.customer.validateUser + params);
    }
    forgotPassword(flag: string, ref_user_id: number, password: number) {
        var params = "?Flag=" + flag;
        params += "&Ref_User_ID=" + ref_user_id;
        params += "&Password=" + password;
        return this._base._apiService.post(ApiConstant.customer.forgotPassword + params);
    }
    requestOTP(requestOTP: any) {
        return this._base._apiService.post(ApiConstant.customer.requestOTP, requestOTP);
    }
    registerGuest() {
        return this._base._apiService.post(ApiConstant.customer.registerGuest);
    }
    public subscriber(email_id: string) {
        return this._base._apiService.post(`${ApiConstant.common.subscribe}?email_id=${email_id}`);
    }
    public getsubscriber(flag = 'all', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getsubscriber}?flag=${flag}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getcontactus() {
        return this._base._apiService.get(`${ApiConstant.common.getcontactus}`);
    }
    public getproject(flag: string = '', aliasname: string = '', project_id: number = 0, client_id: number = 0, search: string = "null") {
        return this._base._apiService.get(`${ApiConstant.common.getproject}?flag=${flag}&aliasname=${aliasname}&project_id=${project_id}&client_id=${client_id}&search=${search}`);
    }
    public projectmaster(_projectMaster: projectMaster) {
        return this._base._apiService.post(`${ApiConstant.common.project}`, _projectMaster);
    }
    public getclient(client_id: number = 0, aliasname: string = '', flag: string = 'all', search: string = "null") {
        return this._base._apiService.get(`${ApiConstant.common.getclient}?client_id=${client_id}&aliasname=${aliasname}&flag=${flag}&search=${search}`);
    }
    public clientmaster(_clientMaster: clientMaster) {
        return this._base._apiService.post(`${ApiConstant.common.client}`, _clientMaster);
    }
    public useraddmodify(_userModel: userModel) {
        return this._base._apiService.post(ApiConstant.customer.user, _userModel);
    }
    public userlist(flag: any, user_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.customer.getuserdetail}?flag=${flag}&user_id=${user_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getuserconfig(user_id = 0) {
        return this._base._apiService.get(`${ApiConstant.config.getuserconfig}?user_id=${user_id}`);
    }
    public usermodule(_userModule: userModule) {
        return this._base._apiService.post(`${ApiConstant.config.managemodule}`, _userModule);
    }
    public getusermodule(module_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.config.getmodule}?module_id=${module_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public authority(_userAuthority: userAuthority) {
        return this._base._apiService.post(`${ApiConstant.config.authority}`, _userAuthority);
    }
    public getauthority(authority_id = 0, flag = '') {
        return this._base._apiService.get(`${ApiConstant.config.getauthority}?authority_id=${authority_id}&flag=${flag}`);
    }
    public typemaster(_typeMaster: typeMaster) {
        return this._base._apiService.post(`${ApiConstant.mastermanagement.typemaster}`, _typeMaster);
    }
    public gettypemaster(flag = 'all', aliasname = 'null', typemaster_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.mastermanagement.gettypemaster}?flag=${flag}&aliasname=${aliasname}&typemaster_id=${typemaster_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public category(_categoryMaster: categoryMaster) {
        return this._base._apiService.post(`${ApiConstant.mastermanagement.category}`, _categoryMaster);
    }
    public getcategory(flag = 'all', typemaster_id = 0, typemaster = 'null', category_id = 0, aliasname = 'null', isfeatured = false, parent_category_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.mastermanagement.getcategory}?flag=${flag}&typemaster_id=${typemaster_id}&typemaster=${typemaster}&category_id=${category_id}&aliasname=${aliasname}&isfeatured=${isfeatured}&parent_category_id=${parent_category_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public labelmaster(_labelMaster: labelMaster) {
        return this._base._apiService.post(`${ApiConstant.mastermanagement.label}`, _labelMaster);
    }
    public getlabelmaster(flag = 'all', label_id = 0, aliasname = 'null', typemaster_id = 0, typemaster = 'null', search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.mastermanagement.getlabel}?flag=${flag}&label_id=${label_id}&aliasname=${aliasname}&typemaster_id=${typemaster_id}&typemaster=${typemaster}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public blogs(_blog: blog) {
        return this._base._apiService.post(`${ApiConstant.postmanagement.blog}`, _blog);
    }
    public getblogs(flag = 'all', blog_id = 0, aliasname = 'null', category_id = 0, category = 'null', label_id = 0, label = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.postmanagement.getblogs}?flag=${flag}&blog_id=${blog_id}&aliasname=${aliasname}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&start_count=${start_count}&end_count=${end_count}`);
    }
    public image(_imageMaster: imageMaster) {
        return this._base._apiService.post(`${ApiConstant.managegallery.imagefile}`, _imageMaster);
    }
    public getimage(flag = 'null', image_id = 0, aliasname = 'null', category_id = 0, category = 'null', isfeatured = false, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managegallery.getimagefile}?flag=${flag}&image_id=${image_id}&aliasname=${aliasname}&category_id=${category_id}&category=${category}&isfeatured=${isfeatured}&start_count=${start_count}&end_count=${end_count}`);
    }
    public video(_videoMaster: videoMaster) {
        return this._base._apiService.post(`${ApiConstant.managegallery.video}`, _videoMaster);
    }
    public getvideo(category_id = 0, category = 'null', aliasname = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managegallery.getvideo}?category_id=${category_id}&category=${category}&aliasname=${aliasname}&start_count=${start_count}&end_count=${end_count}`);
    }
    public controls(_controlDetails: controlDetails) {
        return this._base._apiService.post(`${ApiConstant.config.controls}`, _controlDetails);
    }
    public getcontrols(control_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.config.getcontrols}?control_id=${control_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public recipe(_recipeMaster: recipeMaster) {
        return this._base._apiService.post(`${ApiConstant.managerecipe.recipe}`, _recipeMaster);
    }
    public getrecipe(flag = 'null', recipe_id = 0, aliasname = 'null', category_id = 0, cuisine_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managerecipe.getrecipe}?flag=${flag}&recipe_id=${recipe_id}&aliasname=${aliasname}&category_id=${category_id}&cuisine_id=${cuisine_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public cuisine(_cuisineMaster: cuisineMaster) {
        return this._base._apiService.post(`${ApiConstant.managerecipe.cuisine}`, _cuisineMaster);
    }
    public getcuisine(flag = 'all', aliasname = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managerecipe.getcuisine}?flag=${flag}&aliasname=${aliasname}&start_count=${start_count}&end_count=${end_count}`);
    }
    public batch(_batch: batchModel) {
        return this._base._apiService.post(`${ApiConstant.batchmanagement.managebatch}`, _batch);
    }
    // public getbatch(flag = 'all', batch_id = 0, aliasname = 'null', category_id = 0, category = 'null', label_id = 0, label = 'null', isfeatured = false, start_count = 0, end_count = 0) {
    //     return this._base._apiService.get(`${ApiConstant.batchmanagement.getbatch}?flag=${flag}&batch_id=${batch_id}&aliasname=${aliasname}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&isfeatured=${isfeatured}&start_count=${start_count}&end_count=${end_count}`);
    // }
    public getinstructor(start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.batchmanagement.getinstructor}?start_count=${start_count}&end_count=${end_count}`);
    }
    public articles(_blog: blog) {
        return this._base._apiService.post(`${ApiConstant.postmanagement.managearticle}`, _blog);
    }
    public getarticles(flag = 'all', category_id = 0, category = 'null', label_id = 0, label = 'null', aliasname = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.postmanagement.getarticles}?flag=${flag}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&aliasname=${aliasname}&start_count=${start_count}&end_count=${end_count}`);
    }
    public forum(_blog: blog) {
        return this._base._apiService.post(`${ApiConstant.postmanagement.manageforum}`, _blog);
    }
    public getforum(flag = 'all', category_id = 0, category = 'null', label_id = 0, label = 'null', aliasname = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.postmanagement.getforum}?flag=${flag}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&aliasname=${aliasname}&start_count=${start_count}&end_count=${end_count}`);
    }
    public banner(_banner: banner) {
        return this._base._apiService.post(`${ApiConstant.managebanner.managebanner}`, _banner);
    }
    public getbanner(flag = 'all', banner_id = 0, category_id = 0, category = 'null', label_id = 0, label = 'null', search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managebanner.getbanner}?flag=${flag}&banner_id=${banner_id}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managecontest(_contestMaster: contestMaster) {
        return this._base._apiService.post(`${ApiConstant.contest.managecontest}`, _contestMaster);
    }
    public getcontest(flag = 'all', aliasname = 'null', category_id = 0, category = 'null', start_count = 0, end_count = 0, user_id = 0) {
        return this._base._apiService.get(`${ApiConstant.contest.getcontest}?flag=${flag}&aliasname=${aliasname}&category_id=${category_id}&category=${category}&start_count=${start_count}&end_count=${end_count}&user_id=${user_id}`);
    }
    public posts(_post: post) {
        return this._base._apiService.post(`${ApiConstant.postmanagement.dilkibolipost}`, _post);
    }
    public getposts(flag = 'all', type_id = 0, type = 'null', category_id = 0, category = 'null', label_id = 0, label = 'null', search = "", post_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.postmanagement.dilkiboligetpost}?flag=${flag}&type_id=${type_id}&type=${type}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&post_id=${post_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getcategorywithrecipecount(flag = 'all', typemaster_id = 0, typemaster = 'null', aliasname = 'null', isfeatured = false, parent_category_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managerecipe.getcategorywithrecipe}?flag=${flag}&typemaster_id=${typemaster_id}&typemaster=${typemaster}&aliasname=${aliasname}&isfeatured=${isfeatured}&parent_category_id=${parent_category_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public tour(_tourMaster: tourMaster) {
        return this._base._apiService.post(`${ApiConstant.managetour.managetour}`, _tourMaster);
    }
    public gettour(flag = 'null', tour_id = 0, aliasname = 'null', category_id = 0, category = 'null', label_id = 0, label = 'null', isfeatured = false, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managetour.gettour}?flag=${flag}&tour_id=${tour_id}&aliasname=${aliasname}&category_id=${category_id}&category=${category}&label_id=${label_id}&label=${label}&isfeatured=${isfeatured}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getcategorywithtourcount(flag = 'all', typemaster_id = 0, typemaster = 'null', aliasname = 'null', isfeatured = false, parent_category_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managetour.getcategorywithtourcount}?flag=${flag}&typemaster_id=${typemaster_id}&typemaster=${typemaster}&aliasname=${aliasname}&isfeatured=${isfeatured}&parent_category_id=${parent_category_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public enquiry(_enquiryModel: enquiryModel) {
        return this._base._apiService.post(`${ApiConstant.enquiry.manageenquiry}`, _enquiryModel);
    }
    public getenquiry(flag = 'null', enquiry_id = 0, module_id = 0, ref_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.enquiry.getenquiry}?flag=${flag}&enquiry_id=${enquiry_id}&module_id=${module_id}&ref_id=${ref_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getformdetails(guid: string = 'null', flag = 'null', booking_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.managetour.getbookinginfo}?guid=${guid}&flag=${flag}&booking_id=${booking_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public formdetails(datamodel: any) {
        return this._base._apiService.post(ApiConstant.managetour.bookinginfo, datamodel);
    }
    public get_usermaster(flag = 'all', usermaster_id = 0, is_mandatory = false, has_parent = false, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.mastermanagement.getusermaster}?flag=${flag}&usermaster_id=${usermaster_id}&is_mandatory=${is_mandatory}&has_parent=${has_parent}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managemaster(_usermaster: MasterModel) {
        return this._base._apiService.post(`${ApiConstant.mastermanagement.managemaster}`, _usermaster);
    }
    public get_usermasterdata(flag = 'all', usermasterdata_id = 0, usermaster_name = 'null', usermasterdata_parent_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.mastermanagement.getusermasterdata}?flag=${flag}&usermasterdata_id=${usermasterdata_id}&usermaster_name=${usermaster_name}&usermasterdata_parent_id=${usermasterdata_parent_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managemasterdata(_masterdata: MasterDataModel) {
        return this._base._apiService.post(`${ApiConstant.mastermanagement.managemasterdata}`, _masterdata);
    }
    public getnotice(flag = 'all', notice_id = 0, category_id = 0, society_id = 0, complex_id = 0, wing_id = 0, flat_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getnotice}?flag=${flag}&notice_id=${notice_id}&category_id=${category_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&flat_id=${flat_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managenotice(_noticeModel: noticeModel) {
        return this._base._apiService.post(`${ApiConstant.common.managenotice}`, _noticeModel);
    }

    public getsupport(flag = 'all', support_id = 0, category_id = 0, society_id = 0, complex_id = 0, wing_id = 0, flat_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getsupport}?flag=${flag}&support_id=${support_id}&category_id=${category_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&flat_id=${flat_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managesupport(_supportMaster: supportMaster) {
        return this._base._apiService.post(`${ApiConstant.common.managesupport}`, _supportMaster);
    }

    public getdocuments(flag = 'all', document_id = 0, category_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getdocuments}?flag=${flag}&document_id=${document_id}&category_id=${category_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managedocuments(_documentsMaster: documentsMaster) {
        return this._base._apiService.post(`${ApiConstant.common.managedocuments}`, _documentsMaster);
    }

    public getvehicle(flag = 'all', vehicle_id = 0, society_id = 0, complex_id = 0, wing_id = 0, flat_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.society.getvehicle}?flag=${flag}&vehicle_id=${vehicle_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&flat_id=${flat_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managevehicle(_vehicleModel: vehicleModel) {
        return this._base._apiService.post(`${ApiConstant.society.managevehicle}`, _vehicleModel);
    }

    public getpet(flag = 'all', pet_id = 0, category_id = 0, society_id = 0, complex_id = 0, wing_id = 0, flat_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.customer.getpet}?flag=${flag}&pet_id=${pet_id}&category_id=${category_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&flat_id=${flat_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managepet(_petModel: petModel) {
        return this._base._apiService.post(`${ApiConstant.customer.managepet}`, _petModel);
    }

    public getaccountheaders(flag = 'all', accountheader_id = 0, category_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getaccountheaders}?flag=${flag}&accountheader_id=${accountheader_id}&category_id=${category_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageaccountheaders(_accountHeaderModel: accountHeaderModel) {
        return this._base._apiService.post(`${ApiConstant.account.manageaccountheaders}`, _accountHeaderModel);
    }

    public getbudget(flag = 'all', budget_id = 0, category_id = 0, financialyear_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getbudget}?flag=${flag}&budget_id=${budget_id}&category_id=${category_id}&financialyear_id=${financialyear_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managebudget(_budgetModel: budgetModel) {
        return this._base._apiService.post(`${ApiConstant.account.managebudget}`, _budgetModel);
    }

    public getfinancialyear(flag = 'all', financialyear_id = 0, society_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.config.getfinancialyear}?flag=${flag}&financialyear_id=${financialyear_id}&society_id=${society_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managefinancialyear(_financialyearModel: financialyearModel) {
        return this._base._apiService.post(`${ApiConstant.config.managefinancialyear}`, _financialyearModel);
    }

    public gettenant(flag = 'all', tenant_id = 0, user_id = 0, society_id = 0, complex_id = 0, wing_id = 0, flat_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.customer.gettenant}?flag=${flag}&tenant_id=${tenant_id}&user_id=${user_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&flat_id=${flat_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managetenant(_tenantModel: tenantModel) {
        return this._base._apiService.post(`${ApiConstant.customer.managetenant}`, _tenantModel);
    }

    public getcompany(flag = 'all', company_id = 0, category_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getcompany}?flag=${flag}&company_id=${company_id}&category_id=${category_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managecompany(_companyModel: companyModel) {
        return this._base._apiService.post(`${ApiConstant.common.managecompany}`, _companyModel);
    }
    public appuser_approved_reject(_app_userapproved_model: app_userapproved_model) {
        return this._base._apiService.post(`${ApiConstant.customer.appuser_approved_reject}`, _app_userapproved_model);
    }

    public getserviceprovider(flag = 'all', serviceprovider_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getserviceprovider}?flag=${flag}&serviceprovider_id=${serviceprovider_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageserviceprovider(_serviceproviderModel: serviceproviderModel) {
        return this._base._apiService.post(`${ApiConstant.common.manageserviceprovider}`, _serviceproviderModel);
    }

    public getmode(flag = 'all', mode_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getmode}?flag=${flag}&mode_id=${mode_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managemode(_modeModel: modeModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managemode}`, _modeModel);
    }

    public getapi(flag = 'all', api_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getapi}?flag=${flag}&api_id=${api_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageapi(_apimodel: apiModel) {
        return this._base._apiService.post(`${ApiConstant.communication.manageapi}`, _apimodel);
    }

    public getsender(flag = 'all', sender_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getsender}?flag=${flag}&sender_id=${sender_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managesender(_sendermodel: senderModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managesender}`, _sendermodel);
    }

    public getinoutreport(flag = 'All', ref_id = 0, request_id = 0, request_type = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getinoutreport}?flag=${flag}&ref_id=${ref_id}&request_id=${request_id}&request_type=${request_type}&start_count=${start_count}&end_count=${end_count}`);
    }
    // , start_date = 'null', end_date = 'null'
    // &start_date=${start_date}&end_date=${end_date}

    public getdashboardwidget(flag = 'all', user_id = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getdashboardwidget}?flag=${flag}&user_id=${user_id}`);
    }

    public gethelpdeskWidget(flag = 'week') {
        return this._base._apiService.get(`${ApiConstant.reports.gethelpdeskWidget}?flag=${flag}`);
    }

    public getactivedeactiveWidget(flag = 'week') {
        return this._base._apiService.get(`${ApiConstant.reports.getactivedeactiveWidget}?flag=${flag}`);
    }

    public getactivesocietyWidget(flag = 'week') {
        return this._base._apiService.get(`${ApiConstant.reports.getactivesocietyWidget}?flag=${flag}`);
    }

    public getinvoiceWidget(society_id = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getinvoiceWidget}?society_id=${society_id}`);
    }
    public getserviceproviderWidget(society_id = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getserviceproviderWidget}?society_id=${society_id}`);
    }

    public getguardmsgWidget(society_id = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getguardmsgWidget}?society_id=${society_id}`);
    }

    public getservice(flag = 'all', service_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getservice}?flag=${flag}&service_id=${service_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageservice(_servicemodel: serviceModel) {
        return this._base._apiService.post(`${ApiConstant.communication.manageservice}`, _servicemodel);
    }

    public gettemplate(flag = 'all', template_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.gettemplate}?flag=${flag}&template_id=${template_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managetemplate(_templateModel: templateModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managetemplate}`, _templateModel);
    }

    public getscheduler(flag = 'all', scheduler_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getscheduler}?flag=${flag}&scheduler_id=${scheduler_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managescheduler(_schedulerModel: schedulerModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managescheduler}`, _schedulerModel);
    }

    public getnotification(notification_id = 0, user_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getnotification}?notification_id=${notification_id}&user_id=${user_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }

    public managenotification(_Notification: notification) {
        return this._base._apiService.post(`${ApiConstant.common.managenotification}`, _Notification);
    }

    public getinvoice(invoice_id = 0, user_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getinvoice}?invoice_id=${invoice_id}&user_id=${user_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getinvoicepenalty(invoice_id = 0, user_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getinvoicepenalty}?invoice_id=${invoice_id}&user_id=${user_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getbatch(flag = 'all', invoice_master_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getbatch}?flag=${flag}&invoice_master_id=${invoice_master_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managebatch(_invoiceModel: invoiceModel) {
        return this._base._apiService.post(`${ApiConstant.account.managebatch}`, _invoiceModel);
    }
    public getpenalty(flag = 'all', penalty_id = 0, penalty_slab_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getpenalty}?flag=${flag}&penalty_id=${penalty_id}&penalty_slab_id=${penalty_slab_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managepenalty(_penaltyModel: penaltyModel) {
        return this._base._apiService.post(`${ApiConstant.account.managepenalty}`, _penaltyModel);
    }
    public getreceipt(flag = 'all', receipt_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getreceipt}?flag=${flag}&receipt_id=${receipt_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managereceipt(_receiptModel: receiptModel) {
        return this._base._apiService.post(`${ApiConstant.account.managereceipt}`, _receiptModel);
    }
    public getcommuserdetail(flag = 'all', user_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.customer.getcommuserdetail}?flag=${flag}&user_id=${user_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managecommuserdetail(_usersocietymapModel: usersocietymapModel) {
        return this._base._apiService.post(ApiConstant.customer.managecommuserdetail, _usersocietymapModel);
    }
    public get_assigned_society(user_id = 0, society_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.society.get_assigned_society}?user_id=${user_id}&society_id=${society_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public get_assigned_complex(user_id = 0, society_id = 0, complex_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.society.get_assigned_complex}?user_id=${user_id}&society_id=${society_id}&complex_id=${complex_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public get_assigned_wing(user_id = 0, society_id = 0, complex_id = 0, wing_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.society.get_assigned_wing}?user_id=${user_id}&society_id=${society_id}&complex_id=${complex_id}&wing_id=${wing_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getsupportresponse(support_response_id = 0, support_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getsupportresponse}?support_response_id=${support_response_id}&support_id=${support_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managesupportresponse(_responseModel: responseModel) {
        return this._base._apiService.post(`${ApiConstant.common.managesupportresponse}`, _responseModel);
    }

    public getaudience(flag: any, audience_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getaudience}?flag=${flag}&audience_id=${audience_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageaudience(_audiencemaster: audiencemanagemaster) {
        return this._base._apiService.post(`${ApiConstant.communication.manageaudience}`, _audiencemaster);
    }

    public gettrigger(flag: any, trigger_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.gettrigger}?flag=${flag}&trigger_id=${trigger_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managetrigger(_TriggerMaster: triggerMaster) {
        return this._base._apiService.post(`${ApiConstant.communication.managetrigger}`, _TriggerMaster);
    }

    public getpost(flag: any, post_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.common.getpost}?flag=${flag}&post_id=${post_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managepost(_postModel: postModel) {
        return this._base._apiService.post(`${ApiConstant.common.managepost}`, _postModel);
    }

    public getkey(flag: any, key_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getkey}?flag=${flag}&key_id=${key_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managekey(_keyModel: keyModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managekey}`, _keyModel);
    }

    public getutility(utility_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getutility}?utility_id=${utility_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public get_budget_kpi(flag: any, financialyear_id = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getbudgetkpi}?flag=${flag}&financialyear_id=${financialyear_id}`);
    }

    public get_journal_kpi(journal_id = 0) {
        return this._base._apiService.get(`${ApiConstant.account.get_journal_kpi}?journal_id=${journal_id}`);
    }

    public get_journal_detail_kpi(category_id = 0, budget_id = 0) {
        return this._base._apiService.get(`${ApiConstant.account.get_journal_detail_kpi}?category_id=${category_id}&budget_id=${budget_id}`);
    }
    public manageutility(_utilityModel: utilityModel) {
        return this._base._apiService.post(`${ApiConstant.account.manageutility}`, _utilityModel);
    }

    public get_user_byflat(flat_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.society.get_user_byflat}?flat_id=${flat_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getpackage(flag: any, package_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getpackage}?flag=${flag}&package_id=${package_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managepackage(_packagemodel: packageModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managepackage}`, _packagemodel);
    }

    public getconfiguration(flag: any, configuration_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getconfiguration}?flag=${flag}&configuration_id=${configuration_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageconfiguration(_configurationModel: communicationconfigurationModel) {
        return this._base._apiService.post(`${ApiConstant.communication.manageconfiguration}`, _configurationModel);
    }

    public getguard(user_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getguard}?user_id=${user_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getevent(flag: any, event_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getevent}?flag=${flag}&event_id=${event_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageevent(_eventModel: eventModel) {
        return this._base._apiService.post(`${ApiConstant.communication.manageevent}`, _eventModel);
    }

    public getreminder(flag: any, reminder_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getreminder}?flag=${flag}&reminder_id=${reminder_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managereminder(_reminderModel: reminderModel) {
        return this._base._apiService.post(`${ApiConstant.communication.managereminder}`, _reminderModel);
    }

    public getjournal(flag = 'all', journal_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getjournal}?flag=${flag}&journal_id=${journal_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managejournal(_journalModel: journalModel) {
        return this._base._apiService.post(`${ApiConstant.account.managejournal}`, _journalModel);
    }

    public update_moduledata(_moduledataModel: moduledataModel) {
        return this._base._apiService.post(`${ApiConstant.common.update_moduledata}`, _moduledataModel);
    }

    public getportalconfig(flag = 'all', config_id = 0, config_name = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.config.getportalconfig}?flag=${flag}&config_id=${config_id}&config_name=${config_name}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageportalconfig(_portalconfigModel: portalconfigModel) {
        return this._base._apiService.post(`${ApiConstant.config.manageportalconfig}`, _portalconfigModel);
    }

    public getcommunicatonlogs(flag = 'All', request_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getcommunicatonlogs}?flag=${flag}&request_id=${request_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public getpendingqueue(flag = 'All', request_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.reports.getpendingqueue}?flag=${flag}&request_id=${request_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageaudienceuserdetail(_audienceusermapModel: audienceusermapModel) {
        return this._base._apiService.post(`${ApiConstant.communication.manageaudienceuserdetail}`, _audienceusermapModel);
    }

    public getaudienceuserdetail(flag: any, audience_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.communication.getaudienceuserdetail}?flag=${flag}&audience_id=${audience_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public manageinvoicetemplate(_invoicetemplateModel: invoiceTemplateModel) {
        return this._base._apiService.post(`${ApiConstant.account.manageinvoicetemplate}`, _invoicetemplateModel);
    }

    public getinvoicetemplate(flag: any, inv_template_id = 0, search = "null", start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getinvoicetemplate}?flag=${flag}&inv_template_id=${inv_template_id}&search=${search}&start_count=${start_count}&end_count=${end_count}`);
    }

    public manage_delete_record(user_id = 0) {
        return this._base._apiService.post(`${ApiConstant.customer.manage_delete_record}?user_id=${user_id}`);
    }
    public getheaderflat(accountheader_id = 0, inv_template_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.getheaderflat}?accountheader_id=${accountheader_id}&inv_template_id=${inv_template_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public updateInvoiceHeaderAmount(_useramountModel: useramountModel[]) {
        return this._base._apiService.post(`${ApiConstant.account.updateInvoiceHeaderAmount}`, _useramountModel);
    }
    public get_generalreceipt(receipt_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.account.get_generalreceipt}?receipt_id=${receipt_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public manageproduct(_productMaster: productMaster) {
        return this._base._apiService.post(`${ApiConstant.product.manageproduct}`, _productMaster);
    }
    public getproduct(flag = 'all', product_id = 0, brand_id = 0, category_name = 'null', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getproduct}?flag=${flag}&product_id=${product_id}&brand_id=${brand_id}&category_name=${category_name}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getproductoption(flag = 'all', option_id = 0, product_id = 0, option_type_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getproductoptions}?flag=${flag}&option_id=${option_id}&product_id=${product_id}&option_type_id=${option_type_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public managebrand(_brandMaster: brandsMaster) {
        return this._base._apiService.post(`${ApiConstant.product.managebrand}`, _brandMaster);
    }
    public getbrand(flag = 'all', brand_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getbrand}?flag=${flag}&brand_id=${brand_id}&start_count=${start_count}&end_count=${end_count}`);
    }

    public productoptiontypes(flag = 'all', option_type_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.productoptiontypes}?flag=${flag}&option_type_id=${option_type_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageproductoptiontypes(_optionType: productoptiontype) {
        return this._base._apiService.post(`${ApiConstant.product.manageproductoptiontypes}`, _optionType);
    }

    public productoptionvalues(flag = 'all', option_value_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.productoptionvalues}?flag=${flag}&option_value_id=${option_value_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public manageproductoptionvalues(_optionValue: productoptionvalue) {
        return this._base._apiService.post(`${ApiConstant.product.manageproductoptionvalues}`, _optionValue);
    }
    public manageproductoptions(_productOption: productoption) {
        return this._base._apiService.post(`${ApiConstant.product.manageproductoptions}`, _productOption);
    }

    public getcoupon(coupon_id = 0, coupon_code = '', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getcoupon}?coupon_id=${coupon_id}&coupon_code=${coupon_code}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managecoupon(_couponModel: couponModel) {
        return this._base._apiService.post(`${ApiConstant.product.managecoupon}`, _couponModel);
    }

    public getoptionvalue(option_type = '', product_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getoptionvalue}?option_type=${option_type}&product_id=${product_id}&start_count=${start_count}&end_count=${end_count}`);
    }


    public getorderdetails(flag = 'all', order_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getorderdertails}?flag=${flag}&order_id=${order_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public signUp(_userregister: userRegistration) {
        return this._base._apiService.post(`${ApiConstant.customer.SignUp}`, _userregister);
    }
    public add_to_cart(_usercartMaster: usercartMaster) {
        return this._base._apiService.post(`${ApiConstant.product.add_to_cart}`, _usercartMaster);
    }
    public getusercartdetail(user_cart_id = 0, user_id = 0, product_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getusercartdetail}?user_cart_id=${user_cart_id}&user_id=${user_id}&product_id=${product_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public getvendor(flag = 'all', vendor_id = 0, start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getvendor}?flag=${flag}&vendor_id=${vendor_id}&start_count=${start_count}&end_count=${end_count}`);
    }
    public managevendor(_vendor: vendorModel) {
        return this._base._apiService.post(`${ApiConstant.product.managevendor}`, _vendor);
    }
    public createOrder(_razorpay_OrderAttribute: razorpay_OrderAttribute) {
        return this._base._apiService.post(`${ApiConstant.customer.create_order}`, _razorpay_OrderAttribute);
    }
    public verifyorder(_razorpayPaymentResponse: razorpayPaymentResponse) {
        return this._base._apiService.post(`${ApiConstant.customer.verify_order}`, _razorpayPaymentResponse);
    }
    public getcouponcart(flag = 'all', coupon_id = 0, coupon_code = '', start_count = 0, end_count = 0) {
        return this._base._apiService.get(`${ApiConstant.product.getcoupon}?flag=${flag}&coupon_id=${coupon_id}&coupon_code=${coupon_code}&start_count=${start_count}&end_count=${end_count}`);
    }
     public apply_coupon(_applycoupon: user_coupon_model) {
        return this._base._apiService.post(`${ApiConstant.product.apply_coupon}`, _applycoupon);
    }
}