using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.ClientManagement
{
    public class clientModel : commonModel
    {
        public Int64 client_id { get; set; }
        public Int64 parent_client_id { get; set; }
        public string clientname { get; set; }
        public string aliasname { get; set; }
        public string description { get; set; }
        public string personname { get; set; }
        public string mobilenumber { get; set; }
        public string email_id { get; set; }
    }
}
