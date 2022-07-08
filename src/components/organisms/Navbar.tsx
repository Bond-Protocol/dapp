import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '..';

export const Navbar: FC = () => {
  return (
    <div className="flex justify-evenly py-4">
      <Link to="/">
        <Button>Home</Button>
      </Link>
      <Link to="/wallet">
        <Button>wallet</Button>
      </Link>
      <Link to="/createMarket">
        <Button>Create Market</Button>
      </Link>
    </div>
  );
};
