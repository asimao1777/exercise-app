import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

function Layout() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <header>
        <Navigation />
        <h1>Exercise Tracker</h1>
        <p>Track your workout progress with this easy-to-use exercise manager.</p>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; {currentYear} John Doe</p>
      </footer>
    </>
  );
}

export default Layout;

