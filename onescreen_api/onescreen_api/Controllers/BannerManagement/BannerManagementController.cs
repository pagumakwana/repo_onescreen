using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.BannerManagement;
using onescreenModel.BannerManagement;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace onescreen_api.Controllers.BannerManagement
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/bannermanagement")]
    [ApiController]
    public class BannerManagementController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public BannerManagementController(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="banner_id"></param>
        /// <param name="category_id"></param>
        /// <param name="category"></param>
        /// <param name="label_id"></param>
        /// <param name="label"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getbanner")]
        [HttpGet]
        public responseModel getbanner(string flag, Int64 banner_id, Int64 category_id = 0, string category = "", Int64 label_id = 0, string label = "", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (BannerManagement_BAL _objBannerManagement_BAL = new BannerManagement_BAL(_httpContextAccessor))
            {
                return _objBannerManagement_BAL.getbanner(flag, banner_id, category_id, category, label_id, label, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objbannerModel"></param>
        /// <returns></returns>
        [Route("managebanner")]
        [HttpPost]
        public string managebanner(bannerModel objbannerModel)
        {
            using (BannerManagement_BAL _objBannerManagement_BAL = new BannerManagement_BAL(_httpContextAccessor))
            {
                return _objBannerManagement_BAL.managebanner(objbannerModel);
            }
        }
    }
}
