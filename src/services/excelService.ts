
import * as XLSX from 'xlsx';
import { students } from '../data/mockData';

export interface StudentExcelData {
  'Student ID': string;
  'Password': string;
  'Name': string;
  'Pin No': string;
  'Course': string;
  'Branch': string;
  'Mobile No': string;
}

export const exportStudentsToExcel = () => {
  const excelData: StudentExcelData[] = students.map(student => ({
    'Student ID': student.id,
    'Password': student.password,
    'Name': student.name,
    'Pin No': student.pin,
    'Course': student.course,
    'Branch': student.branch,
    'Mobile No': student.mobile
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  // Auto-size columns
  const cols = [
    { wch: 12 }, // Student ID
    { wch: 12 }, // Password
    { wch: 20 }, // Name
    { wch: 12 }, // Pin No
    { wch: 10 }, // Course
    { wch: 15 }, // Branch
    { wch: 15 }  // Mobile No
  ];
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, 'students_data.xlsx');
};

export const importStudentsFromExcel = (file: File): Promise<StudentExcelData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as StudentExcelData[];
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const validateStudentData = (data: StudentExcelData[]): { valid: StudentExcelData[], errors: string[] } => {
  const valid: StudentExcelData[] = [];
  const errors: string[] = [];
  const existingIds = new Set(students.map(s => s.id));
  const existingPins = new Set(students.map(s => s.pin));
  const newPins = new Set<string>();

  data.forEach((student, index) => {
    const rowNum = index + 2; // Excel row number (starting from 2, accounting for header)
    
    // Check required fields
    if (!student['Student ID']?.trim()) {
      errors.push(`Row ${rowNum}: Student ID is required`);
      return;
    }
    if (!student['Name']?.trim()) {
      errors.push(`Row ${rowNum}: Name is required`);
      return;
    }
    if (!student['Pin No']?.trim()) {
      errors.push(`Row ${rowNum}: Pin No is required`);
      return;
    }
    if (!student['Mobile No']?.trim()) {
      errors.push(`Row ${rowNum}: Mobile No is required`);
      return;
    }

    // Check duplicate ID
    if (existingIds.has(student['Student ID'])) {
      errors.push(`Row ${rowNum}: Student ID '${student['Student ID']}' already exists`);
      return;
    }

    // Check unique pin
    if (existingPins.has(student['Pin No']) || newPins.has(student['Pin No'])) {
      errors.push(`Row ${rowNum}: Pin No '${student['Pin No']}' already exists`);
      return;
    }

    newPins.add(student['Pin No']);
    valid.push(student);
  });

  return { valid, errors };
};
