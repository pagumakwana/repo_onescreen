using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenModel.BannerManagement
{
    public class bannerModel : commonModel
    {
        public Int64 banner_id { get; set; }
        public string title { get; set; }
        public string subtitle { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public Int64 displayorder { get; set; }
        public List<bannerTypeModel> lsttypemaster { get; set; }
        public List<bannerCategoryModel> lstcategory { get; set; }
        public List<bannerLabelModel> lstlabel { get; set; }
    }

    public class bannerCategoryModel : webdObjModel
    {
        public Int64 banner_id { get; set; }
        public Int64 category_id { get; set; }
        public string category { get; set; }
    }
    public class bannerLabelModel : webdObjModel
    {
        public Int64 banner_id { get; set; }
        public Int64 label_id { get; set; }
        public string label { get; set; }
    }
    public class bannerTypeModel : webdObjModel
    {
        public Int64 banner_id { get; set; }
        public Int64 typemaster_id { get; set; }
        public string typemaster { get; set; }
    }
}
