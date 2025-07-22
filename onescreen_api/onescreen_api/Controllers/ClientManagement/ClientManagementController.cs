using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using onescreenBAL.ClientManagement;
using onescreenModel.Common;
using onescreenModel.ClientManagement;

namespace onescreen_api.Controllers.ClientManagement
{
    /// <summary>
    /// 
    /// </summary>
    [Route("api/manageclient")]
    [ApiController]
    public class ClientManagementController : ControllerBase
    {
        private readonly ILogger<ClientManagementController> _logger;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="logger"></param>
        public ClientManagementController(ILogger<ClientManagementController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="client_id"></param>
        /// <param name="flag"></param>
        /// <param name="aliasname"></param>
        /// <returns></returns>
        [Route("getclient")]
        [HttpGet]
        public responseModel getclient(long client_id, string flag = "", string aliasname = "")
        {
            using (ClientManagement_BAL _objClientManagement_BAL = new ClientManagement_BAL())
            {
                return _objClientManagement_BAL.getclient(client_id, flag, aliasname);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objclientModel"></param>
        /// <returns></returns>
        [Route("client")]
        [HttpPost]
        public string clients(clientModel objclientModel)
        {
            using (ClientManagement_BAL _objClientManagement_BAL = new ClientManagement_BAL())
            {
                return _objClientManagement_BAL.clients(objclientModel);
            }
        }
    }
}
