import { DefaultSession } from "next-auth";

/** 로그인 시 JWT에 넣는 기업 프로필 (대시보드 사이드바 등에서 사용) */
export type CorporationProfile = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  industry: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    /** 기업 회원일 때만 존재 */
    corporation?: CorporationProfile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    corporation?: CorporationProfile;
  }
}
