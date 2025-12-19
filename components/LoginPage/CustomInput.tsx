import { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  text: string;
  id: string;
  placeholder: string;
}

export default function CustomInput({
  id,
  placeholder,
  text,
  ...props
}: IProps) {
  return (

    <div className="border">
      <label htmlFor={id}>{text}</label>
      <input id={id} name={id} {...props} placeholder={placeholder} />
    </div>
  );
}
