using onescreenModel.ClientManagement;
using onescreenModel.Common;
using onescreenModel.ProjectManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.Configuration
{
    public class userModuleModel : commonModel
    {
        public Int64? module_id { get; set; }
        public Int64? module_parent_id { get; set; }
        public string? moduleicon { get; set; }
        public string? modulename { get; set; }
        public string? module_identifier { get; set; }
        public string? modulerouting { get; set; }
        public string? modulepath { get; set; }
        public Int64? authority_id { get; set; }
        public Int64? category_id { get; set; }
        public List<userModuleCategoryModel>? lstcategory { get; set; }
        public List<userParentModuleModel>? lstparentmodule { get; set; }
    }

    public class userModuleCategoryModel
    {
        public Int64 category_id { get; set; }
        public string category { get; set; }
    }

    public class userParentModuleModel
    {
        public Int64 module_id { get; set; }
        public string modulename { get; set; }
    }

    public class userConfigurationModel : commonModel
    {
        public List<clientModel> clientlist { get; set; }
        public List<projectModel> projectlist { get; set; }
        //public List<clsUserModule> usermodulelist { get; set; }
    }

    public class authorityModel : commonModel
    {
        public Int64 authority_id { get; set; }
        public string authority { get; set; }
        public string description { get; set; }
        public List<userModuleModel> lstmodule { get; set; }
        public List<controlsModel> lstcontrol { get; set; }
    }
    public class controlsModel : commonModel
    {
        public Int64 control_id { get; set; }
        public string? title { get; set; }
        public string? syscontrolname { get; set; }
        public Int64? module_id { get; set; }
        public string? modulename { get; set; }
        public string? aliasname { get; set; }
        public string? description { get; set; }
        public bool? allowaccess { get; set; }
        public Int64? authority_id { get; set; }
    }

    public class portalconfigModel : commonModel
    {
        public Int64 config_id { get; set; }
        public string config_name { get; set; }
        public String config_value { get; set; }
        public string description { get; set; }
        public string config_data { get; set; }
        public Int64 category_id { get; set; }
        public string? config_type { get; set; }
        public string? category { get; set; }
        public List<portalcategoryModel>? lstportalconfig { get; set; }
    }

    public class portalcategoryModel
    {
        public Int64 category_id { get; set; }
        public string category { get; set; }
    }
}
