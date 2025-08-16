using Microsoft.AspNetCore.Http;
using onescreenDAL.ProductManagement;
using onescreenModel.Common;
using onescreenModel.ProductManagement;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace onescreenBAL.ProductManagement
{
    public class ProductManagement_BAL : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Int64 client_id;
        private readonly Int64 project_id;
        public ProductManagement_BAL(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            client_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
        }

        public responseModel getproduct(string flag, Int64 product_id, Int64 brand_id = 0, string category_name = "", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getproduct(flag, product_id, brand_id, category_name, start_count, end_count);
            }
        }

        public string manageproduct(productModel objproductModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproduct(objproductModel);
            }
        }

        public responseModel getbrand(string flag, Int64 brand_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getbrand(flag, brand_id, start_count, end_count);
            }
        }

        public string managebrand(brandModel objbrandModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.managebrand(objbrandModel);
            }
        }

        public string manageproductoptiontypes(productOptionTypesModel objproductOptionTypesModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproductoptiontypes(objproductOptionTypesModel);
            }
        }

        public string manageproductoptionvalues(productOptionValuesModel objproductOptionValuesModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproductoptionvalues(objproductOptionValuesModel);
            }
        }
        public void Dispose() 
        { 
        }
    }
}
