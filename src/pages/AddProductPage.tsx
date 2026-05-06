import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { createProduct } from "../store/productSlice";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    countInStock: 0,
    image: "/images/sample.jpg", // Abhi ke liye sample, baad mein upload seekhenge
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createProduct(formData)).unwrap();
      alert("Product Added Successfully! 🎉");
      navigate("/products");
    } catch (err) {
      alert("Error adding product: " + err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock Count
            </label>
            <input
              type="number"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  countInStock: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
