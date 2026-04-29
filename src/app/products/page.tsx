"use client";

import { useEffect, useState } from "react";
import ProductTabs from "@/components/ProductTabs";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("PRODUCTSss:", data);
        setProducts(data);
      });
  }, []);

  return (
    <main className="container section">
      <h1>All Products</h1>
      <ProductTabs products={products} />
    </main>
  );
}