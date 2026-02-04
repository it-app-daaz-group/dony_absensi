import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Position {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

const PositionList: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/positions');
      setPositions(response.data);
    } catch (error) {
      message.error('Gagal mengambil data jabatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/positions/${id}`);
      message.success('Jabatan berhasil dihapus');
      fetchPositions();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menghapus jabatan');
    }
  };

  const columns = [
    {
      title: 'Nama Jabatan',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Jumlah Karyawan',
      key: 'employeeCount',
      render: (_: any, record: Position) => record._count?.employees || 0,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Position) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => navigate(`/positions/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm 
            title="Hapus Jabatan" 
            description="Apakah anda yakin ingin menghapus jabatan ini?" 
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
      title="Master Jabatan" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/positions/new')}>
          Tambah Jabatan
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={positions} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default PositionList;
