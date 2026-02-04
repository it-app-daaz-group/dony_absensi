import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';

const PositionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchPosition = async () => {
        try {
          const response = await api.get(`/positions/${id}`);
          form.setFieldsValue(response.data);
        } catch (error) {
          message.error('Gagal mengambil data jabatan');
          navigate('/positions');
        }
      };
      fetchPosition();
    }
  }, [id, isEditMode, form, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/positions/${id}`, values);
        message.success('Jabatan berhasil diperbarui');
      } else {
        await api.post('/positions', values);
        message.success('Jabatan berhasil ditambahkan');
      }
      navigate('/positions');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditMode ? "Edit Jabatan" : "Tambah Jabatan Baru"} 
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/positions')}>
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
          name="name" 
          label="Nama Jabatan" 
          rules={[{ required: true, message: 'Nama jabatan wajib diisi' }]}
        >
          <Input placeholder="Contoh: Manager, Staff, Supervisor" size="large" />
        </Form.Item>

        <Divider />

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/positions')}>
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

export default PositionForm;
