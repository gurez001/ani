import Movie from "@/model/movie-model";
import ImageRepository from "@/utils/comman-repositories/imageRepository";
import { generateRandomId } from "@/utils/generateRandomId";
import { NextFunction } from "express";
const imageRepository = new ImageRepository();
class MovieRepositorie {
  private async genrateId(
    uuid: string,
    randomId: string,
    number: number
  ): Promise<string> {
    return `mov_id_${randomId.toLowerCase()}_${uuid}${number}`;
  }
  // Reusable function to get the next post number
  private async getNextNumber(): Promise<number> {
    const count = await Movie.countDocuments();
    return count + 1;
  }
  async create(
    data: any,
    image_data: any,
    seo: any,
    user_id: string,
    next: NextFunction
  ) {
    try {
      const randomId = generateRandomId();
      const {
        title,
        content,
        duration,
        airedFrom,
        airedTo,
        score,
        rating,
        ageRating,
        publish_status,
        description,
        uuid,
        categorie,
        status,
        metaCanonicalUrl,
      } = data;
      const imageIds = image_data.map((item: any) => item._id);

      // Get next post number
      const counter = await this.getNextNumber();

      // Generate post ID
      const catId = await this.genrateId(uuid, randomId, counter);

      // Prepare data to be saved
      const newPostData = {
        _no: counter,
        title,
        mov_id:catId,
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
        categorie: categorie
          ? categorie.split(",")
          : ["6741bd2663fa4c1a8dd7548b"], // Default categorie ID
        slug: metaCanonicalUrl.toLowerCase(),
        feature_image: imageIds[0],
        seo: seo?._id,
        post_id: catId,
        audit_log: user_id,
      };

      // Create and save the new post
      const result = new Movie(newPostData);
      const savedPost: any = await result.save(); // Save the post first to get the post with populated fields

      // Now populate the categories after the post is saved
      await savedPost.populate("categorie");
      // Prepare image update promises for updating the displayed path and activating the image

      if (imageIds) {
        const updateData = {
          displayedpath: `${savedPost?.categorie[0]?.slug.toLowerCase()}/${newPostData.slug.toLowerCase()}`, // Set the displayed path to the category slug
          is_active: true, // Mark the image as active
        };
        const oldImageId = "";
        await imageRepository.updateImage(
          imageIds,
          "1",
          oldImageId,
          updateData,
          next
        );
      }
      return await savedPost;
    } catch (error: any) {
      throw new Error(`Error creating: ${error.message}`);
    }
  }

  // Find post by URL
  async findByUrl(url: string) {
    return await Movie.findOne({ slug: url });
  }
}

export default MovieRepositorie;
