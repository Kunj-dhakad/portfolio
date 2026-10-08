import { z } from 'zod';
import { kinds } from '@/types';
const url = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      (/^https?:\/\//.test(v) &&
        (() => {
          try {
            return Boolean(new URL(v));
          } catch {
            return false;
          }
        })()),
    'Use an absolute HTTP or HTTPS URL.',
  );
const asset = z
  .string()
  .max(2048)
  .refine(
    (v) => !v || /^\/(?!\/)[a-zA-Z0-9/_.-]+$/.test(v),
    'Use a local public asset path, such as /previews/workspace.svg.',
  );
const list = z.array(z.string().max(250)).max(50);
export const contentSchema = z.object({
  kind: z.enum(kinds),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
  title: z.string().min(2).max(150),
  description: z.string().min(10).max(500),
  category: z.string().min(2).max(100),
  published: z.boolean(),
  featured: z.boolean(),
  sample: z.boolean(),
  data: z.object({
    body: z.string().max(100000),
    cover: asset,
    logo: asset,
    screenshots: z.array(asset).max(20),
    technologies: list,
    features: list,
    challenges: z.string().max(5000),
    solutions: z.string().max(5000),
    projectType: z.string().max(100),
    status: z.string().min(1).max(100),
    liveUrl: url,
    demoUrl: url,
    githubUrl: url,
    productUrl: url,
    audience: z.string().max(500),
    benefits: list,
    pricing: z.string().max(2000),
    affiliateUrl: url,
    officialUrl: url,
    pros: list,
    cons: list,
    disclosure: z.boolean(),
    tags: list,
    author: z.string().max(100),
    publishedAt: z.iso.date(),
    seoTitle: z.string().max(150),
    seoDescription: z.string().max(300),
  }),
});
export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(100),
  email: z.email('Please enter a valid email.').max(254),
  company: z.string().trim().max(150).optional().default(''),
  projectType: z.enum([
    'SaaS application',
    'Custom web application',
    'AI & automation',
    'API integration',
    'MVP development',
    'Dashboard',
    'Modernization',
    'Other',
  ]),
  budget: z.enum([
    'Under $5,000',
    '$5,000–$15,000',
    '$15,000–$30,000',
    '$30,000+',
    'Let’s discuss',
  ]),
  description: z
    .string()
    .trim()
    .min(30, 'Tell me a little more (at least 30 characters).')
    .max(10000),
  timeline: z.enum(['As soon as possible', '1–3 months', '3–6 months', 'Flexible']),
  website: z
    .union([url, z.literal('')])
    .optional()
    .default(''),
  honeypot: z.string().max(500).optional().default(''),
});
export type EnquiryInput = z.input<typeof enquirySchema>;
export const settingsSchema = z.object({
  brand: z.string().min(1).max(60),
  logo: asset,
  headline: z.string().min(5).max(200),
  description: z.string().min(10).max(500),
  email: z.union([z.email(), z.literal('')]),
  github: url,
  linkedin: url,
  seoTitle: z.string().min(5).max(150),
  seoDescription: z.string().min(10).max(300),
  disclosure: z.string().min(20).max(3000),
});
