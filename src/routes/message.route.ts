import { getAvailableContacts, getConversation, getConversations, markAsRead, sendMessage } from '../controllers/message.controller';
import { Router } from 'express';


const router = Router();

// // تطبيق المصادقة على جميع المسارات
// router.use(deserializeUser, requireUser());

/**
 * @route GET /api/messages
 * @desc الحصول على جميع المحادثات (الركاب: مع السائقين فقط، السائقين: مع الركاب والمشرفين)
 * @access راكب / سائق / مشرف
 */
router.get('/', getConversations);
router.get('/contact', getAvailableContacts);

/**
 * @route GET /api/messages/:tripId/:userId
 * @desc الحصول على محادثة محددة مع التحقق من الصلاحيات
 * @access راكب / سائق / مشرف
 * @params tripId (اختياري للسائق-مشرف)
 */
router.get('/:tripId/:userId', getConversation);
router.get('/y/:userId', getConversation);

/**
 * @route POST /api/messages
 * @desc إرسال رسالة جديدة (مع التحقق من الصلاحيات)
 * @access راكب / سائق / مشرف
 * @body { receiverId, tripId?, content }
 */
router.post('/', sendMessage);

/**
 * @route PATCH /api/messages/:messageId/read
 * @desc تحديث حالة الرسالة كمقروءة
 * @access مالك الرسالة فقط
 */
router.patch('/:messageId/read', markAsRead);

/**
 * @route DELETE /api/messages/:messageId
 * @desc حذف رسالة (المالك أو المشرف فقط)
 * @access مالك الرسالة / مشرف
 */
// router.delete('/:messageId', deleteMessage);

export default router;