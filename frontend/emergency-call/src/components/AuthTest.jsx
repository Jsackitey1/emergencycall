import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [testResults, setTestResults] = useState([]);
  const { currentUser, signup, login, loginWithGoogle, logout } = useAuth();

  const addTestResult = (test, success, message) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test signup
  const testSignup = async () => {
    try {
      addTestResult('Signup', null, 'Testing signup...');
      await signup(email, password);
      addTestResult('Signup', true, 'Signup successful');
    } catch (error) {
      addTestResult('Signup', false, `Signup failed: ${error.message}`);
    }
  };

  // Test login
  const testLogin = async () => {
    try {
      addTestResult('Login', null, 'Testing login...');
      await login(email, password);
      addTestResult('Login', true, 'Login successful');
    } catch (error) {
      addTestResult('Login', false, `Login failed: ${error.message}`);
    }
  };

  // Test Google login
  const testGoogleLogin = async () => {
    try {
      addTestResult('Google Login', null, 'Testing Google login...');
      await loginWithGoogle();
      addTestResult('Google Login', true, 'Google login successful');
    } catch (error) {
      addTestResult('Google Login', false, `Google login failed: ${error.message}`);
    }
  };

  // Test logout
  const testLogout = async () => {
    try {
      addTestResult('Logout', null, 'Testing logout...');
      await logout();
      addTestResult('Logout', true, 'Logout successful');
    } catch (error) {
      addTestResult('Logout', false, `Logout failed: ${error.message}`);
    }
  };

  // Test current user state
  useEffect(() => {
    addTestResult(
      'Auth State', 
      true, 
      `Current user: ${currentUser ? currentUser.email : 'No user'}`
    );
  }, [currentUser]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Authentication Test Panel</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Current User Status:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {currentUser ? JSON.stringify(currentUser, null, 2) : 'No user logged in'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Credentials:</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: '5px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Actions:</h3>
        <button 
          onClick={testSignup}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Signup
        </button>
        <button 
          onClick={testLogin}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Login
        </button>
        <button 
          onClick={testGoogleLogin}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Google Login
        </button>
        <button 
          onClick={testLogout}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Test Logout
        </button>
        <button 
          onClick={clearResults}
          style={{ padding: '8px 16px' }}
        >
          Clear Results
        </button>
      </div>

      <div>
        <h3>Test Results:</h3>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px'
        }}>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{
                padding: '8px',
                marginBottom: '4px',
                background: result.success === null 
                  ? '#fff3cd'
                  : result.success 
                    ? '#d4edda'
                    : '#f8d7da',
                borderRadius: '4px'
              }}
            >
              <strong>{result.test}</strong> ({result.timestamp})<br />
              {result.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 