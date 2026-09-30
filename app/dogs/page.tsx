"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Dog, imageSrc } from "./types";

export default function DogsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const res = await fetch("/dogs/api");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message ?? "목록을 불러오지 못했습니다");
          return;
        }

        setDogs(data);
      } catch {
        setError("목록을 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchDogs();
  }, []);

  async function handleDelete(dog: Dog) {
    if (!confirm(`'${dog.kind}'을(를) 삭제할까요?`)) return;

    try {
      const res = await fetch(`/dogs/api/${dog.id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message ?? "삭제에 실패했습니다");
        return;
      }

      setDogs((prev) => prev.filter((d) => d.id !== dog.id));
    } catch {
      alert("삭제에 실패했습니다");
    }
  }

  if (loading) return <p className="p-8">불러오는 중...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dogs</h1>
        <Link
          href="/dogs/new"
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          등록
        </Link>
      </div>
      {dogs.length === 0 && <p>등록된 dog가 없습니다.</p>}
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dogs.map((dog) => (
          <li
            key={dog.id}
            className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/dogs/${dog.id}/edit`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc(dog.image)}
                alt={dog.kind}
                className="w-full h-48 object-cover bg-gray-100"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-semibold">{dog.kind}</h2>
                <p className="text-sm text-gray-500">{dog.country}</p>
                <p>{dog.content}</p>
                <p className="text-sm">
                  키 {dog.height}cm · 몸무게 {dog.weight}kg
                </p>
                <p className="font-bold">{dog.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-400">조회수 {dog.readcount}</p>
              </div>
            </Link>
            <div className="px-4 pb-4 text-right">
              <button
                type="button"
                onClick={() => handleDelete(dog)}
                className="px-3 py-1 rounded border border-red-500 text-red-500 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
