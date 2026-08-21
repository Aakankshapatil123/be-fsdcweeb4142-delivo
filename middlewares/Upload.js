const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// =====================================================
// CLOUDINARY CONFIGURATION
// =====================================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =====================================================
// CLOUDINARY STORAGE
// =====================================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: async (req, file) => {
        let folder = "delivo";

        if (file.fieldname === "profilePicture") {
            folder = "delivo/profiles";
        } else if (file.fieldname === "restaurantImage") {
            folder = "delivo/restaurants";
        } else if (file.fieldname === "menuImage") {
            folder = "delivo/menu";
        }

        return {
            folder: folder,
            allowed_formats: ["jpg", "jpeg", "png", "webp"],
            resource_type: "image",
        };
    },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {
    console.log("====================================");
    console.log("FILE UPLOAD");
    console.log("FIELD NAME:", file.fieldname);
    console.log("MIME TYPE:", file.mimetype);
    console.log("ORIGINAL NAME:", file.originalname);
    console.log("====================================");

    const allowedFields = [
        "profilePicture",
        "restaurantImage",
        "menuImage",
    ];

    if (!allowedFields.includes(file.fieldname)) {
        return cb(
            new Error(
                "Invalid field name. Use profilePicture, restaurantImage or menuImage"
            ),
            false
        );
    }

    // Some clients/Postman may send image as application/octet-stream
    // Check extension also
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];

    const fileExtension = file.originalname
        .toLowerCase()
        .substring(file.originalname.lastIndexOf("."));

    const isImageMimeType =
        file.mimetype &&
        file.mimetype.startsWith("image/");

    const isImageExtension =
        allowedExtensions.includes(fileExtension);

    if (!isImageMimeType && !isImageExtension) {
        return cb(
            new Error(
                "Only image files are allowed for profile, restaurant and menu images"
            ),
            false
        );
    }

    cb(null, true);
};

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

// =====================================================
// EXPORT
// =====================================================

module.exports = upload;
