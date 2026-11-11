import { Router } from 'express';
import authRoutes from './auth.routes.js';
import collegeRoutes from './college.routes.js';
import verificationRoutes from './verification.routes.js';
import serviceRoutes from './service.routes.js';
import proposalRoutes from './proposal.routes.js';
import marketRoutes from './market.routes.js';
import socialRoutes from './social.routes.js';
import commentRoutes from './comment.routes.js';
import noticeRoutes from './notice.routes.js';
import messageRoutes from './message.routes.js';
import userRoutes from './user.routes.js';
import notificationRoutes from './notification.routes.js';
import reviewRoutes from './review.routes.js';
import exploreRoutes from './explore.routes.js';
import uploadRoutes from './upload.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';
import { protect } from '../middleware/auth.js';
import { requireVerifiedCollege } from '../middleware/collegeAccess.js';
import { requireAdmin } from '../middleware/roles.js';

const router = Router();

/* Public */
router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/explore', exploreRoutes);

/* Verified, college-scoped */
router.use('/services', protect, requireVerifiedCollege, serviceRoutes);
router.use('/proposals', protect, requireVerifiedCollege, proposalRoutes);
router.use('/market', protect, requireVerifiedCollege, marketRoutes);
router.use('/social', protect, requireVerifiedCollege, socialRoutes);
router.use('/comments', protect, requireVerifiedCollege, commentRoutes);
router.use('/notices', protect, requireVerifiedCollege, noticeRoutes);
router.use('/messages', protect, requireVerifiedCollege, messageRoutes);
router.use('/users', protect, requireVerifiedCollege, userRoutes);
router.use('/reviews', protect, requireVerifiedCollege, reviewRoutes);
router.use('/uploads', protect, requireVerifiedCollege, uploadRoutes);
router.use('/reports', protect, reportRoutes);

/* Authenticated, any status */
router.use('/notifications', protect, notificationRoutes);
router.use('/verification', protect, verificationRoutes);

/* Admin */
router.use('/admin', protect, requireAdmin, adminRoutes);

export default router;