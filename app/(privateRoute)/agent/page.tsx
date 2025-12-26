import Chat from "@/components/Agent/Chat";

export default function Agent() {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto my-16 bg-white rounded-xl shadow-md h-[80vh]">
      <div className="border-b p-4 shrink-0">
        <h2 className="text-lg font-semibold text-gray-700">
          AI Study Assistant
        </h2>
      </div>
      <Chat />
    </div>
  );
}
