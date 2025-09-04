﻿using Microsoft.AspNetCore.Http;
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

        public responseModel getcoupon(Int64 coupon_id, string coupon_code ="", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getcoupon(coupon_id, coupon_code,start_count, end_count);
            }
        }

        public string managecoupon(couponModel objcouponModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.managecoupon(objcouponModel);
            }
        }

        public responseModel getoptionvalue(string option_type, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getoptionvalue(option_type,product_id, start_count, end_count);
            }
        }

        public responseModel getorderdertails(string flag, Int64 order_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getorderdertails(flag, order_id, start_count, end_count);
            }
        }

        public string add_to_cart(usercartMaster objusercartmaster)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.add_to_cart(objusercartmaster);
            }
        }

        public string remove_cart(removeusercartModel objremoveusercartModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.remove_cart(objremoveusercartModel);
            }
        }

        public responseModel getusercartdetail(Int64 user_cart_id, Int64 user_id, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getusercartdetail(user_cart_id, user_id, product_id, start_count, end_count);
            }
        }

        public responseModel getvendor(string flag, Int64 vendor_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.getvendor(flag, vendor_id, start_count, end_count);
            }
        }

        public string managevendor(vendorModel objvendorModel)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.managevendor(objvendorModel);
            }
        }
        public Razorpay_OrderAttribute CreateOrder(Dictionary<string, object> _obj_dictionay)
        {

            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.CreateOrder(_obj_dictionay);
            }
        }
        public RazorpayPaymentResponse verify_order(RazorpayPaymentResponse objRazorpay_OrderAttribute)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.verify_order(objRazorpay_OrderAttribute);
            }
        }
        public string move_to_order(ordermaster objordermaster)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.move_to_order(objordermaster);
            }
        }

        public string apply_coupon(user_coupon_model objusercoupon)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.apply_coupon(objusercoupon);
            }
        }

        public responseModel get_pendingmediaupload(Int64 user_id = 0, Int64 order_id = 0, Int64 order_product_map_id = 0, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.get_pendingmediaupload(user_id, order_id, order_product_map_id, start_count, end_count);
            }
        }

        public string media_status_update(media_status _objmedia_status)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.media_status_update(_objmedia_status);
            }
        }

        public string media_upload(media_upload _objmedia_upload)
        {
            using (ProductManagement_DAL objProductManagement_DAL = new ProductManagement_DAL(_httpContextAccessor))
            {
                return objProductManagement_DAL.media_upload(_objmedia_upload);
            }
        }

        public void Dispose() 
        { 
        }
    }
}
