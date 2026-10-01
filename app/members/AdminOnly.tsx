"use client";

import Link from "next/link";
import { useMember } from "./MemberProvider";

// ADMIN에게만 children을 보여줌 (실제 권한 검사는 라우트 핸들러의 requireAdmin)
export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { member, loading, isAdmin } = useMember();

  if (loading) return <p className="p-8">불러오는 중...</p>;

  if (!member) {
    return (
      <div className="p-8 space-y-4">
        <p>로그인이 필요합니다.</p>
        <Link href="/members/login" className="inline-block px-4 py-2 rounded bg-blue-600 text-white">
          로그인
        </Link>
      </div>
    );
  }

  if (!isAdmin) return <p className="p-8 text-red-500">관리자만 접근할 수 있습니다.</p>;

  return children;
}
