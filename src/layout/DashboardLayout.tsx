
import { getSession, getUserRole } from "@/actions";
import { SideBar } from "@/components/dashboard"
import { Loader } from "@/components/shared/Loader";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useUser } from "@/hooks";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isLoading, session } = useUser();
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      setRoleLoading(true);
      const session = await getSession();
      if (!session) {
        navigate('/login');
      }

      const role = await getUserRole(session.session?.user.id as string);

      if (role !== 'admin') {
        navigate('/', { replace: true });
      }

      setRoleLoading(false);
    };

    checkRole();

    supabase.auth.onAuthStateChange(async(event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login', { replace: true });
      }
    });
    
  }, [navigate]);

  if (isLoading || !session || roleLoading) return <Loader size={60} />;

  return (
    <div className="flex min-h-screen bg-fondo dark:bg-fondo-dark text-choco dark:text-cream ">
      <SideBar />
      <main className="m-5 flex-1 ml-[140px] lg:ml-[270px] bg-fondo dark:bg-fondo-dark text-choco dark:text-cream">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout