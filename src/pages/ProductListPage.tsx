import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, ShoppingCart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { listProducts, deleteProduct } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";

import type { Product } from "../store/productSlice";

// NEW FIX: Backend address ka base variable banaya taake image broke na ho
const BACKEND_URL = "http://localhost:5000";

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux States
  const { products, loading, error } = useAppSelector(
    (state) => state.products,
  );
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  /* =========================================================
     Handlers
     ========================================================= */
  const deleteHandler = async (id: string) => {
    if (window.confirm("Bhai, pakka delete karna hai?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        alert("Product successfully delete ho gaya!");
      } catch (err) {
        alert("Delete nahi ho saka: " + err);
      }
    }
  };

  // NEW FIX: Image helper function jo local paths ko handle karega aur broke hone se bachayega
  const getProductImage = (imagePath?: string) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        // NEW FIX: Safe image handler yahan bhi pass kiya taake cart state mein sahi path jaye
        image: getProductImage(product.image),
        price: product.price,
        countInStock: product.countInStock || 0,
        qty: 1,
      }),
    );
    navigate("/cart");
  };

  /* =========================================================
     Loading & Error States
     ========================================================= */
  if (loading)
    return (
      <div className="text-center py-10 font-medium">
        Loading products... 📦
      </div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-medium">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {userInfo?.isAdmin
              ? "Products Inventory (Admin)"
              : "Shop Our Products 🛍️"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Explore and manage shop items smoothly.
          </p>
        </div>

        {/* Add Product Button - Admin Only */}
        {userInfo?.isAdmin && (
          <button
            onClick={() => navigate("/products/add")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition font-semibold shadow-sm shadow-blue-100"
          >
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      {/* VIEW SWITCH: Admin Table VS Customer Grid */}
      {products && products.length > 0 ? (
        userInfo?.isAdmin ? (
          /* --- ADMIN TABLE VIEW --- */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 border-b">Product Name</th>
                  <th className="p-4 border-b">Category</th>
                  <th className="p-4 border-b">Price</th>
                  <th className="p-4 border-b">Stock</th>
                  <th className="p-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => {
                  const stockAmount = product.countInStock || 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition border-b last:border-0 text-sm"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {product.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {product.category || "N/A"}
                      </td>
                      <td className="p-4 text-gray-900 font-bold">
                        ${product.price}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stockAmount > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {stockAmount > 0
                            ? `${stockAmount} In Stock`
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 flex gap-4">
                        <button
                          onClick={() =>
                            navigate(`/products/edit/${product._id}`)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* --- CUSTOMER CARD GRID VIEW --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: Product) => {
              const stockAmount = product.countInStock || 0;

              return (
                <div
                  key={product._id}
                  className="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image */}
                    <div className="w-full h-48 bg-gray-50 rounded-xl overflow-hidden border border-gray-50 mb-4 flex items-center justify-center">
                      <img
                        // NEW FIX: Safe image checking apply ki taake grid view me broke icon na aaye
                        src={getProductImage(product.image)}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    {/* Category & Name */}
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                      {product.category || "General"}
                    </span>
                    <h3 className="font-bold text-gray-800 text-lg mt-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xl font-black text-blue-600 mt-2">
                      ${product.price}
                    </p>
                  </div>

                  {/* Stock & Action Button */}
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold ${stockAmount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stockAmount > 0 ? "Available" : "Sold Out"}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={stockAmount === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                        stockAmount > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="text-center py-12 text-gray-500 font-medium">
          No Products Found
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
