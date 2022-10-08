import { AppHome, StockDetail } from './pages';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Wrapper from './components/wrapper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Wrapper />,
    children: [
      {
        path: '',
        element: <AppHome />
      },
      {
        path: 'detail/:stockSymbol',
        element: <StockDetail />,
      },
    ]
  },
]);

function App() {
  return (
    <>
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
