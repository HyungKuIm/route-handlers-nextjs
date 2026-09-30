"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DogForm from "../../DogForm";
import { type Dog } from "../../types";

export default function EditDogPage() {
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDog() {
      try {
        // 목록 API에서 해당 id를 찾음 (상세 조회로 조회수가 오르지 않도록)
        const res = await fetch("/dogs/api");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message ?? "정보를 불러오지 못했습니다");
          return;
        }

        const found = (data as Dog[]).find((d) => String(d.id) === id);
        if (!found) {
          setError("해당 dog를 찾을 수 없습니다");
          return;
        }

        setDog(found);
      } catch {
        setError("정보를 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchDog();
  }, [id]);

  if (loading) return <p className="p-8">불러오는 중...</p>;
  if (error || !dog) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Dog 수정</h1>
      <DogForm dog={dog} />
    </div>
  );
}
