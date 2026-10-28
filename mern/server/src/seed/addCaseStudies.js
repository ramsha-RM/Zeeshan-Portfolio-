/**
 * Safe, repeatable way to add the four starter case studies to the database.
 *
 *   node src/seed/addCaseStudies.js                     add any that are missing
 *   node src/seed/addCaseStudies.js --hide-templates    …and unpublish the old template projects
 *
 * Unlike seed.js it never deletes anything and never overwrites a project that
 * already exists (so images and edits made in /admin are kept). Hidden template
 * projects can be published again from /admin.
 */
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import { caseStudies, templateSlugs } from '../data/caseStudies.js';

const hideTemplates = process.argv.includes('--hide-templates');

try {
  await connectDB();

  let added = 0;
  for (const cs of caseStudies) {
    const result = await Project.updateOne({ slug: cs.slug }, { $setOnInsert: cs }, { upsert: true });
    if (result.upsertedCount) {
      added += 1;
      console.log('Added:', cs.name);
    } else {
      console.log('Already exists, left unchanged:', cs.name);
    }
  }

  if (hideTemplates) {
    const hidden = await Project.updateMany({ slug: { $in: templateSlugs }, published: true }, { $set: { published: false } });
    console.log('Template projects unpublished:', hidden.modifiedCount);
  }

  console.log(`Done. ${added} added, ${caseStudies.length - added} already present.`);
} catch (error) {
  console.error('Could not add case studies:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
