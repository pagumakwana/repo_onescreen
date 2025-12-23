using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.Configuration;
using onescreenModel.Common;
using onescreenModel.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace onescreen_api.Controllers.Configuration
{
    [Route("api/config")]
    [ApiController]
    public class ConfigurationController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public ConfigurationController(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <returns></returns>

        [Route("getuserconfig")]
        [HttpGet]
        public List<userConfigurationModel> getuserconfig(Int64 user_id = 0)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getuserconfig(user_id);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objclsUserModule"></param>
        /// <returns></returns>
        [Route("managemodule")]
        [HttpPost]
        public string usermodule(userModuleModel objclsUserModule)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.usermodule(objclsUserModule);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="module_id"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getmodule")]
        [HttpGet]
        public responseModel getmodule(Int64 module_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getmodule(module_id, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objclsAuthority"></param>
        /// <returns></returns>
        [Route("authority")]
        [HttpPost]
        public string authoritymodule(authorityModel objclsAuthority)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.authoritymodule(objclsAuthority);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="authority_id"></param>
        /// <param name="flag"></param>
        /// <returns></returns>
        [Route("getauthority")]
        [HttpGet]
        public responseModel getauthority(Int64 authority_id = 0, string flag = "")
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getauthority(authority_id, flag);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="objclsControls"></param>
        /// <returns></returns>
        [Route("controls")]
        [HttpPost]
        public string controls(controlsModel objclsControls)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.controls(objclsControls);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="control_id"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getcontrols")]
        [HttpGet]
        public responseModel getcontrols(Int64 control_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getcontrols(control_id, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <param name="module_aliasname"></param>
        /// <returns></returns>
        [Route("getauthoritycontrols")]
        [HttpGet]
        public responseModel getauthoritycontrols(Int64 user_id, string module_aliasname)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getauthoritycontrols(user_id, module_aliasname);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <returns></returns>
        [Route("getauthoritymodule")]
        [HttpGet]
        public responseModel getauthoritymodule(Int64 user_id)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getauthoritymodule(user_id);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="config_id"></param>
        /// <param name="config_name"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getportalconfig")]
        [HttpGet]
        public responseModel getportalconfig(string flag, Int64 config_id, string config_name = "null", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.getportalconfig(flag, config_id, config_name, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objportalconfigModel"></param>
        /// <returns></returns>
        [Route("manageportalconfig")]
        [HttpPost]
        public string manageportalconfig(portalconfigModel objportalconfigModel)
        {
            using (Configuration_BAL objConfiguration_BAL = new Configuration_BAL(_httpContextAccessor))
            {
                return objConfiguration_BAL.manageportalconfig(objportalconfigModel);
            }
        }
    }
}
