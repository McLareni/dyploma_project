import MainBtn from "@/components/HomePage/MainBtn";
import WordsShowcase from "@/components/HomePage/WordsShowcase";

export default function Home() {
  return (
    <main className="relative -mt-14 flex min-h-screen max-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="absolute left-8 top-20">
          <WordsShowcase />
        </div>

        <div className="flex flex-col items-center justify-center gap-5 text-center lg:max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome to EasyLanguage
          </h1>
          <p className="text-xl text-slate-700">
            Your personal study app to easily learn new words and improve your
            language skills.
          </p>
          <MainBtn />
        </div>
      </div>
    </main>
  );
}
