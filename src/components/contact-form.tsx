'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema, type EnquiryInput } from '@/lib/validations';
import Link from 'next/link';
export function ContactForm() {
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { company: '', website: '', honeypot: '' },
  });
  async function submit(values: EnquiryInput) {
    setResult(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      setResult({
        ok: res.ok,
        text: res.ok
          ? 'Thank you. Your enquiry has been received. I’ll be in touch about your project.'
          : body.error || 'Something went wrong. Please try again.',
      });
      if (res.ok) reset();
    } catch {
      setResult({ ok: false, text: 'Unable to connect. Please try again.' });
    }
  }
  function error(name: keyof EnquiryInput) {
    return (
      errors[name] && (
        <span className="field-error" role="alert">
          {errors[name]?.message}
        </span>
      )
    );
  }
  return (
    <form className="form-card" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Full name *</label>
          <input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            {...register('name')}
            aria-invalid={!!errors.name}
          />
          {error('name')}
        </div>
        <div className="field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {error('email')}
        </div>
        <div className="field">
          <label htmlFor="company">
            Company <span>(optional)</span>
          </label>
          <input
            id="company"
            autoComplete="organization"
            placeholder="Your company"
            {...register('company')}
          />
          {error('company')}
        </div>
        <div className="field">
          <label htmlFor="projectType">Project type *</label>
          <select id="projectType" {...register('projectType')} defaultValue="">
            <option value="" disabled>
              Select a project type
            </option>
            {[
              'SaaS application',
              'Custom web application',
              'AI & automation',
              'API integration',
              'MVP development',
              'Dashboard',
              'Modernization',
              'Other',
            ].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          {error('projectType')}
        </div>
        <div className="field">
          <label htmlFor="budget">Estimated budget *</label>
          <select id="budget" {...register('budget')} defaultValue="">
            <option value="" disabled>
              Select a range (USD)
            </option>
            {['Under $5,000', '$5,000–$15,000', '$15,000–$30,000', '$30,000+', 'Let’s discuss'].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
          {error('budget')}
        </div>
        <div className="field">
          <label htmlFor="timeline">Your timeline *</label>
          <select id="timeline" {...register('timeline')} defaultValue="">
            <option value="" disabled>
              Select a timeline
            </option>
            {['As soon as possible', '1–3 months', '3–6 months', 'Flexible'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          {error('timeline')}
        </div>
        <div className="field full">
          <label htmlFor="description">Tell me about your project *</label>
          <textarea
            id="description"
            placeholder="What are you building? Who is it for? What would a successful outcome look like?"
            {...register('description')}
            aria-invalid={!!errors.description}
          />
          {error('description')}
        </div>
        <div className="field full">
          <label htmlFor="website">
            Current website <span>(optional)</span>
          </label>
          <input id="website" type="url" placeholder="https://" {...register('website')} />
          {error('website')}
        </div>
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="fax">Leave this field empty</label>
          <input id="fax" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
        </div>
        <div className="field full">
          <button className="button button-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send project enquiry'}
          </button>
        </div>
      </div>
      <p className="form-fineprint">
        Your details are used to respond to your enquiry. Read the{' '}
        <Link href="/privacy" className="text-link">
          privacy policy
        </Link>
        .
      </p>
      {result && (
        <div className={`form-status ${result.ok ? 'success' : 'error'}`} role="status">
          {result.text}
        </div>
      )}
    </form>
  );
}
