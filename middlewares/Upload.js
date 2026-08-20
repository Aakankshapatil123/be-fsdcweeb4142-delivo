const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: async (req, file) => {
        let folder = "delivo";

        if (file.fieldname === "profilePicture") {
            folder = "delivo/profiles";
        } 
        else if (file.fieldname === "restaurantImage") {
            folder = "delivo/restaurants";
        } 
        else if (file.fieldname === "menuImage") {
            folder = "delivo/menu";
        }

        return {
            folder: folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            resource_type: "image",
        };
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.fieldname === "profilePicture" ||
        file.fieldname === "restaurantImage" ||
        file.fieldname === "menuImage"
    ) {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only image files are allowed for profile, restaurant and menu images"
                ),
                false
            );
        }
    } else {
        cb(
            new Error("Invalid field name for file upload"),
            false
        );
    }
};

const upload = multer({
    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;
