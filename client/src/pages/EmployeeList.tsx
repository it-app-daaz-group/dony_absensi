import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Employee } from '../types';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      message.error('Gagal mengambil data karyawan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/employees/${id}`);
      message.success('Karyawan berhasil dihapus');
      fetchEmployees();
    } catch (error) {
      message.error('Gagal menghapus karyawan');
    }
  };

  const columns = [
    { title: 'NIK', dataIndex: 'nik', key: 'nik' },
    { title: 'Nama', dataIndex: 'name', key: 'name' },
    { title: 'Departemen', dataIndex: ['department', 'name'], key: 'department' },
    { title: 'Jabatan', dataIndex: ['position', 'name'], key: 'position' },
    { title: 'Shift', dataIndex: ['shift', 'name'], key: 'shift' },
    { 
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'isActive',
      render: (active: boolean) => active ? 'Aktif' : 'Non-Aktif'
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => navigate(`/employees/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Karyawan"
            description="Apakah anda yakin ingin menghapus karyawan ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Data Karyawan" extra={
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/new')}>
        Tambah Karyawan
      </Button>
    }>
      <Table 
        columns={columns} 
        dataSource={employees} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default EmployeeList;
