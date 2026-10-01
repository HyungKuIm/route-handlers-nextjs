import { type NextRequest } from "next/server";
import { API_BASE } from "../../dogs/api/spring";

// Spring 장바구니는 세션(JSESSIONID)에 저장되므로
// 브라우저 쿠키를 Spring에 넘기고, Spring의 Set-Cookie를 브라우저로 돌려줌
export async function cartFetch(request: NextRequest, path: string, init: RequestInit = {}) {
    try {
        const headers = new Headers(init.headers);
        const cookie = request.headers.get('cookie');
        if (cookie) {
            headers.set('cookie', cookie);
        }

        const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

        const responseHeaders = new Headers();
        for (const setCookie of res.headers.getSetCookie()) {
            responseHeaders.append('set-cookie', setCookie);
        }

        if (!res.ok) {
            const text = await res.text();
            return Response.json({ message: text }, { status: res.status, headers: responseHeaders });
        }

        return Response.json(await res.json(), { headers: responseHeaders });
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}
