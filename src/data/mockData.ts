
export const fees = [
  { name: "Tuition", desc: "Tuition Fee", amount: 10000 },
  { name: "Bus", desc: "Bus Fee", amount: 5000 },
  { name: "Personality", desc: "Personality Development Fee", amount: 2000 },
  { name: "Exam", desc: "Examination Fee", amount: 1500 }
];

export const fines = [
  { name: "Late Fee", desc: "Late Payment Fine", amount: 500 }
];

export const deadlines = {
  "Tuition": new Date(new Date().getFullYear(), 7, 1),
  "Bus": new Date(new Date().getFullYear(), 7, 15),
  "Personality": new Date(new Date().getFullYear(), 8, 1),
  "Exam": new Date(new Date().getFullYear(), 8, 10)
};

export const years = ["1st year", "2nd year", "3rd year", "4th year"];

// Initialize student data
const initializeStudentFees = () => {
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
  
  return { feesByYear, duesByYear };
};

export const students = [
  {
    id: "S123",
    password: "pass123",
    name: "Alice Johnson",
    pin: "2023001",
    course: "B.Tech",
    branch: "CSE",
    mobile: "9876543210",
    photoColor: "#3498db",
    ...initializeStudentFees(),
    fines: [],
    extraFees: [],
    transactions: []
  },
  {
    id: "S124",
    password: "pass124",
    name: "Bob Smith",
    pin: "2023002",
    course: "B.Tech",
    branch: "ECE",
    mobile: "9876543211",
    photoColor: "#e74c3c",
    ...initializeStudentFees(),
    fines: [],
    extraFees: [],
    transactions: []
  }
];

export const admins = [
  {
    id: "A1",
    password: "admin1",
    name: "Mr. Sharma",
    role: "Fee Manager",
    mobile: "9123456789",
    photoColor: "#e67e22"
  }
];
