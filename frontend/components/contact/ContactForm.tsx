'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { api, ApiClientError } from '@/lib/api';

const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(120, '120 caractères maximum'),
  email: z
    .string()
    .trim()
    .min(1, 'L’email est requis')
    .email('Adresse email invalide')
    .max(254, '254 caractères maximum'),
  phone: z.string().max(30, '30 caractères maximum').optional().or(z.literal('')),
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
    <Card padding="lg" className="h-full">
      <h2 className="text-h3 text-neutral-900">Envoyez-nous un message</h2>
      <p className="mt-2 text-body-sm text-neutral-600">
        Remplissez le formulaire ci-dessous. Nous vous répondrons dans les plus brefs délais.
      </p>

      {status === 'success' ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-button border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-body-sm">{statusMessage}</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-button border border-red-200 bg-red-50 p-4 text-red-900"
        >
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p className="text-body-sm">{statusMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div style={{ display: 'none' }} aria-hidden="true" tabIndex={-1}>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>

        <div>
          <Label htmlFor="name" required>
            Nom complet
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            disabled={isSubmitting}
            aria-required="true"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            aria-required="true"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            disabled={isSubmitting}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div>
          <Label htmlFor="message" required>
            Message
          </Label>
          <Textarea
            id="message"
            rows={6}
            disabled={isSubmitting}
            aria-required="true"
            error={errors.message?.message}
            {...register('message')}
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            'Envoyer le message'
          )}
        </Button>
      </form>
    </Card>
  );
}
