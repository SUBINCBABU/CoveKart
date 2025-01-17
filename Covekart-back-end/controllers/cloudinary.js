
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryUpload } from "../connection/cloudinary.js";



  


 

export const createImages= async(req,res)=>{

    const uploadResult = await cloudinaryUpload.uploader
    .upload(
      req.file, {
            public_id: "upload/images",
        }
    ).then((data)=>{
        console.log(uploadResult);
        
      return data
    })
    .catch((error) => {
        console.log(error);
    });
    
}