using Microsoft.AspNetCore.Http;
using onescreen.DAL.Common;
using onescreenModel.ClientManagement;
using onescreenModel.Common;
using onescreenModel.Configuration;
using onescreenModel.ProjectManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.Configuration
{
    public class Configuration_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 client_id;
        private readonly Int64 project_id;

        public Configuration_DAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
        }

        public List<userConfigurationModel> getuserconfig(Int64 user_id)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getuserconfig, ObJParameterCOl, CommandType.StoredProcedure);
                List<userConfigurationModel> lstconfig = new List<userConfigurationModel>();
                List<clientModel> lstclient = new List<clientModel>();
                List<projectModel> lstproject = new List<projectModel>();
                List<userModuleModel> lstmosule = new List<userModuleModel>();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstclient = ds.Tables[0].AsEnumerable().Select(Row =>
                         new clientModel
                         {
                             client_id = Row.Field<Int64>("client_id"),
                             clientname = Row.Field<string>("clientname"),
                         }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstproject = ds.Tables[1].AsEnumerable().Select(Row =>
                            new projectModel
                            {
                                project_id = Row.Field<Int64>("project_id"),
                                projectname = Row.Field<string>("projectname"),
                                client_id = Row.Field<Int64>("client_id"),
                                clientname = Row.Field<string>("clientname"),
                            }).ToList();
                    }
                    //if (ds.Tables[2].Rows.Count > 0)
                    //{
                    //    lstmosule = ds.Tables[2].AsEnumerable().Select(Row =>
                    //        new userModuleModel
                    //        {
                    //            module_id = Row.Field<Int64>("module_id"),
                    //            module_parent_id = Row.Field<Int64>("module_parent_id"),
                    //            modulename = Row.Field<string>("modulename"),
                    //            moduleicon = Row.Field<string>("moduleicon"),
                    //            modulerouting = Row.Field<string>("modulerouting"),
                    //            modulepath = Row.Field<string>("modulepath"),
                    //        }).ToList();
                    //}
                    lstconfig.Add(new userConfigurationModel()
                    {
                        //usermodulelist = lstmosule,
                        clientlist = lstclient,
                        projectlist = lstproject
                    });
                }
                return lstconfig;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string usermodule(userModuleModel objuserModuleModel)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objuserModuleModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@module_id", objuserModuleModel.module_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@module_parent_id", objuserModuleModel.module_parent_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@moduleicon", objuserModuleModel.moduleicon, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@module_identifier", objuserModuleModel.module_identifier, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@modulename", objuserModuleModel.modulename, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@modulerouting", objuserModuleModel.modulerouting, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@modulepath", objuserModuleModel.modulepath, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category_id", objuserModuleModel.category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objuserModuleModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objuserModuleModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageusermodule, ObJParameterCOl, CommandType.StoredProcedure);

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

        public responseModel getmodule(Int64 module_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@module_id", module_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.GetUserModule, ObJParameterCOl, CommandType.StoredProcedure);
                List<userModuleModel> lstmodule = new List<userModuleModel>();
                List<userModuleCategoryModel> lstcategorymodule = new List<userModuleCategoryModel>();
                List<userParentModuleModel> lstparentmodule = new List<userParentModuleModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0 && module_id > 0)
                    {
                        lstcategorymodule = ds.Tables[0].AsEnumerable().Select(Row =>
                          new userModuleCategoryModel
                          {
                              category_id = Row.Field<Int64>("category_id"),
                              category = Row.Field<string>("category"),
                          }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0 && module_id > 0)
                    {
                        lstparentmodule = ds.Tables[1].AsEnumerable().Select(Row =>
                          new userParentModuleModel
                          {
                              module_id = Row.Field<Int64>("module_id"),
                              modulename = Row.Field<string>("modulename"),
                          }).ToList();
                    }
                    if (ds.Tables[module_id > 0 ? 2 : 0].Rows.Count > 0)
                    {
                        lstmodule = ds.Tables[module_id > 0 ? 2 : 0].AsEnumerable().Select(Row =>
                          new userModuleModel
                          {
                              module_id = Row.Field<Int64>("module_id"),
                              module_parent_id = Row.Field<Int64>("module_parent_id"),
                              category_id = Row.Field<Int64>("category_id"),
                              moduleicon = Row.Field<string>("moduleicon"),
                              modulename = Row.Field<string>("modulename"),
                              module_identifier = Row.Field<string>("module_identifier"),
                              modulerouting = Row.Field<string>("modulerouting"),
                              modulepath = Row.Field<string>("modulepath"),
                              createdby = Row.Field<Int64?>("createdby"),
                              createdname = Row.Field<string>("createdname"),
                              createddatetime = Row.Field<DateTime?>("createddatetime"),
                              lstcategory = lstcategorymodule,
                              lstparentmodule = lstparentmodule
                          }).ToList();
                    }
                    if (ds.Tables[module_id > 0 ? 3 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[module_id > 0 ? 3 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstmodule;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string authoritymodule(authorityModel objclsAuthority)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objclsAuthority.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@authority_id", objclsAuthority.authority_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@authority", objclsAuthority.authority, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objclsAuthority.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclsAuthority.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclsAuthority.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageauthority, ObJParameterCOl, CommandType.StoredProcedure);

                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objclsAuthority.flag.Contains("NEWAUTHORITY") || objclsAuthority.flag.Contains("MODIFYAUTHORITY"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objclsAuthority.authority_id = Convert.ToInt64(Res[1].ToString());
                            if ((objclsAuthority.lstmodule != null && objclsAuthority.lstmodule.Count > 0))
                            {
                                objclsAuthority.lstmodule.ForEach(module =>
                                {
                                    module.authority_id = objclsAuthority.authority_id;
                                    module.project_id = project_id;
                                    module.client_id = client_id;
                                    module.createdby = objclsAuthority.user_id;
                                    module.createdname = objclsAuthority.createdname;
                                    //module.createddatetime = DateTime.Now;
                                    module.isactive = true;
                                    module.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtmoduledata = objCommon_DAL.GetDataTableFromList(objclsAuthority.lstmodule);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_AuthorityModule", dtmoduledata);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapauthoritymodule, ObJParameterCOl2, CommandType.StoredProcedure);
                            }
                            if ((objclsAuthority.lstcontrol != null && objclsAuthority.lstcontrol.Count > 0))
                            {
                                objclsAuthority.lstcontrol.ForEach(control =>
                                {
                                    control.authority_id = objclsAuthority.authority_id;
                                    control.project_id = project_id;
                                    control.client_id = client_id;
                                    control.createdby = objclsAuthority.user_id;
                                    control.createdname = objclsAuthority.createdname;
                                    //control.createddatetime = DateTime.Now;
                                    control.isactive = true;
                                    control.isdeleted = false;
                                });

                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtcontroldata = objCommon_DAL.GetDataTableFromList(objclsAuthority.lstcontrol);
                                DBHelper objDbHelperControl = new DBHelper();
                                string tablename = objDbHelperControl.BulkImport("WebD_AuthorityControl", dtcontroldata);
                                objDbHelperControl = new DBHelper();
                                DBParameterCollection ObJParameterCOl3 = new DBParameterCollection();
                                DBParameter objDBParameter3 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl3.Add(objDBParameter3);
                                objDbHelperControl.ExecuteNonQuery(Constant.mapauthoritycontrol, ObJParameterCOl3, CommandType.StoredProcedure);
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

        public responseModel getauthority(Int64 authority_id, string flag)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@authority_id", authority_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getauthority, ObJParameterCOl, CommandType.StoredProcedure);

                List<authorityModel> lstauthority = new List<authorityModel>();
                List<userModuleModel> lstmodule = new List<userModuleModel>();
                List<controlsModel> lstcontrols = new List<controlsModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {

                    if (flag == "DETAILS")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstmodule = ds.Tables[0].AsEnumerable().Select(Row =>
                      new userModuleModel
                      {
                          module_id = Row.Field<Int64>("module_id"),
                          module_parent_id = Row.Field<Int64>("module_parent_id"),
                      }).ToList();
                        }
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            lstcontrols = ds.Tables[1].AsEnumerable().Select(Row =>
                          new controlsModel
                          {
                              authority_id = Row.Field<Int64>("authority_id"),
                              control_id = Row.Field<Int64>("control_id"),
                              module_id = Row.Field<Int64>("module_id")
                          }).ToList();
                        }
                    }
                    if (ds.Tables[flag == "DETAILS" ? 2 : 0].Rows.Count > 0)
                    {
                        lstauthority = ds.Tables[flag == "DETAILS" ? 2 : 0].AsEnumerable().Select(Row =>
                              new authorityModel
                              {
                                  authority_id = Row.Field<Int64>("authority_id"),
                                  authority = Row.Field<string>("authority"),
                                  description = Row.Field<string>("description"),
                                  createdby = Row.Field<Int64?>("createdby"),
                                  createdname = Row.Field<string>("createdname"),
                                  createddatetime = Row.Field<DateTime?>("createddatetime"),
                                  updatedby = Row.Field<Int64?>("updatedby"),
                                  updatedname = Row.Field<string>("updatedname"),
                                  updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                  isactive = Row.Field<bool>("isactive"),
                                  isdeleted = Row.Field<bool>("isdeleted"),
                                  lstmodule = lstmodule,
                                  lstcontrol = lstcontrols


                              }).ToList();
                    }
                    if (ds.Tables[flag == "DETAILS" ? 3 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[flag == "DETAILS" ? 3 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstauthority;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string controls(controlsModel objcontrolsModel)
        {
            try
            {
                string Response = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objcontrolsModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@control_id", objcontrolsModel.control_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@title", objcontrolsModel.title, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@syscontrolname", objcontrolsModel.syscontrolname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objcontrolsModel.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@module_id", objcontrolsModel.module_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@modulename", objcontrolsModel.modulename, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objcontrolsModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objcontrolsModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objcontrolsModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managecontrol, ObJParameterCOl, CommandType.StoredProcedure);

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

        public responseModel getcontrols(Int64 control_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@control_id", control_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getcontrols, ObJParameterCOl, CommandType.StoredProcedure);
                List<controlsModel> lstcontrols = new List<controlsModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstcontrols = ds.Tables[0].AsEnumerable().Select(Row =>
                          new controlsModel
                          {
                              control_id = Row.Field<Int64>("control_id"),
                              title = Row.Field<string>("title"),
                              aliasname = Row.Field<string>("aliasname"),
                              syscontrolname = Row.Field<string>("syscontrolname"),
                              module_id = Row.Field<Int64>("module_id"),
                              modulename = Row.Field<string>("modulename"),
                              description = Row.Field<string>("description"),
                              createdby = Row.Field<Int64?>("createdby"),
                              createdname = Row.Field<string>("createdname"),
                              createddatetime = Row.Field<DateTime?>("createddatetime"),
                              updatedby = Row.Field<Int64?>("updatedby"),
                              updatedname = Row.Field<string>("updatedname"),
                              updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                              isactive = Row.Field<bool>("isactive"),
                              isdeleted = Row.Field<bool>("isdeleted")
                          }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstcontrols;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getauthoritycontrols(Int64 user_id, string module_aliasname)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@module_aliasname", module_aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getauthoritycontrols, ObJParameterCOl, CommandType.StoredProcedure);
                List<controlsModel> lstcontrols = new List<controlsModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstcontrols = ds.Tables[0].AsEnumerable().Select(Row =>
                          new controlsModel
                          {
                              syscontrolname = Row.Field<string>("syscontrolname"),
                              module_id = Row.Field<Int64>("module_id"),
                              modulename = Row.Field<string>("modulename"),
                              allowaccess = Row.Field<bool>("allowaccess")
                          }).ToList();
                    }
                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstcontrols;
                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getauthoritymodule(Int64 user_id)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getauthoritymodule, ObJParameterCOl, CommandType.StoredProcedure);
                List<userModuleModel> lstmodule = new List<userModuleModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstmodule = ds.Tables[0].AsEnumerable().Select(Row =>
                           new userModuleModel
                           {
                               module_id = Row.Field<Int64>("module_id"),
                               module_parent_id = Row.Field<Int64>("module_parent_id"),
                               moduleicon = Row.Field<string>("moduleicon"),
                               modulename = Row.Field<string>("modulename"),
                               modulerouting = Row.Field<string>("modulerouting"),
                               modulepath = Row.Field<string>("modulepath"),
                               module_identifier = Row.Field<string>("module_identifier"),
                               //createdby = Row.Field<Int64?>("createdby"),
                               //createdname = Row.Field<string>("createdname"),
                               //createddatetime = Row.Field<DateTime?>("createddatetime")
                           }).ToList();
                    }

                    if (ds.Tables[1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstmodule;
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
