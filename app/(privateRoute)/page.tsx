import MainBtn from "@/components/HomePage/MainBtn";

export default function Home() {
  return (
    <div className="flex flex-col items-center -mt-14 justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4">Welcome to EasyEnglish</h1>
      <p className="text-xl mb-16 text-center px-4">
        Your personal study app to easily learn new words and improve your
        English skills.
      </p>
      <MainBtn />
    </div>
  );
}
