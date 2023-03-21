import { SearchBar } from "components/molecules/SearchBar";
import { useState } from "react";

export const TokenPickerDialog = (props: {
  onChange: Function;
  onCancel: Function;
}) => {
  const [filter, setFilter] = useState("");

  return (
    <div className="w-[448px]">
      <SearchBar
        value={filter}
        onChange={setFilter}
        inputClassName=""
        placeholder="Search name or paste token address"
      />
    </div>
  );
};
