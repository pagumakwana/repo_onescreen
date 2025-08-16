using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using onescreenBAL.ProductManagement;
using onescreenModel.Common;
using onescreenModel.ProductManagement;

namespace onescreen_api.Controllers.ProductManagement
{
    [Route("api/product")]
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="brand_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getbrand")]
        [HttpGet]
        public responseModel getbrand(string flag, Int64 brand_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getbrand(flag, brand_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objbrandModel"></param>
        /// <returns></returns>
        [Route("managebrand")]
        [HttpPost]
        public string managebrand(brandModel objbrandModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.managebrand(objbrandModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objproductOptionTypesModel"></param>
        /// <returns></returns>
        [Route("manageproductoptiontypes")]
        [HttpPost]
        public string manageproductoptiontypes(productOptionTypesModel objproductOptionTypesModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.manageproductoptiontypes(objproductOptionTypesModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objproductOptionValuesModel"></param>
        /// <returns></returns>
        [Route("manageproductoptionvalues")]
        [HttpPost]
        public string manageproductoptionvalues(productOptionValuesModel objproductOptionValuesModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.manageproductoptionvalues(objproductOptionValuesModel);
            }
        }
    }
}
