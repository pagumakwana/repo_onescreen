using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using onescreen.DAL.Common;
using onescreenModel.Common;

namespace onescreen.BuisnessAccessLayer.Common
{
    public class Common_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostingEnvironment _hostingEnvironment;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <param name="hostingEnvironment"></param>
        public Common_BAL(IHttpContextAccessor httpContextAccessor, IHostingEnvironment hostingEnvironment = null)
        {
            _httpContextAccessor = httpContextAccessor;
            _hostingEnvironment = hostingEnvironment;
        }

        public List<fileInfoModel> FileUploader(string module)
        {
            using (Common_DAL _objCommon_DAL = new Common_DAL(_httpContextAccessor, _hostingEnvironment))
            {
                return _objCommon_DAL.FileUploader(module);
            }
        }
        public string RemoveFile(Int64 file_id)
        {
            using (Common_DAL _objCommon_DAL = new Common_DAL(_httpContextAccessor, _hostingEnvironment))
            {
                return _objCommon_DAL.RemoveFile(file_id);
            }
        }

        public void Dispose()
        {
            //throw new NotImplementedException();
        }
    }
}
