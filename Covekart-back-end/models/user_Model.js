import mongoose from "mongoose"



const schema = mongoose.Schema
const userschema = new schema({
   id: { type: Number, required: true,  },
   name: { type: String, required: true,  },
   email: { type: String, required: true,  },
   password: { type: String, required: true},
   phone: { type: Number, required: true,  },
   country_code: { type: String, required: true,  },
   status: { type: Boolean, default: true },
   orders_count:{type:Number,default:0},
   system_reserve:{type:String,default:"0"},
   email_verified_at:{type:String ,default:null},
   role_id: {type: Number},
   point:{type:Object,default:null},
   store:{type:Object, default:null},
   wallet:{type:Object,default:null},
   vendor_wallet:{type:Object,default:null},
   profile_image:{type:Object,default:null},
   payment_account:{type:Object,default:null},
   profile_image_id: {type:Number},
   Permission:[],
   created_at: {
      type: Date, required: true, default: Date.now,
   },
   updated_at: {
      type: Date, required: true, default: Date.now,
   },
   role:{},
   address:[{type:Number,default:null}],
   wishlist:[{}]
})


const userModel = mongoose.model("users", userschema)

export default userModel