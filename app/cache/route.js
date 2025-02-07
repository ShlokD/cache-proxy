import { NextResponse } from 'next/server';
let cache = {};

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);
    const clearCache = search.get('clear-cache');
    if (clearCache === 'true') {
      cache = {};
      return NextResponse.json({
        message: 'Cache Cleared',
      });
    }
    const requestUrl = search.get('url');
    if (cache[requestUrl]) {
      return NextResponse.json({
        'X-CACHE': 'HIT',
        payload: cache[requestUrl],
      });
    }
    try {
      const res = await fetch(requestUrl);
      const json = await res.json();
      cache[requestUrl] = json;
      return NextResponse.json({
        'X-CACHE': 'MISS',
        payload: json,
      });
    } catch (e) {
      return NextResponse.error({
        message: e.message,
      });
    }
  } catch (_) {
    return NextResponse.error(
      { message: 'Caching Server Error' },
      { status: 500 }
    );
  }
}
