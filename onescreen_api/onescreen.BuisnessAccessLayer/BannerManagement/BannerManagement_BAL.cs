using Microsoft.AspNetCore.Http;
using onescreenDAL.BannerManagement;
using onescreenModel.BannerManagement;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.BannerManagement
{
    public class BannerManagement_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BannerManagement_BAL(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        public responseModel getbanner(string flag, Int64 banner_id, Int64 category_id = 0, string category = "", Int64 label_id = 0, string label = "", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (BannerManagement_DAL _objBannerManagement_DAL = new BannerManagement_DAL(_httpContextAccessor))
            {
                return _objBannerManagement_DAL.getbanner(flag, banner_id, category_id, category, label_id, label, search, start_count, end_count);
            }
        }
        public string managebanner(bannerModel objbannerModel)
        {
            using (BannerManagement_DAL _objBannerManagement_DAL = new BannerManagement_DAL(_httpContextAccessor))
            {
                return _objBannerManagement_DAL.managebanner(objbannerModel);
            }
        }
        public void Dispose()
        {
            //throw new NotImplementedException();
        }
    }
}
