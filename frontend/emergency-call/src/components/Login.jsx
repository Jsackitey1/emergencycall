import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn, FaGithub, FaInstagram, FaMedium, FaTwitter } from 'react-icons/fa';
import '../styles/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return error.message;
    }
  };

  async function handleSignIn(e) {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    
    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(signUpEmail, signUpPassword);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google: ' + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const handlePanelSwitch = () => {
    const container = document.getElementById('container');
    if (container) {
      container.classList.toggle('right-panel-active');
    }
  };

  return (
    <>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><FaFacebookF /></a>
              <a href="#" onClick={handleGoogleSignIn} className="social"><FaGooglePlusG /></a>
              <a href="#" className="social"><FaLinkedinIn /></a>
            </div>
            <span>or use your email for registration</span>
            {error && <div className="error-message">{error}</div>}
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><FaFacebookF /></a>
              <a href="#" onClick={handleGoogleSignIn} className="social"><FaGooglePlusG /></a>
              <a href="#" className="social"><FaLinkedinIn /></a>
            </div>
            <span>or use your account</span>
            {error && <div className="error-message">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={handlePanelSwitch}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handlePanelSwitch}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <b>Follow me on</b>
        <div className="icons">
          <a href="https://github.com/kvaibhav01" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.instagram.com/vaibhavkhulbe143/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://medium.com/@vaibhavkhulbe" target="_blank" rel="noopener noreferrer">
            <FaMedium />
          </a>
          <a href="https://twitter.com/vaibhav_khulbe" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/in/vaibhav-khulbe/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </>
  );
} 