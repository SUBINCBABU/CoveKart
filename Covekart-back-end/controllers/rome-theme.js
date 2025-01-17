import RomeThemeModel from "../models/rome-theme_model.js";


export const createRomeTheme = async (req, res) => {
  try {
    const { id, content, slug } = req.body;
    if (!id || !content || !slug) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rome = new RomeThemeModel({
      id,
      content,
      slug,
    });

    const savedRome = await rome.save();
    res.status(200).json({ message: "Success", data: savedRome });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving Rome theme", error: error.message });
  }
};


export const getRomeTheme = async (req, res) => {
  const slug = req.params.slug;
   
   
  try {
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const rome = await RomeThemeModel.findOne({ slug }).lean();
    if (!rome) {
      return res.status(404).json({ message: "Rome theme not found" });
    }

    res.status(200).json(rome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving Rome theme", error: error.message });
  }
};


export const updateRomeTheme = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const {
    home_banner = {},
    categories_image_list = {},
    value_banners = {},
    categories_products = {},
    two_column_banners = {},
    slider_products = {},
    full_width_banner = {},
    products_list_1 = {},
    featured_blogs = {},
    news_letter = {},
    products_ids,
  } = data.content || {};

  const { status, main_banner, sub_banner_1, sub_banner_2, sub_banner_3, bg_image_url } = home_banner;
  const { category_ids, tittle } = categories_image_list;
  const {  banners } = value_banners;
  const {  } = categories_products;
  const {  banner_1, banner_2 } = two_column_banners;
  const {  product_slider_1, product_slider_2, product_slider_3, product_slider_4 } = slider_products;
  const {  } = full_width_banner;
  const { } = products_list_1;
  const {   blog_ids } = featured_blogs;
  const {  sub_title, image_url } = news_letter;
  try {
    const updateFields = {};

    if (main_banner) updateFields["content.home_banner.main_banner"] = main_banner;
    if (sub_banner_1) updateFields["content.home_banner.sub_banner_1"] = sub_banner_1;
    if (sub_banner_2) updateFields["content.home_banner.sub_banner_2"] = sub_banner_2;
    if (sub_banner_3) updateFields["content.home_banner.sub_banner_3"] = sub_banner_3;
    if (bg_image_url) updateFields["content.home_banner.bg_image_url"] = bg_image_url;
    if (status) updateFields["content.home_banner.status"] = status;

    if (category_ids) updateFields["content.categories_image_list.category_ids"] = category_ids;
    if (tittle) updateFields["content.categories_image_list.tittle"] = tittle;
    if (categories_image_list.status) updateFields["content.categories_image_list.status"] = categories_image_list.status;

    if (value_banners.tittle) updateFields["content.value_banners.tittle"] = value_banners.tittle;
    if (value_banners.status) updateFields["content.value_banners.status"] = value_banners.status;
    if (banners) updateFields["content.value_banners.banners"] = banners;

    if (categories_products.status) updateFields["content.categories_products.categories_products_status"] = categories_products.status;
    if (categories_products.tittle) updateFields["content.categories_products.categories_products_tittle"] = categories_products.tittle;
    if (categories_products.category_ids) updateFields["content.categories_products.categories_products_category_ids"] = categories_products.category_ids;

    if (two_column_banners.status) updateFields["content.two_column_banners.two_column_banners_status"] = two_column_banners.status;
    if (banner_1) updateFields["content.two_column_banners.banner_1"] = banner_1;
    if (banner_2) updateFields["content.two_column_banners.banner_2"] = banner_2;

    if (slider_products.status) updateFields["content.slider_products.slider_products_status"] = slider_products.status;
    if (product_slider_1) updateFields["content.slider_products.product_slider_1"] = product_slider_1;
    if (product_slider_2) updateFields["content.slider_products.product_slider_2"] = product_slider_2;
    if (product_slider_3) updateFields["content.slider_products.product_slider_3"] = product_slider_3;
    if (product_slider_4) updateFields["content.slider_products.product_slider_4"] = product_slider_4;

    if (full_width_banner.status) updateFields["content.full_width_banner.status"] = full_width_banner.status;
    if (full_width_banner.image_url) updateFields["content.full_width_banner.image_url"] = full_width_banner.image_url;
    if (full_width_banner.redirect_link) updateFields["content.full_width_banner.redirect_link"] = full_width_banner.redirect_link;
    

    if (products_list_1.status) updateFields["content.products_list_1.status"] = products_list_1.status;
    if (products_list_1.tittle) updateFields["content.products_list_1.tittle"] = products_list_1.tittle;
    if (products_list_1.product_ids) updateFields["content.products_list_1.product_ids"] = products_list_1.product_ids;

    if (featured_blogs.tittle) updateFields["content.featured_blogs.featured_blogs_tittle"] = featured_blogs.tittle;
    if (featured_blogs.status) updateFields["content.featured_blogs.featured_blogs_status"] = featured_blogs.status;
    if (blog_ids) updateFields["content.featured_blogs.blog_ids"] = blog_ids;

    if (news_letter.title) updateFields["content.news_letter.news_letter_title"] = news_letter.title;
    if (sub_title) updateFields["content.news_letter.sub_title"] = sub_title;
    if (image_url) updateFields["content.news_letter.image_url"] = image_url;
    if (news_letter.status) updateFields["content.news_letter.news_letter_status"] = news_letter.status;

    if (products_ids) updateFields["content.products_ids"] = products_ids;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

   
    const updatedTheme = await RomeThemeModel.findOneAndUpdate(
      { id: id },
      { $set: updateFields },
      { new: true } 
    );

    
    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    
    res.status(200).json({ message: "Theme updated successfully", data: updatedTheme });
  } catch (error) {
  
    console.error("Error updating theme:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
