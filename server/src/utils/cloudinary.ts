import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { config } from '../config';
import { logger } from './logger';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

async function uploadFromBuffer(buffer: Buffer | ArrayBuffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result!);
      }
    });

    uploadStream.end(buffer);
  });
}

export async function uploadImage(buffer: Buffer | ArrayBuffer) {
  try {
    const data = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
    const result = await uploadFromBuffer(data);
    return result;
  } catch (error) {
    logger.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}
