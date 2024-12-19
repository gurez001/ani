import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";
// Define the IMovie interface
export interface IMovie extends Document {
  _no: string;
  mov_id: string;
  title: string;
  description: string;
  content: string;
  rating: string;
  duration: number;
  airedFrom: Date;
  airedTo?: Date;
  status: string;
  slug: string;
  publish_status: string;
  score?: number;
  ageRating: string;
  audit_log: mongoose.Types.ObjectId;
  feature_image: mongoose.Types.ObjectId;
  categorie: mongoose.Types.ObjectId[];
  video: mongoose.Types.ObjectId[];
  seo: mongoose.Types.ObjectId;
  is_active?: boolean;
  is_delete?: boolean;
  generateSlug: () => string;
  generateDescription: () => string;
}

// Define the Movie Schema
const movieSchema = new Schema<IMovie>(
  {
    _no: { type: String, required: true },
    mov_id: { type: String, },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: String, required: true },
    duration: { type: Number, required: true },
    airedFrom: { type: Date, required: true },
    airedTo: { type: Date, default: null },
    status: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    publish_status: { type: String, required: true },
    score: { type: Number, default: 0 },
    ageRating: { type: String, required: true },
    audit_log: { type: Schema.Types.ObjectId, ref: "AuditLog", required: true },
    feature_image: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    categorie: [{ type: Schema.Types.ObjectId }],
    video: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    seo: { type: Schema.Types.ObjectId, ref: "SEO", required: true },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
// Method to generate a slug from the title
movieSchema.methods.generateSlug = function (): string {
  return slugify(this.title, { lower: true, strict: true, replacement: "-" });
};

// Add instance methods for `generateSlug` and `generateDescription`
movieSchema.methods.generateSlug = function (): string {
  return this.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// Pre-save middleware to set slug and description if not provided
movieSchema.pre<IMovie>("save", function (next) {
  if (!this.slug) {
    this.slug = this.generateSlug(); // Set the slug if it's not provided
  }
  next();
});
movieSchema.methods.generateDescription = function (): string {
  return `${this.title} is a movie with a rating of ${this.rating}. ${this.description}`;
};

// Create the Movie Model
const Movie: Model<IMovie> = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
