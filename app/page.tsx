import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Pickable</h1>
        <p className="text-gray-500">GDGoC 해커톤 프로젝트</p>

        <div className="border-t pt-4 space-y-2">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="프로필"
              className="mx-auto h-16 w-16 rounded-full"
            />
          )}
          <p className="font-medium text-gray-900">{session.user.name}</p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            로그아웃
          </button>
        </form>
      </div>
    </main>
  );
}
