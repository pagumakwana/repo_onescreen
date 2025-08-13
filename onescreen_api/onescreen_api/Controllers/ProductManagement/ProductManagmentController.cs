using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.ProductManagement;
using onescreenModel.Common;
using onescreenModel.ProductManagement;

namespace onescreen_api.Controllers.ProductManagement
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductManagmentController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public ProductManagmentController(IHttpContextAccessor httpContextAccessor) =>
           _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="product_id"></param>
        /// <param name="brand_id"></param>
        /// <param name="category_name"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getproduct")]
        [HttpGet]
        public responseModel getproduct(string flag, Int64 product_id, Int64 brand_id = 0, string category_name = "", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getproduct(flag, product_id, brand_id, category_name, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objproductModel"></param>
        /// <returns></returns>
        [Route("manageproduct")]
        [HttpPost]
        public string manageproduct(productModel objproductModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.manageproduct(objproductModel);
            }
        }
    }
}
