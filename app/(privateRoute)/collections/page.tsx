import CollectionCard from "@/components/Collections/CollectionCard/CollectionCard";
import { Collection } from "@/type/collection";
import { getValue } from "@/utils/getCookiesValue";

const URL = process.env.PUBLIC_HOST;

export default async function Collections() {
  const sessionToken = await getValue("session");
  const res = await fetch(URL + "/api/collections", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });
  const collections: Collection[] = await res.json();

  console.log(collections);

  return (
    <div className="flex flex-row flex-wrap gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 justify-center overflow-y-scroll max-h-full">
      {collections.length &&
        collections.map((collection: any) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
    </div>
  );
}
