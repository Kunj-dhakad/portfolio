import type { ContentData, Entry, Kind, SiteSettings } from '@/types';
export const defaults: SiteSettings = {
  brand: 'Navonixx',
  logo: '/brand/navonixx-logo.png',
  headline: 'Ideas into products.\nBuilt for what’s next.',
  description:
    'Thoughtful SaaS products, powerful web applications, and digital experiences. Designed with purpose. Built to move your business forward.',
  email: '',
  github: '',
  linkedin: '',
  seoTitle: 'Navonixx — Digital Product Studio',
  seoDescription:
    'SaaS development, custom web applications, AI integrations, and a thoughtfully curated software toolkit.',
  disclosure:
    'Some links may be affiliate links. If you purchase through a configured affiliate link, I may earn a commission at no additional cost to you. Sample recommendations are editorial placeholders, not endorsements based on first-hand use.',
};
export const blankData: ContentData = {
  body: '',
  cover: '/previews/workspace.svg',
  logo: '',
  screenshots: [],
  technologies: [],
  features: [],
  challenges: '',
  solutions: '',
  projectType: '',
  status: 'In Development',
  liveUrl: '',
  demoUrl: '',
  githubUrl: '',
  productUrl: '',
  audience: '',
  benefits: [],
  pricing: '',
  affiliateUrl: '',
  officialUrl: '',
  pros: [],
  cons: [],
  disclosure: false,
  tags: [],
  author: 'Navonixx',
  publishedAt: '2026-10-08',
  seoTitle: '',
  seoDescription: '',
};
const projects = [
  [
    'Orbit',
    'A calmer command center for ambitious teams.',
    'SaaS Applications',
    'workspace',
    ['Next.js', 'PostgreSQL', 'Prisma'],
  ],
  [
    'Pulse',
    'Make business data clear, connected, and actionable.',
    'Dashboards',
    'analytics',
    ['React', 'TypeScript', 'Recharts'],
  ],
  [
    'Draft AI',
    'An AI-assisted writing workspace for your next great idea.',
    'AI Tools',
    'writing',
    ['Next.js', 'AI SDK', 'Tailwind'],
  ],
  [
    'Flowbridge',
    'Bring your tools together with thoughtful automation.',
    'Business Automation',
    'workspace',
    ['Node.js', 'PostgreSQL', 'APIs'],
  ],
  [
    'Commerce OS',
    'A focused storefront and operations workspace.',
    'E-commerce',
    'analytics',
    ['Next.js', 'Prisma', 'Stripe'],
  ],
  [
    'API Lens',
    'A developer workspace for exploring connected services.',
    'APIs',
    'writing',
    ['TypeScript', 'REST', 'Zod'],
  ],
];
const products = [
  [
    'Orbit Workspace',
    'Projects, notes, and decisions in one focused workspace.',
    'Productivity',
    'workspace',
  ],
  [
    'Pulse Analytics',
    'A readable view of the signals that matter to your business.',
    'Business Intelligence',
    'analytics',
  ],
  [
    'Draft AI Studio',
    'A structured space for briefs, drafts, and better writing.',
    'AI & Content',
    'writing',
  ],
  [
    'Flowbridge Automations',
    'Connect workflows and reduce repetitive operations.',
    'Automation',
    'workspace',
  ],
];
const tools = [
  [
    'Vercel',
    'Hosting and Cloud',
    'Deploy and manage modern web applications.',
    'https://vercel.com',
  ],
  [
    'Notion',
    'Productivity Tools',
    'Organize notes, documents, and team knowledge.',
    'https://www.notion.com',
  ],
  [
    'Figma',
    'Design Tools',
    'Collaborate on interfaces and interactive prototypes.',
    'https://www.figma.com',
  ],
  [
    'GitHub',
    'Developer Tools',
    'Host source code and collaborate on software.',
    'https://github.com',
  ],
  [
    'Linear',
    'Business Software',
    'Plan software projects and track team work.',
    'https://linear.app',
  ],
  ['OpenAI', 'AI Tools', 'Build applications using AI models and APIs.', 'https://openai.com'],
  ['n8n', 'Automation', 'Connect services in customizable automation workflows.', 'https://n8n.io'],
  [
    'Mailchimp',
    'Marketing Tools',
    'Create and manage email marketing campaigns.',
    'https://mailchimp.com',
  ],
];
const posts = [
  [
    'From idea to a focused SaaS MVP',
    'SaaS Development',
    'Start with a clear problem. Build the smallest product that solves it well.',
  ],
  [
    'Designing dashboards people actually use',
    'Software Engineering',
    'Turn complex information into clear decisions with purposeful interface design.',
  ],
  [
    'A practical approach to AI integrations',
    'AI Tools',
    'Find the right workflow for AI before choosing models or frameworks.',
  ],
  [
    'Automation starts with a better process',
    'Automation',
    'Understand the manual workflow before introducing automated steps.',
  ],
  [
    'Choosing the right tools for your next build',
    'Developer Tutorials',
    'Evaluate fit, maintenance, and constraints rather than following a trend.',
  ],
  [
    'What to consider before comparing software',
    'Software Comparisons',
    'A useful framework for evaluating software against your real requirements.',
  ],
];
function entry(
  kind: Kind,
  title: string,
  description: string,
  category: string,
  index: number,
  data: Partial<ContentData>,
): Entry {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return {
    id: `sample-${kind}-${index}`,
    kind,
    slug,
    title,
    description,
    category,
    published: true,
    featured: index < 3,
    sample: true,
    createdAt: '2026-10-08T00:00:00.000Z',
    updatedAt: '2026-10-08T00:00:00.000Z',
    data: {
      ...blankData,
      body: `## The idea\n\n${description}\n\nThis is illustrative sample content. Replace it with your own work before publishing your personal brand.\n\n## A thoughtful approach\n\nBegin with user needs, make the core workflow clear, and build a maintainable foundation. Keep accessibility, reliable data handling, and usability part of every decision.\n\n## Next steps\n\nDocument requirements, validate the design, and test the complete journey before launch.`,
      ...data,
    },
  };
}
export const sampleEntries: Entry[] = [
  ...projects.map(([title, description, category, preview, technologies], i) =>
    entry('projects', title as string, description as string, category as string, i, {
      cover: `/previews/${preview}.svg`,
      screenshots: [`/previews/${preview}.svg`, '/previews/analytics.svg'],
      technologies: technologies as string[],
      features: [
        'Accessible, responsive interface',
        'Structured content and workflows',
        'Secure account architecture',
      ],
      challenges: 'Balance a focused interface with flexible workflows.',
      solutions: 'A reusable component system and a clear information hierarchy.',
      projectType: 'Independent concept',
      status: 'Concept',
    }),
  ),
  ...products.map(([title, description, category, preview], i) =>
    entry('products', title, description, category, i, {
      cover: `/previews/${preview}.svg`,
      screenshots: [`/previews/${preview}.svg`],
      features: ['Focused dashboard', 'Collaborative workflows', 'Responsive workspace'],
      audience: 'Teams and independent professionals',
      benefits: ['Less context switching', 'A clearer view of your work'],
      status: i === 3 ? 'In Development' : 'Coming Soon',
      pricing: 'Pricing has not been announced.',
    }),
  ),
  ...tools.map(([title, category, description, officialUrl], i) =>
    entry('tools', title, description, category, i, {
      officialUrl,
      status: 'Editorial placeholder',
      features: ['Visit the official website for current capabilities.'],
      pros: ['Evaluate against your workflow and requirements.'],
      cons: ['Features and pricing may change.'],
      pricing: 'Check the official website for current pricing.',
      disclosure: true,
    }),
  ),
  ...posts.map(([title, category, description], i) =>
    entry('blog', title, description, category, i, {
      cover: `/previews/${['workspace', 'analytics', 'writing'][i % 3]}.svg`,
      tags: [category, 'Product building'],
    }),
  ),
];
export const services = [
  {
    title: 'SaaS application development',
    text: 'From a validated idea to a dependable subscription product. Build accounts, workflows, billing integrations, and a foundation that can grow.',
    icon: 'Layers',
    deliverables: [
      'Product architecture',
      'Responsive application',
      'Account and billing integration',
    ],
  },
  {
    title: 'Custom web applications',
    text: 'Purpose-built software for the way your business operates, with clear interfaces and maintainable engineering.',
    icon: 'Code',
    deliverables: ['Workflow discovery', 'Custom application', 'Technical documentation'],
  },
  {
    title: 'AI integrations & automation',
    text: 'Put AI to work in useful, measurable workflows. Connect models to your product and automate repetitive tasks with human oversight.',
    icon: 'Sparkles',
    deliverables: ['Workflow mapping', 'AI integration', 'Evaluation and safeguards'],
  },
  {
    title: 'APIs & integrations',
    text: 'Connect your systems with well-designed APIs, reliable data flows, and understandable documentation.',
    icon: 'Network',
    deliverables: ['API design', 'Service integrations', 'Error handling and documentation'],
  },
  {
    title: 'MVP development',
    text: 'Turn your idea into a focused first product. Prioritize what matters, validate the experience, and establish a path forward.',
    icon: 'Rocket',
    deliverables: ['Scope and roadmap', 'Core product workflow', 'Launch preparation'],
  },
  {
    title: 'Dashboards & admin panels',
    text: 'Give teams a clear view of their data and the controls they need to run daily operations confidently.',
    icon: 'LayoutDashboard',
    deliverables: ['Data visualization', 'Role-based controls', 'Management workflows'],
  },
  {
    title: 'Application modernization',
    text: 'Improve an existing application through focused upgrades to architecture, usability, performance, and maintainability.',
    icon: 'RefreshCw',
    deliverables: [
      'Technical assessment',
      'Incremental upgrade plan',
      'Implementation and handover',
    ],
  },
];
