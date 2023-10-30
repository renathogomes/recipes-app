import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { GlobalContext } from '../../contexts/global.context';
import style from './Profile.module.css';

function Profile() {
  const { state } = useContext(GlobalContext);

  const getEmail = () => {
    const localStorageData = localStorage.getItem('user');
    let jsonData = '';
    if (localStorageData) {
      jsonData = JSON.parse(localStorageData).email;
    }
    return state.user.email || jsonData;
  };

  const navigate = useNavigate();

  const redirect = (url: string) => navigate(`/${url}-recipes`);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <Header
        pageTitle="Profile"
        searchIcon={ false }
      />
      <div className={ style.profileContainer }>
        <span
          data-testid="profile-email"
          className={ style.spanEmail }
        >
          { `${getEmail()}` }
        </span>
        <button
          type="button"
          data-testid="profile-done-btn"
          onClick={ () => redirect('done') }
          className={ style.btnDone }
        >
          <img src="src/icons/Done Recipes.svg" alt="" />
          <span className={ style.spanBtn }>Done Recipes</span>
        </button>
        <div className={ style.separator } />
        <button
          type="button"
          data-testid="profile-favorite-btn"
          onClick={ () => redirect('favorite') }
          className={ style.btnFav }
        >
          <img src="src/icons/Favorite.svg" alt="" />
          <span className={ style.spanBtn }>Favorite Recipes</span>
        </button>
        <div className={ style.separator } />
        <button
          type="button"
          data-testid="profile-logout-btn"
          onClick={ logout }
          className={ style.btnLogout }
        >
          <img src="src/icons/Logout.svg" alt="" />
          <span className={ style.spanBtn }>Logout</span>
        </button>
      </div>
    </>

  );
}
export default Profile;
