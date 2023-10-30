import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import SearchButton from './SearchButton';
import style from './Header.module.css';
import trayImg from '../../images/tray.svg';
import SearchInput from '../SearchBar';

type HeaderProps = {
  pageTitle: string,
  searchIcon?: boolean;
};

export default function Header({ pageTitle, searchIcon = true }: HeaderProps) {
  const [searchOn, setSearchOn] = useState(false);

  return (
    <header className={ style.headerContainer }>
      <div className={ style.TopHeaderContainer }>
        <button
          className={ style.headerTitle }
        >
          <img src={ trayImg } alt="meal icon" />
          <h1
            className={ style.heading }
          >
            <span className={ style.titleSpan }>Recipes</span>
            {' '}
            <span className={ style.subtitleSpan }>app</span>
          </h1>
        </button>
        <div className={ style.icons }>
          { searchIcon && <SearchButton barVisible={ () => setSearchOn(!searchOn) } /> }
          <ProfileButton />
        </div>
      </div>
      { searchOn && <SearchInput /> }
      <div className={ style.bottomHeaderContainer }>
        <img src={ `src/icons/${pageTitle}.svg` } alt="" />
        <h2
          data-testid="page-title"
          className={ style.bottomHeading }
        >
          { pageTitle }
        </h2>
      </div>
    </header>
  );
}
