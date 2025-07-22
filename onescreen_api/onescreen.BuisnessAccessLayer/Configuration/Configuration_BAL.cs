using Microsoft.AspNetCore.Http;
using onescreenDAL.Configuration;
using onescreenModel.Common;
using onescreenModel.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.Configuration
{
    public class Configuration_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Configuration_BAL(IHttpContextAccessor httpContextAccessor) =>
           _httpContextAccessor = httpContextAccessor;
        public List<userConfigurationModel> getuserconfig(Int64 user_id)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getuserconfig(user_id);
            }
        }

        public string usermodule(userModuleModel objclsUserModule)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.usermodule(objclsUserModule);
            }
        }

        public responseModel getmodule(Int64 module_id, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getmodule(module_id, search, start_count, end_count);
            }
        }

        public string authoritymodule(authorityModel objclsAuthority)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.authoritymodule(objclsAuthority);
            }
        }

        public responseModel getauthority(Int64 authority_id, string flag)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getauthority(authority_id, flag);
            }
        }

        public string controls(controlsModel objcontrolsModel)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.controls(objcontrolsModel);
            }
        }

        public responseModel getcontrols(Int64 control_id, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getcontrols(control_id, search, start_count, end_count);
            }
        }
        public responseModel getauthoritycontrols(Int64 user_id, string module_aliasname)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getauthoritycontrols(user_id, module_aliasname);
            }
        }
        public responseModel getauthoritymodule(Int64 user_id)
        {
            using (Configuration_DAL _objConfiguration_DAL = new Configuration_DAL(_httpContextAccessor))
            {
                return _objConfiguration_DAL.getauthoritymodule(user_id);
            }
        }

        public void Dispose() 
        { 
        }
    }
}
