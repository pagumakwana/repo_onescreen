using onescreenModel.ClientManagement;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webdHelper;

namespace onescreenDAL.ClientManagement
{
    public class ClientManagement_DAL : IDisposable
    {
        public responseModel getclient(Int64 client_id, string flag = "", string aliasname = "")
        {
            responseModel response = new responseModel();
            try
            {

                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.getclients, ObJParameterCOl, CommandType.StoredProcedure);
                List<clientModel> lstClientDetails = new List<clientModel>();
                if (ds != null)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        lstClientDetails = ds.Tables[0].AsEnumerable().Select(Row =>
                          new clientModel
                          {
                              client_id = Row.Field<Int64>("client_id"),
                              parent_client_id = Row.Field<Int64>("parent_client_id"),
                              clientname = Row.Field<string>("clientname"),
                              aliasname = Row.Field<string>("aliasname"),
                              personname = Row.Field<string>("personname"),
                              email_id = Row.Field<string>("email_id"),
                              mobilenumber = Row.Field<string>("mobilenumber"),
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
                        response.count = Convert.ToInt64(ds.Tables[1].Rows[0]["RESPONSE"].ToString());
                    }
                    response.data = lstClientDetails;
                }
                return response;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public string clients(clientModel objclientModel)
        {
            try
            {
                string ResponseMessage = "";
                DBParameterCollection ObJParameterCOl = new DBParameterCollection();
                DBParameter objDBParameter = new DBParameter("@flag", objclientModel.flag, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@client_id", objclientModel.client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@parent_client_id", objclientModel.parent_client_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@clientname", objclientModel.clientname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@aliasname", objclientModel.aliasname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@description", objclientModel.description, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@personname", objclientModel.personname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@mobilenumber", objclientModel.mobilenumber, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@email_id", objclientModel.email_id, DbType.String);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@user_id", objclientModel.user_id, DbType.Int64);
                ObJParameterCOl.Add(objDBParameter);
                objDBParameter = new DBParameter("@createdname", objclientModel.createdname, DbType.String);
                ObJParameterCOl.Add(objDBParameter);

                DBHelper objDbHelper = new DBHelper();
                DataSet ds = objDbHelper.ExecuteDataSet(Constant.clientmaster, ObJParameterCOl, CommandType.StoredProcedure);
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
        public void Dispose() 
        { 
        }
    }
}
