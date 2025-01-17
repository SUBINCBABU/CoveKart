
import mongoose from "mongoose"

const schema=mongoose.Schema
const permissionSchema=new schema(
    {
      id: {
        type: Number,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      guard_name: {
        type: String,
        default: null,
      },
      created_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
      pivot: {
        role_id: {
          type: Number,
          required: true,
        },
        permission_id: {
          type: Number,
          required: true,
        },
      },
    },
    {
      timestamps: false, // Using custom `created_at` and `updated_at`, so we disable default timestamps
    }
  );


const  permissionModel=mongoose.model("Permission",permissionSchema)

export default permissionModel