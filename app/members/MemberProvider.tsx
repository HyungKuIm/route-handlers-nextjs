"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Member } from "./types";

type MemberContextValue = {
  member: Member | null;
  loading: boolean;
  setMember: (member: Member | null) => void;
};

const MemberContext = createContext<MemberContextValue | null>(null);

// 로그인한 회원 정보를 앱 전체에서 공유 (로그인/로그아웃 시 setMember로 갱신)
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/members/api/me");
        if (res.ok) {
          setMember(await res.json());
        }
      } catch {
        // 서버에 연결할 수 없으면 비로그인 상태로 둠
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  return <MemberContext value={{ member, loading, setMember }}>{children}</MemberContext>;
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember는 MemberProvider 안에서만 쓸 수 있습니다");
  }

  return { ...context, isAdmin: context.member?.role === "ADMIN" };
}
