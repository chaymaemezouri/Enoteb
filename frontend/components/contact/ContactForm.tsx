'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { contactPageContent } from '@/config/contact';
import { cn } from '@/lib/cn';
import { api, ApiClientError } from '@/lib/api';

const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(120, '120 caractères maximum'),
  email: z
    .string()
    .trim()
    .min(1, 'L’email est requis')
    .email('Adresse email invalide')
    .max(254, '254 caractères maximum'),
  company: z.string().max(120, '120 caractères maximum').optional().or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, '30 caractères maximum')
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^[\d\s+().-]+$/.test(value),
      'Numéro de téléphone invalide',
    ),
  message: z
    .string()
    .trim()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, '5000 caractères maximum'),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type FormStatus = 'idle' | 'success' | 'error';

export function ContactForm() {
  const { form } = contactPageContent;
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus('idle');
    setStatusMessage('');

    try {
      const response = await api.sendContact({
        name: values.name,
        email: values.email,
        company: values.company?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        message: values.message,
        website: values.website,
      });

      setStatus('success');
      setStatusMessage(response.message);
      reset();
    } catch (error) {
      setStatus('error');

      if (error instanceof ApiClientError) {
        setStatusMessage(
          error.messages.join(', ') || 'Une erreur est survenue lors de l’envoi du message.',
        );
        return;
      }

      setStatusMessage('Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.');
    }
  };

  return (
    <div className="contact-form">
      {status === 'success' ? (
        <div role="status" className="contact-form__status contact-form__status--success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{statusMessage}</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div role="alert" className="contact-form__status contact-form__status--error">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{statusMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'none' }} aria-hidden="true" tabIndex={-1}>
          <label htmlFor="website">Website</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>

        <div className="contact-form__grid">
          <div className="contact-form__field">
            <label htmlFor="name" className="contact-form__label">
              {form.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={form.namePlaceholder}
              disabled={isSubmitting}
              aria-required="true"
              className={cn('contact-form__input', errors.name && 'contact-form__input--error')}
              {...register('name')}
            />
            {errors.name ? <p className="contact-form__error">{errors.name.message}</p> : null}
          </div>

          <div className="contact-form__field">
            <label htmlFor="email" className="contact-form__label">
              {form.emailLabel}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={form.emailPlaceholder}
              disabled={isSubmitting}
              aria-required="true"
              className={cn('contact-form__input', errors.email && 'contact-form__input--error')}
              {...register('email')}
            />
            {errors.email ? <p className="contact-form__error">{errors.email.message}</p> : null}
          </div>
        </div>

        <div className="contact-form__grid">
          <div className="contact-form__field">
            <label htmlFor="company" className="contact-form__label">
              {form.companyLabel}
            </label>
            <input
              id="company"
              type="text"
              autoComplete="organization"
              placeholder={form.companyPlaceholder}
              disabled={isSubmitting}
              className={cn('contact-form__input', errors.company && 'contact-form__input--error')}
              {...register('company')}
            />
            {errors.company ? <p className="contact-form__error">{errors.company.message}</p> : null}
          </div>

          <div className="contact-form__field">
            <label htmlFor="phone" className="contact-form__label">
              {form.phoneLabel}
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder={form.phonePlaceholder}
              disabled={isSubmitting}
              className={cn('contact-form__input', errors.phone && 'contact-form__input--error')}
              {...register('phone')}
            />
            {errors.phone ? <p className="contact-form__error">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div className="contact-form__field">
          <label htmlFor="message" className="contact-form__label">
            {form.messageLabel}
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder={form.messagePlaceholder}
            disabled={isSubmitting}
            aria-required="true"
            className={cn(
              'contact-form__input contact-form__textarea',
              errors.message && 'contact-form__input--error',
            )}
            {...register('message')}
          />
          {errors.message ? <p className="contact-form__error">{errors.message.message}</p> : null}
        </div>

        <div className="contact-form__actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="contact-form__submit btn-orange-solid link-focus rounded-none text-white focus-visible:ring-[#e85f14]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {form.submittingLabel}
              </>
            ) : (
              <>
                {form.submitLabel}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
