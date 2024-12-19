import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";
// Define the ISeasons interface
export interface ISeasons extends Document {
  _no: string;
  seas_id: string;
  season: number;
  title: string;
  duration: number;
  description: string;
  content: string;
  rating: string;
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
  episode: mongoose.Types.ObjectId[];
  seo: mongoose.Types.ObjectId;
  is_active?: boolean;
  is_delete?: boolean;
  generateSlug: () => string;
  generateDescription: () => string;
}

// Define the Movie Schema
const seasonsSchema = new Schema<ISeasons>(
  {
    _no: { type: String, required: true },
    season: { type: Number, required: true },
    seas_id: { type: String, required: true, unique: true },
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
    categorie: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    episode: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
    seo: { type: Schema.Types.ObjectId, ref: "SEO", required: true },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
// Method to generate a slug from the title
seasonsSchema.methods.generateSlug = function (): string {
  return slugify(this.title, { lower: true, strict: true, replacement: "-" });
};

// Add instance methods for `generateSlug` and `generateDescription`
seasonsSchema.methods.generateSlug = function (): string {
  return this.title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// Pre-save middleware to set slug and description if not provided
seasonsSchema.pre<ISeasons>("save", function (next) {
  if (!this.slug) {
    this.slug = this.generateSlug(); // Set the slug if it's not provided
  }
  next();
});
seasonsSchema.methods.generateDescription = function (): string {
  return `${this.title} is a movie with a rating of ${this.rating}. ${this.description}`;
};

// Create the Movie Model
const Movie: Model<ISeasons> = mongoose.model<ISeasons>(
  "Season",
  seasonsSchema
);

export default Movie;
