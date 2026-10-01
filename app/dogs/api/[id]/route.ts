import { type NextRequest } from "next/server";
import { API_BASE, toDogRequest, uploadImage } from "../spring";

// 상세 조회 (Spring에서 조회수가 1 증가함)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const res = await fetch(`${API_BASE}/dogs/${id}`);

        if (!res.ok) {
            const text = await res.text();
            return Response.json({ message: text }, { status: res.status });
        }

        return Response.json(await res.json());
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // 1) PUT /dogs/{id} (JSON)  2) 새 파일이 있으면 POST /dogs/{id}/image
        const formData = await request.formData();

        const updateRes = await fetch(`${API_BASE}/dogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toDogRequest(formData)),
        });

        if (!updateRes.ok) {
            const text = await updateRes.text();
            return Response.json({ message: text }, { status: updateRes.status });
        }

        const dog = await updateRes.json();

        const uploadRes = await uploadImage(id, formData);
        if (!uploadRes) {
            return Response.json(dog);
        }

        if (!uploadRes.ok) {
            const text = await uploadRes.text();
            return Response.json(
                { message: `Dog(id=${id}) 정보는 수정됐지만 이미지 업로드에 실패했습니다: ${text}` },
                { status: uploadRes.status },
            );
        }

        return Response.json(await uploadRes.json());
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const res = await fetch(`${API_BASE}/dogs/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            const text = await res.text();
            return Response.json({ message: text }, { status: res.status });
        }

        // Spring은 보통 204 No Content를 반환하므로 본문 없이 전달
        return new Response(null, { status: 204 });
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}
