"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDogPage() {
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

      const res = await fetch("/dogs/api", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "등록에 실패했습니다");
        return;
      }

      router.push("/dogs");
    } catch {
      setError("등록에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2";

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Dog 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          견종
          <input name="kind" required className={inputClass} />
        </label>
        <label className="block">
          국가
          <input name="country" required className={inputClass} />
        </label>
        <label className="block">
          설명
          <textarea name="content" rows={3} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            키 (cm)
            <input name="height" type="number" step="0.1" required className={inputClass} />
          </label>
          <label className="block">
            몸무게 (kg)
            <input name="weight" type="number" step="0.1" required className={inputClass} />
          </label>
        </div>
        <label className="block">
          가격 (원)
          <input name="price" type="number" required className={inputClass} />
        </label>
        <label className="block">
          이미지
          <input name="file" type="file" accept="image/*" className={inputClass} />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {submitting ? "등록 중..." : "등록"}
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
    </div>
  );
}
