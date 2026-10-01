import { type NextRequest } from "next/server";
import { memberFetch } from "../spring";

// 세션을 통째로 지우므로 장바구니도 비워짐
export async function POST(request: NextRequest) {
    return memberFetch(request, '/members/logout', { method: 'POST' });
}
