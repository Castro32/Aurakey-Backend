// import { Router, Request, Response } from 'express';
// import { body, validationResult } from 'express-validator';
// import ContactLead from '../models/ContactLead';
// import { sendContactEmail } from '../services/emailService';
// import { sendWhatsAppNotification } from '../services/whatsappService';
// import { contactLimiter } from '../middleware/rateLimiter';
// import { protect, AuthRequest } from '../middleware/auth';

// const router = Router();

// // POST /api/contact — public form submission
// router.post(
//   '/',
//   contactLimiter,
//   [
//     body('firstName').notEmpty().trim(),
//     body('lastName').notEmpty().trim(),
//     body('email').isEmail().normalizeEmail(),
//   ],
//   async (req: Request, res: Response): Promise<void> => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

//     const { firstName, lastName, email, phone, interest, message, source } = req.body;

//     try {
//       // Save to DB
//       const lead = await ContactLead.create({ firstName, lastName, email, phone, interest, message, source });

//       // Send email notification
//       await sendContactEmail({ firstName, lastName, email, phone, interest, message });

//       // Send WhatsApp notification
//       await sendWhatsAppNotification({ name: `${firstName} ${lastName}`, email, phone, type: 'contact', interest });

//       res.status(201).json({ message: 'Message received — our team will be in touch shortly', id: lead._id });
//     } catch (error) {
//       console.error('Contact form error:', error);
//       res.status(500).json({ message: 'Failed to send message — please try again' });
//     }
//   }
// );

// // GET /api/contact — admin: view all leads
// router.get('/', protect, async (_req: AuthRequest, res: Response) => {
//   const leads = await ContactLead.find().sort({ createdAt: -1 });
//   res.json(leads);
// });

// // PUT /api/contact/:id/status — admin: update lead status
// router.put('/:id/status', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   const lead = await ContactLead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
//   if (!lead) { res.status(404).json({ message: 'Lead not found' }); return; }
//   res.json(lead);
// });

// export default router;
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import ContactLead from '../models/ContactLead';
import { sendContactEmail, sendBrochureEmail } from '../services/emailService';
import { sendWhatsAppNotification } from '../services/whatsappService';
import { contactLimiter } from '../middleware/rateLimiter';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/contact — public (contact form + brochure download)
router.post(
  '/',
  contactLimiter,
  [
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { firstName, lastName, email, phone, interest, message, source, propertyId } = req.body;
    const isBrochure = source === 'brochure-download';

    try {
      const lead = await ContactLead.create({
        firstName,
        lastName,
        email,
        phone,
        interest,
        message,
        source: isBrochure ? 'brochure-download' : (source || 'contact-form'),
      });

      if (isBrochure) {
        // Brochure-specific email
        await sendBrochureEmail({ firstName, lastName, email, phone, propertyTitle: interest || 'a property' });
        await sendWhatsAppNotification({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          type: 'brochure',
          interest: interest || 'a property',
        });
      } else {
        // Standard contact form email
        await sendContactEmail({ firstName, lastName, email, phone, interest, message });
        await sendWhatsAppNotification({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          type: 'contact',
          interest,
        });
      }

      res.status(201).json({
        message: isBrochure
          ? 'Details received — your download will begin shortly'
          : 'Message received — our team will be in touch shortly',
        id: lead._id,
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to submit — please try again' });
    }
  }
);

// GET /api/contact — admin: view all leads
router.get('/', protect, async (_req: AuthRequest, res: Response) => {
  const leads = await ContactLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// PUT /api/contact/:id/status — admin: update lead status
router.put('/:id/status', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await ContactLead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!lead) { res.status(404).json({ message: 'Lead not found' }); return; }
  res.json(lead);
});

export default router;