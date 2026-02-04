import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, DatePicker, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';
import dayjs from 'dayjs';

const HolidayForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchHoliday = async () => {
        try {
          const response = await api.get(`/holidays/${id}`);
          const data = response.data;
          form.setFieldsValue({
            ...data,
            date: dayjs(data.date),
          });
        } catch (error) {
          message.error('Gagal mengambil data hari libur');
          navigate('/holidays');
        }
      };
      fetchHoliday();
    }
  }, [id, isEditMode, form, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (isEditMode) {
        await api.put(`/holidays/${id}`, payload);
        message.success('Hari libur berhasil diperbarui');
      } else {
        await api.post('/holidays', payload);
        message.success('Hari libur berhasil ditambahkan');
      }
      navigate('/holidays');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditMode ? "Edit Hari Libur" : "Tambah Hari Libur Baru"} 
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/holidays')}>
          Kembali
        </Button>
      }
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
      >
        <Form.Item 
          name="date" 
          label="Tanggal" 
          rules={[{ required: true, message: 'Tanggal wajib diisi' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" format="DD MMMM YYYY" />
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Keterangan" 
          rules={[{ required: true, message: 'Keterangan wajib diisi' }]}
        >
          <Input placeholder="Contoh: Tahun Baru, Idul Fitri" size="large" />
        </Form.Item>

        <Divider />

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/holidays')}>
            Batal
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            Simpan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default HolidayForm;
