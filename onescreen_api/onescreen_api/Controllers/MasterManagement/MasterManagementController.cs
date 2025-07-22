using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.MasterManagement;
using onescreenModel.Common;
using onescreenModel.MasterManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace onescreen_api.Controllers.MasterManagement
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MasterManagementController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public MasterManagementController(IHttpContextAccessor httpContextAccessor) =>
           _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ObjUserMaster"></param>
        /// <returns></returns>
        [Route("UserMaster")]
        [HttpPost]
        public string AddUserMaster(usermasterModel ObjUserMaster)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.AddUserMaster(ObjUserMaster);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="usermaster_id"></param>
        /// <param name="is_mandatory"></param>
        /// <param name="has_parent"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("UserMaster")]
        [HttpGet]
        public responseModel GetUserMasterList(string flag, Int64 usermaster_id, Boolean is_mandatory, Boolean has_parent, string search, Int64 start_count, Int64 end_count)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.GetUserMasterList(flag, usermaster_id, is_mandatory, has_parent, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ObjUserMasterData"></param>
        /// <returns></returns>
        [Route("UserMasterData")]
        [HttpPost]
        public string AddUserMasterData(usermasterdataModel ObjUserMasterData)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.AddUserMasterData(ObjUserMasterData);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="usermasterdata_id"></param>
        /// <param name="usermaster_name"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("UserMasterData")]
        [HttpGet]
        public responseModel GetUserMasterDataList(string flag, Int64 usermasterdata_id, string usermaster_name, string search, Int64 start_count, Int64 end_count)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.GetUserMasterDataList(flag, usermasterdata_id, usermaster_name, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objtypemasterModel"></param>
        /// <returns></returns>
        [Route("typemaster")]
        [HttpPost]
        public string typemaster(typemasterModel objtypemasterModel)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.typemaster(objtypemasterModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="aliasname"></param>
        /// <param name="typemaster_id"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("gettypemaster")]
        [HttpGet]
        public responseModel gettypemaster(string flag, string aliasname = "null", Int64 typemaster_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.gettypemaster(flag, aliasname, typemaster_id, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objcategoryModel"></param>
        /// <returns></returns>
        [Route("category")]
        [HttpPost]
        public string category(categoryModel objcategoryModel)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.category(objcategoryModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="typemaster_id"></param>
        /// <param name="typemaster"></param>
        /// <param name="category_id"></param>
        /// <param name="aliasname"></param>
        /// <param name="isfeatured"></param>
        /// <param name="parent_category_id"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getcategory")]
        [HttpGet]
        public responseModel getcategory(string flag, Int64 typemaster_id = 0, string typemaster = "null", Int64 category_id = 0, string aliasname = "null", bool isfeatured = false, Int64 parent_category_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.getcategory(flag, typemaster_id, typemaster, category_id, aliasname, isfeatured, parent_category_id, search, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objlabelModel"></param>
        /// <returns></returns>
        [Route("labelmaster")]
        [HttpPost]
        public string labelmaster(labelModel objlabelModel)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.labelmaster(objlabelModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="label_id"></param>
        /// <param name="aliasname"></param>
        /// <param name="typemaster_id"></param>
        /// <param name="typemaster"></param>
        /// <param name="search"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getlabelmaster")]
        [HttpGet]
        public responseModel getlabelmaster(string flag, Int64 label_id = 0, string aliasname = "null", Int64 typemaster_id = 0, string typemaster = "null", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.getlabelmaster(flag, label_id, aliasname, typemaster_id, typemaster, search, start_count, end_count);
            }
        }


        //[Route("UploadFile")]
        //[HttpPost]
        //public string UploadFile(string Module)
        //{
        //    using (MasterManagement_BAL objMasterManagement_BAL = new MasterManagement_BAL(_httpContextAccessor))
        //    {
        //        return objMasterManagement_BAL.UploadFile(Module);
        //    }
        //}
    }
}
