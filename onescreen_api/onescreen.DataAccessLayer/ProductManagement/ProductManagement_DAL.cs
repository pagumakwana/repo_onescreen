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
            client_id = 1;// Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = 1;// Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
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
                List<productrouteCategoryModel> lstcategoryroute = new List<productrouteCategoryModel>();
                List<productpropertyCategoryModel> lstpropertycategoryroute = new List<productpropertyCategoryModel>();
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
                            lstcategoryroute = ds.Tables[2].AsEnumerable().Select(Row =>
                                new productrouteCategoryModel
                                {
                                    category_id = Row.Field<Int64>("category_id"),
                                    category = Row.Field<string>("category")
                                }).ToList();
                        }
                        if (ds.Tables[3].Rows.Count > 0)
                        {
                            lstpropertycategoryroute = ds.Tables[3].AsEnumerable().Select(Row =>
                                new productpropertyCategoryModel
                                {
                                    category_id = Row.Field<Int64>("category_id"),
                                    category = Row.Field<string>("category")
                                }).ToList();
                        }
                        if (ds.Tables[4].Rows.Count > 0)
                        {
                            lstFileinfo = ds.Tables[4].AsEnumerable().Select(Row =>
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
                    if (ds.Tables[flag == "Details" ? 5 : 0].Rows.Count > 0)
                    {
                        lstproducts = ds.Tables[flag == "Details" ? 5 : 0].AsEnumerable().Select(Row =>
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
                              route_category_id = Row.Field<Int64>("route_category_id"),
                              route_category = Row.Field<string>("route_category"),
                              lstcategory = lstcategory,
                              lstcategoryroute = lstcategoryroute,
                              lstpropertycategoryroute = lstpropertycategoryroute,
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
                    if (ds.Tables[flag == "Details" ? 6 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 6 : 1].Rows[0]["RESPONSE"].ToString());
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
                objDBParameter = new DBParameter("@property_category_id", objproductModel.property_category_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@route_category_id", objproductModel.route_category_id, DbType.Int64);
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

        public responseModel getbrand(string flag, Int64 brand_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_id", brand_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getbrand, ObJParameterCOl, CommandType.StoredProcedure);
                List<brandModel> lstbrand = new List<brandModel>();
                List<fileInfoModel> lstFileinfo = new List<fileInfoModel>();
                if (ds != null)
                {
                    if (flag == "Details")
                    {
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            lstFileinfo = ds.Tables[0].AsEnumerable().Select(Row =>
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
                    if (ds.Tables[flag == "Details" ? 1 : 0].Rows.Count > 0)
                    {
                        lstbrand = ds.Tables[flag == "Details" ? 1 : 0].AsEnumerable().Select(Row =>
                          new brandModel
                          {
                              brand_id = Row.Field<Int64>("brand_id"),
                              brand_name = Row.Field<string>("brand_name"),
                              brand_description = Row.Field<string>("brand_description"),
                              thumbnail = Row.Field<string>("thumbnail"),
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
                    if (ds.Tables[flag == "Details" ? 2 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 2 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                    response.data = lstbrand;
                }
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string managebrand(brandModel objbrandModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objbrandModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_id", objbrandModel.brand_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_name", objbrandModel.brand_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@brand_description", objbrandModel.brand_description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@thumbnail", objbrandModel.thumbnail, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objbrandModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objbrandModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objbrandModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objbrandModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objbrandModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managebrand, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objbrandModel.flag.Contains("NEWBRAND") || objbrandModel.flag.Contains("MODIFYBRAND"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objbrandModel.brand_id = Convert.ToInt64(Res[1].ToString());
                            if ((objbrandModel.filemanager != null && objbrandModel.filemanager.Count > 0))
                            {
                                objbrandModel.filemanager.ForEach(filemanager =>
                                {
                                    filemanager.ref_id = objbrandModel.brand_id;
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
                                    filemanager.createdby = objbrandModel.user_id;
                                    filemanager.createdname = objbrandModel.createdname;
                                    filemanager.createddatetime = DateTime.Now;
                                    filemanager.isactive = true;
                                    filemanager.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objbrandModel.filemanager);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_BrandFileManagerMapping", dtfilemanagercategory);
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


        public responseModel productoptiontypes(string flag, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_type_id", option_type_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getproductoptiontypes, ObJParameterCOl, CommandType.StoredProcedure);
                List<productOptionTypesModel> lstoptiontype = new List<productOptionTypesModel>();
                if (ds != null)
                {

                    lstoptiontype = ds.Tables[0].AsEnumerable().Select(Row =>
                          new productOptionTypesModel
                          {
                              option_type_id = Row.Field<Int64>("option_type_id"),
                              title = Row.Field<string>("title"),
                              display_order = Row.Field<Int64>("display_order"),
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
                    if (ds.Tables[flag == "Details" ? 2 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    response.data = lstoptiontype;
               
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string manageproductoptiontypes(productOptionTypesModel objproductOptionTypesModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objproductOptionTypesModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_type_id", objproductOptionTypesModel.option_type_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@title", objproductOptionTypesModel.title, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@display_order", objproductOptionTypesModel.display_order, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objproductOptionTypesModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objproductOptionTypesModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objproductOptionTypesModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objproductOptionTypesModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objproductOptionTypesModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageproductoptiontypes, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                       ResponseMessage = ds.Tables[0].Rows[0]["Response"].ToString();
                    }
                }
                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel productoptionvalues(string flag, Int64 option_value_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_value_id", @option_value_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getproductoptionvalues, ObJParameterCOl, CommandType.StoredProcedure);
                List<productOptionValuesModel> lstvalue = new List<productOptionValuesModel>();
                if (ds != null)
                {

                    lstvalue = ds.Tables[0].AsEnumerable().Select(Row =>
                          new productOptionValuesModel
                          {
                              option_type_id = Row.Field<Int64>("option_type_id"),
                              option_value_id = Row.Field<Int64>("option_value_id"),
                              option_value = Row.Field<string>("option_value"),
                              display_order = Row.Field<Int64>("display_order"),
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
                if (ds.Tables[flag == "Details" ? 2 : 1].Rows.Count > 0)
                {
                    response.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                }
                response.data = lstvalue;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string manageproductoptionvalues(productOptionValuesModel objproductOptionValuesModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objproductOptionValuesModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_value_id", objproductOptionValuesModel.option_value_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_type_id", objproductOptionValuesModel.option_type_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_value", objproductOptionValuesModel.option_value, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@display_order", objproductOptionValuesModel.display_order, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objproductOptionValuesModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objproductOptionValuesModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objproductOptionValuesModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objproductOptionValuesModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objproductOptionValuesModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageroductoptionvalues, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        ResponseMessage = ds.Tables[0].Rows[0]["Response"].ToString();
                    }
                }
                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string manageproductoptions(productOptionsModel objproductOptionsModel)
        {
            try
            {
                string ResponseMessage = "success";
                Int64 product_id = 0;
                if(objproductOptionsModel.lstproduct.Count > 0)
                {
                    product_id = objproductOptionsModel.lstproduct[0].product_id;

                    objproductOptionsModel.optiontype_list.ForEach(item =>
                    {
                        item.option_type_id = item.option_type_id;
                        item.product_id = product_id;
                        item.client_id = client_id;
                        item.project_id = project_id;
                        item.createdby = objproductOptionsModel.user_id;
                        item.createdname = objproductOptionsModel.createdname;
                        item.createddatetime = DateTime.Now;
                        item.isactive = true;
                        item.isdeleted = false;
                    });
                    Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                    DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objproductOptionsModel.optiontype_list);
                    DBHelper objDbHelperModule = new DBHelper();
                    string tablename = objDbHelperModule.BulkImport("WebD_ProductOptionMapping", dtfilemanagercategory);
                    objDbHelperModule = new DBHelper();
                    DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                    DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                    ObJParameterCOl2.Add(objDBParameter2);
                    objDbHelperModule.ExecuteNonQuery(Constant.mapfilemanager, ObJParameterCOl2, CommandType.StoredProcedure);
                }

                //DBHelper objDbHelper = new DBHelper();
                //DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageproductoption, ObJParameterCOl, CommandType.StoredProcedure);
                //if (ds != null)
                //{
                //    if (ds.Tables[0].Rows.Count > 0)
                //    {
                //        ResponseMessage = ds.Tables[0].Rows[0]["Response"].ToString();
                //    }
                //}
                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getcoupon(Int64 coupon_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@coupon_id", coupon_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getcoupon, ObJParameterCOl, CommandType.StoredProcedure);
                List<couponModel> lstcoupon = new List<couponModel>();
                if (ds != null)
                {

                    lstcoupon = ds.Tables[0].AsEnumerable().Select(Row =>
                          new couponModel
                          {
                              coupon_id = Row.Field<Int64>("coupon_id"),
                              coupon_code = Row.Field<string>("coupon_code"),
                              discount_value = Row.Field<string>("discount_value"),
                              from_date = Row.Field<string>("from_date"),
                              to_date = Row.Field<string>("to_date"),
                              isdisable = Row.Field<bool>("isdisable"),
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
                    response.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                }
                response.data = lstcoupon;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string managecoupon(couponModel objcouponModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objcouponModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_code", objcouponModel.coupon_code, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@discount_value", objcouponModel.discount_value, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@from_date", objcouponModel.from_date, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@to_date", objcouponModel.to_date, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isdisable", objcouponModel.isdisable, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objcouponModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objcouponModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objcouponModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objcouponModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objcouponModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managecoupon, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        ResponseMessage = ds.Tables[0].Rows[0]["Response"].ToString();
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
