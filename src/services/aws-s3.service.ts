import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { extension as mimeExtension, lookup as mimeLookup } from 'mime-types';
import {
  AWS_CONFIG
} from '@config/index';
import { BadRequestException } from 'src/exceptions/bad-requests.js';
import { ErrorCodes } from 'src/utils/constants';

const s3 = new S3Client({
  region: AWS_CONFIG.region || 'us-east-1',
  endpoint: AWS_CONFIG.endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  },
});

export type S3UploadParams = {
  bucket: string;
  file: Express.Multer.File;
  folder?: string;  
  filename?: string;
};

export type S3UploadResult = {
  key: string;       
  contentType: string;
  publicUrl?: string | null; 
};

function ensureBuffer(file: Express.Multer.File): Buffer {
  if (file?.buffer) return file.buffer;
  throw new BadRequestException('File buffer is missing. Use Multer memoryStorage.', ErrorCodes.INVALID_FILE);
}

function resolveFilename(file: Express.Multer.File, custom?: string): string {
  if (custom) return custom;
  const ext = mimeExtension(file.mimetype) || file.originalname.split('.').pop() || 'bin';
  return `${uuid()}.${ext}`;
}

function buildKey(folder: string | undefined, filename: string) {
  return folder ? `${folder.replace(/\/+$/,'')}/${filename}` : filename;
}

export function buildPublicUrl(bucket: string, key: string): string | null {
  if (!AWS_CONFIG.url) return null;
  return `${AWS_CONFIG.url.replace(/\/+$/,'')}/storage/v1/object/public/${bucket}/${bucket}/${key}`;
}

export async function uploadToAWSS3(params: S3UploadParams): Promise<S3UploadResult> {
  const { bucket, file, folder, filename } = params;
  if (!bucket) throw new BadRequestException('Bucket is required', ErrorCodes.INVALID_PARAMETERS);
  if (!file) throw new BadRequestException('File is required', ErrorCodes.INVALID_PARAMETERS);

  const body = ensureBuffer(file);
  const name = resolveFilename(file, filename);
  const key = buildKey(folder, name);
  const contentType = file.mimetype || (mimeLookup(name) as string) || 'application/octet-stream';

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));

  return {
    key,
    contentType,
    publicUrl: buildPublicUrl(bucket, key), 
  };
}

export async function deleteFromAWSS3(bucket: string, key: string): Promise<void> {
  if (!bucket || !key) throw new BadRequestException('Bucket and key are required', ErrorCodes.INVALID_PARAMETERS);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getSignedDownloadUrl(bucket: string, key: string, expiresInSeconds = 60): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}