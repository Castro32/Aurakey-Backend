import { Router, Response, Request } from 'express';
import slugify from 'slugify';
import BlogPost from '../models/BlogPost';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/blog — public (published)
router.get('/', async (req: Request, res: Response) => {
  const { category } = req.query;
  const filter: Record<string, unknown> = { isPublished: true };
  if (category) filter.category = category;
  const posts = await BlogPost.find(filter).sort({ publishedAt: -1 }).select('-content');
  res.json(posts);
});

// GET /api/blog/:slug — single post (public)
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
  if (!post) { res.status(404).json({ message: 'Post not found' }); return; }
  res.json(post);
});

// POST /api/blog — admin only
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const post = await BlogPost.create({ ...req.body, slug });
  res.status(201).json(post);
});

// PUT /api/blog/:id — admin only
router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(post);
});

// DELETE /api/blog/:id — admin only
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Post deleted' });
});

export default router;