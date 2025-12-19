interface IProps {
  progress: number;
  total: number;
}

export default function ProgressLine({ progress, total }: IProps) {
  const percentage = (progress / total) * 100;
  return (
    <div className="w-full bg-white h-2.5 absolute bottom-0 left-0">
      <div
        className="bg-blue-600 h-2.5"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
