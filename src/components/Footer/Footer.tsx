import { useNavigate } from 'react-router-dom';
import drinkIcon from '../../images/drinkIcon.svg';
import mealIcon from '../../images/mealIcon2.svg';
import style from './Footer.module.css';
import drink from '../../images/drinkIcon2.svg';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      data-testid="footer"
      className={ style.footer }
    >
      <button
        onClick={ () => navigate('/drinks') }
        className={ style.footerIcon }
      >
        <img
          className={ style.menufooter }
          data-testid="drinks-bottom-btn"
          src={ drink }
          alt="drink icon"
        />
      </button>
      <button
        onClick={ () => navigate('/meals') }
        className={ style.footerIcon }
      >
        <img
          className={ style.menufooter }
          data-testid="meals-bottom-btn"
          src={ mealIcon }
          alt="meal icon"
          style={ { width: '40px' } }
        />
      </button>
    </footer>
  );
}
