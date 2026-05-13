// Utilities for share link and QR generation
function toBase64Utf8(data) {
  if (typeof btoa === 'function' && typeof TextEncoder !== 'undefined') {
    const bytes = new TextEncoder().encode(data);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(data, 'utf8').toString('base64');
  }

  throw new Error('Base64 encoding is not supported in this environment.');
}

function fromBase64Utf8(base64) {
  const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');

  if (typeof atob === 'function' && typeof TextDecoder !== 'undefined') {
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(normalized, 'base64').toString('utf8');
  }

  throw new Error('Base64 decoding is not supported in this environment.');
}

export function encodeData(data) {
  // URL-safe Base64 (replace +/ with -_ and remove padding)
  const b64 = toBase64Utf8(data);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeData(encoded) {
  // Restore padding
  let s = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad === 2) s += '==';
  else if (pad === 3) s += '=';
  else if (pad === 1) s += '===';
  return fromBase64Utf8(s);
}

export function buildShareLink(baseURL, dataObj) {
  const json = JSON.stringify(dataObj);
  const enc = encodeData(json);
  // Ensure baseURL has no search params
  try {
    const u = new URL(baseURL);
    u.search = '';
    return `${u.toString()}?share=${enc}`;
  } catch (e) {
    return `${baseURL}?share=${enc}`;
  }
}

export function buildQRLink(shareLink) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(shareLink)}`;
}
