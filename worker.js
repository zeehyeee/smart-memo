export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // index.html 요청만 가로채서 플레이스홀더 치환
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const assetReq = new Request(new URL('/index.html', request.url), request);
      const response = await env.ASSETS.fetch(assetReq);
      let html = await response.text();
      html = html.replace('__GEMINI_KEY__', env.GEMINI_API_KEY || '');
      return new Response(html, {
        status: response.status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
