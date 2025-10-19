using Microsoft.AspNetCore.Mvc;
using onescreen.BuisnessAccessLayer.Common;
using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;

namespace onescreen_api.Controllers.Common
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/common")]
    [ApiController]
    public class CommonController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <param name="hostingEnvironment"></param>
        public CommonController(IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment)
        {
            _httpContextAccessor = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="module"></param>
        /// <returns></returns>
        [Route("fileupload")]
        [HttpPost]
        public List<fileInfoModel> FileUploader(string module = "")
        {
            using (Common_BAL objCommon_BAL = new Common_BAL(_httpContextAccessor, _hostingEnvironment))
            {
                return objCommon_BAL.FileUploader(module);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="file_id"></param>
        /// <returns></returns>
        [Route("removefile")]
        [HttpPost]
        public string RemoveFile(Int64 file_id)
        {
            using (Common_BAL objCommon_BAL = new Common_BAL(_httpContextAccessor, _hostingEnvironment))
            {
                return objCommon_BAL.RemoveFile(file_id);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="user_id"></param>
        /// <returns></returns>
        [Route("getdashboardwidget")]
        [HttpGet]
        public responseModel getdashboardwidget(string flag, Int64 user_id)
        {
            using (Common_BAL objCommon_BAL = new Common_BAL(_httpContextAccessor, _hostingEnvironment))
            {
                return objCommon_BAL.getdashboardwidget(flag, user_id);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <returns></returns>
        [Route("getwalletwidget")]
        [HttpGet]
        public responseModel getwalletwidget(Int64 user_id)
        {
            using (Common_BAL objCommon_BAL = new Common_BAL(_httpContextAccessor, _hostingEnvironment))
            {
                return objCommon_BAL.getwalletwidget(user_id);
            }
        }
    }
}
