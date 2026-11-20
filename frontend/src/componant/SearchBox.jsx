import "./SearchBox.css";

function SearchBox({ value, onChange, placeholder = "ابحث..." }) {
  return (
    <div className="search-box">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" onClick={() => onChange("")} aria-label="مسح البحث">
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBox;
