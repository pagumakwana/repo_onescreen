using Microsoft.AspNetCore.Http;
using onescreenDAL.ProjectManagement;
using onescreenModel.Common;
using onescreenModel.ProjectManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.ProjectManagement
{
    public class ProjectManagement_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ProjectManagement_BAL(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;
        public string AddModifyProjectDetails(projectModel objprojectModel)
        {
            using (ProjectManagement_DAL _objProjectManagement_DAL = new ProjectManagement_DAL(_httpContextAccessor))
            {
                return _objProjectManagement_DAL.AddModifyProjectDetails(objprojectModel);
            }
        }
        public responseModel ProjectDetails(string flag = "", string aliasname = "", Int64 project_id = 0, Int64 client_id = 0)
        {
            using (ProjectManagement_DAL _objProjectManagement_DAL = new ProjectManagement_DAL(_httpContextAccessor))
            {
                return _objProjectManagement_DAL.ProjectDetails(flag, aliasname, project_id, client_id);
            }
        }
        public void Dispose()
        {

        }
    }
}
