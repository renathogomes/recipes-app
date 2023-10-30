import { useNavigate } from 'react-router-dom';
import profileImg from '../../images/profileIcon.svg';
import style from './Header.module.css';
import profileIcon from '../../images/profileIcon2.svg';

export default function ProfileButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={ () => navigate('/profile') }
      className={ style.btnProfile }
    >
      <img
        data-testid="profile-top-btn"
        src={ profileIcon }
        alt="profile icon"
        className={ style.iconProfile }
      />
    </button>
  );
}
