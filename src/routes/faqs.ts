import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import slugify from 'slugify';
import FAQCategory from '../models/FAQ';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/faqs — public (published categories + items)
router.get('/', async (_req, res: Response) => {
  const faqs = await FAQCategory.find({ isPublished: true }).sort({ order: 1 });
  res.json(faqs);
});

// GET /api/faqs/admin — all categories (admin only)
router.get('/admin', protect, async (_req, res: Response) => {
  const faqs = await FAQCategory.find().sort({ order: 1 });
  res.json(faqs);
});

// POST /api/faqs — create category (admin only)
router.post(
  '/',
  protect,
  [body('category').notEmpty().trim()],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { category, order, isPublished } = req.body;
    const slug = slugify(category, { lower: true, strict: true });
    const faq = await FAQCategory.create({ category, slug, order, isPublished, items: [] });
    res.status(201).json(faq);
  }
);

// PUT /api/faqs/:id — update category (admin only)
router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.body.category) {
    req.body.slug = slugify(req.body.category, { lower: true, strict: true });
  }
  const faq = await FAQCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!faq) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(faq);
});

// DELETE /api/faqs/:id — delete category (admin only)
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const faq = await FAQCategory.findByIdAndDelete(req.params.id);
  if (!faq) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Category deleted' });
});

// POST /api/faqs/:id/items — add item to category
router.post('/:id/items', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const faq = await FAQCategory.findById(req.params.id);
  if (!faq) { res.status(404).json({ message: 'Category not found' }); return; }
  faq.items.push({ question: req.body.question, answer: req.body.answer, order: req.body.order || 0 });
  await faq.save();
  res.json(faq);
});

// PUT /api/faqs/:id/items/:itemId — update item
router.put('/:id/items/:itemId', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const faq = await FAQCategory.findById(req.params.id);
  if (!faq) { res.status(404).json({ message: 'Not found' }); return; }

  const item = faq.items.find((i: any) => i._id.toString() === req.params.itemId);
  if (!item) { res.status(404).json({ message: 'Item not found' }); return; }

  if (req.body.question) item.question = req.body.question;
  if (req.body.answer) item.answer = req.body.answer;
  if (req.body.order !== undefined) item.order = req.body.order;

  await faq.save();
  res.json(faq);
});


// DELETE /api/faqs/:id/items/:itemId — delete item
router.delete('/:id/items/:itemId', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const faq = await FAQCategory.findById(req.params.id);
  if (!faq) { res.status(404).json({ message: 'Not found' }); return; }

  faq.items = faq.items.filter((i: any) => i._id.toString() !== req.params.itemId) as any;

  await faq.save();
  res.json(faq);
});

export default router;