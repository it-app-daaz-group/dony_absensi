
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Divider, TimePicker, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';
import dayjs from 'dayjs';

const ShiftForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode) {
      const fetchShift = async () => {
        try {
          const response = await api.get(`/shifts/${id}`);
          const data = response.data;
          // Convert string time to dayjs object for TimePicker
          form.setFieldsValue({
            ...data,
            startTime: data.startTime ? dayjs(data.startTime, 'HH:mm') : null,
            endTime: data.endTime ? dayjs(data.endTime, 'HH:mm') : null,
          });
        } catch (error) {
          message.error('Gagal mengambil data shift');
          navigate('/shifts');
        }
      };
      fetchShift();
    }
  }, [id, isEditMode, form, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Convert dayjs object back to string HH:mm
      const payload = {
        ...values,
        startTime: values.startTime ? values.startTime.format('HH:mm') : null,
        endTime: values.endTime ? values.endTime.format('HH:mm') : null,
      };

      if (isEditMode) {
        await api.put(`/shifts/${id}`, payload);
        message.success('Shift berhasil diperbarui');
      } else {
        await api.post('/shifts', payload);
        message.success('Shift berhasil ditambahkan');
      }
      navigate('/shifts');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditMode ? "Edit Shift" : "Tambah Shift Baru"} 
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/shifts')}>
          Kembali
        </Button>
      }
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        initialValues={{ lateTolerance: 15 }}
      >
        <Form.Item 
          name="name" 
          label="Nama Shift" 
          rules={[{ required: true, message: 'Nama shift wajib diisi' }]}
        >
          <Input placeholder="Contoh: Shift Pagi, Shift Malam" size="large" />
        </Form.Item>

        <Form.Item 
          name="startTime" 
          label="Jam Masuk" 
          rules={[{ required: true, message: 'Jam masuk wajib diisi' }]}
        >
          <TimePicker format="HH:mm" size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          name="endTime" 
          label="Jam Pulang" 
          rules={[{ required: true, message: 'Jam pulang wajib diisi' }]}
        >
          <TimePicker format="HH:mm" size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          name="lateTolerance" 
          label="Toleransi Keterlambatan (Menit)" 
          rules={[{ required: true, message: 'Toleransi wajib diisi' }]}
        >
          <InputNumber min={0} size="large" style={{ width: '100%' }} />
        </Form.Item>

        <Divider />

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/shifts')}>
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

export default ShiftForm;
