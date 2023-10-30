import searchImg from '../../images/searchIcon.svg';
import style from './Header.module.css';
import searchIcon from '../../images/searchIcon2.svg';

type SearchButtonProps = {
  barVisible: () => void;
};

export default function SearchButton({ barVisible }: SearchButtonProps) {
  return (
    <button
      onClick={ () => barVisible() }
      className={ style.btnSearch }
    >
      <img
        data-testid="search-top-btn"
        src={ searchIcon }
        alt="search icon"
        className={ style.iconSearch }
      />
    </button>
  );
}
