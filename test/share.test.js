import { describe, it, expect } from 'vitest';
import { encodeData, decodeData, buildShareLink, buildQRLink } from '../src/utils/share.js';

describe('share utils', () => {
  it('encodes and decodes data correctly (roundtrip)', () => {
    const obj = { name: 'Alice', regNo: 'R001', subjects: [{ name: 'Math', m1: {}, m2: {} }] };
    const json = JSON.stringify(obj);
    const enc = encodeData(json);
    const dec = decodeData(enc);
    expect(dec).toBe(json);
  });

  it('builds a share link with URL-safe base64', () => {
    const base = 'https://example.com/app?foo=bar';
    const obj = { x: 1 };
    const link = buildShareLink(base, obj);
    expect(link.startsWith('https://example.com/')).toBe(true);
    expect(link).toContain('?share=');
    const encoded = link.split('?share=')[1];
    // ensure no plus or slash characters
    expect(encoded).not.toMatch(/[+/]/);
  });

  it('builds a QR link that encodes the share link', () => {
    const share = 'https://example.com/?share=abc-def_ghi';
    const qr = buildQRLink(share);
    expect(qr).toContain('api.qrserver.com');
    expect(qr).toContain(encodeURIComponent(share));
  });
});
