import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

import Landing from './pages/public/Landing';
import Explore from './pages/public/Explore';
import CollegePublic from './pages/public/CollegePublic';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyCollege from './pages/auth/VerifyCollege';
import ForgotPassword from './pages/auth/ForgotPassword';

import Dashboard from './pages/campus/Dashboard';
import Feed from './pages/campus/Feed';
import Notices from './pages/campus/Notices';

import Services from './pages/services/Services';
import Marketplace from './pages/marketplace/Marketplace';
import Messages from './pages/messages/Messages';

import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';

import Admin from './pages/admin/Admin';
import { NotificationPanel } from './components/notifications/NotificationPanel';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:slug" element={<CollegePublic />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="feed" element={<Feed />} />
                    <Route path="services" element={<Services />} />
                    <Route path="market" element={<Marketplace />} />
                    <Route path="notices" element={<Notices />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:id" element={<Messages />} />
                    <Route path="explore" element={<Explore insideApp />} />
                    <Route path="explore/:slug" element={<CollegePublic insideApp />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/edit" element={<EditProfile />} />
                    <Route path="profile/verify" element={<VerifyCollege />} />
                    <Route path="notifications" element={<NotificationPanel />} />
                </Route>
                <Route path="/app/admin" element={<Layout />}>
                    <Route index element={<Admin />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}