import { Word } from "@/type/word";
import Actions from "./Actions";

interface IProps {
  word: any;
}

export default function Study({ word: studyWord }: IProps) {
  return (
    <div className="flex flex-col items-center gap-24">
      <div className="bg-white aspect-square rounded">
        <h2 className="text-2xl text-center leading-64">{studyWord.word}</h2>
      </div>
      <Actions />
    </div>
  );
}
