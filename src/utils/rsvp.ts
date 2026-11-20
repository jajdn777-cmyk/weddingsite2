export type AttendanceStatus = 'attending' | 'declining';

export interface RsvpInput {
  fullName: string;
  contact: string;
  attendance: AttendanceStatus;
  guests: number;
  message: string;
}

export interface RsvpRecord extends RsvpInput {
  id: string;
  createdAt: string;
}

export interface RsvpValidationErrors {
  fullName?: string;
  contact?: string;
  guests?: string;
}

export const MAX_GUESTS = 5;

export function validateRsvpInput(input: RsvpInput): {
  valid: boolean;
  errors: RsvpValidationErrors;
  normalized: RsvpInput;
} {
  const errors: RsvpValidationErrors = {};
  const trimmedName = input.fullName.trim();
  const trimmedContact = input.contact.trim();
  const trimmedMessage = input.message.trim().slice(0, 400);

  if (trimmedName.length < 2) {
    errors.fullName = 'لطفاً نام کامل خود را وارد نمایید (حداقل ۲ حرف).';
  }

  if (trimmedContact.length < 5) {
    errors.contact = 'لطفاً شماره تماس یا ایمیل معتبر خود را بنویسید.';
  } else if (trimmedContact.includes('@')) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedContact)) {
      errors.contact = 'لطفاً یک ایمیل معتبر وارد نمایید.';
    }
  } else {
    const normalizedContactDigits = trimmedContact
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
    const digitsOnly = normalizedContactDigits.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      errors.contact = 'شماره تماس باید حداقل ۷ رقم باشد یا ایمیل معتبر بنویسید.';
    }
  }

  let normalizedGuests = input.attendance === 'declining' ? 0 : Math.round(input.guests);
  if (input.attendance === 'attending') {
    if (!Number.isFinite(normalizedGuests) || normalizedGuests < 1 || normalizedGuests > MAX_GUESTS) {
      errors.guests = `تعداد مهمانان باید بین ۱ تا ${MAX_GUESTS} نفر باشد.`;
      normalizedGuests = Math.min(MAX_GUESTS, Math.max(1, normalizedGuests || 1));
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalized: {
      fullName: trimmedName,
      contact: trimmedContact,
      attendance: input.attendance,
      guests: normalizedGuests,
      message: trimmedMessage,
    },
  };
}

export const INITIAL_BLESSINGS: RsvpRecord[] = [
  {
    id: 'seed-1',
    fullName: 'لیلا و فرید',
    contact: 'family@example.com',
    attendance: 'attending',
    guests: 2,
    message: 'با آرزوی زندگی سرشار از عشق، آرامش و خوشبختی جاودان برای امیره جان و لطیف جان.',
    createdAt: '2026-11-10T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    fullName: 'ثنا وردک',
    contact: 'sana@example.com',
    attendance: 'attending',
    guests: 1,
    message: 'بی‌صبرانه منتظر دیدار و جشن باشکوه شما در تالار فریال هستم!',
    createdAt: '2026-11-14T14:30:00.000Z',
  },
];
