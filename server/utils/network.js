// Configure global fetch (Undici) to prefer IPv4 and honor HTTPS_PROXY/HTTP_PROXY if available.
// Works even if 'undici' package isn't installed: it will no-op gracefully.
export const configureNetwork = async () => {
  try {
    const { setGlobalDispatcher, Agent, ProxyAgent } = await import('undici');
    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if (proxyUrl && ProxyAgent) {
      setGlobalDispatcher(new ProxyAgent(proxyUrl));
    } else {
      setGlobalDispatcher(new Agent({ connect: { family: 4 } }));
    }
  } catch {
    // undici not available; skip configuration
  }
};
