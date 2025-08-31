export const config = { runtime: 'nodejs18.x' };

export default async function handler(req, res) {
  try {
    const mod = await import('./server.js'); // import local in the server/
    const app = mod.default || mod;
    return app(req, res);
  } catch (e) {
    console.error('API handler failed:', e);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({
      ok: false,
      error: 'API handler failed',
      message: e?.message ?? 'Unknown error',
    }));
  }
}