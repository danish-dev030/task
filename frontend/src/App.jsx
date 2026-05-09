import { Route, Routes } from 'react-router-dom';
import RootRedirect from './components/RootRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import CreatorDashboard from './pages/CreatorDashboard';
import UploadPage from './pages/UploadPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute role="consumer">
              <FeedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/photo/:id"
          element={
            <ProtectedRoute role="any">
              <PhotoDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator"
          element={
            <ProtectedRoute role="creator">
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/upload"
          element={
            <ProtectedRoute role="creator">
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toast />
    </>
  );
}
