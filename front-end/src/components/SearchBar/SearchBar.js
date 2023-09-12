import images from "~/assets/img";
import classNames from "classnames/bind";
import styles from "./SearchBar.module.scss";

const cx = classNames.bind(styles);
function SearchBar({ setSearchQuery, handleSearch }) {
  return (
    <div className={cx("wrapper")}>
      <input
        type="text"
        className={cx("input")}
        placeholder="Tìm kiếm"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className={cx("btn")} onClick={handleSearch}>
        <img src={images.search} alt="search" />
      </button>
    </div>
  );
}

export default SearchBar;
