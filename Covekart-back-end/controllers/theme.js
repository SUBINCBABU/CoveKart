import themeModel from "../models/theme_model.js"

export const createTheme = async (req, res) => {
    const { name, slug, id, image, status, created_at, updated_at } = req.body
    const theme = new themeModel({
        name, slug, id, image, status, created_at, updated_at
    })
    const savedTheme = await theme.save()
    if (savedTheme) {
        res.status(200).send({ message: "successfully created " })
    }
    else {
        res.status(400).send({ message: "error" })
    }

}

export const getTheme = async (req, res) => {
    const theme = await themeModel.find({}).lean({})
    if (theme) {
        res.status(200).json({ message: "Success", data: theme })
    }
    else {
        res.status(400).json({ message: "Error" })
    }
}


export const updateTheme = async (req, res) => {
    try {
        const status = req.body.status;
        const id = req.params.id;
        if (typeof status === 'undefined' || !id) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const oldTheme = await themeModel.findOneAndUpdate({ status: 1 },
            { $set: { status: 0 } },
            { new: true });

        const theme = await themeModel.findOneAndUpdate(
            { id: id },
            { $set: { status: status } },
            { new: true }
        );
        if (!theme) {
            return res.status(404).json({ message: 'Theme not found' });
        }
        res.status(200).json(theme);
    } catch (error) {
        console.error("Error updating theme:", error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
