import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Analyze from './pages/dashboard/Analyze.jsx';
import Results from './pages/dashboard/Results.jsx';
import JobMatcher from './pages/dashboard/JobMatcher.jsx';
import History from './pages/dashboard/History.jsx';
import Templates from './pages/dashboard/Templates.jsx';
import CareerTips from './pages/dashboard/CareerTips.jsx';
import Settings from './pages/dashboard/Settings.jsx';
import PageTransition from './components/PageTransition.jsx';

function withTransition(element) {
  return <PageTransition>{element}</PageTransition>;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(<LandingPage />)} />
        <Route path="/login" element={withTransition(<Login />)} />
        <Route path="/signup" element={withTransition(<Signup />)} />
        <Route path="/forgot-password" element={withTransition(<ForgotPassword />)} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={withTransition(<Dashboard />)} />
          <Route path="analyze" element={withTransition(<Analyze />)} />
          <Route path="results" element={withTransition(<Results />)} />
          <Route path="job-matcher" element={withTransition(<JobMatcher />)} />
          <Route path="history" element={withTransition(<History />)} />
          <Route path="templates" element={withTransition(<Templates />)} />
          <Route path="tips" element={withTransition(<CareerTips />)} />
          <Route path="settings" element={withTransition(<Settings />)} />
        </Route>

        <Route path="*" element={withTransition(<LandingPage />)} />
      </Routes>
    </AnimatePresence>
  );
}
