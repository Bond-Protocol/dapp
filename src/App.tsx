import { Navbar } from 'components/Navbar';
import { FC } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Routes } from './routes';
import { Providers } from './providers/providers';

export const App: FC = () => {
  return (
    <Providers>
      <Router>
        <Navbar />
        <Routes />
      </Router>
    </Providers>
  );
};
