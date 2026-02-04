import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import dayjs from 'dayjs';

interface Holiday {
  id: number;
  date: string;
  description: string;
}

const HolidayList: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await api.get('/holidays');
      setHolidays(response.data);
    } catch (error) {
      message.error('Gagal mengambil data hari libur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/holidays/${id}`);
      message.success('Hari libur berhasil dihapus');
      fetchHolidays();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menghapus hari libur');
    }
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format('DD MMMM YYYY'),
    },
    {
      title: 'Keterangan',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_: any, record: Holiday) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => navigate(`/holidays/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm 
            title="Hapus Hari Libur" 
            description="Apakah anda yakin ingin menghapus hari libur ini?" 
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
      title="Master Hari Libur" 
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/holidays/new')}>
          Tambah Hari Libur
        </Button>
      }
    >
      <Table 
        columns={columns} 
        dataSource={holidays} 
        rowKey="id" 
        loading={loading}
      />
    </Card>
  );
};

export default HolidayList;
