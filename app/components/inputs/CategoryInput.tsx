"use client";

import { IconType } from "react-icons";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer ${
        selected
          ? "border-red-400 bg-red-100 text-red-600"
          : "border-neutral-200"
      }`}
    >
      <Icon size={30} style={{ color: selected ? "red" : "black" }} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryBox;
