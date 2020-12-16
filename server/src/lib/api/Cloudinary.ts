import cloudinary from 'cloudinary';

export const Cloudinary = {
  upload: async (image: string): Promise<string> => {
    const res = await cloudinary.v2.uploader.upload(image, {
      api_key: process.env.CLOUDINARY_KEY,
      cloud_name: process.env.CLOUDINARY_NAME,
      api_secret: process.env.CLOUDINARY_SECRET,
      folder: 'NEXT_Assets/',
    });

    return res.secure_url;
  },
};
