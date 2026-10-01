"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { imageSrc } from "../dogs/types";
import { type Cart, type CartItem } from "./types";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/cart/api");
        const data = await res.json();

        if (!res.ok) {
          setError(data.message ?? "장바구니를 불러오지 못했습니다");
          return;
        }

        setCart(data);
      } catch {
        setError("장바구니를 불러오지 못했습니다");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  async function handleRemove(item: CartItem) {
    if (!confirm(`'${item.kind}'을(를) 장바구니에서 뺄까요?`)) return;

    try {
      const res = await fetch(`/cart/api/items/${item.dogId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message ?? "삭제에 실패했습니다");
        return;
      }

      // Spring이 갱신된 장바구니 전체를 돌려줌
      setCart(data);
    } catch {
      alert("삭제에 실패했습니다");
    }
  }

  if (loading) return <p className="p-8">불러오는 중...</p>;
  if (error || !cart) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">장바구니</h1>
        <Link href="/dogs" className="px-4 py-2 rounded border border-gray-300">
          계속 쇼핑하기
        </Link>
      </div>

      {cart.items.length === 0 && <p>장바구니가 비어 있습니다.</p>}

      <ul className="divide-y divide-gray-200">
        {cart.items.map((item) => (
          <li key={item.dogId} className="flex items-center gap-4 py-4">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc(item.image)}
                alt={item.kind}
                className="w-20 h-20 object-cover rounded bg-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded bg-gray-100" />
            )}
            <div className="flex-1">
              <Link href={`/dogs/${item.dogId}`} className="font-semibold hover:underline">
                {item.kind}
              </Link>
              <p className="text-sm text-gray-500">
                {item.price.toLocaleString()}원 × {item.quantity}
              </p>
            </div>
            <p className="font-bold">{item.amount.toLocaleString()}원</p>
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="px-3 py-1 rounded border border-red-500 text-red-500 hover:bg-red-50"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {cart.items.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-300 text-right space-y-1">
          <p>총 수량 {cart.totalQuantity}개</p>
          <p className="text-xl font-bold">합계 {cart.totalPrice.toLocaleString()}원</p>
        </div>
      )}
    </div>
  );
}
