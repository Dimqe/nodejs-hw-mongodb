
import cloudinary from './cloudinary.js';

export const parseFile = async (file) => {
  try {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    console.log('Uploading to Cloudinary...');

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'contacts-photos',
    });

    console.log('Upload successful! URL:', result.secure_url); 

    return result.secure_url;
  } catch (error) {
   
    console.error('--- CLOUDINARY UPLOAD ERROR ---', error);
  
    return undefined;
  }
};