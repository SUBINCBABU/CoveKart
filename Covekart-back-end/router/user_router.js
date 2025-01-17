import express from "express"
import multer from "multer";
const userRouter = express.Router()
// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })

const storage=multer.diskStorage({
    filename: function (req,file,cb) {
      cb(null, file.originalname)
    }
  });
 const upload=multer({storage:storage})


import { postSignup, postLogin, postSignupVerify, postLogout, verified, postForgotPassword, postUpdatePassword, getUserDetails,postCreateUserAddress, postCreateAttribute,
     deleteAttribute,getAttribute, updateUserAddress,
     deleteAddress,
     updateUserProfile} from "../controllers/user_controller.js";
import {putUpdateAttribute,deleteAttributes} from "../controllers/attribute.js"
import {getTags, postCreateTag,updateTag,deleteTag, updateTagStatus,deleteTags} from "../controllers/tag.js"
import {getImages,postCreateImages,deleteImages,deleteImage} from "../controllers/image.js"
import { postCreateRole,getRoles ,putUpdateRole,getRoleById,deleteRole,deleteAllRoles} from "../controllers/role.js";
import {postCreatePermission} from "../controllers/permission.js";
import {postCreateAccount,getAccount, updateProfile, updatePassword} from "../controllers/account.js";
import {postCreateModule,getRoleModules} from "../controllers/module.js";
import { postCreateUsers,getUsers,updateUsers,updateUsersStatus,deleteUser ,deleteAllUsers} from "../controllers/user.js";
import { approveStoreStatus, deleteAllStore, deleteStore, editStore, getStores, postCreateStore, updateStore } from "../controllers/store.js";
import { adminVerified, postAdminLogin,postAdminLogout } from "../controllers/admin_login.js";
import { getCountry, postCreateCountry } from "../controllers/country.js";
import { postCreateState,getStates } from "../controllers/state.js";
import { postAddProduct,getProduct, editProduct, updateProduct, deleteProduct, deleteAllProduct, updateProductStatus, approveProductStatus } from "../controllers/product.js";
import {  postCreateCategory,getCategory,getCategoryToUpdate,putUpdateCategory,deleteCategory } from "../controllers/category.js";
import { postCreateTax ,getTax,putUpdateTax,updateTaxStatus,deleteTax,deleteAllTax} from "../controllers/tax.js";
import { createImages } from "../controllers/cloudinary.js";
import { createCart, deleteCart, getCart } from "../controllers/cart.js";
import {  deleteWishlist, getWishlist, postWishlist } from "../controllers/wishlist.js";
import { createTheme, getTheme, updateTheme } from "../controllers/theme.js";
import { createThemeOption, getThemeOption, updateThemeOption } from "../controllers/theme-option.js";
import { createRomeTheme, getRomeTheme, updateRomeTheme } from "../controllers/rome-theme.js";
import { createSettings, getSettings, updateSettingsOption } from "../controllers/settings.js";
import { createShipping, createShippingRule, deleteShipping, deleteShippingRule, editShipping, getShipping, updateShipping, updateShippingRule } from "../controllers/shipping.js";
import { createCurrency, deleteAllCurrency, deleteCurrency, editCurrency, getCurrency, updateCurrency, updateCurrencyStatus } from "../controllers/currency.js";
import { createOrderStatus } from "../controllers/order-status.js";
import { deleteAllReviews, deleteReviews, getReview, getReviews, postReview } from "../controllers/review.js";
import { createCoupons, deleteAllCoupons, DeleteCoupons, EditCoupon, getCoupons, UpdateCoupons, updateCouponStatus } from "../controllers/coupon.js";
import { createPages, deleteAllPages, deletePages, editPages, getPages,updatePages, updatePageStatus } from "../controllers/pages.js";
import { deleteAllQuestionAnswers, DeleteQuestionAnswers, EditQuestionAnswers, getQuestionAnswers, getQuestions, sendFeedback, sendQuestion, updateQuestion, UpdateQuestionAnswers } from "../controllers/questionAnsewr.js";
import { createBlog, deleteAllBlog, deleteBlog, EditBlog, getBlog, updateBlog, updateBlogStatus } from "../controllers/blog.js";
import { createFaqs, deleteAllFaq, DeleteFaq, EditFaq, getFaqs, UpdateFaq, updateFaqStatus } from "../controllers/faq.js";
import { adminGetOrder, getOrders, orderCheckout, placeOrder, viewOrder } from "../controllers/order.js";



       



userRouter.post("/imageUpload",upload.single("image"),createImages)




userRouter.post("/login", postLogin)
userRouter.post("/signup", postSignup)
userRouter.post("/signup/verify", postSignupVerify)
userRouter.post("/forgotPassword", postForgotPassword)
userRouter.post("/updatePassword", postUpdatePassword)
userRouter.post("/userLogout", postLogout)
userRouter.get("/getUserAccount",verified, getUserDetails)
userRouter.put("/updateUserProfile",updateUserProfile)



//user address
userRouter.post("/createUserAddress",verified,postCreateUserAddress)
userRouter.put("/updateAddress/:id",verified,updateUserAddress)
userRouter.delete("/deleteAddress/:id",verified,deleteAddress)

 


//Account
userRouter.post("/createAccount",adminVerified, postCreateAccount)
userRouter.get("/getAccount",adminVerified, getAccount)
userRouter.put("/updateProfile",adminVerified,updateProfile)
userRouter.put("/putUpdatePassword",adminVerified,updatePassword)



//user
userRouter.post("/createUsers", postCreateUsers)
userRouter.get("/getUsers", getUsers)
userRouter.put("/updateUsers/:id", updateUsers)
userRouter.patch("/updateUsersStatus/:id",updateUsersStatus)
userRouter.delete("/deleteUser/:id",deleteUser)
userRouter.post("/deleteAllUsers", deleteAllUsers)

   

//Admin
userRouter.post("/adminLogin",postAdminLogin)
userRouter.post("/adminLogout", postAdminLogout)



//Store
userRouter.post("/createStore", postCreateStore)
userRouter.get("/getStores",getStores)
userRouter.get("/editStore/:id",editStore)
userRouter.put("/updateStore/:id",updateStore)
userRouter.patch("/approveStoreStatus/:id",approveStoreStatus)
userRouter.delete("/deleteStore/:id",deleteStore)
userRouter.post("/deleteAllStores",deleteAllStore)




//Cart 
userRouter.post("/createCart",verified,createCart)
userRouter.get("/getCart",verified,getCart)
userRouter.delete("/deleteCart/:id",verified,deleteCart)




//wishlist
userRouter.post("/postWishlist",postWishlist)
userRouter.get("/getWishlist",verified,getWishlist)
userRouter.delete("/deleteWishlist/:id",deleteWishlist)



//Country && state
userRouter.post("/createCountry", postCreateCountry)
userRouter.post("/createStates", postCreateState)
userRouter.get("/getStates",getStates)
userRouter.get("/getCountries",getCountry)
   
//product
userRouter.post("/createProduct",postAddProduct)
userRouter.get("/getProducts",getProduct)
userRouter.get("/getProduct/:id",editProduct)
userRouter.put("/updateProduct/:id", updateProduct)
userRouter.delete("/deleteProduct/:id",deleteProduct)
userRouter.post("/deleteAllProduct",deleteAllProduct)
userRouter.patch("/updateProductStatus/:id",updateProductStatus)
userRouter.patch("/approveProductStatus/:id",approveProductStatus)
//userRouter.get("/getCountry",getCountry)
   


//Blog
userRouter.post("/createBlog", createBlog)
userRouter.get("/getBlog", getBlog)
userRouter.get("/editBlog/:id",EditBlog)
userRouter.post("/updateBlog/:id",updateBlog)
userRouter.post("/updateBlogStatus/:id", updateBlogStatus)
userRouter.delete("/deleteBlog/:id", deleteBlog)
userRouter.post("/deleteAllBlog", deleteAllBlog)



//tax
userRouter.post("/createTax",postCreateTax)
userRouter.get("/getTax",getTax)
userRouter.put("/updateTax/:id", putUpdateTax)
userRouter.patch("/updateTaxStatus/:id",updateTaxStatus)
userRouter.delete("/deleteTax/:id",deleteTax)
userRouter.post("/deleteAllTax", deleteAllTax)

//category
userRouter.post("/createCategory", postCreateCategory)
userRouter.get("/getCategoryUpdate/:id", getCategoryToUpdate)
userRouter.put("/updateCategory/:id", putUpdateCategory)
userRouter.get("/getCategory",getCategory)
userRouter.delete("/deleteCategory/:id",deleteCategory)


//Attribute
userRouter.post("/createAttribute", postCreateAttribute)
userRouter.get("/getAttribute",getAttribute)
userRouter.put("/updateAttribute/:id",putUpdateAttribute)
userRouter.delete("/deleteAttribute/:id",deleteAttribute)
userRouter.post("/deleteAttributes", deleteAttributes)


//image--media
userRouter.post("/createImages", upload.array("files", 10), postCreateImages); 
userRouter.get("/getImages",getImages); 
userRouter.delete("/deleteImage/:id",deleteImage)
userRouter.post("/deleteImages", deleteImages)



//FAQ
userRouter.get("/getFaqs",getFaqs)
userRouter.post("/createFaqs",createFaqs)
userRouter.get("/editFaq/:id",EditFaq)
userRouter.post("/updateFaq/:id",UpdateFaq)
userRouter.delete("/deleteFaq/:id", DeleteFaq)
userRouter.post("/deleteAllFaq", deleteAllFaq)
userRouter.post("/updateFaqStatus/:id", updateFaqStatus)





// Tag
userRouter.post("/createTag", postCreateTag)
userRouter.get("/getTags",getTags); 
userRouter.put("/updateTag/:id",updateTag)
userRouter.delete("/deleteTag/:id",deleteTag)
userRouter.patch("/updateTagStatus/:id",updateTagStatus)
userRouter.post("/deleteTags", deleteTags)

//Theme
userRouter.post("/createTheme",createTheme)
userRouter.get("/getTheme",getTheme)
userRouter.put("/updateTheme/:id",updateTheme)




//Theme-option
userRouter.post("/createThemeOption",createThemeOption)
userRouter.get("/getThemeOption",getThemeOption)
userRouter.put("/updateThemeOption",updateThemeOption)



//Question Answer
userRouter.post("/sendQuestion",sendQuestion)
userRouter.get("/getQuestion/:slug",getQuestionAnswers)
userRouter.post("/updateQuestionAnswers/:id",updateQuestion)
userRouter.get("/getQuestions",getQuestions)  //admin
userRouter.post("/editQuestionAnswers/:id",EditQuestionAnswers)
userRouter.post("/updateQuestion/:id",UpdateQuestionAnswers)
userRouter.delete("/deleteQuestionAnswers/:id",DeleteQuestionAnswers)
userRouter.post("/deleteAllQuestionAnswers",deleteAllQuestionAnswers)
userRouter.post("/feedback",sendFeedback)



//get rome theme from database
userRouter.post("/createRomeTheme",createRomeTheme)
userRouter.get("/getRomeTheme/:slug",getRomeTheme)
userRouter.put("/updateHomePage/:id",updateRomeTheme)



//module
userRouter.post("/createModule", postCreateModule)
userRouter.get("/getRoleModules", getRoleModules);


//Permission
userRouter.post("/createPermission", postCreatePermission)


//Role 
userRouter.post("/createRole",adminVerified, postCreateRole)
userRouter.get("/getRoles",getRoles); 
userRouter.get("/getRole/:id", getRoleById); 
userRouter.put("/updateRole/:id", putUpdateRole)
userRouter.delete("/deleteRole/:id",deleteRole)
userRouter.post("/deleteAllRoles", deleteAllRoles)


// Settings
userRouter.post("/createSettings", createSettings)
userRouter.get("/getSettings",getSettings)
userRouter.put("/updateSettings",updateSettingsOption)



//Shipping
userRouter.post("/createShipping",createShipping)
userRouter.get("/getShipping",getShipping)
userRouter.get("/editShipping/:id",editShipping)
userRouter.put("/updateShipping/:id",updateShipping)
userRouter.delete("/deleteShipping/:id",deleteShipping)
userRouter.post("/createShippingRule",createShippingRule)
userRouter.put("/updateShippingRules/:id",updateShippingRule)
userRouter.delete("/deleteShippinRule/:id",deleteShippingRule)



//Review
userRouter.get("/getReview/:slug",getReview)
userRouter.post("/addReview",postReview)
userRouter.get("/getReviews",getReviews) //admin side 
userRouter.delete("/deleteReviews/:id",deleteReviews)//admin sid
userRouter.post("/deleteAllReviews",deleteAllReviews)//admin sid


//Coupon
userRouter.get("/getCoupons",getCoupons)
userRouter.post("/createCoupons",createCoupons)
userRouter.post("/updateCouponStatus/:id",updateCouponStatus)
userRouter.get("/editCoupon/:id",EditCoupon)
userRouter.post("/updateCoupons/:id",UpdateCoupons)
userRouter.delete("/deletecoupons/:id",DeleteCoupons)
userRouter.post("/deleteAllCoupons",deleteAllCoupons)



//Pages

userRouter.get("/getPages",getPages)
userRouter.post("/createPages",createPages)
// userRouter.get("/editPages/:id",editPages)
userRouter.post("/updatePages/:id",updatePages)
userRouter.delete("/deletePages/:id",deletePages)
userRouter.post("/deleteAllPages",deleteAllPages)
userRouter.post("/updatePageStatus/:id",updatePageStatus)




//currency 
userRouter.post("/createCurrency",createCurrency)
userRouter.get("/getCurrency",getCurrency)
userRouter.get("/editCurrency/:id",editCurrency)
userRouter.put("/updateCurrency/:id",updateCurrency)
userRouter.patch("/updateCurrencyStatus/:id",updateCurrencyStatus)
userRouter.delete("/deleteCurrency/:id",deleteCurrency)
userRouter.post("/deleteAllCurrency",deleteAllCurrency)
    

    
//Order
userRouter.post("/orderCheckout",verified,orderCheckout)
userRouter.post("/orderPlace",verified,placeOrder)
userRouter.get("/getOrders",verified,getOrders)
userRouter.get("/details/:id",verified,viewOrder)
userRouter.get("/adminGetOrders",adminGetOrder)


//order-status

userRouter.post("/createOrderStatus",createOrderStatus)

export default userRouter  