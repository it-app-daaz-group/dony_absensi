import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';

const DepartmentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchDepartment = async () => {
        try {
          const response = await api.get(`/departments/${id}`);
          form.setFieldsValue(response.data);
        } catch (error) {
          message.error('Gagal mengambil data departemen');
          navigate('/departments');
        }
      };
      fetchDepartment();
    }
  }, [id, isEditMode, form, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/departments/${id}`, values);
        message.success('Departemen berhasil diperbarui');
      } else {
        await api.post('/departments', values);
        message.success('Departemen berhasil ditambahkan');
      }
      navigate('/departments');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditMode ? "Edit Departemen" : "Tambah Departemen Baru"} 
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/departments')}>
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
          label="Nama Departemen" 
          rules={[{ required: true, message: 'Nama departemen wajib diisi' }]}
        >
          <Input placeholder="Contoh: HRD, IT, Finance" size="large" />
        </Form.Item>

        <Divider />

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/departments')}>
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

export default DepartmentForm;
