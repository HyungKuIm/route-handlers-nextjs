import { type NextRequest } from "next/server";
import { API_BASE } from "../../dogs/api/spring";
import { type Member } from "../types";

// 브라우저 쿠키(JSESSIONID)를 Spring에 넘김
function withCookie(request: NextRequest, init: RequestInit = {}): RequestInit {
    const headers = new Headers(init.headers);
    const cookie = request.headers.get('cookie');
    if (cookie) {
        headers.set('cookie', cookie);
    }
    return { ...init, headers };
}

// 로그인 상태는 Spring 세션에 저장되므로 쿠키를 넘기고,
// Spring의 Set-Cookie(로그인 시 세션 id 변경 등)를 브라우저로 돌려줌
// messages: 상태 코드별로 Spring 오류 대신 보여줄 메시지
export async function memberFetch(
    request: NextRequest,
    path: string,
    init: RequestInit = {},
    messages: Record<number, string> = {},
) {
    try {
        const res = await fetch(`${API_BASE}${path}`, withCookie(request, init));

        const responseHeaders = new Headers();
        for (const setCookie of res.headers.getSetCookie()) {
            responseHeaders.append('set-cookie', setCookie);
        }

        if (!res.ok) {
            const text = await res.text();
            return Response.json(
                { message: messages[res.status] ?? text },
                { status: res.status, headers: responseHeaders },
            );
        }

        // 로그아웃은 204 No Content
        if (res.status === 204) {
            return new Response(null, { status: 204, headers: responseHeaders });
        }

        return Response.json(await res.json(), { status: res.status, headers: responseHeaders });
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}

// 현재 로그인한 회원. 로그인하지 않았으면 null
export async function getLoginMember(request: NextRequest): Promise<Member | null> {
    const res = await fetch(`${API_BASE}/members/me`, withCookie(request));

    if (res.status === 401) {
        return null;
    }
    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

// Spring의 /dogs API는 권한 검사를 하지 않으므로 라우트 핸들러에서 막음
// ADMIN이면 null, 아니면 그대로 돌려줄 오류 응답
export async function requireAdmin(request: NextRequest) {
    try {
        const member = await getLoginMember(request);

        if (!member) {
            return Response.json({ message: '로그인이 필요합니다' }, { status: 401 });
        }
        if (member.role !== 'ADMIN') {
            return Response.json({ message: '관리자만 할 수 있습니다' }, { status: 403 });
        }

        return null;
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}
