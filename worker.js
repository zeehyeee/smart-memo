export default {
  async fetch(request, env) {
    const key = (env.GEMINI_API_KEY || '').trim();

    if (!key) {
      return new Response(
        'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.\n' +
        '로컬: .dev.vars 파일에 GEMINI_API_KEY=실제키 입력 후 wrangler dev 재시작\n' +
        '프로덕션: wrangler secret put GEMINI_API_KEY',
        { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/index.html') {
      const assetReq = new Request(new URL('/index.html', request.url), request);
      const response = await env.ASSETS.fetch(assetReq);
      let html = await response.text();
      html = html.replaceAll('__GEMINI_KEY__', key);
      return new Response(html, {
        status: response.status,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
