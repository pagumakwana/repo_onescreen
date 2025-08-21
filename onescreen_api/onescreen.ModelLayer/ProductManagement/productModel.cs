using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.ProductManagement
{
    public class productModel : commonModel
    {
        public Int64 product_id { get; set; }
        public Int64? brand_id { get; set; }
        public string product_name { get; set; }
        public string product_description { get; set; }
        public Int64? category_id { get; set; }
        public string? category { get; set; }
        public string? brand_name { get; set; }
        public List<productCategoryModel> lstcategory { get; set; }
        public List<brandModel>? lstbrand { get; set; }
    }

    public class brandModel : commonModel
    {
        public Int64 brand_id { get; set; }
        public string brand_name { get; set; }
        public string? brand_description { get; set; }
    }

    public class productCategoryModel
    {
        public Int64 category_id { get; set; }
        public string category { get; set; }
    }

    public class productOptionTypesModel : commonModel
    {
        public Int64 option_type_id { get; set; }
        public string title { get; set; }
        public Int64 display_order { get; set; }
    }
    public class productOptionValuesModel : commonModel
    {
        public Int64 option_value_id { get; set; }
        public Int64 option_type_id { get; set; }
        public string option_value { get; set; }
        public Int64 display_order { get; set; }
    }

    public class productOptionsModel : commonModel
    {
        public Int64? option_id { get; set; }
        public Int64? option_type_id { get; set; }
        public Int64? product_id { get; set; }
        public List<product_list>? lstproduct { get; set; }
        public List<optiontype_list>? optiontype_list { get; set; }
    }

    public class product_list
    {
        public Int64 product_id { get; set; }
        public string product_name { get; set; }
    }
    public class optiontype_list : commonModel
    {
        public Int64 option_type_id { get; set; }
        public Int64 product_id { get; set; }
        public string title { get; set; }
    }
}
