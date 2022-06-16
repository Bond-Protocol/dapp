import { Link } from 'react-router-dom';
import type { FC } from 'react';

export const Navbar: FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/hello">
        <button>hello</button>
      </Link>
      <Link to="/wallet">
        <button>wallet</button>
      </Link>
    </div>
  );
};
