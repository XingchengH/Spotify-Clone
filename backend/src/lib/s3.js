import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    key: (req, file, cb) => {
      const filename = `avatars/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

export default upload;
