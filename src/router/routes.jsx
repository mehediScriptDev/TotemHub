import { createBrowserRouter } from 'react-router';
import AdminLayout from '../layout/AdminLayout';
import ProtectedRoute from '../Components/common/ProtectedRoute';
import LoginPage from '../pages/login/LoginPage';
import DashboardPage from '../pages/admin/dashboard/DashboardPage';
import CreateTotemPage from '../pages/admin/create-totem/CreateTotemPage';
import TotemDetailPage from '../pages/admin/totem-detail/TotemDetailPage';
import NotFound from '../pages/error/NotFound';

export const router = createBrowserRouter([
  // ── Public: Login ──
  {
    path: '/login',
    element: <LoginPage />,
  },

  // ── Protected: Admin Layout ──
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'totem/new',
        element: <CreateTotemPage />,
      },
      {
        path: 'totem/:id',
        element: <TotemDetailPage />,
      },
    ],
  },

  // ── 404 Catch-All ──
  {
    path: '*',
    element: <NotFound />,
  },
]);