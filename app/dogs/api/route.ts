import { type NextRequest } from "next/server";

const API_BASE = process.env.SPRING_API_URL; 

export async function GET(request: NextRequest) {
    
    try {
        const res = await fetch(`${API_BASE}/dogs`);

        if (!res.ok) {
            const text = await res.text();
            return Response.json({ message: text }, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (e) {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}