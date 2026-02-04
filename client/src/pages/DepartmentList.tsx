import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    employees: number;
  };
}

const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      message.error('Gagal mengambil data departemen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/departments/${id}`);
      message.success('Departemen berhasil dihapus');
      fetchDepartments();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menghapus departemen');
    }
  };

  const columns = [
    {
      title: 'Nama Departemen',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Jumlah Karyawan',
      key: 'employeeCount',
      render: (_: any, record: Department) => record._count?.employees || 0,
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Department) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => navigate(`/departments/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm 
            title="Hapus Departemen" 
            description="Apakah anda yakin ingin menghapus departemen ini?" 
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
      title="Master Departemen" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/departments/new')}>
          Tambah Departemen
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={departments} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default DepartmentList;
