// // // // // // import { Router, Response, Request } from 'express';
// // // // // // import slugify from 'slugify';
// // // // // // import Property from '../models/Property';
// // // // // // import { protect, AuthRequest } from '../middleware/auth';

// // // // // // const router = Router();

// // // // // // // GET /api/properties — public
// // // // // // router.get('/', async (req: Request, res: Response) => {
// // // // // //   const { type, status, featured } = req.query;
// // // // // //   const filter: Record<string, unknown> = { isPublished: true };
// // // // // //   if (type) filter.type = type;
// // // // // //   if (status) filter.status = status;
// // // // // //   if (featured === 'true') filter.isFeatured = true;
// // // // // //   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
// // // // // //   res.json(properties);
// // // // // // });

// // // // // // // GET /api/properties/:slug — single property (public)
// // // // // // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// // // // // //   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// // // // // //   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// // // // // //   res.json(property);
// // // // // // });

// // // // // // // POST /api/properties — admin only
// // // // // // router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // // // // //   const slug = slugify(req.body.title, { lower: true, strict: true });
// // // // // //   const property = await Property.create({ ...req.body, slug });
// // // // // //   res.status(201).json(property);
// // // // // // });

// // // // // // // PUT /api/properties/:id — admin only
// // // // // // router.put('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // // // // //   if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
// // // // // //   const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
// // // // // //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // // // //   res.json(property);
// // // // // // });

// // // // // // // DELETE /api/properties/:id — admin only
// // // // // // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // // // // //   const property = await Property.findByIdAndDelete(req.params.id);
// // // // // //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // // // //   res.json({ message: 'Property deleted' });
// // // // // // });

// // // // // // export default router;
// // // // // import { Router, Response, Request } from 'express';
// // // // // import slugify from 'slugify';
// // // // // import multer from 'multer';
// // // // // import Property from '../models/Property';
// // // // // import { protect, AuthRequest } from '../middleware/auth';

// // // // // const router = Router();

// // // // // // Multer — memory storage, no Cloudinary
// // // // // // const upload = multer({
// // // // // //   storage: multer.memoryStorage(),
// // // // // //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
// // // // // //   fileFilter: (_req, file, cb) => {
// // // // // //     file.mimetype.startsWith('image/')
// // // // // //       ? cb(null, true)
// // // // // //       : cb(new Error('Only image files allowed'));
// // // // // //   },
// // // // // // });
// // // // // const upload = multer({
// // // // //   storage: multer.memoryStorage(),
// // // // //   limits: {
// // // // //     fileSize: 10 * 1024 * 1024,    // 10MB per file
// // // // //     fieldSize: 50 * 1024 * 1024,   // 50MB for field values (covers Base64 strings)
// // // // //     files: 11,                      // max 10 images + 1 floorplan
// // // // //   },
// // // // //   fileFilter: (_req, file, cb) => {
// // // // //     file.mimetype.startsWith('image/')
// // // // //       ? cb(null, true)
// // // // //       : cb(new Error('Only image files allowed'));
// // // // //   },
// // // // // });

// // // // // // Helper — convert buffer to Base64 data URI
// // // // // const toBase64 = (file: Express.Multer.File): string => {
// // // // //   return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// // // // // };

// // // // // // GET /api/properties — public
// // // // // router.get('/', async (req: Request, res: Response) => {
// // // // //   const { type, status, featured } = req.query;
// // // // //   const filter: Record<string, unknown> = { isPublished: true };
// // // // //   if (type) filter.type = type;
// // // // //   if (status) filter.status = status;
// // // // //   if (featured === 'true') filter.isFeatured = true;
// // // // //   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
// // // // //   res.json(properties);
// // // // // });

// // // // // // GET /api/properties/:slug — single (public)
// // // // // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// // // // //   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// // // // //   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// // // // //   res.json(property);
// // // // // });

// // // // // // POST /api/properties — admin only
// // // // // router.post(
// // // // //   '/',
// // // // //   protect,
// // // // //   upload.any(),
// // // // //   async (req: AuthRequest, res: Response): Promise<void> => {
// // // // //     try {
// // // // //       const files = req.files as Express.Multer.File[];

// // // // //       // Separate images from floorplan by fieldname
// // // // //       const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // // // //       const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

// // // // //       const imageBase64: string[] = imageFiles.map(toBase64);
// // // // //       const floorplanBase64: string | undefined = floorplanFile
// // // // //         ? toBase64(floorplanFile)
// // // // //         : undefined;

// // // // //       const slug = slugify(req.body.title, { lower: true, strict: true });

// // // // //       const features = req.body.features
// // // // //         ? JSON.parse(req.body.features)
// // // // //         : [];

// // // // //       const property = await Property.create({
// // // // //         ...req.body,
// // // // //         slug,
// // // // //         images: imageBase64,
// // // // //         floorplan: floorplanBase64,
// // // // //         features,
// // // // //         beds: Number(req.body.beds),
// // // // //         baths: Number(req.body.baths),
// // // // //         year: Number(req.body.year),
// // // // //         order: Number(req.body.order) || 0,
// // // // //         isFeatured: req.body.isFeatured === 'true',
// // // // //         isPublished: req.body.isPublished === 'true',
// // // // //       });

// // // // //       res.status(201).json(property);
// // // // //     } catch (error) {
// // // // //       console.error('Property create error:', error);
// // // // //       res.status(500).json({ message: 'Failed to create property' });
// // // // //     }
// // // // //   }
// // // // // );

// // // // // // PUT /api/properties/:id — admin only
// // // // // router.put(
// // // // //   '/:id',
// // // // //   protect,
// // // // //   upload.any(),
// // // // //   async (req: AuthRequest, res: Response): Promise<void> => {
// // // // //     try {
// // // // //       const files = req.files as Express.Multer.File[];
// // // // //       const updateData: Record<string, unknown> = { ...req.body };

// // // // //       // if (req.body.title) {
// // // // //       //   updateData.slug = slugify(req.body.title, { lower: true, strict: true });
// // // // //       // }

// // // // //       // const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // // // //       // const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

// // // // //       // if (imageFiles.length) {
// // // // //       //   updateData.images = imageFiles.map(toBase64);
// // // // //       // }
// // // // //       // if (floorplanFile) {
// // // // //       //   updateData.floorplan = toBase64(floorplanFile);
// // // // //       // }
// // // // //       // In properties PUT — replace the slug regeneration block
// // // // //       if (req.body.title) {
// // // // //         const newSlug = slugify(req.body.title, { lower: true, strict: true });
// // // // //         const existing = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
// // // // //         if (!existing) {
// // // // //           updateData.slug = newSlug;
// // // // //         }
// // // // //       } else {
// // // // //         delete updateData.slug;
// // // // //       }

// // // // //       if (req.body.features) updateData.features = JSON.parse(req.body.features);
// // // // //       if (req.body.beds) updateData.beds = Number(req.body.beds);
// // // // //       if (req.body.baths) updateData.baths = Number(req.body.baths);
// // // // //       if (req.body.year) updateData.year = Number(req.body.year);
// // // // //       if (req.body.order) updateData.order = Number(req.body.order);
// // // // //       if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
// // // // //       if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

// // // // //       const property = await Property.findByIdAndUpdate(
// // // // //         req.params.id,
// // // // //         updateData,
// // // // //         { new: true, runValidators: true }
// // // // //       );
// // // // //       if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // // //       res.json(property);
// // // // //     } catch (error) {
// // // // //       console.error('Property update error:', error);
// // // // //       res.status(500).json({ message: 'Failed to update property' });
// // // // //     }
// // // // //   }
// // // // // );

// // // // // // DELETE /api/properties/:id — admin only
// // // // // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // // // //   const property = await Property.findByIdAndDelete(req.params.id);
// // // // //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // // //   res.json({ message: 'Property deleted' });
// // // // // });

// // // // // export default router;
// // // // import { Router, Response, Request } from 'express';
// // // // import slugify from 'slugify';
// // // // import multer from 'multer';
// // // // import Property from '../models/Property';
// // // // import { protect, AuthRequest } from '../middleware/auth';

// // // // const router = Router();

// // // // const upload = multer({
// // // //   storage: multer.memoryStorage(),
// // // //   limits: {
// // // //     fileSize: 10 * 1024 * 1024,
// // // //     fieldSize: 50 * 1024 * 1024,
// // // //     files: 11,
// // // //   },
// // // //   fileFilter: (_req, file, cb) => {
// // // //     file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files allowed'));
// // // //   },
// // // // });

// // // // const toBase64 = (file: Express.Multer.File): string =>
// // // //   `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// // // // // GET /api/properties — public
// // // // router.get('/', async (req: Request, res: Response) => {
// // // //   const { type, status, featured } = req.query;
// // // //   const filter: Record<string, unknown> = { isPublished: true };
// // // //   if (type) filter.type = type;
// // // //   if (status) filter.status = status;
// // // //   if (featured === 'true') filter.isFeatured = true;
// // // //   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
// // // //   res.json(properties);
// // // // });

// // // // // GET /api/properties/:slug — single public
// // // // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// // // //   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// // // //   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// // // //   res.json(property);
// // // // });

// // // // // POST /api/properties — admin only
// // // // router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// // // //   try {
// // // //     const files = req.files as Express.Multer.File[];
// // // //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // // //     const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

// // // //     const slug = slugify(req.body.title, { lower: true, strict: true });
// // // //     const features = req.body.features ? JSON.parse(req.body.features) : [];

// // // //     const property = await Property.create({
// // // //       ...req.body,
// // // //       slug,
// // // //       images: imageFiles.map(toBase64),
// // // //       floorplan: floorplanFile ? toBase64(floorplanFile) : undefined,
// // // //       features,
// // // //       beds: Number(req.body.beds),
// // // //       baths: Number(req.body.baths),
// // // //       year: Number(req.body.year),
// // // //       order: Number(req.body.order) || 0,
// // // //       isFeatured: req.body.isFeatured === 'true',
// // // //       isPublished: req.body.isPublished === 'true',
// // // //     });

// // // //     res.status(201).json(property);
// // // //   } catch (error) {
// // // //     console.error('Property create error:', error);
// // // //     res.status(500).json({ message: 'Failed to create property' });
// // // //   }
// // // // });

// // // // // PUT /api/properties/:id — admin only
// // // // router.put('/:id', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// // // //   try {
// // // //     const files = req.files as Express.Multer.File[];
// // // //     const updateData: Record<string, unknown> = { ...req.body };

// // // //     // Only update slug if title changed AND new slug doesn't conflict with another property
// // // //     if (req.body.title) {
// // // //       const newSlug = slugify(req.body.title, { lower: true, strict: true });
// // // //       const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
// // // //       if (!conflict) updateData.slug = newSlug;
// // // //       else delete updateData.slug;
// // // //     } else {
// // // //       delete updateData.slug;
// // // //     }

// // // //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // // //     const floorplanFile = files?.find(f => f.fieldname === 'floorplan');

// // // //     if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
// // // //     if (floorplanFile) updateData.floorplan = toBase64(floorplanFile);

// // // //     if (req.body.features) updateData.features = JSON.parse(req.body.features);
// // // //     if (req.body.beds) updateData.beds = Number(req.body.beds);
// // // //     if (req.body.baths) updateData.baths = Number(req.body.baths);
// // // //     if (req.body.year) updateData.year = Number(req.body.year);
// // // //     if (req.body.order) updateData.order = Number(req.body.order);
// // // //     if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
// // // //     if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

// // // //     const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
// // // //     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // //     res.json(property);
// // // //   } catch (error) {
// // // //     console.error('Property update error:', error);
// // // //     res.status(500).json({ message: 'Failed to update property' });
// // // //   }
// // // // });

// // // // // DELETE /api/properties/:id — admin only
// // // // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // // //   const property = await Property.findByIdAndDelete(req.params.id);
// // // //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // // //   res.json({ message: 'Property deleted' });
// // // // });

// // // // export default router;
// // // import { Router, Response, Request } from 'express';
// // // import slugify from 'slugify';
// // // import multer from 'multer';
// // // import Property from '../models/Property';
// // // import { protect, AuthRequest } from '../middleware/auth';

// // // const router = Router();

// // // const upload = multer({
// // //   storage: multer.memoryStorage(),
// // //   limits: {
// // //     fileSize: 20 * 1024 * 1024,   // 20MB per file (covers PDFs)
// // //     fieldSize: 50 * 1024 * 1024,  // 50MB field size
// // //     files: 12,                     // up to 10 images + 1 brochure + buffer
// // //   },
// // //   fileFilter: (_req, file, cb) => {
// // //     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
// // //     if (allowed.includes(file.mimetype)) {
// // //       cb(null, true);
// // //     } else {
// // //       cb(new Error('Only images (JPG, PNG, WebP) and PDF files are allowed'));
// // //     }
// // //   },
// // // });

// // // const toBase64 = (file: Express.Multer.File): string =>
// // //   `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// // // // GET /api/properties — public
// // // router.get('/', async (req: Request, res: Response) => {
// // //   const { city, propertyType, projectStatus, featured } = req.query;
// // //   const filter: Record<string, unknown> = { isPublished: true };
// // //   if (city) filter.city = city;
// // //   if (propertyType) filter.propertyType = propertyType;
// // //   if (projectStatus) filter.projectStatus = projectStatus;
// // //   if (featured === 'true') filter.isFeatured = true;
// // //   const properties = await Property.find(filter).sort({ order: 1, createdAt: -1 });
// // //   res.json(properties);
// // // });

// // // // GET /api/properties/:slug — single public
// // // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// // //   const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// // //   if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// // //   res.json(property);
// // // });

// // // // POST /api/properties — admin only
// // // router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// // //   try {
// // //     const files = req.files as Express.Multer.File[];

// // //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // //     const brochureFile = files?.find(f => f.fieldname === 'brochure');

// // //     // unitTypes comes as JSON string from form-data
// // //     const unitTypes = req.body.unitTypes
// // //       ? JSON.parse(req.body.unitTypes)
// // //       : [];

// // //     const slug = slugify(req.body.title, { lower: true, strict: true });

// // //     const property = await Property.create({
// // //       ...req.body,
// // //       slug,
// // //       images: imageFiles.map(toBase64),
// // //       brochureUrl: brochureFile ? toBase64(brochureFile) : undefined,
// // //       unitTypes,
// // //       order: Number(req.body.order) || 0,
// // //       isFeatured: req.body.isFeatured === 'true',
// // //       isPublished: req.body.isPublished === 'true',
// // //     });

// // //     res.status(201).json(property);
// // //   } catch (error) {
// // //     console.error('Property create error:', error);
// // //     res.status(500).json({ message: 'Failed to create property' });
// // //   }
// // // });

// // // // PUT /api/properties/:id — admin only
// // // router.put('/:id', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// // //   try {
// // //     const files = req.files as Express.Multer.File[];
// // //     const updateData: Record<string, unknown> = { ...req.body };

// // //     // Slug — only update if title changed and no conflict
// // //     if (req.body.title) {
// // //       const newSlug = slugify(req.body.title, { lower: true, strict: true });
// // //       const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
// // //       if (!conflict) updateData.slug = newSlug;
// // //       else delete updateData.slug;
// // //     } else {
// // //       delete updateData.slug;
// // //     }

// // //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// // //     const brochureFile = files?.find(f => f.fieldname === 'brochure');

// // //     if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
// // //     if (brochureFile) updateData.brochureUrl = toBase64(brochureFile);

// // //     if (req.body.unitTypes) updateData.unitTypes = JSON.parse(req.body.unitTypes);
// // //     if (req.body.order) updateData.order = Number(req.body.order);
// // //     if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
// // //     if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

// // //     const property = await Property.findByIdAndUpdate(
// // //       req.params.id,
// // //       updateData,
// // //       { new: true, runValidators: true }
// // //     );
// // //     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // //     res.json(property);
// // //   } catch (error) {
// // //     console.error('Property update error:', error);
// // //     res.status(500).json({ message: 'Failed to update property' });
// // //   }
// // // });

// // // // DELETE /api/properties/:id — admin only
// // // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// // //   const property = await Property.findByIdAndDelete(req.params.id);
// // //   if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// // //   res.json({ message: 'Property deleted' });
// // // });

// // // export default router;
// // import { Router, Response, Request } from 'express';
// // import slugify from 'slugify';
// // import multer from 'multer';
// // import Property from '../models/Property';
// // import { protect, AuthRequest } from '../middleware/auth';

// // const router = Router();

// // const upload = multer({
// //   storage: multer.memoryStorage(),
// //   limits: {
// //     fileSize: 20 * 1024 * 1024,   // 20MB per file (covers PDFs)
// //     fieldSize: 50 * 1024 * 1024,  // 50MB field size
// //     files: 12,                     // up to 10 images + 1 brochure + buffer
// //   },
// //   fileFilter: (_req, file, cb) => {
// //     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
// //     if (allowed.includes(file.mimetype)) {
// //       cb(null, true);
// //     } else {
// //       cb(new Error('Only images (JPG, PNG, WebP) and PDF files are allowed'));
// //     }
// //   },
// // });

// // const toBase64 = (file: Express.Multer.File): string =>
// //   `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// // // GET /api/properties — public (list view)
// // router.get('/', async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const { city, propertyType, projectStatus, featured, page, limit } = req.query;

// //     const filter: Record<string, unknown> = { isPublished: true };
// //     if (city) filter.city = city;
// //     if (propertyType) filter.propertyType = propertyType;
// //     if (projectStatus) filter.projectStatus = projectStatus;
// //     if (featured === 'true') filter.isFeatured = true;

// //     // Pagination — defaults keep the sort set small so it never hits the
// //     // in-memory sort limit again, regardless of how large documents get
// //     const pageNum = Math.max(1, Number(page) || 1);
// //     const pageSize = Math.min(100, Math.max(1, Number(limit) || 50));
// //     const skip = (pageNum - 1) * pageSize;

// //     const [properties, total] = await Promise.all([
// //       Property.find(filter)
// //         // Exclude the heavy base64 image/brochure fields from list results —
// //         // this is the main fix: those fields are what were blowing the
// //         // 32MB in-memory sort limit. Detail page still returns them.
// //         .select('-images -brochureUrl')
// //         .sort({ order: 1, createdAt: -1 })
// //         .skip(skip)
// //         .limit(pageSize),
// //       Property.countDocuments(filter),
// //     ]);

// //     res.json({
// //       properties,
// //       pagination: {
// //         page: pageNum,
// //         limit: pageSize,
// //         total,
// //         pages: Math.ceil(total / pageSize),
// //       },
// //     });
// //   } catch (error) {
// //     console.error('Property list error:', error);
// //     res.status(500).json({ message: 'Failed to fetch properties' });
// //   }
// // });

// // // GET /api/properties/:slug — single public (full detail, including images)
// // router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
// //   try {
// //     const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
// //     if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
// //     res.json(property);
// //   } catch (error) {
// //     console.error('Property fetch error:', error);
// //     res.status(500).json({ message: 'Failed to fetch property' });
// //   }
// // });

// // // POST /api/properties — admin only
// // router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// //   try {
// //     const files = req.files as Express.Multer.File[];

// //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// //     const brochureFile = files?.find(f => f.fieldname === 'brochure');

// //     // unitTypes comes as JSON string from form-data
// //     const unitTypes = req.body.unitTypes
// //       ? JSON.parse(req.body.unitTypes)
// //       : [];

// //     const slug = slugify(req.body.title, { lower: true, strict: true });

// //     const property = await Property.create({
// //       ...req.body,
// //       slug,
// //       images: imageFiles.map(toBase64),
// //       brochureUrl: brochureFile ? toBase64(brochureFile) : undefined,
// //       unitTypes,
// //       order: Number(req.body.order) || 0,
// //       isFeatured: req.body.isFeatured === 'true',
// //       isPublished: req.body.isPublished === 'true',
// //     });

// //     res.status(201).json(property);
// //   } catch (error) {
// //     console.error('Property create error:', error);
// //     res.status(500).json({ message: 'Failed to create property' });
// //   }
// // });

// // // PUT /api/properties/:id — admin only
// // router.put('/:id', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
// //   try {
// //     const files = req.files as Express.Multer.File[];
// //     const updateData: Record<string, unknown> = { ...req.body };

// //     // Slug — only update if title changed and no conflict
// //     if (req.body.title) {
// //       const newSlug = slugify(req.body.title, { lower: true, strict: true });
// //       const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
// //       if (!conflict) updateData.slug = newSlug;
// //       else delete updateData.slug;
// //     } else {
// //       delete updateData.slug;
// //     }

// //     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
// //     const brochureFile = files?.find(f => f.fieldname === 'brochure');

// //     if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
// //     if (brochureFile) updateData.brochureUrl = toBase64(brochureFile);

// //     if (req.body.unitTypes) updateData.unitTypes = JSON.parse(req.body.unitTypes);
// //     if (req.body.order) updateData.order = Number(req.body.order);
// //     if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
// //     if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

// //     const property = await Property.findByIdAndUpdate(
// //       req.params.id,
// //       updateData,
// //       { new: true, runValidators: true }
// //     );
// //     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// //     res.json(property);
// //   } catch (error) {
// //     console.error('Property update error:', error);
// //     res.status(500).json({ message: 'Failed to update property' });
// //   }
// // });

// // // DELETE /api/properties/:id — admin only
// // router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
// //   try {
// //     const property = await Property.findByIdAndDelete(req.params.id);
// //     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
// //     res.json({ message: 'Property deleted' });
// //   } catch (error) {
// //     console.error('Property delete error:', error);
// //     res.status(500).json({ message: 'Failed to delete property' });
// //   }
// // });

// // export default router;
// import { Router, Response, Request } from 'express';
// import slugify from 'slugify';
// import multer from 'multer';
// import Property from '../models/Property';
// import { protect, AuthRequest } from '../middleware/auth';

// const router = Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 20 * 1024 * 1024,   // 20MB per file (covers PDFs)
//     fieldSize: 50 * 1024 * 1024,  // 50MB field size
//     files: 12,                     // up to 10 images + 1 brochure + buffer
//   },
//   fileFilter: (_req, file, cb) => {
//     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
//     if (allowed.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images (JPG, PNG, WebP) and PDF files are allowed'));
//     }
//   },
// });

// const toBase64 = (file: Express.Multer.File): string =>
//   `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// // GET /api/properties — public (list view)
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { city, propertyType, projectStatus, featured, page, limit } = req.query;

//     const filter: Record<string, unknown> = { isPublished: true };
//     if (city) filter.city = city;
//     if (propertyType) filter.propertyType = propertyType;
//     if (projectStatus) filter.projectStatus = projectStatus;
//     if (featured === 'true') filter.isFeatured = true;

//     // Pagination — defaults keep the sort set small so it never hits the
//     // in-memory sort limit again, regardless of how large documents get
//     const pageNum = Math.max(1, Number(page) || 1);
//     const pageSize = Math.min(100, Math.max(1, Number(limit) || 50));
//     const skip = (pageNum - 1) * pageSize;

//     const [properties, total] = await Promise.all([
//       Property.find(filter)
//         // Exclude only brochureUrl (large PDF, never needed on a card) from
//         // list results. Now that the model has an index covering this
//         // filter+sort shape, Mongo sorts using the index rather than loading
//         // full documents into memory, so we no longer need to strip images
//         // entirely to avoid the crash.
//         .select('-brochureUrl')
//         .sort({ order: 1, createdAt: -1 })
//         .skip(skip)
//         .limit(pageSize),
//       Property.countDocuments(filter),
//     ]);

//     // Trim each property's images down to a single thumbnail for the list
//     // view — cards only need one image, no need to ship the whole array.
//     const trimmed = properties.map((p) => {
//       const obj = p.toObject();
//       return { ...obj, images: obj.images?.length ? [obj.images[0]] : [] };
//     });

//     res.json({
//       properties: trimmed,
//       pagination: {
//         page: pageNum,
//         limit: pageSize,
//         total,
//         pages: Math.ceil(total / pageSize),
//       },
//     });
//   } catch (error) {
//     console.error('Property list error:', error);
//     res.status(500).json({ message: 'Failed to fetch properties' });
//   }
// });

// // GET /api/properties/:slug — single public (full detail, including images)
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
//     if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
//     res.json(property);
//   } catch (error) {
//     console.error('Property fetch error:', error);
//     res.status(500).json({ message: 'Failed to fetch property' });
//   }
// });

// // POST /api/properties — admin only
// router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
//     const brochureFile = files?.find(f => f.fieldname === 'brochure');

//     // unitTypes comes as JSON string from form-data
//     const unitTypes = req.body.unitTypes
//       ? JSON.parse(req.body.unitTypes)
//       : [];

//     const slug = slugify(req.body.title, { lower: true, strict: true });

//     const property = await Property.create({
//       ...req.body,
//       slug,
//       images: imageFiles.map(toBase64),
//       brochureUrl: brochureFile ? toBase64(brochureFile) : undefined,
//       unitTypes,
//       order: Number(req.body.order) || 0,
//       isFeatured: req.body.isFeatured === 'true',
//       isPublished: req.body.isPublished === 'true',
//     });

//     res.status(201).json(property);
//   } catch (error) {
//     console.error('Property create error:', error);
//     res.status(500).json({ message: 'Failed to create property' });
//   }
// });

// // PUT /api/properties/:id — admin only
// router.put('/:id', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     const updateData: Record<string, unknown> = { ...req.body };

//     // Slug — only update if title changed and no conflict
//     if (req.body.title) {
//       const newSlug = slugify(req.body.title, { lower: true, strict: true });
//       const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
//       if (!conflict) updateData.slug = newSlug;
//       else delete updateData.slug;
//     } else {
//       delete updateData.slug;
//     }

//     const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
//     const brochureFile = files?.find(f => f.fieldname === 'brochure');

//     if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
//     if (brochureFile) updateData.brochureUrl = toBase64(brochureFile);

//     if (req.body.unitTypes) updateData.unitTypes = JSON.parse(req.body.unitTypes);
//     if (req.body.order) updateData.order = Number(req.body.order);
//     if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
//     if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

//     const property = await Property.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );
//     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
//     res.json(property);
//   } catch (error) {
//     console.error('Property update error:', error);
//     res.status(500).json({ message: 'Failed to update property' });
//   }
// });

// // DELETE /api/properties/:id — admin only
// router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const property = await Property.findByIdAndDelete(req.params.id);
//     if (!property) { res.status(404).json({ message: 'Not found' }); return; }
//     res.json({ message: 'Property deleted' });
//   } catch (error) {
//     console.error('Property delete error:', error);
//     res.status(500).json({ message: 'Failed to delete property' });
//   }
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
    fileSize: 20 * 1024 * 1024,   // 20MB per file (covers PDFs)
    fieldSize: 50 * 1024 * 1024,  // 50MB field size
    files: 12,                     // up to 10 images + 1 brochure + buffer
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPG, PNG, WebP) and PDF files are allowed'));
    }
  },
});

const toBase64 = (file: Express.Multer.File): string =>
  `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

// GET /api/properties — public (list view)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, propertyType, projectStatus, featured, page, limit } = req.query;

    const filter: Record<string, unknown> = { isPublished: true };
    if (city) filter.city = city;
    if (propertyType) filter.propertyType = propertyType;
    if (projectStatus) filter.projectStatus = projectStatus;
    if (featured === 'true') filter.isFeatured = true;

    // Pagination — defaults keep the sort set small so it never hits the
    // in-memory sort limit again, regardless of how large documents get
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * pageSize;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        // Exclude only brochureUrl (large PDF, never needed on a card) from
        // list results. Now that the model has an index covering this
        // filter+sort shape, Mongo sorts using the index rather than loading
        // full documents into memory, so we no longer need to strip images
        // entirely to avoid the crash.
        .select('-brochureUrl')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      Property.countDocuments(filter),
    ]);

    // Trim each property's images down to a single thumbnail for the list
    // view — cards only need one image, no need to ship the whole array.
    const trimmed = properties.map((p) => {
      const obj = p.toObject();
      return { ...obj, images: obj.images?.length ? [obj.images[0]] : [] };
    });

    res.json({
      properties: trimmed,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Property list error:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// GET /api/properties/admin — protected, full data for the admin panel.
// Unlike the public list route, this returns ALL properties (including
// drafts / isPublished:false) with complete images arrays and brochureUrl,
// so the admin grid and edit form have everything they need. Must be
// declared before /:slug or Express would treat "admin" as a slug value.
router.get('/admin', protect, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const properties = await Property.find({}).sort({ order: 1, createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Admin property list error:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:slug — single public (full detail, including images)
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findOne({ slug: req.params.slug, isPublished: true });
    if (!property) { res.status(404).json({ message: 'Property not found' }); return; }
    res.json(property);
  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
});

// POST /api/properties — admin only
router.post('/', protect, upload.any(), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
    const brochureFile = files?.find(f => f.fieldname === 'brochure');

    // unitTypes comes as JSON string from form-data
    const unitTypes = req.body.unitTypes
      ? JSON.parse(req.body.unitTypes)
      : [];

    const slug = slugify(req.body.title, { lower: true, strict: true });

    const property = await Property.create({
      ...req.body,
      slug,
      images: imageFiles.map(toBase64),
      brochureUrl: brochureFile ? toBase64(brochureFile) : undefined,
      unitTypes,
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

    // Slug — only update if title changed and no conflict
    if (req.body.title) {
      const newSlug = slugify(req.body.title, { lower: true, strict: true });
      const conflict = await Property.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (!conflict) updateData.slug = newSlug;
      else delete updateData.slug;
    } else {
      delete updateData.slug;
    }

    const imageFiles = files?.filter(f => f.fieldname === 'images') || [];
    const brochureFile = files?.find(f => f.fieldname === 'brochure');

    if (imageFiles.length) updateData.images = imageFiles.map(toBase64);
    if (brochureFile) updateData.brochureUrl = toBase64(brochureFile);

    if (req.body.unitTypes) updateData.unitTypes = JSON.parse(req.body.unitTypes);
    if (req.body.order) updateData.order = Number(req.body.order);
    if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true';
    if (req.body.isPublished !== undefined) updateData.isPublished = req.body.isPublished === 'true';

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!property) { res.status(404).json({ message: 'Not found' }); return; }
    res.json(property);
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id — admin only
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) { res.status(404).json({ message: 'Not found' }); return; }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    console.error('Property delete error:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

export default router;
