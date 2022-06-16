import { Link } from 'react-router-dom';

export const TestHome = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>why hello</h1>
      <div>
        <Link to="wallet">
          <button>wallet</button>
        </Link>
      </div>
    </div>
  );
};
