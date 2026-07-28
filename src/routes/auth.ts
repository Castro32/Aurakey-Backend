import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin || !(await admin.comparePassword(password))) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        admin: { id: admin._id, name: admin.name, email: admin.email },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST /api/auth/register (run once to seed first admin, then disable)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ message: 'Registration disabled in production' });
    return;
  }
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) { res.status(400).json({ message: 'Admin already exists' }); return; }
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ message: 'Admin created', id: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;