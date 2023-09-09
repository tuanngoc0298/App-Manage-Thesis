import "./SearchBar.scss";
import images from "~/assets/img";

function SearchBar({ setSearchQuery, handleSearch }) {
  return (
    <div className="wrap-search">
      <input type="text" className="search" placeholder="Tìm kiếm" onChange={(e) => setSearchQuery(e.target.value)} />
      <button className="search-btn" onClick={handleSearch}>
        <img src={images.search} alt="search" />
      </button>
    </div>
  );
}

export default SearchBar;
