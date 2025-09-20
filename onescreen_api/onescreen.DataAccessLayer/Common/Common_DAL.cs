using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using webdHelper;
using onescreenModel.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection.Metadata;
using Constant = onescreenModel.Common.Constant;

namespace onescreen.DAL.Common
{
    public class Common_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly Int64 project_id;
        private readonly Int64 client_id;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <param name="hostingEnvironment"></param>
        public Common_DAL(IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment = null)
        {
            _httpContextAccessor = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="module"></param>
        /// <returns></returns>
        public List<fileInfoModel> FileUploader(string module)
        {
            List<fileInfoModel> lstFiles = new List<fileInfoModel>();
            try
            {
                if (_httpContextAccessor.HttpContext.Request.ContentLength > 0)
                {

                    var httpRequest = _httpContextAccessor.HttpContext.Request;
                    foreach (IFormFile file in httpRequest.Form.Files)
                    {
                        string FilePath = Path.Combine(_hostingEnvironment.ContentRootPath.ToString() + "/FileStorage/" + Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString()) + "/" + Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()) + "/" + module + "/");
                        string StoreFilePath = "/FileStorage/" + Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString()) + "/" + Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString()) + "/" + module + "/";
                        if (!Directory.Exists(FilePath))
                        {
                            Directory.CreateDirectory(FilePath);
                        }
                        fileInfoModel objFileInfo = new fileInfoModel();
                        var postedFile = file;
                        string FileName = AppendTimeStamp(postedFile.FileName);
                        FilePath = Path.Combine(FilePath, FileName);
                        objFileInfo.filename = FileName;
                        objFileInfo.filepath = StoreFilePath + FileName;
                        objFileInfo.filesize = postedFile.Length;
                        objFileInfo.fileextension = Path.GetExtension(FilePath);
                        objFileInfo.module = module;
                        using (var stream = new FileStream(FilePath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                        // postedFile.CopyTo(FilePath);
                        lstFiles.Add(objFileInfo);
                    }
                    return lstFiles;
                }
                else
                {
                    return lstFiles;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string AppendTimeStamp(string fileName)
        {
            return string.Concat(
                Path.GetFileNameWithoutExtension(fileName),
                DateTime.Now.ToString("_yyyy-MM-dd-HH-mm-ss"),
                Guid.NewGuid().ToString(),
                Path.GetExtension(fileName)
                );
        }
        public string RemoveFile(Int64 file_id)
        {
            try
            {
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@file_id", file_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                string Massage = "";
                DBHelper objDbHelper = new DBHelper();
                Massage = Convert.ToString(objDbHelper.ExecuteScalar(Constant.removefile, ObJParameterCOl, CommandType.StoredProcedure));

                return Massage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataTable GetDataTableFromObjects(object[] objects)
        {
            if (objects != null && objects.Length > 0)
            {
                Type t = objects[0].GetType();
                DataTable dt = new DataTable(t.Name);
                foreach (PropertyInfo pi in t.GetProperties())
                {
                    dt.Columns.Add(new DataColumn(pi.Name));
                }
                foreach (var o in objects)
                {
                    DataRow dr = dt.NewRow();
                    foreach (DataColumn dc in dt.Columns)
                    {
                        dr[dc.ColumnName] = o.GetType().GetProperty(dc.ColumnName).GetValue(o, null);
                    }
                    dt.Rows.Add(dr);
                }
                return dt;
            }
            return null;
        }
        public DataTable GetDataTableFromList<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                dataTable.Columns.Add(prop.Name);
            }

            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            return dataTable;
        }

        public responseModel getdashboardwidget(string flag, Int64 user_id)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                responseModel lstresponse = new responseModel();
                List<userdashboardModel> lstuserdashboard = new List<userdashboardModel>();

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getdashboardwidget, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstuserdashboard = ds.Tables[0].AsEnumerable().Select(Row =>
                            new userdashboardModel
                            {
                                total_product = Row.Field<Int32>("total_product")
                            }).ToList();
                    }

                    if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    {
                        lstuserdashboard[0].in_cart = ds.Tables[1].Rows[0].Field<Int32>("in_cart");
                    }
                    lstresponse.data = lstuserdashboard;
                    lstresponse.response = "success";
                    lstresponse.count = lstuserdashboard.Count;

                }
                return lstresponse;
            }
            catch
            {
                return new responseModel() { count = 0, data = "", response = "invalid_request" };
            }
        }

        public responseModel getwalletwidget(Int64 user_id)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@user_id", user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                responseModel lstresponse = new responseModel();
                List<walletwidgetModel> lstwallet = new List<walletwidgetModel>();

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getwalletwidget, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstwallet = ds.Tables[0].AsEnumerable().Select(Row =>
                            new walletwidgetModel
                            {
                                balance_amount = Row.Field<decimal>("balance_amount")
                            }).ToList();
                    }

                    if (ds.Tables.Count > 1 && ds.Tables[1].Rows.Count > 0)
                    {
                        lstwallet[0].requested_amount = ds.Tables[1].Rows[0].Field<decimal>("requested_amount");
                    }
                    if (ds.Tables.Count > 2 && ds.Tables[2].Rows.Count > 0)
                    {
                        lstwallet[0].transaction_amount = ds.Tables[2].Rows[0].Field<decimal>("transaction_amount");
                    }
                    lstresponse.data = lstwallet;
                    lstresponse.response = "success";
                    lstresponse.count = lstwallet.Count;

                }
                return lstresponse;
            }
            catch
            {
                return new responseModel() { count = 0, data = "", response = "invalid_request" };
            }
        }


        public void Dispose()
        {
            //throw new NotImplementedException();
        }
    }
}
