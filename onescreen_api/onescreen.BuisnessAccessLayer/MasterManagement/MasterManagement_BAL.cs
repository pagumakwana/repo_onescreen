using Microsoft.AspNetCore.Http;
using onescreenDAL.MasterManagement;
using onescreenModel.Common;
using onescreenModel.MasterManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.MasterManagement
{
    public class MasterManagement_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterManagement_BAL(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;
        public String AddUserMaster(usermasterModel objusermasterModel)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.AddUserMaster(objusermasterModel);
            }
        }

        public responseModel GetUserMasterList(string flag, Int64 usermaster_id, Boolean is_mandatory, Boolean has_parent, string search, Int64 start_count, Int64 end_count)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.GetUserMasterList(flag, usermaster_id, is_mandatory, has_parent, search, start_count, end_count);
            }
        }

        public List<parentUserMasterModel> GetParentUserMasterList(Int64 UserMasterID)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.GetParentUserMasterList(UserMasterID);
            }
        }

        public String AddUserMasterData(usermasterdataModel ObjUserMasterData)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.AddUserMasterData(ObjUserMasterData);
            }

        }

        public responseModel GetUserMasterDataList(string flag, Int64 usermasterdata_id, string usermaster_name, string search, Int64 start_count, Int64 end_count)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.GetUserMasterDataList(flag, usermasterdata_id, usermaster_name, search, start_count, end_count);
            }
        }

        public string typemaster(typemasterModel objclsTypeMaster_BO)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.typemaster(objclsTypeMaster_BO);
            }

        }
        public responseModel gettypemaster(string flag, string aliasname = "null", Int64 typemaster_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.gettypemaster(flag, aliasname, typemaster_id, search, start_count, end_count);
            }
        }
        public string category(categoryModel objcategoryModel)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.category(objcategoryModel);
            }

        }
        public responseModel getcategory(string flag, Int64 typemaster_id = 0, string typemaster = "null", Int64 category_id = 0, string aliasname = "null", bool isfeatured = false, Int64 parent_category_id = 0, string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.getcategory(flag, typemaster_id, typemaster, category_id, aliasname, isfeatured, parent_category_id, search, start_count, end_count);
            }
        }
        public string labelmaster(labelModel objlabelModel)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.labelmaster(objlabelModel);
            }

        }
        public responseModel getlabelmaster(string flag, Int64 label_id = 0, string aliasname = "null", Int64 typemaster_id = 0, string typemaster = "null", string search = "null", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
            {
                return objMasterManagement_BAL.getlabelmaster(flag, label_id, aliasname, typemaster_id, typemaster, search, start_count, end_count);
            }
        }
        //public string UploadFile(string Module)
        //{
        //    using (MasterManagement_DAL objMasterManagement_BAL = new MasterManagement_DAL(_httpContextAccessor))
        //    {
        //        return objMasterManagement_BAL.UploadFile(Module);
        //    }

        //}

        public void Dispose()
        {

        }
    }
}
