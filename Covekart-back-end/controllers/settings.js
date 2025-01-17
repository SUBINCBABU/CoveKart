import { log } from "console";
import settingsModel from "../models/settings_model.js";
import ImageModel from "../models/images_model.js";
import currencyModel from "../models/currency_model.js";

export const createSettings = async (req, res) => {
    try {
        const settingsData = req.body;
        const newSettings = new settingsModel(settingsData);
        await newSettings.save();
        res.status(201).json({ message: 'Settings created successfully!', data: newSettings });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating settings.', error });
    }
};



export const getSettings = async (req, res) => {
    try {
        const results = await settingsModel.find({});
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Settings not found" });
        }
        const result = results[0];
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching settings:", error.message);
        res.status(500).json({ message: "An error occurred while fetching settings", error: error.message });
    }
};




export const updateSettingsOption = async (req, res) => {
    const values = req.body;

    try {
        if (!values || Object.keys(values).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No options provided for update"
            });
        }

        const updateFields = {};

        // Process image fields
        const processImageField = async (imageId, fieldPath) => {
            if (!imageId) return;

            const image = await ImageModel.findOne({ id: imageId });
            if (!image) return;

            const imageData = {
                id: image.id,
                collection_name: image.collection_name,
                name: image.name,
                file_name: image.file_name,
                mime_type: image.mime_type,
                disk: image.disk,
                conversions_disk: image.conversions_disk,
                size: image.size,
                created_by_id: image.created_by_id,
                created_at: image.created_at,
                updated_at: image.updated_at,
                original_url: image.original_url
            };

            updateFields[fieldPath] = imageData;
        };


        const default_currency_id = values.general.default_currency_id

        if (default_currency_id) {
            try {
                const defaultCurrency = await currencyModel.findOne({ id: default_currency_id });
                if (!defaultCurrency) {
                    throw new Error('Currency not found');
                }

                // Store the complete currency object in settings
                updateFields['values.general.default_currency'] = defaultCurrency;
            } catch (error) {
                throw new Error(`Error processing currency: ${error.message}`);
            }
        }
        // Process non-image fields
        const processNonImageFields = () => {
            // General settings
            if (values.general) {
                const {
                    light_logo_image_id, dark_logo_image_id,
                    tiny_logo_image_id, favicon_image_id,
                    ...generalFields
                } = values.general;

                Object.entries(generalFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.general.${key}`] = value;
                    }
                });
            }





            if (values.wallet_points) {
                const { ...walletFields } = values.wallet_points;

                Object.entries(walletFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.wallet_points.${key}`] = value;
                    }
                });
            }
            if (values.vendor_commissions) {
                const { ...vendor_commissionsFields } = values.vendor_commissions;

                Object.entries(vendor_commissionsFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.vendor_commissions.${key}`] = value;
                    }
                });
            }
            if (values.refund) {
                const { ...refundFields } = values.refund;

                Object.entries(refundFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.refund.${key}`] = value;
                    }
                });
            }

            if (values.google_reCaptcha) {
                const { ...google_reCaptchaFields } = values.google_reCaptcha;

                Object.entries(google_reCaptchaFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.google_reCaptcha.${key}`] = value;
                    }
                });
            }
            if (values.newsletter) {
                const { ...newsletterFields } = values.newsletter;

                Object.entries(newsletterFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.newsletter.${key}`] = value;
                    }
                });
            }
            // Analytics settings
            if (values.analytics) {
                Object.entries(values.analytics).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.analytics.${key}`] = value;
                    }
                });
            }

            // Delivery settings
            if (values.delivery) {
                Object.entries(values.delivery).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.delivery.${key}`] = value;
                    }
                });
            }

            // Maintenance settings
            if (values.maintenance) {
                const { maintenance_image_id, ...maintenanceFields } = values.maintenance;
                Object.entries(maintenanceFields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        updateFields[`values.maintenance.${key}`] = value;
                    }
                });
            }
        };

        // Process images
        if (values.general) {
            if (values.general.light_logo_image_id) {
                await processImageField(
                    values.general.light_logo_image_id,
                    'values.general.light_logo_image'
                );
            }
            if (values.general.dark_logo_image_id) {
                await processImageField(
                    values.general.dark_logo_image_id,
                    'values.general.dark_logo_image'
                );
            }
            if (values.general.tiny_logo_image_id) {
                await processImageField(
                    values.general.tiny_logo_image_id,
                    'values.general.tiny_logo_image'
                );
            }
            if (values.general.favicon_image_id) {
                await processImageField(
                    values.general.favicon_image_id,
                    'values.general.favicon_image'
                );
            }
        }

        if (values.maintenance?.maintenance_image_id) {
            await processImageField(
                values.maintenance.maintenance_image_id,
                'values.maintenance.maintenance_image'
            );
        }

        // Process other fields
        processNonImageFields();

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields to update"
            });
        }



        const updatedSettings = await settingsModel.findOneAndUpdate(
            {},
            { $set: updateFields },
            {
                new: true,
                runValidators: true
            }
        );



        if (!updatedSettings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: updatedSettings
        });

    } catch (error) {
        console.error('Error updating settings:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating settings",
            error: error.message
        });
    }
};