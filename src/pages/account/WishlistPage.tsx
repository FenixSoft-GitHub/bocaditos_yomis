// src/pages/account/WishlistPage.tsx

import { useWishlist } from "@/hooks/wishlist/useWishlist";
import { CardProduct } from "@/components/products/CardProduct";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import {
  PageTransition,
  StaggerList,
  StaggerItem,
} from "@/components/animations";
import { Loader } from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

const WishlistPage = () => {
  const { wishlistProducts, isLoadingProducts } = useWishlist();

  if (isLoadingProducts) return <Loader size={60} />;

  return (
    <PageTransition>
      <DashboardSection
        title="Mis Favoritos"
        description="Productos que guardaste para más tarde"
        count={wishlistProducts.length}
        isEmpty={wishlistProducts.length === 0}
        empty={
          <>
            <Heart className="size-14 text-choco/20 dark:text-cream/20" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-choco dark:text-cream">
                Aún no tienes favoritos
              </p>
              <p className="text-sm text-choco/50 dark:text-cream/50">
                Toca el corazón en cualquier producto para guardarlo aquí
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2"
            >
              <ShoppingBag className="size-4" />
              Explorar productos
            </Link>
          </>
        }
      >
        <StaggerList className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:col-span-2 xl:col-span-3">
          {wishlistProducts.map((product) => (
            <StaggerItem key={product.id}>
              <CardProduct product={product} />
            </StaggerItem>
          ))}
        </StaggerList>
      </DashboardSection>
    </PageTransition>
  );
};

export default WishlistPage;
