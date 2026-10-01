import { type NextRequest } from "next/server";
import { memberFetch } from "../spring";

export async function GET(request: NextRequest) {
    return memberFetch(request, '/members/me', {}, {
        401: '로그인이 필요합니다',
    });
}
