/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useRouteError
} from 'react-router';
import { BaseLayout } from '@/layouts';

const Home = lazy(() => import('@/views/Home'));
const NotFound = lazy(() => import('@/views/NotFound'));

function RootErrorBoundary() {
  const error = useRouteError() as Error;
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    location.reload();
  }
  return null;
}

const lazyView = (view: JSX.Element) => {
  return <Suspense fallback="Loading...">{view}</Suspense>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RootErrorBoundary />}>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={lazyView(<Home />)} />
        <Route path="*" element={lazyView(<NotFound />)} />
      </Route>
    </Route>
  )
);

export default router;
