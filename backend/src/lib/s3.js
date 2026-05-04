import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/x-m4a"];
const MIME_TO_EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const imageFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const songFileFilter = (req, file, cb) => {
  if (file.fieldname === "imageFile" && ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "audioFile" && ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for field: ${file.fieldname}`), false);
  }
};

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
      const ext = MIME_TO_EXT[file.mimetype] || "jpg";
      cb(null, `avatars/${req.user.id}-avatar.${ext}`);
    },
  }),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const songUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const folder = file.fieldname === "audioFile" ? "songs/audio" : "songs/images";
      cb(null, `${folder}/${Date.now()}-${ext}`);
    },
  }),
  fileFilter: songFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const deleteFromS3 = async (url) => {
  if (!url) return;

  const bucket = process.env.S3_BUCKET;
  const urlObj = new URL(url);
  const key = decodeURIComponent(urlObj.pathname.replace(/^\/+/, ""));

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


const albumUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `albums/${Date.now()}-${ext}`);
    },
  }),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload, songUpload, deleteFromS3, albumUpload };
