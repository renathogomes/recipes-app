import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../contexts/global.context';
import style from './Login.module.css';

function Login() {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const { update } = useContext(GlobalContext);
  const navigate = useNavigate();
  const validateEmail = /\S+@\S+\.\S+/;

  useEffect(() => {
    if ((validateEmail.test(inputEmail)) && (inputPass.length + 1 > 7)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [inputEmail, inputPass]); // Valida o número de caracteres reais em cada input

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPass(e.target.value);
  };

  const handleClick = () => {
    localStorage.setItem('user', JSON.stringify({ // seta o objeto no localStorage
      email: inputEmail,
    }));
    update({ user: { email: inputEmail } }); // atualiza o estado global
    navigate('/meals');
  };

  return (
    <div className={ style.container }>
      <img src="src/icons/login.svg" alt="" />
      <h1 className={ style.heading }>Login</h1>
      <input
        className={ style.inputLogin }
        type="email"
        data-testid="email-input"
        onChange={ handleChangeEmail }
        value={ inputEmail }
      />
      <input
        className={ style.inputLogin }
        type="password"
        data-testid="password-input"
        onChange={ handleChangePassword }
        minLength={ 7 }
        value={ inputPass }
      />
      <button
        className={ style.btnLogin }
        type="submit"
        data-testid="login-submit-btn"
        disabled={ isDisabled }
        onClick={ handleClick }
      >
        Enter
      </button>
    </div>
  );
}

export default Login;
