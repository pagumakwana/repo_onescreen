using Microsoft.AspNetCore.Http;
using onescreenDAL.UserManagement;
using onescreenModel.Common;
using onescreenModel.UserManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.UserManagement
{
    public class UserManagement_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserManagement_BAL(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        public string SignUp(userManagementModel objclsUserManagement)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.SignUp(objclsUserManagement);
            }
        }
        public List<userManagementModel> SignIn(string userName, string password)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.SignIn(userName, password);
            }
        }

        public string ForgotPassword(string usercode)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.ForgotPassword(usercode);
            }
        }

        public string ValidateUser(string usercode)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.ValidateUser(usercode);
            }
        }

        public string RequestOTP(requestOTPModel objclsRequestOTP)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.RequestOTP(objclsRequestOTP);
            }
        }
        public string manageuser(userManagementModel objclsUserManagement)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.manageuser(objclsUserManagement);
            }
        }

        public responseModel getuserdetail(string flag, Int64 user_id, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.getuserdetail(flag, user_id, search, start_count, end_count);
            }
        }

        public string subscribe(string email_id)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.subscribe(email_id);
            }
        }
        public responseModel getsubscriber(string flag, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.getsubscriber(flag, start_count, end_count);
            }
        }

        public string managecontactus(contactUsModel objcontactus)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.managecontactus(objcontactus);
            }
        }

        public responseModel getcontactus()
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.getcontactus();
            }
        }
        public string profilepicture(userManagementModel objclsUserManagement)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.profilepicture(objclsUserManagement);
            }
        }

        public string requestfriend(userFriendModel objclsUserFriend_BO)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.requestfriend(objclsUserFriend_BO);
            }
        }

        public string approvedrequest(userFriendModel objclsUserFriend_BO)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.approvedrequest(objclsUserFriend_BO);
            }
        }

        public string addressupdate(userAddressModel objuserAddressModel)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.addressupdate(objuserAddressModel);
            }
        }
        public responseModel getusertoken(string authToken)
        {
            using (UserManagement_DAL objUserManagement_DAL = new UserManagement_DAL(_httpContextAccessor))
            {
                return objUserManagement_DAL.getusertoken(authToken);
            }
        }

        public void Dispose() 
        {
        }
    }
}
