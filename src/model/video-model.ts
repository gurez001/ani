import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";
// Define the IVideo interface
export interface IVideo extends Document {
  _no: string;
  vid_id: string;
  quality: string;
  title: string;
  format: string;
  duration: number;
  description: string;
  slug: string;
  audit_log: mongoose.Types.ObjectId;
  is_active?: boolean;
  is_delete?: boolean;
  generateSlug: () => string;
  generateDescription: () => string;
}

// Define the Movie Schema
const seasonsSchema = new Schema<IVideo>(
  {
    _no: { type: String, required: true },
    format: { type: String, required: true },
    vid_id: { type: String, required: true, unique: true },
    quality: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    audit_log: { type: Schema.Types.ObjectId, ref: "AuditLog", required: true },
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
seasonsSchema.pre<IVideo>("save", function (next) {
  if (!this.slug) {
    this.slug = this.generateSlug(); // Set the slug if it's not provided
  }
  next();
});
seasonsSchema.methods.generateDescription = function (): string {
  return `${this.title} is a movie with a rating of ${this.rating}. ${this.description}`;
};

// Create the Movie Model
const Movie: Model<IVideo> = mongoose.model<IVideo>("Episode", seasonsSchema);

export default Movie;
