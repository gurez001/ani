import Movie from "@/model/movie-model";
import ImageRepository from "@/utils/comman-repositories/imageRepository";
import { generateRandomId } from "@/utils/generateRandomId";
import { NextFunction } from "express";
const imageRepository = new ImageRepository();
class MovieRepositorie {
  private async generateId(uuid: string, randomId: string, number: number): Promise<string> {
    return `mov_id_${randomId.toLowerCase()}_${uuid}${number}`;
  }

  private async getNextNumber(): Promise<number> {
    return await Movie.estimatedDocumentCount() + 1; // Faster than countDocuments
  }

  async create(data: any, imageData: any, seo: any, userId: string, next: NextFunction) {
    try {
      const randomId = generateRandomId();
      const {
        title, content, duration, airedFrom, airedTo, score, rating, ageRating, publish_status,
        description, uuid, categorie, status, metaCanonicalUrl,
      } = data;

      const imageIds = imageData.map((item: any) => item._id);
      const counter = await this.getNextNumber();
      const movId = await this.generateId(uuid, randomId, counter);

      const newPostData = {
        _no: counter,
        title,
        mov_id: movId,
        content,
        status,
        duration: Number(duration),
        airedFrom,
        airedTo,
        score: Number(score),
        rating,
        ageRating,
        publish_status,
        description,
        categorie: categorie?.split(",") || ["default-category-id"],
        slug: metaCanonicalUrl.toLowerCase(),
        feature_image: imageIds[0],
        seo: seo?._id,
        audit_log: userId,
      };

      const result = await new Movie(newPostData).save();
      return result; // Return directly after save
    } catch (error: any) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  async findByUrl(url: string) {
    return Movie.findOne({ slug: url });
  }
}

export default MovieRepositorie;
