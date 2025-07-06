import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `avatars/${req.user.id}-avatar.jpg`;
      cb(null, filename);
    },
  }),
});

const songUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const folder =
        file.fieldname === "audioFile" ? "songs/audio" : "songs/images";
      const filename = `${folder}/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

const deleteFromS3 = async (url) => {
  if (!url) return;

  const bucket = process.env.S3_BUCKET;
  const urlObj = new URL(url);
  const key = decodeURIComponent(urlObj.pathname.slice(1)); // Removes the leading "/"

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    console.log("Deleted from S3");
  } catch (error) {
    console.log("Error deleting from S3", error);
  }
};

export { upload, songUpload, deleteFromS3 };
