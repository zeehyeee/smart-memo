export default {
  async fetch(request, env) {
    const key = (env.GEMINI_API_KEY || '').trim();

    if (!key) {
      return new Response(
        'GEMINI_API_KEY 시크릿이 설정되지 않았습니다.\n' +
        '로컬: .dev.vars 파일에 GEMINI_API_KEY=실제키 입력 후 wrangler dev 재시작\n' +
        '프로덕션: Cloudflare Dashboard > Workers > Settings > Variables and Secrets\n' +
        '         또는: wrangler secret put GEMINI_API_KEY',
        { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/index.html') {
      // Request 객체를 그대로 넘기면 body/method 문제가 생길 수 있어 새 GET 요청 생성
      const assetReq = new Request(new URL('/index.html', request.url).toString(), {
        method: 'GET',
        headers: { 'Accept': 'text/html' },
      });
      const response = await env.ASSETS.fetch(assetReq);
      if (!response.ok) {
        return new Response('index.html 로드 실패: ' + response.status, { status: 502 });
      }
      const html = (await response.text()).replaceAll('__GEMINI_KEY__', key);
      return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
