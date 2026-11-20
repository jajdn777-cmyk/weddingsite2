import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  MailOpen,
  MessageSquare,
  Minus,
  Phone,
  Plus,
  User,
  X,
} from 'lucide-react';
import { toPersianDigits } from '../utils/countdown';
import {
  INITIAL_BLESSINGS,
  MAX_GUESTS,
  validateRsvpInput,
  type AttendanceStatus,
  type RsvpRecord,
  type RsvpValidationErrors,
} from '../utils/rsvp';
import { BotanicalBlossomSvg, BotanicalCornerAsset } from './FloralDecorations';

const LOCAL_STORAGE_KEY = 'amira-latif-rsvps-v1';

export function RsvpSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<RsvpValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<RsvpRecord | null>(null);
  const [rsvpList, setRsvpList] = useState<RsvpRecord[]>(INITIAL_BLESSINGS);

  useEffect(() => {
    let active = true;
    const loadInitial = async () => {
      try {
        const localRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localRaw) {
          const parsed = JSON.parse(localRaw);
          if (Array.isArray(parsed) && parsed.length > 0 && active) {
            setRsvpList(parsed);
          }
        }
      } catch {
        // Ignore storage read issues
      }

      try {
        const res = await fetch('/api/rsvps');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.rsvps) && active) {
          setRsvpList(data.rsvps);
          try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.rsvps));
          } catch {
            // Ignore storage write issues
          }
        }
      } catch {
        // Fallback to localStorage / seed blessings
      }
    };

    loadInitial();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateRsvpInput({
      fullName,
      contact,
      attendance,
      guests,
      message,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.normalized),
      });

      let savedRecord: RsvpRecord;
      let nextList: RsvpRecord[];

      if (res.ok) {
        const data = await res.json();
        savedRecord = data.record;
        nextList = Array.isArray(data.rsvps) ? data.rsvps : [savedRecord, ...rsvpList];
      } else if (res.status === 400) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        setIsSubmitting(false);
        return;
      } else {
        throw new Error('Unable to save RSVP');
      }

      setRsvpList(nextList);
      setSubmittedRecord(savedRecord);
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
      } catch {
        // Ignore storage errors
      }
    } catch {
      const fallbackRecord: RsvpRecord = {
        ...validation.normalized,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const nextList = [fallbackRecord, ...rsvpList];
      setRsvpList(nextList);
      setSubmittedRecord(fallbackRecord);
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextList));
      } catch {
        // Ignore storage errors
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedRecord(null);
    setFullName('');
    setContact('');
    setAttendance('attending');
    setGuests(1);
    setMessage('');
    setIsNoteOpen(false);
    setErrors({});
  };

  const modalContent = (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          key="rsvp-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2A2D20]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rsvp-modal-title"
          data-testid="rsvp-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            dir="rtl"
            className="relative max-h-[90dvh] w-full max-w-[460px] overflow-y-auto rounded-[24px] border border-[#7A8E74]/45 bg-gradient-to-b from-[#FFFCF7] via-[#FBF6EE] to-[#F2ECE1] px-6 py-7 text-right shadow-[0_24px_60px_rgba(67,70,52,0.28)] sm:px-8 sm:py-8"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="بستن فرم تأیید حضور"
              className="absolute top-3.5 left-3.5 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full text-[#5D634E] transition-colors hover:bg-[#7A8E74]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546B57]"
            >
              <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </button>

            <div className="flex flex-col items-center text-center">
              <BotanicalBlossomSvg className="h-10 w-10" />
              <h3
                id="rsvp-modal-title"
                className="mt-2 font-display text-2xl font-bold text-[#434634] sm:text-[26px]"
              >
                تأیید حضور در محفل پیوند
              </h3>
              <p className="mt-1 text-xs font-medium text-[#546B57] sm:text-sm">
                امیره و لطیف
              </p>
            </div>

            {submittedRecord ? (
              <div
                data-testid="rsvp-confirmation"
                className="mt-6 border-t border-[#7A8E74]/30 pt-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#546B57] text-[#FFFCF5]">
                  <Check className="h-6 w-6" aria-hidden="true" />
                </div>

                <h4 className="mt-4 font-display text-2xl font-bold text-[#434634]">
                  سپاس از پاسخ شما، {submittedRecord.fullName}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-[#5D634E]">
                  {submittedRecord.attendance === 'attending'
                    ? `جایگاه شما برای ${toPersianDigits(
                        submittedRecord.guests,
                      )} مهمان با کمال مسرت ثبت گردید.`
                    : 'از اطلاع‌رسانی شما سپاسگزاریم؛ یادتان در این شب فرخنده با ماست.'}
                </p>

                {submittedRecord.message && (
                  <p className="mt-4 border-t border-[#7A8E74]/25 pt-4 text-sm italic text-[#434634]">
                    «{submittedRecord.message}»
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-[#546B57]/35 bg-[#FFFCF5] px-5 py-2.5 text-xs font-semibold text-[#546B57] transition-colors hover:bg-[#EFE8DC]"
                  >
                    ثبت پاسخ جدید
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-[#546B57] px-6 py-2.5 text-xs font-semibold text-[#FFFCF5] transition-colors hover:bg-[#435645]"
                  >
                    بازگشت به دعوت‌نامه
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                {/* Full Name - clean underline field */}
                <div>
                  <label
                    htmlFor="rsvp-name"
                    className="block text-xs font-semibold text-[#434634] sm:text-sm"
                  >
                    نام و نام خانوادگی <span className="text-[#BF9042]">*</span>
                  </label>
                  <div className="relative mt-1 flex items-center border-b border-[#7A8E74]/55 transition-colors focus-within:border-[#546B57]">
                    <input
                      id="rsvp-name"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: احمد شکیب"
                      aria-invalid={Boolean(errors.fullName)}
                      className="min-h-[42px] w-full bg-transparent pl-7 py-2 text-right text-sm text-[#434634] placeholder:text-[#969A87] focus:outline-none"
                    />
                    <User
                      aria-hidden="true"
                      strokeWidth={1.6}
                      className="pointer-events-none absolute left-0.5 h-4 w-4 text-[#7A8E74]"
                    />
                  </div>
                  {errors.fullName && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#9E3B33]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Contact / WhatsApp - clean underline field */}
                <div>
                  <label
                    htmlFor="rsvp-contact"
                    className="block text-xs font-semibold text-[#434634] sm:text-sm"
                  >
                    شماره تماس یا واتساپ <span className="text-[#BF9042]">*</span>
                  </label>
                  <div className="relative mt-1 flex items-center border-b border-[#7A8E74]/55 transition-colors focus-within:border-[#546B57]">
                    <input
                      id="rsvp-contact"
                      name="contact"
                      type="text"
                      required
                      dir="ltr"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="۰۷۹۹ ۱۲۳ ۴۵۶"
                      aria-invalid={Boolean(errors.contact)}
                      className="min-h-[42px] w-full bg-transparent pl-7 py-2 text-right text-sm text-[#434634] placeholder:text-[#969A87] focus:outline-none"
                    />
                    <Phone
                      aria-hidden="true"
                      strokeWidth={1.6}
                      className="pointer-events-none absolute left-0.5 h-4 w-4 text-[#7A8E74]"
                    />
                  </div>
                  {errors.contact && (
                    <p role="alert" className="mt-1.5 text-xs font-medium text-[#9E3B33]">
                      {errors.contact}
                    </p>
                  )}
                </div>

                {/* Attendance two-option radio buttons */}
                <div>
                  <span className="block text-xs font-semibold text-[#434634] sm:text-sm">
                    آیا در محفل حضور می‌یابید؟{' '}
                    <span className="text-[#BF9042]">*</span>
                  </span>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setAttendance('attending')}
                      aria-pressed={attendance === 'attending'}
                      className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-right text-xs transition-all whitespace-nowrap ${
                        attendance === 'attending'
                          ? 'border-[#546B57] bg-[#E8EFE7] font-semibold text-[#434634]'
                          : 'border-[#C9D1C4] bg-[#FFFCF5]/75 text-[#5D634E] hover:border-[#7A8E74]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          attendance === 'attending'
                            ? 'border-[#546B57]'
                            : 'border-[#9AA895]'
                        }`}
                      >
                        {attendance === 'attending' && (
                          <span className="h-2 w-2 rounded-full bg-[#546B57]" />
                        )}
                      </span>
                      <span className="flex-1">با خوشی شرکت می‌کنم</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('declining')}
                      aria-pressed={attendance === 'declining'}
                      className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-right text-xs transition-all whitespace-nowrap ${
                        attendance === 'declining'
                          ? 'border-[#546B57] bg-[#E8EFE7] font-semibold text-[#434634]'
                          : 'border-[#C9D1C4] bg-[#FFFCF5]/75 text-[#5D634E] hover:border-[#7A8E74]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          attendance === 'declining'
                            ? 'border-[#546B57]'
                            : 'border-[#9AA895]'
                        }`}
                      >
                        {attendance === 'declining' && (
                          <span className="h-2 w-2 rounded-full bg-[#546B57]" />
                        )}
                      </span>
                      <span className="flex-1">متأسفانه نمی‌توانم حضور یابم</span>
                    </button>
                  </div>
                </div>

                {/* Compact guest count when attending */}
                {attendance === 'attending' && (
                  <div className="flex items-center justify-between border-b border-[#7A8E74]/35 pb-2.5">
                    <span className="text-xs font-semibold text-[#434634] sm:text-sm">
                      تعداد مهمانان
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        aria-label="کاهش تعداد مهمانان"
                        className="flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-full border border-[#C9D1C4] text-[#434634] transition-colors hover:bg-[#E8EFE7] disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>

                      <span
                        data-testid="rsvp-guest-count"
                        className="min-w-[56px] text-center font-display text-lg font-bold text-[#434634] tabular-nums"
                      >
                        {toPersianDigits(guests)} نفر
                      </span>

                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                        disabled={guests >= MAX_GUESTS}
                        aria-label="افزایش تعداد مهمانان"
                        className="flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-full border border-[#C9D1C4] text-[#434634] transition-colors hover:bg-[#E8EFE7] disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional greeting message toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsNoteOpen((prev) => !prev)}
                    aria-expanded={isNoteOpen}
                    className="inline-flex min-h-[36px] cursor-pointer items-center gap-2 text-xs font-medium text-[#5D634E] transition-colors hover:text-[#434634]"
                  >
                    <MessageSquare
                      className="h-3.5 w-3.5 text-[#7A8E74]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <span>پیام تبریک می‌نویسم (اختیاری)</span>
                  </button>

                  {isNoteOpen && (
                    <div className="mt-2">
                      <label htmlFor="rsvp-message" className="sr-only">
                        پیام تبریک یا یادداشت (اختیاری)
                      </label>
                      <textarea
                        id="rsvp-message"
                        name="message"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="پیام نیک و دعای خیر خود را بنویسید..."
                        className="w-full rounded-xl border border-[#7A8E74]/50 bg-[#FFFCF5]/85 px-3.5 py-2.5 text-sm text-[#434634] placeholder:text-[#969A87] focus:border-[#546B57] focus:outline-none focus:ring-2 focus:ring-[#546B57]/15"
                      />
                    </div>
                  )}
                </div>

                {/* Primary rounded CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5E7761] via-[#546B57] to-[#5E7761] px-6 py-3 text-sm font-bold text-[#FFFCF5] shadow-[0_10px_24px_rgba(84,107,87,0.3)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  <span>{isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی پاسخ'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section
      id="rsvp"
      className="relative z-10 mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20"
    >
      {/* Section Callout with Trigger Button */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 overflow-hidden rounded-3xl border border-[#7A8E74]/35 bg-gradient-to-b from-[#FCF9F4]/95 via-[#F4EDE3]/90 to-[#EDE4D8]/85 px-6 py-14 shadow-[0_10px_32px_rgba(67,70,52,0.10)] sm:px-12"
      >
        <BotanicalCornerAsset
          variant="flower-tr"
          corner="tr"
          opacity={0.48}
          swayDegrees={0.8}
          className="w-24 sm:w-36"
        />
        <BotanicalCornerAsset
          variant="flower-bl"
          corner="bl"
          opacity={0.48}
          swayDegrees={0.8}
          className="w-24 sm:w-36"
        />

        <span
          dir="ltr"
          style={{ fontFamily: 'var(--font-card)' }}
          className="relative z-10 block text-xs font-semibold tracking-[0.26em] text-[#7A8E74]"
        >
          R.S.V.P
        </span>
        <h2 className="relative z-10 mt-2 font-display text-3xl font-bold text-[#434634] sm:text-4xl">
          تأیید حضور در محفل
        </h2>
        <p className="relative z-10 mx-auto mt-3 max-w-md text-xs leading-relaxed text-[#5D634E] sm:text-sm">
          لطفاً جهت هماهنگی بهتر پذیرایی و جایگاه مهمانان گرامی، حضور خود را از
          طریق فرم زیر اطلاع دهید.
        </p>

        <div className="relative z-10 mt-7">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#5E7761] via-[#546B57] to-[#5E7761] px-8 py-3.5 text-sm font-bold text-[#FFFCF5] shadow-[0_8px_22px_rgba(84,107,87,0.3)] transition-all duration-200 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546B57]"
          >
            <MailOpen className="h-4 w-4" aria-hidden="true" />
            <span>پاسخ به دعوتنامه</span>
          </button>
        </div>
      </motion.div>

      {/* Guestbook Blessings Wall */}
      <div className="relative z-10 mt-14 text-right">
        <div className="text-center">
          <span className="block text-xs font-semibold tracking-widest text-[#7A8E74]">
            دفتر یادبود
          </span>
          <h3 className="mt-1.5 font-display text-2xl font-bold text-[#434634] sm:text-3xl">
            یادگاری‌های شما
          </h3>
          <div className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[#BF9042] to-transparent" />
        </div>

        <div
          data-testid="rsvp-wishes-list"
          className="mt-7 divide-y divide-[#7A8E74]/30 border-y border-[#7A8E74]/30"
        >
          {rsvpList
            .filter(
              (item) =>
                item.message.trim().length > 0 ||
                item.id.startsWith('rsvp-') ||
                item.id.startsWith('local-'),
            )
            .slice(0, 5)
            .map((entry) => (
              <article key={entry.id} className="py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-display text-xl font-bold text-[#434634]">
                    {entry.fullName}
                  </h4>
                  <span className="text-xs text-[#546B57] whitespace-nowrap">
                    {entry.attendance === 'attending'
                      ? `حضور · ${toPersianDigits(entry.guests)} نفر`
                      : 'با آرزوی نیک'}
                  </span>
                </div>
                {entry.message && (
                  <p className="mt-2 text-sm leading-relaxed text-[#5D634E]">
                    {entry.message}
                  </p>
                )}
              </article>
            ))}
        </div>
      </div>

      {/* Render overlay directly onto document.body so fixed positioning ignores ancestor filters/transforms */}
      {typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </section>
  );
}
