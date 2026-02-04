
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  lateTolerance: number;
  _count?: {
    employees: number;
  };
}

const ShiftList: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/shifts');
      setShifts(response.data);
    } catch (error) {
      message.error('Gagal mengambil data shift');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/shifts/${id}`);
      message.success('Shift berhasil dihapus');
      fetchShifts();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menghapus shift');
    }
  };

  const columns = [
    {
      title: 'Nama Shift',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Jam Masuk',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Jam Pulang',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => <Tag color="orange">{text}</Tag>
    },
    {
      title: 'Toleransi (Menit)',
      dataIndex: 'lateTolerance',
      key: 'lateTolerance',
    },
    {
      title: 'Jumlah Karyawan',
      key: 'employeeCount',
      render: (_: any, record: Shift) => record._count?.employees || 0,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Shift) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => navigate(`/shifts/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm 
            title="Hapus Shift" 
            description="Apakah anda yakin ingin menghapus shift ini?" 
            onConfirm={() => handleDelete(record.id)} 
            okText="Ya" 
            cancelText="Tidak"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">Hapus</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="Master Shift" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/shifts/new')}>
          Tambah Shift
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={shifts} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default ShiftList;
