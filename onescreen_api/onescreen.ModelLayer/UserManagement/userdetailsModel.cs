using onescreenModel.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using onescreenModel.Common;
using onescreenModel.Configuration;
using onescreenModel.ProjectManagement;

namespace onescreenModel.UserManagement
{
    public class userManagementModel : commonModel
    {
        public string username { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        public string mobilenumber { get; set; }
        public string? bio { get; set; }
        public bool? thirdparty { get; set; }
        public string? dob { get; set; }
        public string? website { get; set; }
        public string? profilepicture { get; set; }
        public Nullable<bool> is_approved { get; set; }
        public Int64 vendor_id { get; set; }
        public string? contact_person_name { get; set; }
        public string? commission { get; set; }
        public List<authorityuserModel> lstauthority { get; set; }
        public List<vendoruserModel> lstvendor { get; set; }
        public string password { get; set; }
        public string? address { get; set; }
    }

    public class authorityuserModel
    {
        public Int64 authority_id { get; set; }
        public Int64 user_id { get; set; }
        public string authority { get; set; }
    }

    public class projectuserModel
    {
        public Int64 project_id { get; set; }
        public Int64 user_id { get; set; }
        public string projectname { get; set; }
    }
    public class vendoruserModel
    {
        public Int64 vendor_id { get; set; }
        public string? contact_person_name { get; set; }
    }

    public class requestOTPModel : commonModel
    {
        public Int64 Ref_OTP_ID { get; set; }
        public string OTP { get; set; }
        public string Type { get; set; }
        public bool IsValidate { get; set; }
    }

    public class contact_details : commonModel
    {
        public Int64 contact_id { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        public string? mobile_no { get; set; }
        public string? subject_line { get; set; }
        public string? description { get; set; }
    }

    public class subscriberModel : commonModel
    {
        public Int64 subscriber_id { get; set; }
        public string email_id { get; set; }
    }

    public class userFriendModel : commonModel
    {
        public Int64 friend_id { get; set; }
        public string username { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        public bool approved { get; set; }
    }

    public class userAddressModel : commonModel
    {
        public Int64 address_id { get; set; }
        public string flat_number { get; set; }
        public string buildingname { get; set; }
        public string line_one { get; set; }
        public string line_two { get; set; }
        public string landmark { get; set; }
        public Int64 pincode_id { get; set; }
        public Int64 country_id { get; set; }
        public Int64 state_id { get; set; }
        public Int64 city_id { get; set; }
        public bool isregistereduser { get; set; }
    }
    public class AuthModel : commonModel
    {
        public string authToken { get; set; }
        public string refreshToken { get; set; }
        public Nullable<DateTime> expiresIn { get; set; }
        public string username { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        public string mobilenumber { get; set; }
        public string bio { get; set; }
        public bool thirdparty { get; set; }
        public DateTime? dob { get; set; }
        public string website { get; set; }
        public string profilepicture { get; set; }
        public List<authorityModel> lstauthority { get; set; }
        public List<projectModel> lstproject { get; set; }
        public string password { get; set; }
    }

    public class userRegistration : commonModel
    {
        public Int64 user_id { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        public string mobilenumber { get; set; }
        public string password { get; set; }

    }

    public class update_user :commonModel
    {
        public Int64 user_id { get; set; }
        public string fullname { get; set; }
        public string email_id { get; set; }
        //public string mobilenumber { get; set; }
        public string address { get; set; }
    }
}
