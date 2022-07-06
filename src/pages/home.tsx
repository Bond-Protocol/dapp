import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <>
      <div className="bg-yellow-500" style={{ textAlign: 'center' }}>
        <h1>why hello</h1>
        <div>
          <Link to="wallet">
            <button>wallet</button>
          </Link>
        </div>
      </div>
    </>
  );
};
