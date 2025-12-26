import { ChatMode } from "@/components/Agent/Chat";
import { GeneratedWord } from "@/type/word";

export function GenerateAIMessage(
  userId: string,
  fromLang: string,
  toLang: string
) {
  const generate = async (mode: ChatMode, input: string) => {
    let res, data, formatted;

    switch (mode) {
      case "collection":
        res = await fetch(`/api/agent/collection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            text: input,
            language: "pl",
          }),
        });
        
        data = await res.json();

        formatted = data.generated_text
          .map(
            (word: GeneratedWord, index: number) =>
              `${
                index + 1
              }. ${word.word.toUpperCase()} — ${word.translation.toUpperCase()}`
          )
          .join("\n");

        return { content: formatted, collectionData: data.generated_text };

      case "story":
        res = await fetch(`/api/agent/story`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId, text: input }),
        });

        data = await res.json();

        formatted = `Topic: ${data.generated_text[
          "topic of text"
        ].toUpperCase()}\n${data.generated_text["text"]}`;

        return { content: formatted };

      case "translate":
        res = await fetch(`/api/agent/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            text: input,
            from: fromLang,
            target: toLang,
          }),
        });

        data = await res.json();

        formatted = `${fromLang} → ${toLang}\n${
          data.generated_text["original text"]
        } → ${
          data.generated_text["translated text"]
        }\nAlternative: [${data.generated_text["alternative translations"].join(
          ", "
        )}]`;

        return {
          content: formatted,
          translateWord: {
            word: data.generated_text["original text"],
            translation: data.generated_text["translated text"],
            alternatives: [...data.generated_text["alternative translations"]],
          },
        };
    }
  };

  return { generate };
}
