import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  await dbConnect();
  
  // Fetch orders matching the connected user's email
  const orders = await Order.find({ email: session.user.email }).sort({ createdAt: -1 }).lean() as any[];

  return (
    <div className="container section">
      <div className="glass-card" style={{padding: '3rem'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>Hello, {session.user.name || 'User'}!</h1>
        <p style={{color: 'var(--text-light)', marginBottom: '3rem'}}>Email: {session.user.email}</p>
        
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p style={{marginTop: '1rem', color: '#888'}}>You haven't placed any orders yet.</p>
        ) : (
          <div style={{marginTop: '2rem'}}>
            {orders.map((order, i) => (
              <div key={i} style={{padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', marginBottom: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <strong>Order ID: <span style={{fontWeight: 'normal'}}>{order._id.toString()}</span></strong>
                  <strong>Total: <span style={{fontWeight: 'normal'}}>Rs. {order.totalAmount}</span></strong>
                </div>
                <div style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
