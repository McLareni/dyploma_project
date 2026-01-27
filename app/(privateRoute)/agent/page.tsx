import Chat from "@/components/Agent/Chat";

export default function Agent() {
  return (
    <div className="flex flex-col w-full lg:max-w-2xl lg:mx-auto my-0 lg:my-12 bg-white lg:rounded-xl shadow-md lg:h-[calc(100%-6rem)] h-full">
      <div className="border-b p-4 ">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700">
          AI Study Assistant
        </h2>
      </div>
      <Chat />
    </div>
  );
}
