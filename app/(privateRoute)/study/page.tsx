import StudySession from "@/components/Study/StudySession";
import { getValue } from "@/utils/getCookiesValue";

const URL = process.env.PUBLIC_HOST;

export default async function Study() {
  const sessionToken = await getValue("session");

  const res = await fetch(`${URL}/api/study`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div className="h-full overflow-y-auto">
      <StudySession
        words={data.map((item: any) => item.word)}
        progress={0}
        isStudy
      />
    </div>
  );
}
