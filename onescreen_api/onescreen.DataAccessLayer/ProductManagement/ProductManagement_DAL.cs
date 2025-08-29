using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using onescreen.DAL.Common;
using onescreenModel.ClientManagement;
using onescreenModel.Common;
using onescreenModel.ProductManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Threading.Tasks;
using webdHelper;
using Razorpay.Api;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text.Json;

namespace onescreenDAL.ProductManagement
{
    public class ProductManagement_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 client_id;
        private readonly Int64 project_id;

        private readonly string _key = "rzp_test_RAp1XhaN6GAi6K";
        private readonly string _secret = "CIqkb8Ivu8lE9DQmnIxd830x";

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
                List<productAttributeModel> lsttimeattribute = new List<productAttributeModel>();
                List<productAttributeModel> lstrepeattribute = new List<productAttributeModel>();
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
                        if (ds.Tables[5].Rows.Count > 0)
                        {
                            lsttimeattribute = ds.Tables[5].AsEnumerable().Select(Row =>
                                new productAttributeModel
                                {
                                    option_value_id = Row.Field<Int64>("option_value_id"),
                                    option_value = Row.Field<string>("option_value"),
                                    price_delta = Row.Field<decimal>("price_delta")
                                }).ToList();
                        }
                        if (ds.Tables[6].Rows.Count > 0)
                        {
                            lstrepeattribute = ds.Tables[6].AsEnumerable().Select(Row =>
                                new productAttributeModel
                                {
                                    option_value_id = Row.Field<Int64>("option_value_id"),
                                    option_value = Row.Field<string>("option_value"),
                                    price_delta = Row.Field<decimal>("price_delta")
                                }).ToList();
                        }

                    }
                    if (ds.Tables[flag == "Details" ? 7 : 0].Rows.Count > 0)
                    {
                        lstproducts = ds.Tables[flag == "Details" ? 7 : 0].AsEnumerable().Select(Row =>
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
                              base_price = Row.Field<decimal>("base_price"),
                              route_category_id = Row.Field<Int64>("route_category_id"),
                              route_category = Row.Field<string>("route_category"),
                              lstcategory = lstcategory,
                              lstcategoryroute = lstcategoryroute,
                              lstpropertycategoryroute = lstpropertycategoryroute,
                              lstbrand = lstbrand,
                              filemanager = lstFileinfo,
                              lsttimeattribute = lsttimeattribute,
                              lstrepeattribute = lstrepeattribute,
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
                    if (ds.Tables[flag == "Details" ? 8 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 8 : 1].Rows[0]["RESPONSE"].ToString());
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
                objDBParameter = new DBParameter("@base_price", objproductModel.base_price, DbType.Decimal);
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
                            if ((objproductModel.lstattribute != null && objproductModel.lstattribute.Count > 0))
                            {
                                objproductModel.lstattribute.ForEach(_item =>
                                {
                                    DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                                    DBParameter objDBParameter = new DBParameter("@product_option_adj_id", _item.product_option_adj_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@option_value_id", _item.option_value_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@option_value", _item.option_value, DbType.String);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@price_delta", _item.price_delta, DbType.Decimal);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@product_id", objproductModel.product_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@isactive", _item.isactive, DbType.Boolean);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@user_id", objproductModel.user_id, DbType.Int64);
                                    ObJParameterCOl.Add(objDBParameter);
                                    objDBParameter = new DBParameter("@createdname", objproductModel.createdname, DbType.String);
                                    ObJParameterCOl.Add(objDBParameter);

                                    DBHelper objDbHelper = new DBHelper();
                                    DataSet ds = objDbHelper.ExecuteDataSet(Constant.mapproductattribute, ObJParameterCOl, CommandType.StoredProcedure);
                                });
                            }

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
                objDBParameter = new DBParameter("@option_value_id", option_value_id, DbType.Int64);
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
                List<productOptionTypesModel> lsttype = new List<productOptionTypesModel>();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (flag == "Details" && ds.Tables[0].Rows.Count > 0)
                        {
                            if (ds.Tables[0].Rows.Count > 0)
                            {
                                lsttype = ds.Tables[0].AsEnumerable().Select(Row =>
                                 new productOptionTypesModel
                                 {
                                     option_type_id = Row.Field<Int64>("option_type_id"),
                                     title = Row.Field<string>("title"),
                                 }).ToList();
                            }
                        }
                        lstvalue = ds.Tables[flag == "Details" ? 1 : 0].AsEnumerable().Select(Row =>
                              new productOptionValuesModel
                              {
                                  option_type_id = Row.Field<Int64>("option_type_id"),
                                  title = Row.Field<string>("title"),
                                  option_value_id = Row.Field<Int64>("option_value_id"),
                                  option_value = Row.Field<string>("option_value"),
                                  display_order = Row.Field<Int64>("display_order"),
                                  createdby = Row.Field<Int64?>("createdby"),
                                  createdname = Row.Field<string>("createdname"),
                                  createddatetime = Row.Field<DateTime?>("createddatetime"),
                                  lstoptiontype = lsttype,
                                  updatedby = Row.Field<Int64?>("updatedby"),
                                  updatedname = Row.Field<string>("updatedname"),
                                  updateddatetime = Row.Field<DateTime?>("updateddatetime"),
                                  isactive = Row.Field<bool>("isactive"),
                                  isdeleted = Row.Field<bool>("isdeleted")
                              }).ToList();
                    }
                }
                if (ds.Tables[flag == "Details" ? 2 : 1].Rows.Count > 0)
                {
                    response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 2 : 1].Rows[0]["RESPONSE"].ToString());
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

        public responseModel getproductoption(string flag, Int64 option_id, Int64 product_id, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@option_id", option_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_id", product_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getproductoption, ObJParameterCOl, CommandType.StoredProcedure);
                List<productOptionsModel> lstoption = new List<productOptionsModel>();
                List<product_list> lstproduct = new List<product_list>();
                List<optiontype_list> optiontype_list = new List<optiontype_list>();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (flag == "Details" && ds.Tables[0].Rows.Count > 0)
                        {
                            if (ds.Tables[0].Rows.Count > 0)
                            {
                                lstproduct = ds.Tables[0].AsEnumerable().Select(Row =>
                                 new product_list
                                 {
                                     product_id = Row.Field<Int64>("product_id"),
                                     product_name = Row.Field<string>("product_name"),
                                 }).ToList();
                            }
                            if (ds.Tables[1].Rows.Count > 0)
                            {
                                optiontype_list = ds.Tables[1].AsEnumerable().Select(Row =>
                                 new optiontype_list
                                 {
                                     product_id = Row.Field<Int64>("product_id"),
                                     option_type_id = Row.Field<Int64>("option_type_id"),
                                     title = Row.Field<string>("title"),
                                 }).ToList();
                            }
                        }
                        lstoption = ds.Tables[flag == "Details" ? 2 : 0].AsEnumerable().Select(Row =>
                          new productOptionsModel
                          {
                              option_id = Row.Field<Int64>("option_id"),
                              option_type_id = Row.Field<Int64>("option_type_id"),
                              option_type = Row.Field<string>("option_type"),
                              product_id = Row.Field<Int64>("product_id"),
                              product_name = Row.Field<string>("product_name"),
                              optiontype_list = optiontype_list,
                              lstproduct = lstproduct,
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
                    if (ds.Tables[flag == "Details" ? 3 : 1].Rows.Count > 0)
                    {
                        response.count = Convert.ToInt64(ds.Tables[flag == "Details" ? 3 : 1].Rows[0]["RESPONSE"].ToString());
                    }
                }
                response.data = lstoption;

                return response;
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
                if(objproductOptionsModel.optiontype_list.Count > 0)
                {
                    objproductOptionsModel.optiontype_list.ForEach(item =>
                    {
                        item.option_type_id = item.option_type_id;
                        item.product_id = objproductOptionsModel.product_id;
                        item.client_id = client_id;
                        item.project_id = project_id;
                        item.createdby = objproductOptionsModel.user_id;
                        item.createdname = objproductOptionsModel.createdname;
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
                    objDbHelperModule.ExecuteNonQuery(Constant.mapproductoption, ObJParameterCOl2, CommandType.StoredProcedure);
                }
                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getcoupon(Int64 coupon_id, string coupon_code = "", Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@coupon_id", coupon_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_code", coupon_code, DbType.String);
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

        public responseModel getoptionvalue(string option_type, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@option_type", option_type, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_id", product_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getoptionvalue, ObJParameterCOl, CommandType.StoredProcedure);
                List<productOptionValuesModel> lstoptionvalue = new List<productOptionValuesModel>();
                if (ds != null)
                {

                    lstoptionvalue = ds.Tables[0].AsEnumerable().Select(Row =>
                          new productOptionValuesModel
                          {
                              option_value_id = Row.Field<Int64>("option_value_id"),
                              option_value = Row.Field<string>("option_value"),
                              price_delta = Row.Field<decimal?>("price_delta"),
                          }).ToList();
                }
                if (ds.Tables[1].Rows.Count > 0)
                {
                    response.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                }
                response.data = lstoptionvalue;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getorderdertails(string flag, Int64 order_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_id", order_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getorderdertails, ObJParameterCOl, CommandType.StoredProcedure);
                List<orderDetails> lstorder = new List<orderDetails>();
                if (ds != null)
                {

                    lstorder = ds.Tables[0].AsEnumerable().Select(Row =>
                          new orderDetails
                          {
                              order_id = Row.Field<Int64>("order_id"),
                              user_id = Row.Field<Int64>("user_id"),
                              order_number = Row.Field<string>("order_number"),
                              payment_type = Row.Field<string>("payment_type"),
                              payment_order_id = Row.Field<string>("payment_order_id"),
                              payment_response = Row.Field<string>("payment_response"),
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
                response.data = lstorder;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string add_to_cart(usercartMaster objusercartmaster)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objusercartmaster.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_master_id", objusercartmaster.cart_master_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_id", objusercartmaster.coupon_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_code", objusercartmaster.coupon_code, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_total", objusercartmaster.cart_total, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_subtotal", objusercartmaster.cart_subtotal, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_discount", objusercartmaster.cart_discount, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_tax", objusercartmaster.cart_tax, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objusercartmaster.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objusercartmaster.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objusercartmaster.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objusercartmaster.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objusercartmaster.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managecartmaster, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objusercartmaster.flag.Contains("NEWCART") || objusercartmaster.flag.Contains("MODIFYCART"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objusercartmaster.cart_master_id = Convert.ToInt64(Res[1].ToString());
                            if ((objusercartmaster.lst_cart_product != null && objusercartmaster.lst_cart_product.Count > 0))
                            {
                                objusercartmaster.lst_cart_product.ForEach(item =>
                                {
                                    item.cart_master_id = objusercartmaster.cart_master_id;
                                    item.product_id = item.product_id;
                                    item.optionvalues = JsonConvert.SerializeObject(item.optionvalues);
                                    item.base_amount = item.base_amount;
                                    item.total_amount = item.total_amount;
                                    item.attribute_amount = item.attribute_amount;
                                    item.client_id = client_id;
                                    item.project_id = project_id;
                                    item.createdby = objusercartmaster.user_id;
                                    item.createdname = objusercartmaster.createdname;
                                    item.isactive = true;
                                    item.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objusercartmaster.lst_cart_product);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_UserCartMapping", dtfilemanagercategory);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapusercart, ObJParameterCOl2, CommandType.StoredProcedure);
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

        public responseModel getusercartdetail(Int64 user_cart_id, Int64 user_id, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_cart_id", user_cart_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_id", product_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getusercartdetail, ObJParameterCOl, CommandType.StoredProcedure);
                List<usercartmappingModel> lstusercartmapping = new List<usercartmappingModel>();
                List<usercartMaster> lstusercart = new List<usercartMaster>();

                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstusercartmapping = ds.Tables[0].AsEnumerable().Select(Row =>
                          new usercartmappingModel
                          {
                              user_cart_mapping_id = Row.Field<Int64>("user_cart_mapping_id"),
                              user_id = Row.Field<Int64>("user_id"),
                              product_id = Row.Field<Int64>("product_id"),
                              product_name = Row.Field<string>("product_name"),
                              cart_master_id = Row.Field<Int64>("cart_master_id"),
                              optionvalues = Row.Field<string>("optionvalues"),
                              attribute_amount = Row.Field<decimal>("attribute_amount"),
                              base_amount = Row.Field<decimal>("base_amount"),
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

                        lstusercart = ds.Tables[1].AsEnumerable().Select(Row =>
                              new usercartMaster
                              {
                                  cart_master_id = Row.Field<Int64>("cart_master_id"),
                                  user_id = Row.Field<Int64>("user_id"),
                                  batch_id = Row.Field<Guid>("batch_id"),
                                  coupon_id = Row.Field<Int64>("coupon_id"),
                                  coupon_code = Row.Field<string>("coupon_code"),
                                  cart_total = Row.Field<decimal>("cart_total"),
                                  cart_subtotal = Row.Field<decimal>("cart_subtotal"),
                                  cart_discount = Row.Field<decimal>("cart_discount"),
                                  cart_tax = Row.Field<decimal>("cart_tax"),
                                  lst_cart_product = lstusercartmapping,
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
                }
                if (ds.Tables[2].Rows.Count > 0)
                {
                    response.count = Convert.ToInt64(ds.Tables[2].Rows[0]["RESPONSE"].ToString());
                }
                response.data = lstusercart;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel getvendor(string flag, Int64 vendor_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@vendor_id", vendor_id, DbType.Int64);
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
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getvendor, ObJParameterCOl, CommandType.StoredProcedure);
                List<vendorModel> lstvendor = new List<vendorModel>();
                if (ds != null)
                {

                    lstvendor = ds.Tables[0].AsEnumerable().Select(Row =>
                          new vendorModel
                          {
                              vendor_id = Row.Field<Int64>("vendor_id"),
                              contact_person_name = Row.Field<string>("contact_person_name"),
                              company_name = Row.Field<string>("company_name"),
                              email_id = Row.Field<string>("email_id"),
                              mobile_no = Row.Field<string>("mobile_no"),
                              vendor_address = Row.Field<string>("vendor_address"),
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
                response.data = lstvendor;

                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public string managevendor(vendorModel objvendorModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objvendorModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@contact_person_name", objvendorModel.contact_person_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@company_name", objvendorModel.company_name, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objvendorModel.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@mobile_no", objvendorModel.mobile_no, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@vendor_address", objvendorModel.vendor_address, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objvendorModel.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objvendorModel.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objvendorModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.managevendor, ObJParameterCOl, CommandType.StoredProcedure);
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

        public Razorpay_OrderAttribute CreateOrder(Dictionary<string, object> _obj_dictionay)
        {
            RazorpayClient client = new RazorpayClient(_key, _secret);
            //Dictionary<string, object> options = new Dictionary<string, object>
            //{
            //    { "amount", (int)10000 }, // paise
            //    { "currency", "INR" },
            //    { "payment_capture", 1 }
            //};
            if (_obj_dictionay.ContainsKey("amount"))
            {
                int amountInPaise = 0;

                if (_obj_dictionay["amount"] is JsonElement element)
                {
                    // Try to parse as decimal
                    if (element.ValueKind == JsonValueKind.Number)
                    {
                        decimal amountInRupees = element.GetDecimal();
                        amountInPaise = Convert.ToInt32(Math.Round(amountInRupees * 100));
                    }
                    else if (element.ValueKind == JsonValueKind.String &&
                             decimal.TryParse(element.GetString(), out var amt))
                    {
                        amountInPaise = Convert.ToInt32(Math.Round(amt * 100));
                    }
                }
                else
                {
                    decimal amountInRupees = Convert.ToDecimal(_obj_dictionay["amount"]);
                    amountInPaise = Convert.ToInt32(Math.Round(amountInRupees * 100));
                }

                _obj_dictionay["amount"] = amountInPaise;
            }
            if (_obj_dictionay.ContainsKey("currency"))
            {
                if (_obj_dictionay["currency"] is JsonElement element)
                {
                    _obj_dictionay["currency"] = element.GetString();
                }
                else
                {
                    _obj_dictionay["currency"] = _obj_dictionay["currency"].ToString();
                }
            }
            else
            {
                _obj_dictionay["currency"] = "INR"; // default
            }

            if (_obj_dictionay.ContainsKey("payment_capture"))
            {
                if (_obj_dictionay["payment_capture"] is JsonElement element)
                {
                    if (element.ValueKind == JsonValueKind.True)
                        _obj_dictionay["payment_capture"] = true;
                    else if (element.ValueKind == JsonValueKind.False)
                        _obj_dictionay["payment_capture"] = false;
                }
                else
                {
                    // Convert string "true"/"false" to bool
                    _obj_dictionay["payment_capture"] =
                        Convert.ToBoolean(_obj_dictionay["payment_capture"]);
                }
            }


            Order order = client.Order.Create(_obj_dictionay);

            string json = JsonConvert.SerializeObject(order.Attributes);

            // Deserialize into your custom model
            try
            {
                Razorpay_OrderAttribute response = JsonConvert.DeserializeObject<Razorpay_OrderAttribute>(json);
            return response;
            }
            catch (Exception)
            {
                return new Razorpay_OrderAttribute { status = "failure" };
            }
        }

        public RazorpayPaymentResponse verify_order(RazorpayPaymentResponse objRazorpayPaymentResponse)
        {
            string orderId = objRazorpayPaymentResponse.razorpay_order_id;
            string paymentId = objRazorpayPaymentResponse.razorpay_payment_id;
            string signature = objRazorpayPaymentResponse.razorpay_signature;

            var attributes = new Dictionary<string, string>
            {
                { "razorpay_order_id", orderId },
                { "razorpay_payment_id", paymentId },
                { "razorpay_signature", signature }
            };

            try
            {
                Utils.verifyPaymentSignature(attributes);
                return new RazorpayPaymentResponse { razorpay_order_id= orderId, razorpay_payment_id= paymentId, razorpay_signature= signature, status = "failure" };
            }
            catch (Exception)
            {
                return new RazorpayPaymentResponse { status = "failure" };
            }
        }

        public string move_to_order(userorderMaster objuserorderMaster)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objuserorderMaster.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_id", objuserorderMaster.order_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@payment_type", objuserorderMaster.payment_type, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@payment_order_id", objuserorderMaster.payment_order_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@payment_response", objuserorderMaster.payment_response, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_id", objuserorderMaster.coupon_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_total", objuserorderMaster.order_total, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_subtotal", objuserorderMaster.order_subtotal, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_discount", objuserorderMaster.order_discount, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_tax", objuserorderMaster.order_tax, DbType.Decimal);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@order_status", objuserorderMaster.order_status, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@payment_status", objuserorderMaster.payment_status, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objuserorderMaster.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objuserorderMaster.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objuserorderMaster.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objuserorderMaster.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objuserorderMaster.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.manageordermaster, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        if (objuserorderMaster.flag.Contains("NEWCART") || objuserorderMaster.flag.Contains("MODIFYCART"))
                        {
                            ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                            var Res = ResponseMessage.Split('~');
                            objuserorderMaster.order_id = Convert.ToInt64(Res[1].ToString());
                            if ((objuserorderMaster.lst_orderdetail != null && objuserorderMaster.lst_orderdetail.Count > 0))
                            {
                                objuserorderMaster.lst_orderdetail.ForEach(item =>
                                {
                                    item.order_id = objuserorderMaster.order_id;
                                    item.product_id = item.product_id;
                                    item.optionvalues = JsonConvert.SerializeObject(item.optionvalues);
                                    item.base_amount = item.base_amount;
                                    item.attribute_amount = item.attribute_amount;
                                    item.client_id = client_id;
                                    item.project_id = project_id;
                                    item.createdby = objuserorderMaster.user_id;
                                    item.createdname = objuserorderMaster.createdname;
                                    item.isactive = true;
                                    item.isdeleted = false;
                                });
                                Common_DAL objCommon_DAL = new Common_DAL(_httpContextAccessor);
                                DataTable dtfilemanagercategory = objCommon_DAL.GetDataTableFromList(objuserorderMaster.lst_orderdetail);
                                DBHelper objDbHelperModule = new DBHelper();
                                string tablename = objDbHelperModule.BulkImport("WebD_UserOrderMapping", dtfilemanagercategory);
                                objDbHelperModule = new DBHelper();
                                DBParameterCollection ObJParameterCOl2 = new DBParameterCollection();
                                DBParameter objDBParameter2 = new DBParameter("@tablename", tablename, DbType.String);
                                ObJParameterCOl2.Add(objDBParameter2);
                                objDbHelperModule.ExecuteNonQuery(Constant.mapusercart, ObJParameterCOl2, CommandType.StoredProcedure);
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
        public string apply_coupon(user_coupon_model objusercoupon)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objusercoupon.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_cart_mapid", objusercoupon.coupon_cart_mapid, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@coupon_id", objusercoupon.coupon_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@cart_id", objusercoupon.cart_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objusercoupon.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@product_ids", objusercoupon.product_ids, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@isactive", objusercoupon.isactive, DbType.Boolean);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdby", objusercoupon.createdby, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objusercoupon.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.user_coupon_mapping, ObJParameterCOl, CommandType.StoredProcedure);
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
