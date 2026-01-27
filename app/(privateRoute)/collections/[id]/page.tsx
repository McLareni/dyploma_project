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
    <div className="flex flex-col items-center p-4 gap-4 h-full">
      <div className="text-center sm:text-left max-w-4xl">
        <h2 className="text-2xl lg:text-4xl text-gray-700 break-words">
          Collection: {collection.name}
        </h2>
        <p className="text-sm sm:text-base text-right mt-1">Author: {collection.authorName}</p>
      </div>
      <StudySession
        words={collection.words.map((item: any) => ({ ...item.word }))}
        progress={Number(progress)}
        collectionId={collection.id}
      />
    </div>
  );
}
