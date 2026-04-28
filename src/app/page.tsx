import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Link from 'next/link';
import ProductTabs from '@/components/ProductTabs';

async function getProducts() {
  try {
    const csvPath = path.join(process.cwd(), '../web scraping2/scraped_data.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
    
    return parsed.data; // Return ALL products
  } catch (error) {
    console.error("Error reading csv:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container">
      <div className="hero glass animate-fade-in">
        <h1 className="hero-title">Bring Nature <span style={{color: 'var(--primary)'}}>Home</span></h1>
        <p className="hero-subtitle">
          Explore our premium collection of fruit plants, seeds, and outdoor decor to transform your living spaces into green sanctuaries.
        </p>
        <Link href="/products" className="btn btn-primary" style={{textDecoration: 'none'}}>Shop Collection</Link>
      </div>

      <div className="section">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
          <div>
            <h2 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Featured Plants</h2>
            <p style={{color: 'var(--text-light)'}}>Carefully nurtured and ready for your garden</p>
          </div>
          <Link href="/products" style={{color: 'var(--primary)', fontWeight: '500', textDecoration: 'none'}}>View All →</Link>
        </div>

        <ProductTabs products={products} />
      </div>
    </main>
  );
}
