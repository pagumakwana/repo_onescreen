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
        public Int64? property_category_id { get; set; }
        public Int64? route_category_id { get; set; }
        public string? category { get; set; }
        public string? route_category { get; set; }
        public string? property_category { get; set; }
        public string? brand_name { get; set; }
        public decimal? base_price { get; set; }
        public List<productCategoryModel> lstcategory { get; set; }
        public List<productrouteCategoryModel> lstcategoryroute { get; set; }
        public List<productpropertyCategoryModel> lstpropertycategoryroute { get; set; }
        public List<brandModel>? lstbrand { get; set; }
        public List<productAttributeModel>? lstattribute { get; set; }
        public List<productAttributeModel>? lstrepeattribute { get; set; }
        public List<productAttributeModel>? lsttimeattribute { get; set; }
    }

    public class productAttributeModel : commonModel
    {
        public Int64? product_option_adj_id { get; set; }
        public Int64? option_value_id { get; set; }
        public string? option_value { get; set; }
        public decimal price_delta { get; set; }
        public Int64? product_id { get; set; }
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

    public class productrouteCategoryModel
    {
        public Int64 category_id { get; set; }
        public string category { get; set; }
    }

    public class productpropertyCategoryModel
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
        public string? title { get; set; }
        public string option_value { get; set; }
        public decimal? price_delta { get; set; }
        public Int64 display_order { get; set; }
        public List<productOptionTypesModel>? lstoptiontype { get; set; }
    }

    public class productOptionsModel : commonModel
    {
        public Int64? option_id { get; set; }
        public Int64? option_type_id { get; set; }
        public string? option_type { get; set; }
        public Int64? product_id { get; set; }
        public string? product_name { get; set; }
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
        public Int64? option_type_id { get; set; }
        public Int64? product_id { get; set; }
        public string? title { get; set; }
    }

    public class couponModel : commonModel
    {
        public Int64 coupon_id { get; set; }
        public string coupon_code { get; set; }
        public string discount_value { get; set; }
        public string from_date { get; set; }
        public string to_date { get; set; }
        public bool isdisable { get; set; }

    }

    public class cartMaster : commonModel
    {
        public Int64 cartmaster_id { get; set; }
        public Int64 user_id { get; set; }
    }

    public class productCartMap : commonModel
    {
        public Int64 product_cart_mapid { get; set; }
        public Int64 user_id { get; set; }
        public Int64 product_id { get; set; }
        public Int64 cartmaster_id { get; set; }
        public string optiovalues_ids { get; set; }
        public decimal total_amount { get; set; }
        public decimal attribute_amount { get; set; }
        public decimal base_amount { get; set; }
        public List<productOptionValuesModel>? lstvalues {get; set;}
       
    }

    public class orderDetails : commonModel
    {
        public Int64 order_id { get; set; }
        public Int64 user_id { get; set; }
        public string order_number { get; set; }
        public string payment_type { get; set; }
        public string payment_order_id { get; set; }
        public string payment_response { get; set; }

    }
}
