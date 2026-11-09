const moduleUrl = new URL(import.meta.url);
const prefix = moduleUrl.protocol === 'file:'
  ? (process.env.SITE_BASE_PATH || '').replace(/^\/+|\/+$/g, '')
  : new URL('.', moduleUrl).pathname.slice(1, -1);

export function sitePath(path) {
  return prefix && path.startsWith('/') && !path.startsWith('//') ? `/${prefix}${path}` : path;
}
