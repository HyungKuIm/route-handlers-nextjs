"use client";

import { useEffect, useState } from "react";

type Dog = {
  id: number;
  kind: string;
  country: string;
  content: string;
  height: number;
  weight: number;
  price: number;
  readcount: number;
  image: string;
};

// "h.jpg"처럼 경로 없이 파일명만 온 경우도 /images/ 아래로 맞춤
function imageSrc(image: string) {
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/images/${image}`;
}

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

  if (loading) return <p className="p-8">불러오는 중...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (dogs.length === 0) return <p className="p-8">등록된 dog가 없습니다.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dogs</h1>
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dogs.map((dog) => (
          <li key={dog.id} className="border border-gray-300 rounded-lg overflow-hidden">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
