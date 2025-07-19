
import { useState } from "react";
import { motion } from "framer-motion";
import Enhanced3DLoginPage from "./Enhanced3DLoginPage";
import { useAdmins } from "../hooks/useAdmins";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authenticateAdmin } = useAdmins();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: admin, error } = await authenticateAdmin(adminId, password);
      
      if (error || !admin) {
        toast.error("Invalid Admin ID or Password");
        return;
      }

      const legacyAdmin = {
        id: admin.admin_id,
        password: admin.password,
        name: admin.name,
        role: admin.role,
        mobile: admin.mobile,
        photoColor: admin.photo_color
      };

      onLogin(legacyAdmin);
      toast.success(`Welcome back, ${admin.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use the Enhanced3DLoginPage component
  return (
    <Enhanced3DLoginPage 
      onLogin={onLogin} 
      onBack={onBack} 
      isAdmin={true} 
    />
  );
};

export default AdminLogin;
