import { current_user } from './user_controller.js';
import ProductModel from '../models/product_model.js';
import userModel from '../models/user_Model.js';
import reviewModel from '../models/review_model.js'

const generateNumericId = async () => {
  const MIN_ID = 10000;
  const MAX_ID = Number.MAX_SAFE_INTEGER;

  try {
    const lastTag = await reviewModel.findOne({}, { id: 1 }).sort({ id: -1 });
    let newId = lastTag ? lastTag.id + 1 : MIN_ID;
    if (newId > MAX_ID) {
      newId = MIN_ID;
    }
    const existingIdTag = await reviewModel.findOne({ id: newId });
    if (existingIdTag) {
      return generateNumericId();
    }
    return newId;
  } catch (error) {
    console.error(`ID generation error: ${error.message}`);
    throw new Error(`Failed to generate unique ID: ${error.message}`);
  }
};

export const postReview = async (req, res) => {
  try {
   
    const product = await ProductModel.findOne({ id: req.body.product_id }).lean();
    const user = await userModel.findOne({ id: current_user[0].id }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const reviewId = await generateNumericId();
    const review = new reviewModel({
      id: reviewId,
      store_id: product.store_id,
      product_id: req.body.product_id,
      rating: req.body.rating,
      review_image_id: user.profile_image_id,
      description: req.body.description,
      consumer_id: user.id,
      consumer: user,
      consumer_name: user.name,
      review_image: user.profile_image,

      product_name: product.name,
      store: product.store,
    });
    const savedReview = await review.save();


    const productUpdate = {
      $push: { reviews: review },
      $set: {
        can_review: true,
        review_count: (product.review_count || 0) + 1,
      },
      $inc: { [`review_ratings.${req.body.rating - 1}`]: 1 },
    };

    await ProductModel.findOneAndUpdate(
      { id: req.body.product_id },
      productUpdate,
      { new: true }
    ).lean();


    const prod = await ProductModel.findOne({ id: req.body.product_id }).lean();


    const totalRating = prod.reviews.reduce((sum, review) => {
      const rating = parseInt(review.rating, 10);
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);

    const rating_count = prod.reviews.length > 0 ? totalRating / prod.reviews.length : 0;

    if (isNaN(totalRating)) {
      const p = await ProductModel.findOneAndUpdate(
        { id: req.body.product_id },
        { $set: { rating_count: 0 } },
        { new: true }
      ).lean({});

      await reviewModel.findOneAndUpdate(
        { id: savedReview.id },
        { $set: { product: p } },
        { new: true }
      ).lean({})
      const reviews = await reviewModel.find({}).lean({})
      return res.status(200).json({
        data: reviews,
        message: "Review added successfully",
      });


    }
    else {
      const p = await ProductModel.findOneAndUpdate(
        { id: req.body.product_id },
        { $set: { rating_count: rating_count } },
        { new: true }
      ).lean();
      await reviewModel.findOneAndUpdate(
        { id: savedReview.id },
        { $unset: { product: {} } },
        { new: true }
      ).lean({})

      await reviewModel.findOneAndUpdate(
        { id: savedReview.id },
        { $set: { product: p } },
        { new: true }
      ).lean({})
      await ProductModel.findOneAndUpdate(
        { id: savedReview.id },
        { $unset: { reviews: "" } },
        { new: true }
      )

      const updatedReview = await reviewModel.find({ product_id: req.body.product_id }).lean({})
      await ProductModel.findOneAndUpdate(
        { id: savedReview.id },
        { $set: { reviews: updatedReview } },
        { new: true }
      )
      const reviews = await reviewModel.find({ product_id: req.body.product_id}).lean({})
      return res.status(200).json({
        data: reviews,
        message: "Review added successfully",
      });

    }

  } catch (error) {
    console.error("Error adding review:", error.message);
    return res.status(500).json({
      message: "Error adding review",
      error: error.message,
    });
  }
};


export const getReview = async (req, res) => {
  try {

    let reviews = await reviewModel.find({ product_id: req.params.slug }).lean({})

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error get review:", error.message);
    return res.status(500).json({
      message: "Error get review",
      error: error.message,
    });
  }
}

export const getReviews = async (req, res) => {
  try {
    let reviews = await reviewModel.find({}).lean({})

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error getReviews review:", error.message);
    return res.status(500).json({
      message: "Error getReviews",
      error: error.message,
    });
  }
}

export const deleteReviews = async (req, res) => {
  try {
    await reviewModel.findOneAndDelete(req.params.id).lean({})
    res.status(200).json({
      message: "review deleted successfully",
    })
  } catch (error) {
    console.error("Error deleteReviews:", error.message);
    return res.status(500).json({
      message: "Error deleteReviews",
      error: error.message,
    });
  }
}

export const deleteAllReviews = async (req, res) => {
  try {
    let ids = req.body.ids
    await reviewModel.deleteMany({ id: { $in: ids } }).lean({})
    res.status(200).json({
      message: "All Page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleteAllReviews:", error.message);
    return res.status(500).json({
      message: "Error deleteAllReviews",
      error: error.message,
    });
  }
}