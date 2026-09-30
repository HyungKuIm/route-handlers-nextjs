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

export async function POST(request: NextRequest) {

    try {
        // 브라우저에서는 multipart/form-data로 받고, Spring에는 2단계로 전달
        // 1) POST /dogs (JSON)  2) POST /dogs/{id}/image (multipart, key: file)
        const formData = await request.formData();

        const dogRequest = {
            kind: formData.get('kind'),
            country: formData.get('country'),
            content: formData.get('content'),
            height: Number(formData.get('height')),
            weight: Number(formData.get('weight')),
            price: Number(formData.get('price')),
        };

        const createRes = await fetch(`${API_BASE}/dogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dogRequest),
        });

        if (!createRes.ok) {
            const text = await createRes.text();
            return Response.json({ message: text }, { status: createRes.status });
        }

        const dog = await createRes.json();

        // 파일을 선택하지 않으면 빈 File(size 0)이 오므로 건너뜀
        const file = formData.get('file');
        if (!(file instanceof File) || file.size === 0) {
            return Response.json(dog, { status: 201 });
        }

        const imageForm = new FormData();
        imageForm.append('file', file);

        const uploadRes = await fetch(`${API_BASE}/dogs/${dog.id}/image`, {
            method: 'POST',
            body: imageForm,
        });

        if (!uploadRes.ok) {
            const text = await uploadRes.text();
            return Response.json(
                { message: `Dog(id=${dog.id})는 등록됐지만 이미지 업로드에 실패했습니다: ${text}` },
                { status: uploadRes.status },
            );
        }

        return Response.json(await uploadRes.json(), { status: 201 });
    } catch {
        return Response.json({ message: 'Spring 서버에 연결할 수 없습니다 '}, { status: 502 });
    }
}
