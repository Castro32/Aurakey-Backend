import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import PropertyListing from '../models/PropertyListing';
import { sendListingEmail } from '../services/emailService';
import { sendWhatsAppNotification } from '../services/whatsappService';
import { contactLimiter } from '../middleware/rateLimiter';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/listings — public: submit a property to list
router.post(
  '/',
  contactLimiter,
  [
    body('ownerName').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty(),
    body('propertyType').notEmpty(),
    body('location').notEmpty(),
    body('price').notEmpty(),
    body('listingType').isIn(['Sale', 'Rent']),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const data = req.body;

    try {
      const listing = await PropertyListing.create(data);
      await sendListingEmail(data);
      await sendWhatsAppNotification({ name: data.ownerName, email: data.email, phone: data.phone, type: 'listing', interest: data.propertyType });

      res.status(201).json({ message: 'Listing submitted — our team will review and reach out within 24 hours', id: listing._id });
    } catch (error) {
      console.error('Listing submission error:', error);
      res.status(500).json({ message: 'Submission failed — please try again' });
    }
  }
);

// GET /api/listings — admin: view all submissions
router.get('/', protect, async (_req: AuthRequest, res: Response) => {
  const listings = await PropertyListing.find().sort({ createdAt: -1 });
  res.json(listings);
});

// PUT /api/listings/:id/status — admin: update status
router.put('/:id/status', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const listing = await PropertyListing.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!listing) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(listing);
});

export default router;