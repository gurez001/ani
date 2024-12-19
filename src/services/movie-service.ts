import MovieRepositorie from "@/repositories/movie-repositorie";
import ImageRepository from "@/utils/comman-repositories/imageRepository";
import seoRepositorie from "@/utils/comman-repositories/seo-repositorie";
import ErrorHandler from "@/utils/ErrorHandler";
import { ImageUploader } from "@/utils/ImageUpload";
import { NextFunction } from "express";

const imageUploader = new ImageUploader();
const add_image = new ImageRepository();
class MovieService {
  constructor(private movieRepositorie: MovieRepositorie) {}
  private handleError(message: string, next: NextFunction, code: number = 404) {
    next(new ErrorHandler(message, code));
  }
  // Upload and save image with database entry
  private async handleImage(files: any, user_id: string, next: NextFunction) {
    const uploadedImage = await imageUploader.uploadImage(files, next, "1");
    if (!uploadedImage) {
      this.handleError("Image upload failed on the server", next);
      return null;
    }

    const imageData = await add_image.createImage(
      files,
      uploadedImage,
      user_id,
      next,
      "1"
    );
    if (!imageData) {
      this.handleError("Image not added to database", next);
      return null;
    }

    return { uploadedImage, imageData };
  }

  async create(data: any, files: any, user_id: string, next: NextFunction) {
    try {
      const imageResult = await this.handleImage(files, user_id, next);
      if (!imageResult) return;

      const { uploadedImage, imageData } = imageResult;

      const seo = await seoRepositorie.create(data, uploadedImage, next);
      if (!seo) {
        return this.handleError("SEO data not added to database", next);
      }

      return await this.movieRepositorie.create(
        data,
        imageData,
        seo,
        user_id,
        next
      );
    } catch (error: any) {
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }
  async findByUrl(url: string) {
    return await this.movieRepositorie.findByUrl(url);
  }
}

export default MovieService;
