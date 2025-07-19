
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, FileText } from "lucide-react";
import { importStudentsFromExcel, validateStudentData, exportStudentsToExcel } from "../../services/excelService";
import { students, fees, years } from "../../data/mockData";
import { toast } from "sonner";

const BulkStudentImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.includes('sheet') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const excelData = await importStudentsFromExcel(file);
      const { valid, errors } = validateStudentData(excelData);

      if (errors.length > 0) {
        toast.error(`Validation errors:\n${errors.join('\n')}`);
        setUploading(false);
        return;
      }

      // Add valid students
      valid.forEach(studentData => {
        const feesByYear: any = {};
        const duesByYear: any = {};
        
        for (let y of years) {
          feesByYear[y] = {};
          duesByYear[y] = {};
          for (let f of fees) {
            feesByYear[y][f.name] = f.amount;
            duesByYear[y][f.name] = f.amount;
          }
        }

        const newStudent = {
          id: studentData['Student ID'],
          password: studentData['Password'] || 'default123',
          name: studentData['Name'],
          pin: studentData['Pin No'],
          course: studentData['Course'] || 'B.Tech',
          branch: studentData['Branch'],
          mobile: studentData['Mobile No'],
          photoColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          feesByYear,
          duesByYear,
          fines: [],
          extraFees: [],
          transactions: []
        };

        students.push(newStudent);
      });

      toast.success(`Successfully imported ${valid.length} students!`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error("Error importing file. Please check the format.");
      console.error(error);
    }
    setUploading(false);
  };

  const handleExport = () => {
    exportStudentsToExcel();
    toast.success("Students data exported successfully!");
  };

  const downloadTemplate = () => {
    const templateData = [{
      'Student ID': 'S001',
      'Password': 'pass123',
      'Name': 'Sample Student',
      'Pin No': '2024001',
      'Course': 'B.Tech',
      'Branch': 'CSE',
      'Mobile No': '9876543210'
    }];

    const worksheet = require('xlsx').utils.json_to_sheet(templateData);
    const workbook = require('xlsx').utils.book_new();
    require('xlsx').utils.book_append_sheet(workbook, worksheet, 'Template');
    require('xlsx').writeFile(workbook, 'student_import_template.xlsx');
    
    toast.success("Template downloaded successfully!");
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Bulk Student Import</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Students
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Select Excel File:</label>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {file && (
                <p className="text-sm text-green-400 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImport}
              disabled={!file || uploading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Importing..." : "Import Students"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export & Template
          </h4>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadTemplate}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download Template
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Current Data
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-white/10 rounded-xl p-6 border border-white/10"
      >
        <h4 className="text-lg font-semibold mb-3">Import Instructions:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Download the template to see the required format</li>
          <li>• Student ID and Pin No must be unique</li>
          <li>• All fields except Password are required</li>
          <li>• Mobile numbers should be 10 digits</li>
          <li>• Supported formats: .xlsx, .xls</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default BulkStudentImport;
