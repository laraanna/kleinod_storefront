import {useState, useRef, useEffect} from 'react';

interface Option {
  id: string;
  name: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

export default function CustomSelect({
  options,
  onChange,
  defaultValue,
}: CustomSelectProps) {
  const [selected, setSelected] = useState<Option>(
    options.find((opt) => opt.value === defaultValue) || options[0],
  );
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative w-48" ref={selectRef}>
      {/* Selected Item */}
      <div
        className="bg-white border px-4 py-2 rounded cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.label}
        <span className="ml-2">▼</span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-md z-10">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                selected.value === option.value ? 'bg-gray-300' : ''
              }`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
                onChange(option.value);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
