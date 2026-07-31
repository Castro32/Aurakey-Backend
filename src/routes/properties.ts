// // import { Router, Response, Request } from 'express';
// // import slugify from 'slugify';
// // import Property from '../models/Property';
// // import { protect, AuthRequest } from '../middleware/auth';

// // const router = Router();

// // // GET /api/properties — public
// // router.get('/', async (req: Request, res: Response) => {
// //   const { type, status, featured } = req.query;
// //   const filter: Record<string, unknown> = { isPublished: true };
// //   if (type) filter.type = type;
// //   if (status) filter.status = status;
// //   if (featured === 'true') filter.isFeatured = true;
// //   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
// //   res.json(properties);
// // });

// // // GET /api/properties/:slug — single property (public)
// // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// //   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// //   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// //   res.json(property);
// // });

// // // POST /api/properties — admin only
// // router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// //   const slug = slugify(req.body.title, { lower: true, strict: true });
// //   const property = await Property.create({ ...req.body, slug });
// //   res.status(201).json(property);
// // });

// // // PUT /api/properties/:id — admin only
// // router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// //   if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
// //   const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
// //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// //   res.json(property);
// // });

// // // DELETE /api/properties/:id — admin only
// // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// //   const property = await Property.findByIdAndDelete(req.params.id);
// //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// //   res.json({ message: 'Property deleted' });
// // });

// // export default router;
// import { Router, Response, Request } from 'express';
// import slugify from 'slugify';
// import multer from 'multer';
// import Property from '../models/Property';
// import { protect, AuthRequest } from '../middleware/auth';

// const router = Router();

// // Multer — memory storage, no Cloudinary
// // const upload = multer({
// //   storage: multer.memoryStorage(),
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
// //   fileFilter: (_req, file, cb) => {
// //     file.mimetype.startsWith('image/')
// //       ? cb(null, true)
// //       : cb(new Error('Only image files allowed'));
// //   },
// // });
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10 * 1024 * 1024,    // 10MB per file
//     fieldSize: 50 * 1024 * 1024,   // 50MB for field values (covers Base64 strings)
//     files: 11,                      // max 10 images + 1 floorplan
//   },
//   fileFilter: (_req, file, cb) => {
//     file.mimetype.startsWith('image/')
//       ? cb(null, true)
//       : cb(new Error('Only image files allowed'));
//   },
// });

// // Helper — convert buffer to Base64 data URI
// const toBase64 = (file: Express.Multer.File): string => {
//   return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// };

// // GET /api/properties — public
// router.get('/', async (req: Request, res: Response) => {
//   const { type, status, featured } = req.query;
//   const filter: Record<string, unknown> = { isPublished: true };
//   if (type) filter.type = type;
//   if (status) filter.status = status;
//   if (featured === 'true') filter.isFeatured = true;
//   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
//   res.json(properties);
// });

// // GET /api/properties/:slug — single (public)
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
//   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
//   res.json(property);
// });

// // POST /api/properties — admin only
// router.post(
//   '/',
//   protect,
//   upload.any(),
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     try {
//       const files = req.files as Express.Multer.File[];

//       // Separate images from floorplan by fieldname
//       const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
//       const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

//       const imageBase64: string[] = imageFiles.map(toBase64);
//       const floorplanBase64: string | undefined = floorplanFile
//         ? toBase64(floorplanFile)
//         : undefined;

//       const slug = slugify(req.body.title, { lower: true, strict: true });

//       const features = req.body.features
//         ? JSON.parse(req.body.features)
//         : [];

//       const property = await Property.create({
//         ...req.body,
//         slug,
//         images: imageBase64,
//         floorplan: floorplanBase64,
//         features,
//         beds: Number(req.body.beds),
//         baths: Number(req.body.baths),
//         year: Number(req.body.year),
//         order: Number(req.body.order) || 0,
//         isFeatured: req.body.isFeatured === 'true',
//         isPublished: req.body.isPublished === 'true',
//       });

//       res.status(201).json(property);
//     } catch (error) {
//       console.error('Property create error:', error);
//       res.status(500).json({ message: 'Failed to create property' });
//     }
//   }
// );

// // PUT /api/properties/:id — admin only
// router.put(
//   '/:id',
//   protect,
//   upload.any(),
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     try {
//       const files = req.files as Express.Multer.File[];
//       const updateData: Record<string, unknown> = { ...req.body };

//       // if (req.body.title) {
//       //   updateData.slug = slugify(req.body.title, { lower: true, strict: true });
//       // }

//       // const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
//       // const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

//       // if (imageFiles.length) {
//       //   updateData.images = imageFiles.map(toBase64);
//       // }
//       // if (floorplanFile) {
//       //   updateData.floorplan = toBase64(floorplanFile);
//       // }
//       // In properties PUT — replace the slug regeneration block
//       if (req.body.title) {
//         const newSlug = slugify(req.body.title, { lower: true, strict: true });
//         const existing = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
//         if (!existing) {
//           updateData.slug = newSlug;
//         }
//       } else {
//         delete updateData.slug;
//       }

//       if (req.body.features) updateData.features = JSON.parse(req.body.features);
//       if (req.body.beds) updateData.beds = Number(req.body.beds);
//       if (req.body.baths) updateData.baths = Number(req.body.baths);
//       if (req.body.year) updateData.year = Number(req.body.year);
//       if (req.body.order) updateData.order = Number(req.body.order);
//       if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
//       if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

//       const property = await Property.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true, runValidators: true }
//       );
//       if (!property) { res.status(404).json({ message: 'Not found' }); return; }
//       res.json(property);
//     } catch (error) {
//       console.error('Property update error:', error);
//       res.status(500).json({ message: 'Failed to update property' });
//     }
//   }
// );

// // DELETE /api/properties/:id — admin only
// router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   const property = await Property.findByIdAndDelete(req.params.id);
//   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
//   res.json({ message: 'Property deleted' });
// });

// export default router;
import { Router, Response, Request } from 'express';
import slugify from 'slugify';
import multer from 'multer';
import Property from '../models/Property';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024,
    files: 11,
  },
  fileFilter: (_req, file, cb) => {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files allowed'));
  },
});

const toBase64 = (file: Express.Multer.File): string =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

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

// GET /api/properties/:slug — single public
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
  if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
  res.json(property);
});

// POST /api/properties — admin only
router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
    const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

    const slug = slugify(req.body.title, { lower: true, strict: true });
    const features = req.body.features ? JSON.parse(req.body.features) : [];

    const property = await Property.create({
      ...req.body,
      slug,
      images: imageFiles.map(toBase64),
      floorplan: floorplanFile ? toBase64(floorplanFile) : undefined,
      features,
      beds: Number(req.body.beds),
      baths: Number(req.body.baths),
      year: Number(req.body.year),
      order: Number(req.body.order) || 0,
      isFeatured: req.body.isFeatured === 'true',
      isPublished: req.body.isPublished === 'true',
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('Property create error:', error);
    res.status(500).json({ message: 'Failed to create property' });
  }
});

// PUT /api/properties/:id — admin only
router.put('/:id', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const updateData: Record<string, unknown> = { ...req.body };

    // Only update slug if title changed AND new slug doesn't conflict with another property
    if (req.body.title) {
      const newSlug = slugify(req.body.title, { lower: true, strict: true });
      const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (!conflict) updateData.slug = newSlug;
      else delete updateData.slug;
    } else {
      delete updateData.slug;
    }

    const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
    const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

    if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
    if (floorplanFile) updateData.floorplan = toBase64(floorplanFile);

    if (req.body.features) updateData.features = JSON.parse(req.body.features);
    if (req.body.beds) updateData.beds = Number(req.body.beds);
    if (req.body.baths) updateData.baths = Number(req.body.baths);
    if (req.body.year) updateData.year = Number(req.body.year);
    if (req.body.order) updateData.order = Number(req.body.order);
    if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
    if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!property) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(property);
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id — admin only
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) { res.status(404).json({ message: 'Not found' }); return; }
  res.json({ message: 'Property deleted' });
});

export default router;