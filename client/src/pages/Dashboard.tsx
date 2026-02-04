import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Typography } from 'antd';
import { UserOutlined, TeamOutlined, IdcardOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../api/axios';

const { Title } = Typography;

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalPositions: number;
  totalShifts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Karyawan"
              value={stats?.totalEmployees}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Departemen"
              value={stats?.totalDepartments}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Jabatan"
              value={stats?.totalPositions}
              prefix={<IdcardOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Shift"
              value={stats?.totalShifts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Selamat Datang" bordered={false} style={{ marginTop: 24 }}>
        <p>Selamat datang di Aplikasi Absensi. Gunakan menu di sebelah kiri untuk mengelola data karyawan, departemen, jabatan, dan shift.</p>
      </Card>
    </div>
  );
};

export default Dashboard;
