using Microsoft.AspNetCore.Http;
using onescreen.DAL.Common;
using onescreenModel.Common;
using onescreenModel.UserManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.UserManagement
{
    public class UserManagement_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 project_id;
        private readonly Int64 client_id;

        public UserManagement_DAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
        }

        public string SignUp(userRegistration objuserRegistration)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objuserRegistration.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@fullname", objuserRegistration.fullname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objuserRegistration.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@mobilenumber", objuserRegistration.mobilenumber, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@password", objuserRegistration.password, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objuserRegistration.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objuserRegistration.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.SignUp, ObJParameterCOl, CommandType.StoredProcedure);
                string Massage = "";
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Massage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }

                return Massage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<userManagementModel> SignIn(string username, string password)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@username", username, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@password", password, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.usersignin, ObJParameterCOl, CommandType.StoredProcedure);
                List<userManagementModel> lstUserDetails = new List<userManagementModel>();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        //Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                        lstUserDetails = ds.Tables[0].AsEnumerable().Select(Row =>
                          new userManagementModel
                          {
                              user_id = Row.Field<Int64>("user_id"),
                              username = Row.Field<string>("username"),
                              fullname = Row.Field<string>("fullname"),
                              email_id = Row.Field<string>("email_id"),
                              mobilenumber = Row.Field<string>("mobilenumber"),
                              password = Row.Field<string>("password"),
                              profilepicture = Row.Field<string>("profilepicture"),
                              createddatetime = Row.Field<DateTime?>("createddatetime"),
                              updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                              response = Row.Field<string>("Response"),
                          }).ToList();
                    }
                }

                return lstUserDetails;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public string ForgotPassword(string UserCode)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@UserCode", UserCode, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.ForgotPassword, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string ValidateUser(string usercode)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@usercode", usercode, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.validateuser, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string RequestOTP(requestOTPModel _requestOTPModel)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@Ref_User_ID", _requestOTPModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@OTP", _requestOTPModel.OTP, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@Flag", _requestOTPModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@Type", _requestOTPModel.Type, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@IsValidate", _requestOTPModel.IsValidate, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.RequestOTP, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string manageuser(userManagementModel objclsUserManagement)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objclsUserManagement.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclsUserManagement.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@fullname", objclsUserManagement.fullname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objclsUserManagement.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@mobilenumber", objclsUserManagement.mobilenumber, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@password", objclsUserManagement.password, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@bio", objclsUserManagement.bio, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@dob", objclsUserManagement.dob, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@website", objclsUserManagement.website, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@profilepicture", objclsUserManagement.profilepicture, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objclsUserManagement.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objclsUserManagement.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objclsUserManagement.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsUserManagement.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageuser, ObJParameterCOl, CommandType.StoredProcedure);

                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objclsUserManagement.flag.Contains("NEWUSER") || objclsUserManagement.flag.Contains("MODIFYUSER"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objclsUserManagement.user_id = Convert.ToInt64(Res[1].ToString());
                            if ((objclsUserManagement.lstauthority != null && objclsUserManagement.lstauthority.Count > 0))
                            {
                                objclsUserManagement.lstauthority.ForEach(authority =>
                                {
                                    DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                    DBParameter objDBParameter2 = new DBParameter("@authority_id", authority.authority_id, DbType.Int64);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    objDBParameter2 = new DBParameter("@user_id", objclsUserManagement.user_id, DbType.Int64);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    objDBParameter2 = new DBParameter("@client_id", objclsUserManagement.client_id, DbType.Int64);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    objDBParameter2 = new DBParameter("@project_id", objclsUserManagement.project_id, DbType.Int64);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    objDBParameter2 = new DBParameter("@createdname", objclsUserManagement.createdname, DbType.String);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    objDBParameter2 = new DBParameter("@createdby", objclsUserManagement.createdby, DbType.Int64);
                                    ObJParameterCOl2.Add(objDBParameter2);
                                    DBHelper objDbHelper1 = new DBHelper();
                                    objDbHelper1.ExecuteScalar(Constant.mapauthorityuser, ObJParameterCOl2, CommandType.StoredProcedure);
                                });
                            }
                            if ((objclsUserManagement.lstproject != null && objclsUserManagement.lstproject.Count > 0))
                            {
                                objclsUserManagement.lstproject.ForEach(project =>
                                {
                                    DBParameterCollection ObJParameterCOl3 = new DBParameterCollection();
                                    DBParameter objDBParameter3 = new DBParameter("@project_id", project.project_id, DbType.Int64);
                                    ObJParameterCOl3.Add(objDBParameter3);
                                    objDBParameter3 = new DBParameter("@user_id", objclsUserManagement.user_id, DbType.Int64);
                                    ObJParameterCOl3.Add(objDBParameter3);
                                    objDBParameter3 = new DBParameter("@client_id", objclsUserManagement.client_id, DbType.Int64);
                                    ObJParameterCOl3.Add(objDBParameter3);
                                    objDBParameter3 = new DBParameter("@createdname", objclsUserManagement.createdname, DbType.String);
                                    ObJParameterCOl3.Add(objDBParameter3);
                                    objDBParameter3 = new DBParameter("@createdby", objclsUserManagement.createdby, DbType.Int64);
                                    ObJParameterCOl3.Add(objDBParameter3);
                                    DBHelper objDbHelper2 = new DBHelper();
                                    objDbHelper2.ExecuteScalar(Constant.mapprojectuser, ObJParameterCOl3, CommandType.StoredProcedure);
                                });
                            }
                            if ((objclsUserManagement.filemanager != null && objclsUserManagement.filemanager.Count > 0))
                            {
                                objclsUserManagement.filemanager.ForEach(filemanager =>
                                {
                                    filemanager.ref_id = objclsUserManagement.user_id;
                                    filemanager.file_id = filemanager.file_id;
                                    filemanager.filename = filemanager.filename;
                                    filemanager.filepath = filemanager.filepath;
                                    filemanager.filetype = filemanager.filetype;
                                    filemanager.fileextension = filemanager.fileextension;
                                    filemanager.filesize = filemanager.filesize;
                                    filemanager.fileidentifier = filemanager.fileidentifier;
                                    filemanager.displayorder = filemanager.displayorder;
                                    filemanager.module = filemanager.module;
                                    filemanager.project_id = project_id;
                                    filemanager.createdby = objclsUserManagement.user_id;
                                    filemanager.createdname = objclsUserManagement.createdname;
                                    filemanager.createddatetime = DateTime.Now;
                                    filemanager.isactive = true;
                                    filemanager.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objclsUserManagement.filemanager);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_UserFileManagerMapping", dtfilemanagercategory);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapfilemanager, ObJParameterCOl2, CommandType.StoredProcedure);
                            }
                            ResponseMessage = Res[0].ToString();
                        }
                        else
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["Response"].ToString();
                        }
                    }
                }

                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getuserdetail(string flag, Int64 user_id, string search, Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getuserdetail, ObJParameterCOl, CommandType.StoredProcedure);
                List<userManagementModel> lstuser = new List<userManagementModel>();
                List<authorityuserModel> lstauthority = new List<authorityuserModel>();
                List<projectuserModel> lstproject = new List<projectuserModel>();
                List<fileInfoModel> lstFileinfo = new List<fileInfoModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (flag == "Detail")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstauthority = ds.Tables[0].AsEnumerable().Select(Row =>
                                new authorityuserModel
                                {
                                    authority_id = Row.Field<Int64>("authority_id"),
                                    user_id = Row.Field<Int64>("user_id"),
                                    authority = Row.Field<string>("authority")
                                }).ToList();
                        }
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            lstproject = ds.Tables[1].AsEnumerable().Select(Row =>
                                new projectuserModel
                                {
                                    project_id = Row.Field<Int64>("project_id"),
                                    user_id = Row.Field<Int64>("user_id"),
                                    projectname = Row.Field<string>("projectname")
                                }).ToList();
                        }
                        if (ds.Tables[2].Rows.Count > 0)
                        {
                            lstFileinfo = ds.Tables[2].AsEnumerable().Select(Row =>
                                new fileInfoModel
                                {
                                    ref_id = Row.Field<Int64>("ref_id"),
                                    file_id = Row.Field<Int64>("file_id"),
                                    filename = Row.Field<string>("filename"),
                                    filepath = Row.Field<string>("filepath"),
                                    filetype = Row.Field<string>("filetype"),
                                    fileextension = Row.Field<string>("fileextension"),
                                    filesize = Row.Field<Int64>("filesize"),
                                    fileidentifier = Row.Field<string>("fileidentifier"),
                                    displayorder = Row.Field<Int64>("displayorder"),
                                    module = Row.Field<string>("module")
                                }).ToList();
                        }
                    }
                    if (ds.Tables[flag == "Detail" ? 3 : 0].Rows.Count > 0)
                    {
                        lstuser = ds.Tables[flag == "Detail" ? 3 : 0].AsEnumerable().Select(Row =>
                      new userManagementModel
                      {
                          user_id = Row.Field<Int64>("user_id"),
                          fullname = Row.Field<string>("fullname"),
                          username = Row.Field<string>("username"),
                          email_id = Row.Field<string>("email_id"),
                          mobilenumber = Row.Field<string>("mobilenumber"),
                          bio = Row.Field<string>("bio"),
                          dob = Row.Field<string>("dob"),
                          website = Row.Field<string>("website"),
                          filemanager = lstFileinfo,
                          is_approved = Row.Field<bool>("is_approved"),
                          password = Row.Field<string>("password"),
                          profilepicture = Row.Field<string>("profilepicture"),
                          createdby = Row.Field<Int64?>("createdby"),
                          createdname = Row.Field<string>("createdname"),
                          createddatetime = Row.Field<DateTime?>("createddatetime"),
                          updatedby = Row.Field<Int64?>("updatedby"),
                          updatedname = Row.Field<string>("updatedname"),
                          updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                          lstauthority = lstauthority,
                          lstproject = lstproject,
                      }).ToList();
                    }
                    if (ds.Tables[flag == "Detail" ? 4 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[flag == "Detail" ? 4 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstuser;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string subscribe(string email_id)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@email_id", email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managesubscribe, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getsubscriber(string flag, Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getsubscriber, ObJParameterCOl, CommandType.StoredProcedure);
                List<subscriberModel> lstsubscriber = new List<subscriberModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstsubscriber = ds.Tables[0].AsEnumerable().Select(Row =>
                          new subscriberModel
                          {
                              subscriber_id = Row.Field<Int64>("subscriber_id"),
                              email_id = Row.Field<string>("email_id"),
                              createdby = Row.Field<Int64?>("createdby"),
                              createdname = Row.Field<string>("createdname"),
                              createddatetime = Row.Field<DateTime?>("createddatetime")
                          }).ToList();
                    }
                    lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    lstresponse.data = lstsubscriber;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string managecontactus(contactUsModel objcontactus)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@fullname", objcontactus.fullname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objcontactus.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@message", objcontactus.message, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@subject", objcontactus.subject, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@mobile", objcontactus.mobile, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managecontactus, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getcontactus()
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getcontactus, ObJParameterCOl, CommandType.StoredProcedure);
                List<contactUsModel> lstcontactus = new List<contactUsModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstcontactus = ds.Tables[0].AsEnumerable().Select(Row =>
                          new contactUsModel
                          {
                              contact_id = Row.Field<Int64>("contact_id"),
                              fullname = Row.Field<string>("fullname"),
                              email_id = Row.Field<string>("email_id"),
                              mobile = Row.Field<string>("mobile"),
                              subject = Row.Field<string>("subject"),
                              message = Row.Field<string>("message"),
                              createdby = Row.Field<Int64?>("createdby"),
                              createdname = Row.Field<string>("createdname"),
                              createddatetime = Row.Field<DateTime?>("createddatetime")
                          }).ToList();
                    }
                    lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    lstresponse.data = lstcontactus;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string profilepicture(userManagementModel objclsUserManagement)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_id", objclsUserManagement.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@path", objclsUserManagement.profilepicture, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsUserManagement.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objclsUserManagement.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.updateprofilepicture, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                        if ((objclsUserManagement.filemanager != null && objclsUserManagement.filemanager.Count > 0))
                        {
                            objclsUserManagement.filemanager.ForEach(filemanager =>
                            {
                                filemanager.ref_id = objclsUserManagement.user_id;
                                filemanager.file_id = filemanager.file_id;
                                filemanager.filename = filemanager.filename;
                                filemanager.filepath = filemanager.filepath;
                                filemanager.filetype = filemanager.filetype;
                                filemanager.fileextension = filemanager.fileextension;
                                filemanager.filesize = filemanager.filesize;
                                filemanager.fileidentifier = filemanager.fileidentifier;
                                filemanager.displayorder = filemanager.displayorder;
                                filemanager.module = filemanager.module;
                                filemanager.client_id = client_id;
                                filemanager.project_id = project_id;
                                filemanager.createdby = objclsUserManagement.user_id;
                                filemanager.createdname = objclsUserManagement.createdname;
                                filemanager.createddatetime = DateTime.Now;
                                filemanager.isactive = true;
                                filemanager.isdeleted = false;
                            });
                            Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                            DataTable dtfilemanagerprofile = objCommon_DAL.GetDataTableFromList(objclsUserManagement.filemanager);
                            DBHelper objDbHelperModule = new DBHelper();
                            string tablename = objDbHelperModule.BulkImport("WebD_ProfilePicture", dtfilemanagerprofile);
                            objDbHelperModule = new DBHelper();
                            DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                            DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                            ObJParameterCOl2.Add(objDBParameter2);
                            objDbHelperModule.ExecuteNonQuery(Constant.mapfilemanagerrecipe, ObJParameterCOl2, CommandType.StoredProcedure);
                        }
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string requestfriend(userFriendModel objclsUserFriend_BO)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objclsUserFriend_BO.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclsUserFriend_BO.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@friend_id", objclsUserFriend_BO.friend_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@fullname", objclsUserFriend_BO.fullname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@username", objclsUserFriend_BO.username, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objclsUserFriend_BO.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsUserFriend_BO.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objclsUserFriend_BO.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.requestfriend, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string approvedrequest(userFriendModel objclsUserFriend_BO)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objclsUserFriend_BO.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclsUserFriend_BO.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@friend_id", objclsUserFriend_BO.friend_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@fullname", objclsUserFriend_BO.fullname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@username", objclsUserFriend_BO.username, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@approved", objclsUserFriend_BO.approved, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objclsUserFriend_BO.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsUserFriend_BO.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objclsUserFriend_BO.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.approvedrequest, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string addressupdate(userAddressModel objuserAddressModel)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objuserAddressModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@address_id", objuserAddressModel.address_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objuserAddressModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@flat_number", objuserAddressModel.flat_number, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@buildingname", objuserAddressModel.buildingname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@line_one", objuserAddressModel.line_one, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@line_two", objuserAddressModel.line_two, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@landmark", objuserAddressModel.landmark, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@pincode_id", objuserAddressModel.pincode_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@country_id", objuserAddressModel.country_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@state_id", objuserAddressModel.state_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@city_id", objuserAddressModel.city_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@city_id", objuserAddressModel.city_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objuserAddressModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objuserAddressModel.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.approvedrequest, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getusertoken(string authToken)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@authToken", authToken, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getusertoken, ObJParameterCOl, CommandType.StoredProcedure);
                List<AuthModel> lstToken = new List<AuthModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstToken = ds.Tables[0].AsEnumerable().Select(Row =>
                          new AuthModel
                          {
                              authToken = Row.Field<string>("authToken"),
                              refreshToken = Row.Field<string>("refreshToken"),
                              expiresIn = Row.Field<DateTime>("expiresIn"),
                              user_id = Row.Field<Int64>("user_id"),
                              username = Row.Field<string>("username"),
                              fullname = Row.Field<string>("fullname"),
                              email_id = Row.Field<string>("email_id"),
                              mobilenumber = Row.Field<string>("mobilenumber"),
                              password = Row.Field<string>("password"),
                              createddatetime = Row.Field<DateTime>("createddatetime"),
                              updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                              response = Row.Field<string>("Response"),
                          }).ToList();
                    }
                    lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    lstresponse.data = lstToken;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void Dispose()
        {

        }
    }
}
