import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import SendIcon from "../../assets/icons/send.svg?react";

interface IProps {
  user_name?: string;
  handleInputValue: (val: string) => void;
  input_placeholder?: string;
  initial_value: string;
}

const CommentBox = ({ handleInputValue, input_placeholder, initial_value }: IProps) => {
  //state
  const [inputValue, setInputValue] = useState(initial_value ?? "");
  const debouncedValue = useDebounce(inputValue);

  //methods
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
  }

  function handleBlur() {
    handleInputValue(inputValue.trim());
    setInputValue("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInputValue(inputValue.trim());
      setInputValue("")
    }
  }

  function handleSendClick() {
    handleInputValue(inputValue.trim());
  }

  return (
    <div className="flex gap-2 items-center w-full z-10 ">
      <div className="flex gap-2 items-center bg-gray-100 rounded-xl py-1 px-2">
        <textarea
          autoFocus
          className="rounded-xl p-1 resize-none outline-none "
          rows={inputValue.trim() === "" ? 1 : 3}
          cols={40}
          placeholder={input_placeholder ?? "Add a comment"}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          value={inputValue}
        ></textarea>

        <button
          className="border border-transparent cursor-pointer hover:border-gray-400 bg-gray-300 p-[0.1rem] rounded-full h-fit"
          onClick={handleSendClick}
        >
          <SendIcon fill="white" className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
