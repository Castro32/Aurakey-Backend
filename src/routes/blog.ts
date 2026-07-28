// import { Router, Response, Request } from 'express';
// import slugify from 'slugify';
// import BlogPost from '../models/BlogPost';
// import { protect, AuthRequest } from '../middleware/auth';

// const router = Router();

// // GET /api/blog — public (published)
// router.get('/', async (req: Request, res: Response) => {
//   const { category } = req.query;
//   const filter: Record<string, unknown> = { isPublished: true };
//   if (category) filter.category = category;
//   const posts = await BlogPost.find(filter).sort({ publishedAt: -1 }).select('-content');
//   res.json(posts);
// });

// // GET /api/blog/:slug — single post (public)
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   const post = await BlogPost.findOne({ slug: req.params.slug, isPublished: true });
//   if (!post) { res.status(404).json({ message: 'Post not found' }); return; }
//   res.json(post);
// });

// // POST /api/blog — admin only
// router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   const slug = slugify(req.body.title, { lower: true, strict: true });
//   const post = await BlogPost.create({ ...req.body, slug });
//   res.status(201).json(post);
// });

// // PUT /api/blog/:id — admin only
// router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
//   const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//   if (!post) { res.status(404).json({ message: 'Not found' }); return; }
//   res.json(post);
// });

// // DELETE /api/blog/:id — admin only
// router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   const post = await BlogPost.findByIdAndDelete(req.params.id);
//   if (!post) { res.status(404).json({ message: 'Not found' }); return; }
//   res.json({ message: 'Post deleted' });
// });

// export default router;
import { Router, Response, Request } from 'express';
import multer from 'multer';
import slugify from 'slugify';
import BlogPost from '../models/BlogPost';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Only image files allowed'));
  },
});

const toBase64 = (file: Express.Multer.File): string =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

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
router.post(
  '/',
  protect,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const slug = slugify(req.body.title, { lower: true, strict: true });

      // Parse author and tags — come as strings from form-data
      const author = req.body.author
        ? (typeof req.body.author === 'string' ? JSON.parse(req.body.author) : req.body.author)
        : { name: '', role: '' };

      const tags = req.body.tags
        ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags)
        : [];

      const coverImage = req.file
        ? toBase64(req.file)
        : req.body.coverImage || '';

      const post = await BlogPost.create({
        ...req.body,
        slug,
        author,
        tags,
        coverImage,
        isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Blog create error:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  }
);

// PUT /api/blog/:id — admin only
router.put(
  '/:id',
  protect,
  upload.single('coverImage'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const updateData: Record<string, unknown> = { ...req.body };

      if (req.body.title) {
        updateData.slug = slugify(req.body.title, { lower: true, strict: true });
      }

      if (req.file) {
        updateData.coverImage = toBase64(req.file);
      }

      if (req.body.author) {
        updateData.author = typeof req.body.author === 'string'
          ? JSON.parse(req.body.author)
          : req.body.author;
      }

      if (req.body.tags) {
        updateData.tags = typeof req.body.tags === 'string'
          ? JSON.parse(req.body.tags)
          : req.body.tags;
      }

      if (req.body.isPublished !== undefined) {
        updateData.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
      }

      const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!post) { res.status(404).json({ message: 'Not found' }); return; }
      res.json(post);
    } catch (error) {
      console.error('Blog update error:', error);
      res.status(500).json({ message: 'Failed to update post' });
    }
  }
);

// DELETE /api/blog/:id — admin only
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Post deleted' });
});

export default router;