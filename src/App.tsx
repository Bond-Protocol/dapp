import { FC } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Providers } from 'services/providers';
import { Navbar } from 'components/organisms';
import { Routes } from 'pages/routes';

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
