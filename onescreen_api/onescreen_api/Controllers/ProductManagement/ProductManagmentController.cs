using System;
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

        [Route("productoptiontypes")]
        [HttpGet]
        public responseModel productoptiontypes(string flag, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.productoptiontypes(flag, option_type_id, start_count, end_count);
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

        [Route("productoptionvalues")]
        [HttpGet]
        public responseModel productoptionvalues(string flag, Int64 option_value_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.productoptionvalues(flag, option_value_id, start_count, end_count);
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


        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="option_id"></param>
        /// <param name="product_id"></param>
        /// <param name="option_type_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getproductoptions")]
        [HttpGet]
        public responseModel getproductoption(string flag, Int64 option_id, Int64 product_id, Int64 option_type_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getproductoption(flag, option_id, product_id, option_type_id, start_count, end_count);
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="objproductOptionsModel"></param>
        /// <returns></returns>
        [Route("manageproductoptions")]
        [HttpPost]
        public string manageproductoptions(productOptionsModel objproductOptionsModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.manageproductoptions(objproductOptionsModel);
            }
        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="coupon_id"></param>
       /// <param name="coupon_code"></param>
       /// <param name="start_count"></param>
       /// <param name="end_count"></param>
       /// <returns></returns>
        [Route("getcoupon")]
        [HttpGet]
        public responseModel getcoupon(Int64 coupon_id, string coupon_code="", Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getcoupon(coupon_id, coupon_code, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objcouponModel"></param>
        /// <returns></returns>
        [Route("managecoupon")]
        [HttpPost]
        public string managecoupon(couponModel objcouponModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.managecoupon(objcouponModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="option_type"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getoptionvalue")]
        [HttpGet]
        public responseModel getoptionvalue(string option_type, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getoptionvalue(option_type,product_id,start_count, end_count);
            }
        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="flag"></param>
       /// <param name="order_id"></param>
       /// <param name="user_id"></param>
       /// <param name="start_count"></param>
       /// <param name="end_count"></param>
       /// <returns></returns>
        [Route("getorderdertails")]
        [HttpGet]
        public responseModel getorderdertails(string flag, Int64 order_id, Int64 user_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getorderdertails(flag, order_id, user_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objusercartmaster"></param>
        /// <returns></returns>
        [Route("add_to_cart")]
        [HttpPost]
        public string add_to_cart(usercartMaster objusercartmaster)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.add_to_cart(objusercartmaster);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objremoveusercartModel"></param>
        /// <returns></returns>
        [Route("remove_cart")]
        [HttpPost]
        public string remove_cart(removeusercartModel objremoveusercartModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.remove_cart(objremoveusercartModel);
            }
        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="batch_id"></param>
       /// <param name="user_id"></param>
       /// <param name="product_id"></param>
       /// <param name="start_count"></param>
       /// <param name="end_count"></param>
       /// <returns></returns>
        [Route("getusercartdetail")]
        [HttpGet]
        public responseModel getusercartdetail(Guid? batch_id, Int64 user_id, Int64 product_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getusercartdetail(batch_id, user_id, product_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="vendor_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getvendor")]
        [HttpGet]
        public responseModel getvendor(string flag, Int64 vendor_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getvendor(flag, vendor_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objvendorModel"></param>
        /// <returns></returns>
        [Route("managevendor")]
        [HttpPost]
        public string managevendor(vendorModel objvendorModel)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.managevendor(objvendorModel);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_obj_dictionay"></param>
        /// <returns></returns>
        [Route("create_order")]
        [HttpPost]
        public Razorpay_OrderAttribute CreateOrder(Dictionary<string, object> _obj_dictionay=null)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.CreateOrder(_obj_dictionay);
            }
        }

       /// <summary>
       /// 
       /// </summary>
       /// <param name="objRazorpayPaymentResponse"></param>
       /// <returns></returns>
        [Route("verify_order")]
        [HttpPost]
        public RazorpayPaymentResponse verify_order(RazorpayPaymentResponse objRazorpayPaymentResponse)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.verify_order(objRazorpayPaymentResponse);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objuserorderMaster"></param>
        /// <returns></returns>
        [Route("move_to_order")]
        [HttpPost]
        public string move_to_order(ordermaster objordermaster)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.move_to_order(objordermaster);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objusercoupon"></param>
        /// <returns></returns>
        [Route("apply_coupon")]
        [HttpPost]
        public string apply_coupon(user_coupon_model objusercoupon)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.apply_coupon(objusercoupon);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user_id"></param>
        /// <param name="order_id"></param>
        /// <param name="order_product_map_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("get_pendingmediaupload")]
        [HttpGet]
        public responseModel get_pendingmediaupload(Int64 user_id = 0, Int64 order_id = 0,Int64 order_product_map_id = 0, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.get_pendingmediaupload(user_id,order_id, order_product_map_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_objmedia_status"></param>
        /// <returns></returns>
        [Route("media_status_update")]
        [HttpPost]
        public string media_status_update(media_status _objmedia_status)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.media_status_update(_objmedia_status);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="_objmedia_upload"></param>
        /// <returns></returns>
        [Route("media_upload")]
        [HttpPost]
        public string media_upload(media_upload _objmedia_upload)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.media_upload(_objmedia_upload);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objuser_verification"></param>
        /// <returns></returns>
        [Route("mobile_verification")]
        [HttpPost]
        public string mobile_verification(user_verification objuser_verification)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.mobile_verification(objuser_verification);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="withdrawal_request_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getwithdrawal_request")]
        [HttpGet]
        public responseModel getwithdrawal_request(string flag, Int64 withdrawal_request_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getwithdrawal_request(flag, withdrawal_request_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="wallet_transaction_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getwallet_transaction")]
        [HttpGet]
        public responseModel getwallet_transaction(string flag, Int64 wallet_transaction_id, Int64 user_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getwallet_transaction(flag, wallet_transaction_id, user_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objwallet_withdrawal"></param>
        /// <returns></returns>
        [Route("wallet_withdrawal_req")]
        [HttpPost]
        public string wallet_withdrawal_req(wallet_withdrawal objwallet_withdrawal)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.wallet_withdrawal_req(objwallet_withdrawal);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="flag"></param>
        /// <param name="wallet_master_id"></param>
        /// <param name="user_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getwalletmaster")]
        [HttpGet]
        public responseModel getwalletmaster(string flag, Int64 wallet_master_id, Int64 user_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getwalletmaster(flag, wallet_master_id, user_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="order_id"></param>
        /// <param name="start_count"></param>
        /// <param name="end_count"></param>
        /// <returns></returns>
        [Route("getinvoicedetails")]
        [HttpGet]
        public responseModel getinvoicedetails(Int64 order_id, Int64 start_count = 0, Int64 end_count = 0)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getinvoicedetails(order_id, start_count, end_count);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="batch_id"></param>
        /// <param name="user_id"></param>
        /// <returns></returns>
        [Route("update_to_cart")]
        [HttpPost]
        public string update_to_cart(Guid batch_id, Int64 user_id)
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.update_to_cart(batch_id, user_id);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="search_date"></param>
        /// <returns></returns>
        [Route("getorderproduct")]
        [HttpGet]
        public responseModel getorderproduct(string search_date = "null")
        {
            using (ProductManagement_BAL objProductManagement_BAL = new ProductManagement_BAL(_httpContextAccessor))
            {
                return objProductManagement_BAL.getorderproduct(search_date);
            }
        }
    }
}
