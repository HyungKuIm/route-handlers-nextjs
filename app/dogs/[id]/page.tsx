"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type Dog, imageSrc } from "../types";
import { useMember } from "../../members/MemberProvider";

export default function DogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { isAdmin } = useMember();

  useEffect(() => {
    async function fetchDog() {
      try {
        const res = await fetch(`/dogs/api/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message ?? "정보를 불러오지 못했습니다");
          return;
        }

        setDog(data);
      } catch {
        setError("정보를 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchDog();
  }, [id]);

  async function handleAddToCart() {
    if (!dog) return;
    setAdding(true);

    try {
      const res = await fetch("/cart/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dogId: dog.id, quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message ?? "장바구니에 담지 못했습니다");
        return;
      }

      if (confirm("장바구니에 담았습니다. 장바구니로 이동할까요?")) {
        router.push("/cart");
      }
    } catch {
      alert("장바구니에 담지 못했습니다");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="p-8">불러오는 중...</p>;
  if (error || !dog) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="grid gap-8 sm:grid-cols-2">
        {dog.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc(dog.image)}
            alt={dog.kind}
            className="w-full aspect-square object-cover rounded-lg bg-gray-100"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            이미지 없음
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{dog.kind}</h1>
          <p className="text-gray-500">{dog.country}</p>
          <p>{dog.content}</p>
          <p className="text-sm">
            키 {dog.height}cm · 몸무게 {dog.weight}kg
          </p>
          <p className="text-xs text-gray-400">조회수 {dog.readcount}</p>
          <p className="text-xl font-bold">{dog.price.toLocaleString()}원</p>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {adding ? "담는 중..." : "장바구니 담기"}
            </button>
          </div>

          <div className="flex gap-2 pt-4">
            {isAdmin && (
              <Link href={`/dogs/${dog.id}/edit`} className="px-4 py-2 rounded border border-gray-300">
                수정
              </Link>
            )}
            <Link href="/dogs" className="px-4 py-2 rounded border border-gray-300">
              목록
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
