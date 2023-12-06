import { useEffect, useRef, useState } from "react";

const DropdownDefault = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <button ref={trigger} onClick={() => setDropdownOpen(!dropdownOpen)}>    
      </button>
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 top-full z-40 w-40 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <button className="flex w-full items-center gap-2 rounded-sm py-1.5 px-4 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">
           Edit
        </button>
        <button className="flex w-full items-center gap-2 rounded-sm py-1.5 px-4 text-left text-sm hover:bg-gray dark:hover:bg-meta-4">        
          Delete
        </button>
      </div>
    </div>
  );
};

export default DropdownDefault;
