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

    public class usercartMaster : commonModel
    {
        public Int64? cart_master_id { get; set; }
        public Int64? user_id { get; set; }
        public Guid? batch_id { get; set; }
        public Int64? coupon_id { get; set; }
        public string? coupon_code { get; set; }
        public decimal cart_total { get; set; }
        public decimal cart_subtotal { get; set; }
        public decimal cart_discount { get; set; }
        public decimal cart_tax { get; set; }
        public List<usercartmappingModel> lst_cart_product { get; set; }
    }

    public class usercartmappingModel : commonModel
    {
        public Int64 user_cart_mapping_id { get; set; }
        public Int64? cart_master_id { get; set; }
        public Int64? product_id { get; set; }
        public string? product_name { get; set; }
        public Int64? user_id { get; set; }
        public string? fullname { get; set; }
        public string? optionvalues { get; set; }
        public decimal attribute_amount { get; set; }
        public decimal total_amount { get; set; }
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

    public class vendorModel : commonModel
    {
        public Int64 vendor_id { get; set; }
        public string contact_person_name { get; set; }
        public string company_name { get; set; }
        public string email_id { get; set; }
        public string mobile_no { get; set; }
        public string vendor_address { get; set; }

    }

    public class Razorpay_OrderAttribute
    {
        public Int64 amount { get; set; }
        public Int64 amount_due { get; set; }
        public Int64 amount_paid { get; set; }
        public Int64 attempts { get; set; }
        public Int64 created_at { get; set; }
        public string currency { get; set; }
        public string entity { get; set; }
        public string id { get; set; }
        public dynamic? notes { get; set; }
        public string? offer_id { get; set; }
        public string? receipt { get; set; }
        public string? status { get; set; }
    }

    public class RazorpayPaymentResponse
    {
        public string razorpay_order_id { get; set; }
        public string razorpay_payment_id { get; set; }
        public string razorpay_signature { get; set; }
        public string? status { get; set; }
    }

    public class userorderMaster : commonModel
    {
        public Int64 order_id { get; set; }
        public Int64 user_id { get; set; }
        public Int64 coupon_id { get; set; }
        public string? order_number { get; set; }
        public string? payment_type { get; set; }
        public string? payment_order_id { get; set; }
        public string? payment_response { get; set; }
        public decimal? order_total { get; set; }
        public decimal? order_subtotal { get; set; }
        public decimal? order_discount { get; set; }
        public decimal? order_tax { get; set; }
        public string? order_status { get; set; }
        public string? payment_status { get; set; }
        public List<userorderhistoryModel> lst_orderdetail { get; set; }
    }

    public class userorderhistoryModel : commonModel
    {
        public Int64 order_id { get; set; }
        public Int64 order_history_id { get; set; }
        public Int64 user_id { get; set; }
        public Int64 product_id { get; set; }
        public string? product_name { get; set; }
        public string? from_date { get; set; }
        public string? to_date { get; set; }
        public decimal base_amount { get; set; }
        public string? optionvalues { get; set; }
        public decimal attribute_amount { get; set; }
        public List<productOptionValuesModel>? lstvalues { get; set; }

    }
}
