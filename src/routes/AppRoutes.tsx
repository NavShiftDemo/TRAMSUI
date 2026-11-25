import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import DriverLayout from '../layouts/DriverLayout';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Feature Pages
import { LoginPage } from '../features/auth';
import { DashboardPage } from '../features/dashboard';
import { OrganizationsPage } from '../features/organizations';
import { VehiclesPage } from '../features/vehicles';
import { DriversPage } from '../features/drivers';
import { TripsPage } from '../features/trips';
import { BookingsPage } from '../features/bookings';
import { ExpensesPage } from '../features/expenses';
import { MaintenancePage } from '../features/maintenance';
import { LoansPage } from '../features/loans';
import { DocumentsPage } from '../features/documents';
import { NotificationsPage } from '../features/notifications';
import { ReportsPage } from '../features/reports';
import { SettingsPage } from '../features/settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Management & Admin Dashboard */}
        <Route
          element={<RoleBasedRoute allowedRoles={['ADMIN', 'MANAGER', 'DISPATCHER']} />}
        >
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.ORGANIZATIONS} element={<OrganizationsPage />} />
            <Route path={ROUTES.VEHICLES} element={<VehiclesPage />} />
            <Route path={ROUTES.DRIVERS} element={<DriversPage />} />
            <Route path={ROUTES.TRIPS} element={<TripsPage />} />
            <Route path={ROUTES.BOOKINGS} element={<BookingsPage />} />
            <Route path={ROUTES.EXPENSES} element={<ExpensesPage />} />
            <Route path={ROUTES.MAINTENANCE} element={<MaintenancePage />} />
            <Route path={ROUTES.LOANS} element={<LoansPage />} />
            <Route path={ROUTES.DOCUMENTS} element={<DocumentsPage />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Driver Portal */}
        <Route element={<RoleBasedRoute allowedRoles={['DRIVER']} />}>
          <Route path={ROUTES.DRIVER_PORTAL} element={<DriverLayout />}>
            <Route index element={<TripsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};

export default AppRoutes;
