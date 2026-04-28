import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

import ProductTabs from '@/components/ProductTabs';

async function getAllProducts() {
  try {
    const csvPath = path.join(process.cwd(), '../web scraping2/scraped_data.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    
    return parsed.data; // Return ALL products instead of limiting
  } catch (error) {
    console.error("Error reading csv:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="container section">
      <div style={{marginBottom: '3rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>All Products</h1>
        <p style={{color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto'}}>
          Browse our entire collection and bring nature indoors.
        </p>
      </div>

      <ProductTabs products={products} />
    </main>
  );
}
