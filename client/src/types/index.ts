export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Employee {
  id: number;
  nik: string;
  name: string;
  email?: string;
  phone?: string;
  department?: Department;
  position?: Position;
  shift?: Shift;
  isActive: boolean;
  departmentId?: number;
  positionId?: number;
  shiftId?: number;
}
