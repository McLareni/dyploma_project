import StudySession from "@/components/Study/StudySession";
import { getValue } from "@/utils/getCookiesValue";

const URL = process.env.PUBLIC_HOST;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ id: string }>;
};

export default async function Collection({ searchParams, params }: PageProps) {
  const sessionToken = await getValue("session");
  const progress = (await searchParams).progress ?? "";

  const collectionId = (await params).id;
  const res = await fetch(URL + `/api/collections/${collectionId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const collection: any = await res.json();

  return (
    <div className="flex flex-col items-center p-12 gap-20">
      <div>
        <h2 className="text-5xl text-gray-700">
          Collection: {collection.name}
        </h2>
        <p className="text-right">Author: {collection.authorName}</p>
      </div>
      <StudySession words={collection.words} progress={Number(progress)} />
      
    </div>
  );
}
