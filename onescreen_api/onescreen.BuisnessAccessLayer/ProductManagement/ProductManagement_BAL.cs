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
            client_id = 1;// Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["client_id"].ToString());
            project_id = 1;// Convert.ToInt32(_httpContextAccessor.HttpContext.Request.Headers["project_id"].ToString());
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

        public responseModel productoptiontypes(string flag, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.productoptiontypes(flag, option_type_id, start_count, end_count);
            }
        }

        public string manageproductoptiontypes(productOptionTypesModel objproductOptionTypesModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproductoptiontypes(objproductOptionTypesModel);
            }
        }

        public responseModel productoptionvalues(string flag, Int64 option_value_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.productoptionvalues(flag, option_value_id, start_count, end_count);
            }
        }

        public string manageproductoptionvalues(productOptionValuesModel objproductOptionValuesModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproductoptionvalues(objproductOptionValuesModel);
            }
        }
        public responseModel getproductoption(string flag, Int64 option_id, Int64 product_id, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getproductoption(flag, option_id, product_id, option_type_id, start_count, end_count);
            }
        }

        public string manageproductoptions(productOptionsModel objproductOptionsModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.manageproductoptions(objproductOptionsModel);
            }
        }

        public responseModel getcoupon(Int64 coupon_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getcoupon(coupon_id, start_count, end_count);
            }
        }

        public string managecoupon(couponModel objcouponModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.managecoupon(objcouponModel);
            }
        }

        public responseModel getoptionvalue(string option_type, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getoptionvalue(option_type, start_count, end_count);
            }
        }

        public responseModel getorderdertails(string flag, Int64 order_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getorderdertails(flag, order_id, start_count, end_count);
            }
        }
        
        public void Dispose() 
        { 
        }
    }
}
