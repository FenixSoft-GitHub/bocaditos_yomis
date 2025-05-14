import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cart.store';
import { FormCheckout } from '@/components/checkout/FormCheckout';
import { ItemsCheckout } from '@/components/checkout/ItemsCheckout';
import { Loader } from '@/components/shared/Loader';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks';
import { supabase } from '@/supabase/client';

const CheckoutPage = () => {
  const navigate = useNavigate(); 
  const totalItems = useCartStore(state => state.totalItemsInCart);
  const [, setIsScrolled] = useState(false);

  const { isLoading } = useUser();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <Loader size={60} />; 
  return (
    <main className="dark:bg-fondo-dark dark:text-cream bg-fondo text-choco">
      <div className="w-full flex relative">
        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 w-full mt-10">
            <img
              src="/img/Cart.avif"
              alt="Carro Vacío"
              className="md:w-3/12 w-1/2 rounded-lg shadow-lg"
            />
            <p className="text-sm font-medium tracking-tight">
              Su carro está vacío
            </p>
            <Link
              to="/products"
              className="bg-choco/90 text-cream dark:bg-cream/70 dark:text-choco hover:bg-choco dark:hover:bg-cream hover:scale-105 font-semibold py-4 rounded-full px-7 text-xs shadow-lg transition-all duration-300 ease-in-out mt-4 outline-2 outline-offset-2 dark:outline-cream/70 outline-choco/90"
            >
              Empezar a comprar
            </Link>
          </div>
        ) : (
          <>
            <div className="w-full md:w-[50%] p-10">
              <FormCheckout />
            </div>

            <div
              className="w-[50%] sticky top-0 right-0 p-10 hidden md:block"
              style={{
                minHeight: "calc(100vh - 72px)",
              }}
            >
              <ItemsCheckout />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;