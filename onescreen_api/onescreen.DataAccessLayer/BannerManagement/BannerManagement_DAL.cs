using Microsoft.AspNetCore.Http;
using onescreen.DAL.Common;
using onescreenModel.BannerManagement;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.BannerManagement
{
    public class BannerManagement_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 project_id;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public BannerManagement_DAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
        }

        public responseModel getbanner(string flag, Int64 banner_id, string category = "", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@banner_id", banner_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category", category, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@search", search, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@start_count", start_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@end_count", end_count, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                responseModel lstresponse = new responseModel();
                List<bannerLabelModel> lstlabel = new List<bannerLabelModel>();
                List<bannerCategoryModel> lstcategory = new List<bannerCategoryModel>();
                List<bannerTypeModel> lsttypemaster = new List<bannerTypeModel>();
                List<bannerModel> lstBanner = new List<bannerModel>();
                List<fileInfoModel> lstFileinfo = new List<fileInfoModel>();

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getbanner, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (flag == "Details")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstlabel = ds.Tables[0].AsEnumerable().Select(Row =>
                                new bannerLabelModel
                                {
                                    banner_id = Row.Field<Int64>("banner_id"),
                                    label_id = Row.Field<Int64>("label_id"),
                                    label = Row.Field<string>("label")
                                }).ToList();
                        }
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            lstcategory = ds.Tables[1].AsEnumerable().Select(Row =>
                                new bannerCategoryModel
                                {
                                    banner_id = Row.Field<Int64>("banner_id"),
                                    category_id = Row.Field<Int64>("category_id"),
                                    category = Row.Field<string>("category")
                                }).ToList();
                        }
                        if (ds.Tables[2].Rows.Count > 0)
                        {
                            lsttypemaster = ds.Tables[2].AsEnumerable().Select(Row =>
                                new bannerTypeModel
                                {
                                    banner_id = Row.Field<Int64>("banner_id"),
                                    typemaster_id = Row.Field<Int64>("typemaster_id"),
                                    typemaster = Row.Field<string>("typemaster")
                                }).ToList();
                        }
                        if (ds.Tables[3].Rows.Count > 0)
                        {
                            lstFileinfo = ds.Tables[3].AsEnumerable().Select(Row =>
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
                    if (ds.Tables[flag == "Details" ? 4 : 0].Rows.Count > 0)
                    {
                        lstBanner = ds.Tables[flag == "Details" ? 4 : 0].AsEnumerable().Select(Row =>
                            new bannerModel
                            {
                                banner_id = Row.Field<Int64>("banner_id"),
                                title = Row.Field<string>("title"),
                                subtitle = Row.Field<string>("subtitle"),
                                thumbnail = Row.Field<string>("thumbnail"),
                                url = Row.Field<string>("url"),
                                displayorder = Row.Field<Int64>("displayorder"),
                                description = Row.Field<string>("description"),
                                lstlabel = lstlabel,
                                lstcategory = lstcategory,
                                filemanager = lstFileinfo,
                                lsttypemaster = lsttypemaster,
                                project_id = Row.Field<Int64>("project_id"),
                                createdby = Row.Field<Int64>("createdby"),
                                createdname = Row.Field<string>("createdname"),
                                createddatetime = Row.Field<DateTime?>("createddatetime"),
                                updatedby = Row.Field<Int64?>("updatedby"),
                                updatedname = Row.Field<string>("updatedname"),
                                updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                isactive = Row.Field<bool>("isactive"),
                                isdeleted = Row.Field<bool>("isdeleted")
                            }).ToList();
                    }
                    if (ds.Tables[flag == "Details" ? 5 : 1].Rows.Count > 0)
                    {
                        lstresponse.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 5 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    lstresponse.data = lstBanner;

                }
                return lstresponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string managebanner(bannerModel objbannerModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objbannerModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@banner_id", objbannerModel.banner_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@title", objbannerModel.title, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@subtitle", objbannerModel.subtitle, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objbannerModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@url", objbannerModel.url, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@displayorder", objbannerModel.displayorder, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@thumbnail", objbannerModel.thumbnail, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objbannerModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objbannerModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objbannerModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managebanner, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objbannerModel.flag.Contains("NEWBANNER") || objbannerModel.flag.Contains("MODIFYBANNER"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objbannerModel.banner_id = Convert.ToInt64(Res[1].ToString());
                            if ((objbannerModel.filemanager != null && objbannerModel.filemanager.Count > 0))
                            {
                                objbannerModel.filemanager.ForEach(filemanager =>
                                {
                                    filemanager.ref_id = objbannerModel.banner_id;
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
                                    filemanager.createdby = objbannerModel.user_id;
                                    filemanager.createdname = objbannerModel.createdname;
                                    filemanager.createddatetime = DateTime.Now;
                                    filemanager.isactive = true;
                                    filemanager.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objbannerModel.filemanager);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_BannerFileManagerMapping", dtfilemanagercategory);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapfilemanager, ObJParameterCOl2, CommandType.StoredProcedure);
                            }
                            if ((objbannerModel.lsttypemaster != null && objbannerModel.lsttypemaster.Count > 0))
                            {
                                objbannerModel.lsttypemaster.ForEach(type =>
                                {
                                    type.typemaster_id = type.typemaster_id;
                                    type.banner_id = objbannerModel.banner_id;
                                    type.project_id = project_id;
                                    type.createdby = objbannerModel.user_id;
                                    type.createdname = objbannerModel.createdname;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtrecipedata = objCommon_DAL.GetDataTableFromList(objbannerModel.lsttypemaster);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_BannerTypeMapping", dtrecipedata);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl3 = new DBParameterCollection();
                                DBParameter objDBParameter3 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl3.Add(objDBParameter3);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapbannertype, ObJParameterCOl3, CommandType.StoredProcedure);
                            }
                            if ((objbannerModel.lstcategory != null && objbannerModel.lstcategory.Count > 0))
                            {
                                objbannerModel.lstcategory.ForEach(category =>
                                {
                                    category.category_id = category.category_id;
                                    category.banner_id = objbannerModel.banner_id;
                                    category.project_id = project_id;
                                    category.createdby = objbannerModel.user_id;
                                    category.createdname = objbannerModel.createdname;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtrecipedata = objCommon_DAL.GetDataTableFromList(objbannerModel.lstcategory);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_BannerCategoryMapping", dtrecipedata);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl4 = new DBParameterCollection();
                                DBParameter objDBParameter4 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl4.Add(objDBParameter4);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapbannercategory, ObJParameterCOl4, CommandType.StoredProcedure);
                            }
                            if ((objbannerModel.lstlabel != null && objbannerModel.lstlabel.Count > 0))
                            {
                                objbannerModel.lstlabel.ForEach(label =>
                                {
                                    label.label_id = label.label_id;
                                    label.banner_id = objbannerModel.banner_id;
                                    label.project_id = project_id;
                                    label.createdby = objbannerModel.user_id;
                                    label.createdname = objbannerModel.createdname;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtrecipedata = objCommon_DAL.GetDataTableFromList(objbannerModel.lstlabel);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_BannerLabelMapping", dtrecipedata);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl5 = new DBParameterCollection();
                                DBParameter objDBParameter5 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl5.Add(objDBParameter5);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapbannerlabel, ObJParameterCOl5, CommandType.StoredProcedure);
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
        public void Dispose()
        {
            //throw new NotImplementedException();
        }
    }
}
