"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "./MemberProvider";

export default function MemberNav() {
  const router = useRouter();
  const { member, loading, setMember } = useMember();

  async function handleLogout() {
    if (!confirm("로그아웃할까요? 장바구니도 비워집니다.")) return;

    try {
      const res = await fetch("/members/api/logout", { method: "POST" });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message ?? "로그아웃에 실패했습니다");
        return;
      }

      setMember(null);
      router.push("/dogs");
    } catch {
      alert("로그아웃에 실패했습니다");
    }
  }

  if (loading) return null;

  if (!member) {
    return (
      <div className="flex gap-2">
        <Link href="/members/login" className="px-3 py-1 rounded border border-gray-300">
          로그인
        </Link>
        <Link href="/members/signup" className="px-3 py-1 rounded bg-blue-600 text-white">
          회원가입
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span>
        {member.username}
        {member.role === "ADMIN" && (
          <span className="ml-1 px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">ADMIN</span>
        )}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="px-3 py-1 rounded border border-gray-300"
      >
        로그아웃
      </button>
    </div>
  );
}
