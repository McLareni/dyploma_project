import CollectionCard from "@/components/Collections/CollectionCard/CollectionCard";
import Study from "@/components/Study/Study";
import StudySession from "@/components/Study/StudySession";
const URL = process.env.PUBLIC_HOST;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ id: string }>;
};

export default async function Collection({ searchParams, params }: PageProps) {
  const progress = (await searchParams).progress ?? "";

  const collectionId = (await params).id;
  const res = await fetch(URL + `/api/collections/${collectionId}`);
  const collection: any = await res.json();
  return (
    <div className="flex flex-col items-center p-12 gap-32">
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
