using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.MasterManagement
{
    public class categoryModel : commonModel
    {
        public Int64 category_id { get; set; }
        public Int64 parent_category_id { get; set; }
        public Int64 typemaster_id { get; set; }
        public string typemaster { get; set; }
        public string category { get; set; }
        //public string category_url { get; set; }
        public Int64 displayorder { get; set; }
        public string aliasname { get; set; }
        public string description { get; set; }
        public bool isfeatured { get; set; }
        public Int64 count { get; set; }
        public List<typemasterModel> lsttypemaster { get; set; }
        public List<categoryModel> lstparentcategory { get; set; }
    }
    public class parentUserMasterModel
    {

        public Int64 usermaster_id { get; set; }
        public string usermaster_name { get; set; }
        public Boolean is_compulsory { get; set; }
        public string typeOfView { get; set; }
        public List<usermasterdataModel> usermasterdata { get; set; }

    }


    public class usermasterModel : commonModel
    {
        public Int64 usermaster_id { get; set; }
        //public Int64 usermaster_control_id { get; set; }
        public string usermaster_name { get; set; }
        public string? usermaster_description { get; set; }
        public Int64? parent_ids { get; set; }
        public Boolean? is_mandatory { get; set; }
        public Boolean? has_parent { get; set; }
        public Boolean? allow_numeric { get; set; }
        public Boolean? allow_alphanumeric { get; set; }
        public Boolean? allow_specialcharacter { get; set; }
        public string? special_character { get; set; }
        public Boolean? allow_negative_number { get; set; }
    }
    public class usermasterdataModel : commonModel
    {
        public Int64 usermasterdata_id { get; set; }
        public Int64 usermaster_id { get; set; }
        public Int64 usermasterdata_parent_id { get; set; }
        public string usermasterdata_name { get; set; }
        public string? usermaster_name { get; set; }
        public string usermasterdata_description { get; set; }
        public List<usermasterdatamasterModel> lstmasterdata { get; set; }
    }
    public class usermasterdatamasterModel
    {
        public Int64 usermaster_id { get; set; }
        public string usermaster_name { get; set; }

    }


    public class measurenameModel
    {
        public Int64 Ref_Measure_ID { get; set; }
        public string Measure { get; set; }
        public string MeasureType { get; set; }
        public Int64 Ref_MeasureType_ID { get; set; }
        public decimal MeasureValue { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public Int64 CreatedBy { get; set; }
        public string CreatedName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public Int64 UpdatedBy { get; set; }
        public string UpdatedName { get; set; }
        public DateTime UpdatedDateTime { get; set; }

    }

    public class measureTypeNameModel
    {
        public Int64 Ref_MeasureType_ID { get; set; }
        public string MeasureType { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public Int64 CreatedBy { get; set; }
        public string CreatedName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public Int64 UpdatedBy { get; set; }
        public string UpdatedName { get; set; }
        public DateTime UpdatedDateTime { get; set; }

    }
    public class typemasterModel : commonModel
    {
        public Int64 typemaster_id { get; set; }
        public string aliasname { get; set; }
        public string typemaster { get; set; }
        public string description { get; set; }
        public Int64 displayorder { get; set; }
    }


    #region Product Details
    public class productdetailsModel
    {
        public Int64 Ref_Product_ID { get; set; }
        public Int64 Ref_Brand_ID { get; set; }
        public Int64 Ref_Manufacturer_ID { get; set; }
        public Int64 Ref_SKU_ID { get; set; }
        public Int64 Ref_Type_ID { get; set; }
        public Int64 Ref_Category_ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ProductUse { get; set; }
        public string Is_Active { get; set; }
        public string Is_Deleted { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedName { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedName { get; set; }
        public Int64 ImageUrl { get; set; }
    }
    #endregion



    public class labelModel : commonModel
    {
        public Int64 label_id { get; set; }
        public Int64 typemaster_id { get; set; }
        public string typemaster { get; set; }
        public string description { get; set; }
        public string label { get; set; }
        public string aliasname { get; set; }

    }
}
