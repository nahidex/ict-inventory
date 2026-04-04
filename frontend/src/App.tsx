/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RootLayout from './app/RootLayout';
import DashboardPage from './app/DashboardPage';
import InventoryPage from './app/inventory/InventoryPage';
import AssetDetailPage from './app/inventory/AssetDetailPage';
import AddAssetPage from './app/inventory/AddAssetPage';
import EditAssetPage from './app/inventory/edit/EditAssetPage';
import OfficersPage from './app/officers/OfficersPage';
import AddOfficerPage from './app/officers/AddOfficerPage';
import OfficerDetailPage from './app/officers/OfficerDetailPage';
import TransferAssetsPage from './app/officers/TransferAssetsPage';
import AssignmentsPage from './app/assignments/AssignmentsPage';
import AssignmentDetailPage from './app/assignments/AssignmentDetailPage';
import ReturnAssetPage from './app/assignments/ReturnAssetPage';
import LoginPage from './app/auth/login/LoginPage';
import BranchPage from './app/branches/BranchPage';
import { authService } from './services/auth.service';


const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <RootLayout>{children}</RootLayout>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoutes><DashboardPage /></ProtectedRoutes>} />
        <Route path="/inventory" element={<ProtectedRoutes><InventoryPage /></ProtectedRoutes>} />
        <Route path="/inventory/edit/:id" element={<ProtectedRoutes><EditAssetPage /></ProtectedRoutes>} />
        <Route path="/inventory/add" element={<ProtectedRoutes><AddAssetPage /></ProtectedRoutes>} />
        <Route path="/inventory/:id" element={<ProtectedRoutes><AssetDetailPage /></ProtectedRoutes>} />
        <Route path="/branches" element={<ProtectedRoutes><BranchPage /></ProtectedRoutes>} />
        <Route path="/officers" element={<ProtectedRoutes><OfficersPage /></ProtectedRoutes>} />
        <Route path="/officers/add" element={<ProtectedRoutes><AddOfficerPage /></ProtectedRoutes>} />
        <Route path="/officers/:id" element={<ProtectedRoutes><OfficerDetailPage /></ProtectedRoutes>} />
        <Route path="/officers/edit/:id" element={<ProtectedRoutes><AddOfficerPage /></ProtectedRoutes>} />
        <Route path="/officers/transfer/:id" element={<ProtectedRoutes><TransferAssetsPage /></ProtectedRoutes>} />
        <Route path="/assignments" element={<ProtectedRoutes><AssignmentsPage /></ProtectedRoutes>} />
        <Route path="/assignments/:id" element={<ProtectedRoutes><AssignmentDetailPage /></ProtectedRoutes>} />
        <Route path="/assignments/return/:id" element={<ProtectedRoutes><ReturnAssetPage /></ProtectedRoutes>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
