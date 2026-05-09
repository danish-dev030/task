import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuid } from 'uuid';

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

const requireS3Config = () => {
  if (!region) throw new Error('Missing AWS_REGION');
  if (!bucket) throw new Error('Missing S3_BUCKET');
};

const buildPublicUrl = (key) => {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (base) return `${base.replace(/\/+$/, '')}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

const buildS3Client = () => {
  requireS3Config();
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  const config = { region };
  if (accessKeyId && secretAccessKey) {
    config.credentials = {
      accessKeyId,
      secretAccessKey,
      ...(sessionToken ? { sessionToken } : {})
    };
  }

  return new S3Client(config);
};

let s3Client = null;
const getS3 = () => {
  if (!s3Client) s3Client = buildS3Client();
  return s3Client;
};

export const uploadImageToS3 = async (file) => {
  requireS3Config();
  const ext = path.extname(file.originalname || '').toLowerCase();
  const key = `uploads/${uuid()}${ext}`;
  const isPublic = String(process.env.S3_PUBLIC_READ || 'true').toLowerCase() === 'true';

  try {
    await getS3().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ...(isPublic ? { ACL: 'public-read' } : {})
      })
    );
  } catch (err) {
    if (err?.name === 'CredentialsProviderError' || /credentials/i.test(String(err?.message))) {
      const friendly = new Error(
        'AWS credentials not configured. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to backend/.env (IAM user with s3:PutObject on your bucket), run `aws configure`, or use an IAM role on the server.'
      );
      friendly.status = 503;
      throw friendly;
    }
    throw err;
  }

  return {
    key,
    url: isPublic ? buildPublicUrl(key) : key
  };
};
