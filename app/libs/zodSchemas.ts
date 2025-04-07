import { z } from 'zod';

/**
 * User registration form schema
 * 
 * Enforces:
 * - Email format validation
 * - Name length requirements (2-50 characters)
 * - Password complexity (min 8 chars, at least one number, one uppercase)
 */
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'الاسم يجب أن يكون أكثر من حرفين' })
    .max(50, { message: 'الاسم طويل جداً' }),
  email: z.string()
    .email({ message: 'بريد إلكتروني غير صالح' }),
  password: z.string()
    .min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    .regex(/[A-Z]/, { message: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل' })
    .regex(/[0-9]/, { message: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل' })
});

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'بريد إلكتروني غير صالح' }),
  password: z.string()
    .min(1, { message: 'كلمة المرور مطلوبة' })
});

/**
 * Listing creation schema
 * 
 * Validates all required fields for creating a new property listing
 */
export const listingSchema = z.object({
  category: z.string({ required_error: 'يرجى اختيار الفئة' }),
  location: z.object({
    value: z.string({ required_error: 'يرجى تحديد الموقع' }),
    label: z.string()
  }),
  guestCount: z.number().int().positive(),
  roomCount: z.number().int().positive(),
  bathroomCount: z.number().int().positive(),
  imageSrc: z.array(z.string()).min(1, { message: 'يرجى تحميل صورة واحدة على الأقل' }),
  price: z.string().or(z.number()).pipe(
    z.coerce.number().positive({ message: 'يجب أن يكون السعر أكبر من صفر' })
  ),
  title: z.string().min(5, { message: 'العنوان يجب أن يكون 5 أحرف على الأقل' })
    .max(100, { message: 'العنوان طويل جداً' }),
  description: z.string()
    .min(20, { message: 'الوصف يجب أن يكون 20 حرف على الأقل' })
    .max(1000, { message: 'الوصف طويل جداً' }),
  phone: z.string()
    .regex(/^\d{9,15}$/, { message: 'رقم هاتف غير صالح' }),
  paymentMethod: z.string({ required_error: 'يرجى تحديد طريقة الدفع' })
});

/**
 * Reservation creation schema
 */
export const reservationSchema = z.object({
  listingId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  totalPrice: z.number().positive()
}).refine(data => data.endDate > data.startDate, {
  message: "تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول",
  path: ["endDate"]
});

/**
 * Search parameters schema for filtering listings
 */
export const searchSchema = z.object({
  location: z.object({
    value: z.string(),
    label: z.string()
  }).optional(),
  guestCount: z.number().int().min(1).optional(),
  roomCount: z.number().int().min(1).optional(),
  bathroomCount: z.number().int().min(1).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  category: z.string().optional()
}); 