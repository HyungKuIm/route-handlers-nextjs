import { type NextRequest } from "next/server";
import { memberFetch } from "../spring";

// body: { username, password } → 200 + 회원 정보 (Spring 세션에 저장됨)
export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    return memberFetch(request, '/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }, {
        400: '아이디와 비밀번호를 입력해 주세요',
        401: '아이디 또는 비밀번호가 올바르지 않습니다',
    });
}
