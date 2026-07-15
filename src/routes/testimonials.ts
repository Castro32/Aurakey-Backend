import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Testimonial from '../models/Testimonial';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/testimonials — public (published only)
router.get('/', async (_req, res: Response) => {
  const testimonials = await Testimonial.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
  res.json(testimonials);
});

// GET /api/testimonials/admin — all (admin only)
router.get('/admin', protect, async (_req, res: Response) => {
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
  res.json(testimonials);
});

// POST /api/testimonials — create (admin only)
router.post(
  '/',
  protect,
  [
    body('clientName').notEmpty().trim(),
    body('quote').notEmpty().trim(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { clientName, quote, role, isPublished, order } = req.body;
    const testimonial = await Testimonial.create({ clientName, quote, role, isPublished, order });
    res.status(201).json(testimonial);
  }
);

// PUT /api/testimonials/:id — update (admin only)
router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!testimonial) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(testimonial);
});

// DELETE /api/testimonials/:id — delete (admin only)
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Testimonial deleted' });
});

export default router;