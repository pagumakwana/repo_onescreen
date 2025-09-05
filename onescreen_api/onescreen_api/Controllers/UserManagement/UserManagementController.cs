using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using onescreenBAL.UserManagement;
using onescreenModel.UserManagement;
using onescreenModel.Common;

namespace onescreen_api.Controllers.UserManagement
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagementController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public UserManagementController(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objuserRegistration"></param>
        /// <returns></returns>
        [Route("SignUp")]
        [HttpPost]
        public string SignUp(userRegistration objuserRegistration)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.SignUp(objuserRegistration);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [Route("SignIn")]
        [HttpGet]
        public List<userManagementModel> SignIn(string userName, string password)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.SignIn(userName, password);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="usercode"></param>
        /// <returns></returns>
        [Route("forgotpassword")]
        [HttpPost]
        public string ForgotPassword(string usercode)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.ForgotPassword(usercode);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="usercode"></param>
        /// <returns></returns>
        [Route("validateuser")]
        [HttpGet]
        public string ValidateUser(string usercode)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.ValidateUser(usercode);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objclsRequestOTP"></param>
        /// <returns></returns>
        [Route("RequestOTP")]
        [HttpPost]
        public string RequestOTP(requestOTPModel objclsRequestOTP)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.RequestOTP(objclsRequestOTP);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objuserManagementModel"></param>
        /// <returns></returns>
        [Route("manageuser")]
        [HttpPost]
        public string manageuser(userManagementModel objuserManagementModel)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.manageuser(objuserManagementModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="user_id"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getuserdetail")]
        [HttpGet]
        public responseModel getuserdetail(string flag, long user_id = 0, string search = "null", long start_count = 0, long end_count = 0)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.getuserdetail(flag, user_id, search, start_count, end_count);
            }
        }


        /// <summary>
        /// News Letter Subscribers
        /// </summary>
        /// <param name="email_id"></param>
        /// <returns></returns>
        //[Route("subscribe")]
        //[HttpPost]
        //public string Subscribe(string email_id)
        //{
        //    using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
        //    {
        //        return objUserManagement_BAL.subscribe(email_id);
        //    }
        //}

        /// <summary>
        /// Get Subscriber List
        /// </summary>
        /// <returns></returns>
        //[Route("getsubscriber")]
        //[HttpGet]
        //public responseModel getsubscriber(string flag = "", Int64 start_count = 0, Int64 end_count = 0)
        //{
        //    using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
        //    {
        //        return objUserManagement_BAL.getsubscriber(flag, start_count, end_count);
        //    }
        //}

       /// <summary>
       /// 
       /// </summary>
       /// <param name="contact_id"></param>
       /// <param name="start_count"></param>
       /// <param name="end_count"></param>
       /// <returns></returns>
        [Route("getcontactdetails")]
        [HttpGet]
        public responseModel getcontactdetails(Int64 contact_id = 0, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.getcontactdetails(contact_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objcontactdetails"></param>
        /// <returns></returns>
        [Route("managecontactdetails")]
        [HttpPost]
        public string managecontactdetails(contact_details objcontactdetails)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.managecontactdetails(objcontactdetails);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objuserManagementModel"></param>
        /// <returns></returns>
        [Route("profilepicture")]
        [HttpPost]
        public string profilepicture(userManagementModel objuserManagementModel)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.profilepicture(objuserManagementModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objupdate_user"></param>
        /// <returns></returns>
        [Route("update_userdetails")]
        [HttpPost]
        public string update_userdetails(update_user objupdate_user)
        {
            using (UserManagement_BAL objUserManagement_BAL = new UserManagement_BAL(_httpContextAccessor))
            {
                return objUserManagement_BAL.update_userdetails(objupdate_user);
            }
        }
    }
}
