interface IProps {
  currIndex: number;
  maxIndex: number;
}

export default function StudyCounter({ currIndex, maxIndex }: IProps) {
  return (
    <h2 className="text-5xl text-gray-700">
      {currIndex}/{maxIndex}
    </h2>
  );
}
