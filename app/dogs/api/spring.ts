export const API_BASE = process.env.SPRING_API_URL;

// 폼 데이터 → Spring DogRequest(JSON)
export function toDogRequest(formData: FormData) {
    return {
        kind: formData.get('kind'),
        country: formData.get('country'),
        content: formData.get('content'),
        height: Number(formData.get('height')),
        weight: Number(formData.get('weight')),
        price: Number(formData.get('price')),
    };
}

// 'file'이 있으면 POST /dogs/{id}/image 로 업로드. 파일이 없으면 null 반환
// (파일을 선택하지 않으면 빈 File(size 0)이 옴)
export async function uploadImage(id: number | string, formData: FormData) {
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
        return null;
    }

    const imageForm = new FormData();
    imageForm.append('file', file);

    return fetch(`${API_BASE}/dogs/${id}/image`, {
        method: 'POST',
        body: imageForm,
    });
}
