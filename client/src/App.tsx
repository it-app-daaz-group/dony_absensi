import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import DepartmentList from './pages/DepartmentList';
import DepartmentForm from './pages/DepartmentForm';
import PositionList from './pages/PositionList';
import PositionForm from './pages/PositionForm';
import ShiftList from './pages/ShiftList';
import ShiftForm from './pages/ShiftForm';
import HolidayList from './pages/HolidayList';
import HolidayForm from './pages/HolidayForm';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/authStore';
import { Spin, Layout, Menu, Button } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined, TeamOutlined, IdcardOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setLoading(false);
    };
    verify();
  }, []);

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Karyawan',
      onClick: () => navigate('/employees'),
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: 'Departemen',
      onClick: () => navigate('/departments'),
    },
    {
      key: '4',
      icon: <IdcardOutlined />,
      label: 'Jabatan',
      onClick: () => navigate('/positions'),
    },
    {
      key: '5',
      icon: <ClockCircleOutlined />,
      label: 'Shift',
      onClick: () => navigate('/shifts'),
    },
    {
      key: '6',
      icon: <CalendarOutlined />,
      label: 'Hari Libur',
      onClick: () => navigate('/holidays'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px' }}>
          ABSENSI
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Welcome, {user?.name}</span>
          <Button type="text" icon={<LogoutOutlined />} onClick={() => logout()}>Logout</Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/employees" element={
          <ProtectedRoute>
            <MainLayout>
              <EmployeeList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/employees/new" element={
          <ProtectedRoute>
            <MainLayout>
              <EmployeeForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/employees/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EmployeeForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/departments" element={
          <ProtectedRoute>
            <MainLayout>
              <DepartmentList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/departments/new" element={
          <ProtectedRoute>
            <MainLayout>
              <DepartmentForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/departments/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <DepartmentForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/positions" element={
          <ProtectedRoute>
            <MainLayout>
              <PositionList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/positions/new" element={
          <ProtectedRoute>
            <MainLayout>
              <PositionForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/positions/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <PositionForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/shifts" element={
          <ProtectedRoute>
            <MainLayout>
              <ShiftList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/shifts/new" element={
          <ProtectedRoute>
            <MainLayout>
              <ShiftForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/shifts/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ShiftForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/holidays" element={
          <ProtectedRoute>
            <MainLayout>
              <HolidayList />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/holidays/new" element={
          <ProtectedRoute>
            <MainLayout>
              <HolidayForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/holidays/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <HolidayForm />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
