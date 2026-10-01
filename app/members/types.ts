export type Role = "USER" | "ADMIN";

// Spring MemberResponse (비밀번호 제외)
export type Member = {
  id: number;
  username: string;
  role: Role;
};
