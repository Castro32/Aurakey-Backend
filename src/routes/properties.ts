import { Router, Response, Request } from 'express';
import slugify from 'slugify';
import Property from '../models/Property';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/properties — public
router.get('/', async (req: Request, res: Response) => {
  const { type, status, featured } = req.query;
  const filter: Record<string, unknown> = { isPublished: true };
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (featured === 'true') filter.isFeatured = true;
  const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(properties);
});

// GET /api/properties/:slug — single property (public)
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
  if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
  res.json(property);
});

// POST /api/properties — admin only
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const slug = slugify(req.body.title, { lower: true, strict: true });
  const property = await Property.create({ ...req.body, slug });
  res.status(201).json(property);
});

// PUT /api/properties/:id — admin only
router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!property) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(property);
});

// DELETE /api/properties/:id — admin only
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Property deleted' });
});

export default router;