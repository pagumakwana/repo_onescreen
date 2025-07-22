using Microsoft.AspNetCore.Http;
using onescreen.DAL.Common;
using onescreenModel.Common;
using onescreenModel.ProductManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.ProductManagement
{
    public class ProductManagement_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 client_id;
        private readonly Int64 project_id;

        public ProductManagement_DAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
        }

        public responseModel getproduct(string flag, Int64 product_id, Int64 brand_id = 0, string category_name = "", Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_id", product_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_id", brand_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category_name", category_name, DbType.String);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getproduct, ObJParameterCOl, CommandType.StoredProcedure);
                List<productCategoryModel> lstcategory = new List<productCategoryModel>();
                List<brandModel> lstbrand = new List<brandModel>();
                List<fileInfoModel> lstFileinfo = new List<fileInfoModel>();
                List<productModel> lstproducts = new List<productModel>();
                if (ds != null)
                {
                    if (flag == "Details")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstcategory = ds.Tables[0].AsEnumerable().Select(Row =>
                                new productCategoryModel
                                {
                                    category_id = Row.Field<Int64>("category_id"),
                                    category = Row.Field<string>("category")
                                }).ToList();
                        }
                        if (ds.Tables[1].Rows.Count > 0)
                        {
                            lstbrand = ds.Tables[1].AsEnumerable().Select(Row =>
                                new brandModel
                                {
                                    brand_id = Row.Field<Int64>("brand_id"),
                                    brand_name = Row.Field<string>("brand_name")
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
                        lstproducts = ds.Tables[flag == "Details" ? 3 : 0].AsEnumerable().Select(Row =>
                          new productModel
                          {
                              product_id = Row.Field<Int64>("product_id"),
                              product_name = Row.Field<string>("product_name"),
                              product_description = Row.Field<string>("product_description"),
                              brand_id = Row.Field<Int64>("brand_id"),
                              brand_name = Row.Field<string>("brand_name"),
                              thumbnail = Row.Field<string>("thumbnail"),
                              category_id = Row.Field<Int64>("category_id"),
                              category = Row.Field<string>("category"),
                              lstcategory = lstcategory,
                              lstbrand = lstbrand,
                              filemanager = lstFileinfo,
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
                    if (ds.Tables[flag == "Details" ? 4 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 4 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    response.data = lstproducts;
                }
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public string manageproduct(productModel objproductModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objproductModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_id", objproductModel.product_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_id", objproductModel.brand_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_name", objproductModel.product_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_description", objproductModel.product_description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@category_id", objproductModel.category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@thumbnail", objproductModel.thumbnail, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objproductModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objproductModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objproductModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objproductModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objproductModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageproduct, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objproductModel.flag.Contains("NEWPRODUCT") || objproductModel.flag.Contains("MODIFYPRODUCT"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objproductModel.product_id = Convert.ToInt64(Res[1].ToString());
                            if ((objproductModel.filemanager != null && objproductModel.filemanager.Count > 0))
                            {
                                objproductModel.filemanager.ForEach(filemanager =>
                                {
                                    filemanager.ref_id = objproductModel.product_id;
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
                                    filemanager.createdby = objproductModel.user_id;
                                    filemanager.createdname = objproductModel.createdname;
                                    filemanager.createddatetime = DateTime.Now;
                                    filemanager.isactive = true;
                                    filemanager.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objproductModel.filemanager);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_ProductFileManagerMapping", dtfilemanagercategory);
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
        public void Dispose() 
        { 
        }
    }
}
