"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (password !== formData.get("passwordConfirm")) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/members/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "회원가입에 실패했습니다");
        return;
      }

      alert("가입되었습니다. 로그인해 주세요.");
      router.push("/members/login");
    } catch {
      setError("회원가입에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2";

  return (
    <div className="p-8 max-w-sm">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          아이디 (4~50자)
          <input
            name="username"
            required
            minLength={4}
            maxLength={50}
            autoComplete="username"
            className={inputClass}
          />
        </label>
        <label className="block">
          비밀번호 (4~100자)
          <input
            name="password"
            type="password"
            required
            minLength={4}
            maxLength={100}
            autoComplete="new-password"
            className={inputClass}
          />
        </label>
        <label className="block">
          비밀번호 확인
          <input
            name="passwordConfirm"
            type="password"
            required
            autoComplete="new-password"
            className={inputClass}
          />
        </label>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {submitting ? "가입 중..." : "가입하기"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        이미 계정이 있나요?{" "}
        <Link href="/members/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
