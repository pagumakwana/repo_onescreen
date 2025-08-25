using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.Common
{
    public class commonModel
    {
        public string? flag { get; set; }
        public string? metatitle { get; set; }
        public string? metakeywords { get; set; }
        public string? metadescription { get; set; }
        public string? thumbnail { get; set; }
        public Int64? start_count { get; set; }
        public Int64? end_count { get; set; }
        public Int64? client_id { get; set; }
        public string? clientname { get; set; }
        public Int64? project_id { get; set; }
        public string? projectname { get; set; }
        public Int64? user_id { get; set; }
        public Int64? createdby { get; set; }
        public string? createdname { get; set; }
        public Nullable<DateTime> createddatetime { get; set; }
        public Int64? updatedby { get; set; }
        public string? updatedname { get; set; }
        public Nullable<DateTime> updateddatetime { get; set; }
        public bool? isactive { get; set; }
        public bool? isdeleted { get; set; }
        public string? response { get; set; }
        public string? search { get; set; }
        public List<fileInfoModel>? filemanager { get; set; }
    }
    public class responseModel
    {
        public dynamic data { get; set; }
        public Int64 count { get; set; }
        public string response { get; set; }
    }
    public class fileInfoModel : commonModel
    {
        public Int64? ref_id { get; set; }
        public Int64? file_id { get; set; }
        public string? filename { get; set; }
        public string? filepath { get; set; }
        public string? filetype { get; set; }
        public string? fileextension { get; set; }
        public long? filesize { get; set; }
        public string? fileidentifier { get; set; }
        public string? subidentifier { get; set; }
        public Int64? displayorder { get; set; }
        public string? module { get; set; }
        public string? itemidentifier { get; set; }
    }
    public class webdObjModel
    {
        public Int64? project_id { get; set; }
        public Int64? client_id { get; set; }
        public Int64? user_id { get; set; }
        public Int64? createdby { get; set; }
        public string? createdname { get; set; }
    }

    public class userdashboardModel : commonModel
    {
        public Int32 total_product { get; set; }
        public Int32 in_cart { get; set; }

    }

}
