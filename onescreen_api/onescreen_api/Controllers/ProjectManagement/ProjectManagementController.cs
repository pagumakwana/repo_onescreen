using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.ProjectManagement;
using onescreenModel.Common;
using onescreenModel.ProjectManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace onescreen_api.Controllers.ProjectManagement
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectManagementController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public ProjectManagementController(IHttpContextAccessor httpContextAccessor) =>
            _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objprojectModel"></param>
        /// <returns></returns>
        [Route("project")]
        [HttpPost]
        public string AddModifyProjectDetails(projectModel objprojectModel)
        {
            using (ProjectManagement_BAL objProjectManagement_BAL = new ProjectManagement_BAL(_httpContextAccessor))
            {
                return objProjectManagement_BAL.AddModifyProjectDetails(objprojectModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="aliasname"></param>
        /// <param name="project_id"></param>
        /// <param name="client_id"></param>
        /// <returns></returns>
        [Route("getproject")]
        [HttpGet]
        public responseModel ProjectDetails(string flag = "", string aliasname = "", long project_id = 0, long client_id = 0)
        {
            using (ProjectManagement_BAL objProjectManagement_BAL = new ProjectManagement_BAL(_httpContextAccessor))
            {
                return objProjectManagement_BAL.ProjectDetails(flag, aliasname, project_id, client_id);
            }
        }
    }
}
