using Microsoft.AspNetCore.Http;
using onescreen.DAL.Common;
using onescreenModel.Common;
using onescreenModel.MasterManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.MasterManagement
{
    public class MasterManagement_DAL :IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 client_id;
        private readonly Int64 project_id;

        public MasterManagement_DAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
           
        }
        public string AddUserMaster(usermasterModel ObjUserMaster)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", ObjUserMaster.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_id", ObjUserMaster.usermaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_name", ObjUserMaster.usermaster_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_description", ObjUserMaster.usermaster_description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@parent_ids", ObjUserMaster.parent_ids, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@is_mandatory", ObjUserMaster.is_mandatory, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@has_parent", ObjUserMaster.has_parent, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@allow_alphanumeric", ObjUserMaster.allow_alphanumeric, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@allow_numeric", ObjUserMaster.allow_numeric, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@allow_negative_number", ObjUserMaster.allow_negative_number, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@allow_specialcharacter", ObjUserMaster.allow_specialcharacter, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@special_character", ObjUserMaster.special_character, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", ObjUserMaster.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.AddModifyUserMaster, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["Response"].ToString();

                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel GetUserMasterList(string flag, Int64 usermaster_id, Boolean is_mandatory, Boolean has_parent, string search, Int64 start_count, Int64 end_count)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_id", usermaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@is_mandatory", is_mandatory, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@has_parent", has_parent, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();

                DataSet ds = objDbHelper.ExecuteDataSet(Constant.GetUserMasterList, ObJParameterCOl, CommandType.StoredProcedure);
                List<usermasterModel> lstUsermaster = new List<usermasterModel>();

                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstUsermaster = ds.Tables[0].AsEnumerable().Select(Row =>
                            new usermasterModel
                            {
                                usermaster_id = Row.Field<Int64>("usermaster_id"),
                                usermaster_name = Row.Field<string>("usermaster_name"),
                                usermaster_description = Row.Field<string>("usermaster_description"),
                                //usermaster_control_id = Row.Field<Int64>("usermaster_control_id"),
                                parent_ids = Row.Field<Int64>("parent_ids"),
                                allow_specialcharacter = Row.Field<Boolean>("allow_specialcharacter"),
                                allow_alphanumeric = Row.Field<Boolean>("allow_alphanumeric"),
                                allow_negative_number = Row.Field<Boolean>("allow_negative_number"),
                                allow_numeric = Row.Field<Boolean>("allow_numeric"),
                                special_character = Row.Field<string>("special_character"),
                                is_mandatory = Row.Field<Boolean>("is_mandatory"),
                                has_parent = Row.Field<Boolean>("has_parent"),
                                client_id = Row.Field<Int64>("client_id"),
                                project_id = Row.Field<Int64>("project_id"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<Boolean>("isactive"),
                                isdeleted = Row.Field<Boolean>("isdeleted"),
                            }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstUsermaster;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<parentUserMasterModel> GetParentUserMasterList(Int64 UserMasterID)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@UserMasterID", UserMasterID, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.GetParentUserMasterList, ObJParameterCOl, CommandType.StoredProcedure);
                List<parentUserMasterModel> objUserMasterData = new List<parentUserMasterModel>();

                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        IList<parentUserMasterModel> List = ds.Tables[0].AsEnumerable().Select(Row =>
                            new parentUserMasterModel
                            {
                                usermaster_id = Row.Field<Int64>("usermaster_id"),
                                usermaster_name = Row.Field<string>("usermaster_name"),
                                typeOfView = Row.Field<string>("UserMasterControl"),
                                is_compulsory = Row.Field<Boolean>("is_compulsory"),
                                usermasterdata = ds.Tables[0].AsEnumerable().Where(x => x.Field<Int64>("usermaster_id") == Row.Field<Int64>("usermaster_id")).Select(Row1 =>
                                    new usermasterdataModel
                                    {
                                        usermasterdata_id = Row1.Field<Int64>("usermasterdata_id"),
                                        usermasterdata_name = Row1.Field<string>("usermasterdata_name")
                                    }).ToList()
                            }).ToList();
                        objUserMasterData.AddRange(List);
                    }
                }
                return objUserMasterData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string AddUserMasterData(usermasterdataModel ObjUserMasterData)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", ObjUserMasterData.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermasterdata_id", ObjUserMasterData.usermasterdata_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_id", ObjUserMasterData.usermaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermasterdata_name", ObjUserMasterData.usermasterdata_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermasterdata_description", ObjUserMasterData.usermasterdata_description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermasterdata_parent_id", ObjUserMasterData.usermasterdata_parent_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", ObjUserMasterData.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", ObjUserMasterData.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", ObjUserMasterData.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.AddModifyUserMasterData, ObJParameterCOl, CommandType.StoredProcedure);
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

        public responseModel GetUserMasterDataList(string flag, Int64 usermasterdata_id, string usermaster_name, string search, Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermasterdata_id", usermasterdata_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@usermaster_name", usermaster_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                responseModel lstresponse = new responseModel();
                List<usermasterdatamasterModel> lstmasterdata = new List<usermasterdatamasterModel>();
                List<usermasterdataModel> lstUserMasterData = new List<usermasterdataModel>();
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.GetUserMasterDataList, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (flag == "Details")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstmasterdata = ds.Tables[0].AsEnumerable().Select(Row =>
                                new usermasterdatamasterModel
                                {
                                    usermaster_id = Row.Field<Int64>("usermaster_id"),
                                    usermaster_name = Row.Field<string>("usermaster_name")
                                }).ToList();
                        }
                    }
                    if (ds.Tables[flag == "Details" ? 1 : 0].Rows.Count > 0)
                    {
                        lstUserMasterData = ds.Tables[flag == "Details" ? 1 : 0].AsEnumerable().Select(Row =>
                            new usermasterdataModel
                            {
                                usermasterdata_id = Row.Field<Int64>("usermasterdata_id"),
                                usermaster_id = Row.Field<Int64>("usermaster_id"),
                                usermasterdata_name = Row.Field<string>("usermasterdata_name"),
                                usermasterdata_description = Row.Field<string>("usermasterdata_description"),
                                usermasterdata_parent_id = Row.Field<Int64>("usermasterdata_parent_id"),
                                usermaster_name = Row.Field<string>("usermaster_name"),
                                lstmasterdata = lstmasterdata,
                                client_id = Row.Field<Int64>("client_id"),
                                project_id = Row.Field<Int64>("project_id"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<Boolean>("isactive"),
                                isdeleted = Row.Field<Boolean>("isdeleted"),
                            }).ToList();
                    }

                    if (ds.Tables[flag == "Details" ? 2 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 2 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstUserMasterData;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string typemaster(typemasterModel objclsTypeMaster_BO)
        {
            string Response = "";
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = objDBParameter = new DBParameter("@Flag", objclsTypeMaster_BO.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", objclsTypeMaster_BO.typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster", objclsTypeMaster_BO.typemaster, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objclsTypeMaster_BO.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objclsTypeMaster_BO.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@displayorder", objclsTypeMaster_BO.displayorder, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objclsTypeMaster_BO.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclsTypeMaster_BO.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsTypeMaster_BO.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.TypeMaster, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        Response = ds.Tables[0].Rows[0]["Response"].ToString();
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel gettypemaster(string flag, string aliasname = "null", Int64 typemaster_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.GetTypeMaster, ObJParameterCOl, CommandType.StoredProcedure);
                List<typemasterModel> lstContentType = new List<typemasterModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstContentType = ds.Tables[0].AsEnumerable().Select(Row =>
                            new typemasterModel
                            {
                                typemaster_id = Row.Field<Int64>("typemaster_id"),
                                typemaster = Row.Field<string>("typemaster"),
                                aliasname = Row.Field<string>("aliasname"),
                                description = Row.Field<string>("description"),
                                displayorder = Row.Field<Int64>("displayorder"),
                                client_id = Row.Field<Int64>("client_id"),
                                project_id = Row.Field<Int64>("project_id"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<bool>("isactive"),
                                isdeleted = Row.Field<bool>("isdeleted"),
                            }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstContentType;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string category(categoryModel objcategoryModel)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = objDBParameter = new DBParameter("@flag", objcategoryModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category_id", objcategoryModel.category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", objcategoryModel.typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster", objcategoryModel.typemaster, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objcategoryModel.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@parent_category_id", objcategoryModel.parent_category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category", objcategoryModel.category, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isfeatured", objcategoryModel.isfeatured, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@displayorder", objcategoryModel.displayorder, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objcategoryModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objcategoryModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objcategoryModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objcategoryModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                string ResponseMessage = "";
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managecategory, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objcategoryModel.flag.Contains("NEWCATEGORY") || objcategoryModel.flag.Contains("MODIFYCATEGORY"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objcategoryModel.category_id = Convert.ToInt64(Res[1].ToString());
                            if ((objcategoryModel.filemanager != null && objcategoryModel.filemanager.Count > 0))
                            {
                                objcategoryModel.filemanager.ForEach(filemanager =>
                                {
                                    filemanager.ref_id = objcategoryModel.category_id;
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
                                    filemanager.createdby = objcategoryModel.user_id;
                                    filemanager.createdname = objcategoryModel.createdname;
                                    filemanager.createddatetime = DateTime.Now;
                                    filemanager.isactive = true;
                                    filemanager.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objcategoryModel.filemanager);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_CategoryFileManagerMapping", dtfilemanagercategory);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapfilemanagercategory, ObJParameterCOl2, CommandType.StoredProcedure);
                            }
                            ResponseMessage = Res[0].ToString();
                        }
                        else
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
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
        public responseModel getcategory(string flag, Int64 typemaster_id = 0, string typemaster = "null", Int64 category_id = 0, string aliasname = "null", bool isfeatured = false, Int64 parent_category_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category_id", category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster", typemaster, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isfeatured", isfeatured, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@parent_category_id", parent_category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getcategory, ObJParameterCOl, CommandType.StoredProcedure);
                List<categoryModel> lstCategoryDetails = new List<categoryModel>();
                List<typemasterModel> lstTypemaster = new List<typemasterModel>();
                List<categoryModel> lstParentCategory = new List<categoryModel>();
                List<fileInfoModel> lstFileinfo = new List<fileInfoModel>();
                responseModel lstresponse = new responseModel();

                if (ds != null)
                {
                    if (flag == "Details")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstTypemaster = ds.Tables[0].AsEnumerable().Select(Row =>
                                new typemasterModel
                                {
                                    typemaster_id = Row.Field<Int64>("typemaster_id"),
                                    typemaster = Row.Field<string>("typemaster")
                                }).ToList();
                        }
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            lstParentCategory = ds.Tables[1].AsEnumerable().Select(Row =>
                                new categoryModel
                                {
                                    category_id = Row.Field<Int64>("category_id"),
                                    category = Row.Field<string>("category")
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
                    if (ds.Tables[flag == "Details" ? 3 : 0].Rows.Count > 0)
                    {
                        lstCategoryDetails = ds.Tables[flag == "Details" ? 3 : 0].AsEnumerable().Select(Row =>
                            new categoryModel
                            {
                                typemaster_id = Row.Field<Int64>("typemaster_id"),
                                typemaster = Row.Field<string>("typemaster"),
                                category_id = Row.Field<Int64>("category_id"),
                                parent_category_id = Row.Field<Int64>("parent_category_id"),
                                category = Row.Field<string>("category"),
                                aliasname = Row.Field<string>("aliasname"),
                                thumbnail = Row.Field<string>("thumbnail"),
                                description = Row.Field<string>("description"),
                                isfeatured = Row.Field<bool>("isfeatured"),
                                displayorder = Row.Field<Int64>("displayorder"),
                                client_id = Row.Field<Int64>("client_id"),
                                project_id = Row.Field<Int64>("project_id"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<bool>("isactive"),
                                isdeleted = Row.Field<bool>("isdeleted"),
                                filemanager = lstFileinfo,
                                lstparentcategory = lstParentCategory,
                                lsttypemaster = lstTypemaster
                            }).ToList();
                    }
                    if (ds.Tables[flag == "Details" ? 4 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 4 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstCategoryDetails;

                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string labelmaster(labelModel objlabelModel)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objlabelModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@label_id", objlabelModel.label_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", objlabelModel.typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster", objlabelModel.typemaster, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@label", objlabelModel.label, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objlabelModel.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objlabelModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objlabelModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objlabelModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objlabelModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                string Massage = "";
                DBHelper objDbHelper = new DBHelper();
                Massage = Convert.ToString(objDbHelper.ExecuteScalar(Constant.labelmaster, ObJParameterCOl, CommandType.StoredProcedure));

                return Massage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getlabelmaster(string flag, Int64 label_id = 0, string aliasname = "null", Int64 typemaster_id = 0, string typemaster = "null", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@label_id", label_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster_id", typemaster_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@typemaster", typemaster, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                //objDBParameter = new DBParameter("@search", search, DbType.String);
                //ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()), DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getlabelmaster, ObJParameterCOl, CommandType.StoredProcedure);
                List<labelModel> lstLabelDetails = new List<labelModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstLabelDetails = ds.Tables[0].AsEnumerable().Select(Row =>
                            new labelModel
                            {
                                client_id = Row.Field<Int64>("client_id"),
                                project_id = Row.Field<Int64>("project_id"),
                                typemaster_id = Row.Field<Int64>("typemaster_id"),
                                typemaster = Row.Field<string>("typemaster"),
                                label_id = Row.Field<Int64>("label_id"),
                                label = Row.Field<string>("label"),
                                description = Row.Field<string>("description"),
                                aliasname = Row.Field<string>("aliasname"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<Boolean>("isactive"),
                                isdeleted = Row.Field<Boolean>("isdeleted"),
                            }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstLabelDetails;
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
