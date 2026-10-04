import mongoose from 'mongoose';

const str = (def = '') => ({ type: String, default: def, trim: true });

const colorSchema = new mongoose.Schema(
  { name: str(), hex: str('#000000') },
  { _id: false }
);

const fontSchema = new mongoose.Schema(
  { name: str(), sample: str('Aa') },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    eyebrow: str('The Challenge'),
    heading: str(),
    body: str(),
    image: str(),
    caption: str(),
    captionRight: str(),
    side: { type: String, enum: ['auto', 'left', 'right'], default: 'auto' }
  },
  { _id: false }
);

const highlightSchema = new mongoose.Schema(
  { title: str(), body: str() },
  { _id: false }
);

const detailsSchema = new mongoose.Schema(
  {
    eyebrow: str('Selected Project'),
    title: str('Project Case Study'),
    role: str(),
    client: str(),
    discipline: str(),
    year: str(),
    heroImage: str(),
    heroLabel: str(),
    heroCaption: str(),
    intro: {
      eyebrow: str('The Challenge'),
      heading: str(),
      paragraphs: { type: [String], default: [] },
      image: str()
    },
    colors: { type: [colorSchema], default: [] },
    fonts: { type: [fontSchema], default: [] },
    sections: { type: [sectionSchema], default: [] },
    highlights: {
      eyebrow: str('The Challenge'),
      heading: str(),
      items: { type: [highlightSchema], default: [] }
    },
    screens: {
      eyebrow: str('Every Screen'),
      heading: str(),
      desktop: str(),
      mobile: str(),
      thankYou: str()
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    details: { type: detailsSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
