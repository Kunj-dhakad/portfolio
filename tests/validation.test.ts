import test from 'node:test';
import assert from 'node:assert/strict';
import { contentSchema, enquirySchema, settingsSchema } from '../src/lib/validations';
import { blankData, sampleEntries, defaults } from '../src/data/content';
import { validOrigin } from '../src/lib/security';
test('seed content validates and never invents demo or affiliate links', () => {
  for (const entry of sampleEntries) {
    assert.ok(contentSchema.safeParse(entry).success, entry.slug);
    assert.equal(entry.data.demoUrl, '');
    assert.equal(entry.data.affiliateUrl, '');
    assert.ok(entry.sample);
  }
  assert.ok(settingsSchema.safeParse(defaults).success);
});
test('content rejects executable URLs and invalid image paths', () => {
  const entry = { ...sampleEntries[0], data: { ...blankData, demoUrl: 'javascript:alert(1)' } };
  assert.equal(contentSchema.safeParse(entry).success, false);
  assert.equal(
    contentSchema.safeParse({ ...entry, data: { ...blankData, cover: '//evil.example/x.png' } })
      .success,
    false,
  );
  assert.equal(
    contentSchema.safeParse({ ...entry, slug: '../../admin', data: blankData }).success,
    false,
  );
});
test('enquiry rejects bad email, short requirements, and unapproved budgets', () => {
  const input = {
    name: 'Alex Smith',
    email: 'alex@example.com',
    projectType: 'MVP development',
    budget: '$5,000–$15,000',
    description: 'A project management tool for a small creative studio.',
    timeline: '1–3 months',
  };
  assert.ok(enquirySchema.safeParse(input).success);
  for (const patch of [
    { email: 'invalid' },
    { description: 'short' },
    { budget: 'unknown' },
    { website: 'javascript:alert(1)' },
  ])
    assert.equal(enquirySchema.safeParse({ ...input, ...patch }).success, false);
});
test('mutation requests require a matching origin', () => {
  assert.equal(
    validOrigin(
      new Request('https://studio.example/api/enquiries', {
        headers: { origin: 'https://attacker.example' },
      }),
    ),
    false,
  );
  assert.equal(validOrigin(new Request('https://studio.example/api/enquiries')), false);
  assert.equal(
    validOrigin(
      new Request('https://studio.example/api/enquiries', {
        headers: { origin: 'https://studio.example' },
      }),
    ),
    true,
  );
});
