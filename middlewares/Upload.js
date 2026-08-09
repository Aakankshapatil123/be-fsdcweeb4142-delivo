const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUploadsDir = () => {
    const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/restaurants', 'uploads/menu'];

   uploadDirs.forEach((dir) => {
       if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true });
        }
    });
} 

createUploadsDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

         if (file.fieldname === "profilePicture") {
            uploadPath += 'profiles/';
        }
        else if (file.fieldname === "restaurantImage") {
            uploadPath += 'restaurants/'
        }
        else if (file.fieldname === "menuImage") {
            uploadPath += 'menu';
        }
        else {
            cb(null, "uploads");
        }

        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9) ;

        const fileName = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);

       cb(null, fileName)

    }
});

    const fileFilter = (req, file, cb) => {

    if (
        file.fieldname === "profilePicture" ||
        file.fieldname === "restaurantImage" ||
        file.fieldname === "menuImage"
    )

    {

        // Allow only image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed for profile, restaurant and menu images"),
            false);
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
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;


    
