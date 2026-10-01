"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMember } from "../MemberProvider";

export default function LoginPage() {
  const router = useRouter();
  const { setMember } = useMember();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/members/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "로그인에 실패했습니다");
        return;
      }

      setMember(data);
      router.push("/dogs");
    } catch {
      setError("로그인에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2";

  return (
    <div className="p-8 max-w-sm">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          아이디
          <input name="username" required autoComplete="username" className={inputClass} />
        </label>
        <label className="block">
          비밀번호
          <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        계정이 없나요?{" "}
        <Link href="/members/signup" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
