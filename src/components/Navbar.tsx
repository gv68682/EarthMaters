'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();

  return (
    <nav className="navbar glass">
      <div className="container">
        <Link href="/" className="logo">
          EarthMaters
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/products" className="nav-link">Shop</Link>
          <Link href="/cart" className="nav-link">Cart ({cartCount})</Link>
          
          {session ? (
            <>
              <Link href="/profile" className="nav-link">Profile</Link>
              {/* @ts-ignore */}
              {session.user?.role === 'admin' && <Link href="/admin" className="nav-link" style={{color: 'red'}}>Admin</Link>}
              <button 
                onClick={() => signOut()} 
                className="btn btn-secondary" 
                style={{padding: '0.4rem 1rem'}}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{padding: '0.4rem 1rem'}}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
