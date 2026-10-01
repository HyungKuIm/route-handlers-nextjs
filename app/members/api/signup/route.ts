import { type NextRequest } from "next/server";
import { memberFetch } from "../spring";

// body: { username, password } → 201, role은 항상 USER
export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    return memberFetch(request, '/members/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }, {
        400: '아이디와 비밀번호는 4자 이상이어야 합니다',
        409: '이미 사용 중인 아이디입니다',
    });
}
