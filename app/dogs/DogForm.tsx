"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Dog, imageSrc } from "./types";

type Props = {
  dog?: Dog; // 있으면 수정 모드 (PUT), 없으면 등록 모드 (POST)
};

export default function DogForm({ dog }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // input의 name이 그대로 form-data 키가 됨 (파일은 "file")
      const formData = new FormData(e.currentTarget);

      const res = await fetch(dog ? `/dogs/api/${dog.id}` : "/dogs/api", {
        method: dog ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "저장에 실패했습니다");
        return;
      }

      router.push("/dogs");
    } catch {
      setError("저장에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        견종
        <input name="kind" required defaultValue={dog?.kind} className={inputClass} />
      </label>
      <label className="block">
        국가
        <input name="country" required defaultValue={dog?.country} className={inputClass} />
      </label>
      <label className="block">
        설명
        <textarea name="content" rows={3} defaultValue={dog?.content ?? ""} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          키 (cm)
          <input name="height" type="number" step="0.1" required defaultValue={dog?.height} className={inputClass} />
        </label>
        <label className="block">
          몸무게 (kg)
          <input name="weight" type="number" step="0.1" required defaultValue={dog?.weight} className={inputClass} />
        </label>
      </div>
      <label className="block">
        가격 (원)
        <input name="price" type="number" required defaultValue={dog?.price} className={inputClass} />
      </label>
      <label className="block">
        이미지{dog && " (선택하지 않으면 기존 이미지 유지)"}
        {dog?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc(dog.image)}
            alt={dog.kind}
            className="w-32 h-32 object-cover rounded my-2 bg-gray-100"
          />
        )}
        <input name="file" type="file" accept="image/*" className={inputClass} />
      </label>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {submitting ? "저장 중..." : dog ? "수정" : "등록"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dogs")}
          className="px-4 py-2 rounded border border-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  );
}
