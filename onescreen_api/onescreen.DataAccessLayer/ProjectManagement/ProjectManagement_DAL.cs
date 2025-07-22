using Microsoft.AspNetCore.Http;
using onescreenModel.Common;
using onescreenModel.ProjectManagement;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.ProjectManagement
{
    public class ProjectManagement_DAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProjectManagement_DAL(IHttpContextAccessor httpContextAccessor) =>
           _httpContextAccessor = httpContextAccessor;

        public string AddModifyProjectDetails(projectModel objprojectModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objprojectModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objprojectModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", objprojectModel.project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@clientname", objprojectModel.clientname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objprojectModel.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@projectname", objprojectModel.projectname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objprojectModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objprojectModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objprojectModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.projectmaster, ObJParameterCOl, CommandType.StoredProcedure);
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        ResponseMessage = ds.Tables[0].Rows[0]["RESPONSE"].ToString();
                    }
                }
                return ResponseMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public responseModel ProjectDetails(string flag = "", string aliasname = "", Int64 project_id = 0, Int64 client_id = 0)
        {
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@project_id", project_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getprojects, ObJParameterCOl, CommandType.StoredProcedure);
                List<projectModel> lstProjects = new List<projectModel>();
                responseModel lstresponse = new responseModel();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstProjects = ds.Tables[0].AsEnumerable().Select(Row =>
                          new projectModel
                          {
                              project_id = Row.Field<Int64>("project_id"),
                              projectname = Row.Field<string>("projectname"),
                              aliasname = Row.Field<string>("aliasname"),
                              client_id = Row.Field<Int64>("client_id"),
                              clientname = Row.Field<string>("clientname"),
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
                    lstresponse.data = lstProjects;
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
