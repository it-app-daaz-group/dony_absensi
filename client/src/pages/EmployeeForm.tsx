import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Row, Col, Select, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../api/axios';

const EmployeeForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<{label: string, value: number}[]>([]);
  const [positions, setPositions] = useState<{label: string, value: number}[]>([]);
  const [shifts, setShifts] = useState<{label: string, value: number}[]>([]);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [deptRes, posRes, shiftRes] = await Promise.all([
          api.get('/master/departments'),
          api.get('/master/positions'),
          api.get('/master/shifts')
        ]);

        setDepartments(deptRes.data.map((d: any) => ({ label: d.name, value: d.id })));
        setPositions(posRes.data.map((p: any) => ({ label: p.name, value: p.id })));
        setShifts(shiftRes.data.map((s: any) => ({ label: `${s.name} (${s.startTime} - ${s.endTime})`, value: s.id })));
      } catch (error) {
        message.error('Gagal mengambil data master');
      }
    };

    fetchMasterData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const response = await api.get(`/employees/${id}`);
          form.setFieldsValue({
            ...response.data,
            password: '' // Kosongkan password saat edit
          });
        } catch (error) {
          message.error('Gagal mengambil data karyawan');
          navigate('/employees');
        }
      };
      fetchEmployee();
    }
  }, [id, isEditMode, form, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // Hapus password jika kosong agar tidak terupdate
        if (!values.password) delete values.password;
        await api.put(`/employees/${id}`, values);
        message.success('Data karyawan berhasil diperbarui');
      } else {
        await api.post('/employees', values);
        message.success('Karyawan berhasil ditambahkan');
      }
      navigate('/employees');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={isEditMode ? "Edit Data Karyawan" : "Tambah Karyawan Baru"} 
      bordered={false}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/employees')}>
          Kembali
        </Button>
      }
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Divider orientation="left">Informasi Pribadi</Divider>
            
            <Form.Item name="nik" label="NIK (Nomor Induk Karyawan)" rules={[{ required: true, message: 'NIK wajib diisi' }]}>
              <Input placeholder="Contoh: 2024001" size="large" />
            </Form.Item>
            
            <Form.Item name="name" label="Nama Lengkap" rules={[{ required: true, message: 'Nama wajib diisi' }]}>
              <Input placeholder="Masukkan nama lengkap" size="large" />
            </Form.Item>
            
            <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email tidak valid' }]}>
              <Input placeholder="email@perusahaan.com" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Divider orientation="left">Informasi Pekerjaan</Divider>

            <Form.Item name="departmentId" label="Departemen" rules={[{ required: true, message: 'Pilih departemen' }]}>
              <Select options={departments} placeholder="Pilih Departemen" size="large" />
            </Form.Item>

            <Form.Item name="positionId" label="Jabatan" rules={[{ required: true, message: 'Pilih jabatan' }]}>
              <Select options={positions} placeholder="Pilih Jabatan" size="large" />
            </Form.Item>

            <Form.Item name="shiftId" label="Shift Kerja" rules={[{ required: true, message: 'Pilih shift' }]}>
              <Select options={shifts} placeholder="Pilih Shift" size="large" />
            </Form.Item>
            
            <Form.Item 
              name="password" 
              label={isEditMode ? "Password (Kosongkan jika tidak diubah)" : "Password Default"}
              rules={[{ required: !isEditMode, message: 'Password wajib diisi' }]}
            >
              <Input.Password placeholder={isEditMode ? "Ubah password..." : "Min. 6 karakter"} size="large" />
            </Form.Item>

            {isEditMode && (
              <Form.Item name="isActive" label="Status Karyawan">
                 <Select 
                  size="large"
                  options={[
                    { label: 'Aktif', value: true },
                    { label: 'Non-Aktif', value: false }
                  ]}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Divider />

        <Form.Item style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={() => navigate('/employees')}>
            Batal
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            Simpan Data Karyawan
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EmployeeForm;
