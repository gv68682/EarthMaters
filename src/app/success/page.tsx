import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Link from 'next/link';

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const session = await getServerSession();
  const sessionId = searchParams.session_id;

  if (sessionId) {
    try {
      await dbConnect();
      
      // Simulate Order Creation natively without complex Webhooks for demo purposes
      // A production app would rely strictly on Stripe Webhooks
      const existing = await Order.findOne({ stripeSessionId: sessionId });
      
      if (!existing) {
        await Order.create({
          user: session?.user?.id || null, // Guest checkouts will have null
          email: session?.user?.email || 'guest@example.com', // Stripe session would have the real guest email
          items: [{ name: 'EarthMaters Cart Selection', price: 0, quantity: 1 }], 
          totalAmount: 1000, 
          stripeSessionId: sessionId,
          status: 'completed',
        });
      }
    } catch (e) {
      console.error("Failed to mock order record", e);
    }
  }

  return (
    <div className="container section" style={{textAlign: 'center', marginTop: '4rem'}}>
      <div className="glass-card" style={{padding: '4rem', maxWidth: '600px', margin: '0 auto'}}>
        <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🎉</div>
        <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)'}}>Payment Successful!</h1>
        <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>
          Thank you for choosing EarthMaters. Your premium natural selection will begin processing immediately.
        </p>
        
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link href="/products" className="btn btn-secondary">Keep Shopping</Link>
          {session && (
            <Link href="/profile" className="btn btn-primary">View Order History</Link>
          )}
        </div>
      </div>
    </div>
  );
}
