using onescreenDAL.ClientManagement;
using onescreenModel.ClientManagement;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.ClientManagement
{
    public class ClientManagement_BAL : IDisposable
    {
        public responseModel getclient(Int64 client_id, string flag = "", string aliasname = "")
        {
            using (ClientManagement_DAL _objClientManagement_DAL = new ClientManagement_DAL())
            {
                return _objClientManagement_DAL.getclient(client_id, flag, aliasname);
            }
        }
        public string clients(clientModel objclientModel)
        {
            using (ClientManagement_DAL _objClientManagement_DAL = new ClientManagement_DAL())
            {
                return _objClientManagement_DAL.clients(objclientModel);
            }
        }
        public void Dispose() 
        { 
        }
    }
}
