export type Article = {
  slug: string
  title: string
  excerpt: string
  content: string
  featured?: boolean
  image?: string
  author?: string
  tags?: string[]
}

export const articles: Article[] = [
  {
    slug: 'understanding-menopause',
    title: 'Understanding Menopause',
    excerpt: 'Practical tips and modern approaches to navigate hormonal changes.',
    content: 'Full article content for Understanding Menopause...',
    image: '/articles/understanding-menopause.jpg',
    author: 'Dr. Sara',
    tags: ['Menopause', 'Hormones'],
    featured: true,
  },
  {
    slug: 'navigating-hormone-health',
    title: 'Navigating Hormone Health',
    excerpt: 'Evidence-based guidance and insights.',
    content: 'Full article content for Navigating Hormone Health...',
    image: '/articles/navigating-hormone-health.jpg',
    author: 'Dr. Ali',
    tags: ['Hormones'],
  },
  {
    slug: 'self-care-recovery',
    title: 'Self-care and Recovery',
    excerpt: 'Lifestyle and supportive strategies to help recovery.',
    content: 'Full article content for Self-care and Recovery...',
    image: '/articles/self-care-recovery.jpg',
    author: 'Jane Doe',
    tags: ['Self-care'],
  },
]
