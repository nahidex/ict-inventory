/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './app/layout';
import DashboardPage from './app/page';
import InventoryPage from './app/inventory/page';
import AssetDetailPage from './app/inventory/AssetDetailPage';
import AddAssetPage from './app/inventory/AddAssetPage';
import OfficersPage from './app/officers/page';
import AddOfficerPage from './app/officers/AddOfficerPage';
import EditOfficerPage from './app/officers/EditOfficerPage';
import AssignmentsPage from './app/assignments/page';
import AssignmentDetailPage from './app/assignments/AssignmentDetailPage';
import ReturnAssetPage from './app/assignments/ReturnAssetPage';

export default function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/add" element={<AddAssetPage />} />
          <Route path="/inventory/:id" element={<AssetDetailPage />} />
          <Route path="/officers" element={<OfficersPage />} />
          <Route path="/officers/add" element={<AddOfficerPage />} />
          <Route path="/officers/edit/:id" element={<EditOfficerPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
          <Route path="/assignments/return/:id" element={<ReturnAssetPage />} />
          {/* Fallback to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RootLayout>
    </Router>
  );
}
