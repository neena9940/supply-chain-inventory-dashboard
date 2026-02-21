import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        { id: 1, sku: 'ABC-123', product: 'Widget', quantity: 150, location: 'Aisle 3' },
        { id: 2, sku: 'XYZ-789', product: 'Gadget', quantity: 42, location: 'Aisle 1' },
        { id: 3, sku: 'DEF-456', product: 'Tool', quantity: 0, location: 'Aisle 2' },
        { id: 4, sku: 'GHI-789', product: 'Sensor', quantity: 5, location: 'Aisle 4' },
      ];
      setInventory(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = inventory.filter(item =>
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>📦 Supply Chain Inventory</h1>
      
      <LowStockAlert items={inventory} />
      
      <UpdateForm onUpdate={(update) => {
        setInventory(inventory.map(item => 
          item.sku === update.sku 
            ? { ...item, quantity: update.quantity }
            : item
        ));
      }} />
      
      <input
        type="text"
        placeholder="🔍 Search by product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: '20px 0', padding: '8px', width: '250px' }}
      />
      
      <InventoryTable items={filteredItems} />
    </div>
  );
}

function InventoryTable({ items }) {
  return (
    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead style={{ backgroundColor: '#f0f0f0' }}>
        <tr>
          <th>SKU</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.sku}</td>
            <td>{item.product}</td>
            <td style={{ 
              color: item.quantity === 0 ? 'red' : 'black',
              fontWeight: item.quantity < 10 ? 'bold' : 'normal'
            }}>
              {item.quantity}
            </td>
            <td>{item.location}</td>
            <td>
              {item.quantity === 0 ? '🔴 Out of Stock' : 
               item.quantity < 10 ? '🟡 Low Stock' : '🟢 In Stock'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UpdateForm({ onUpdate }) {
  const [sku, setSku] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ sku, quantity: parseInt(newQuantity) });
    setSku('');
    setNewQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9' }}>
      <h3>✏️ Update Inventory</h3>
      <input
        placeholder="Enter SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <input
        placeholder="New Quantity"
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>Update</button>
    </form>
  );
}

function LowStockAlert({ items }) {
  const lowStock = items.filter(item => item.quantity < 10 && item.quantity > 0);
  
  if (lowStock.length === 0) return null;
  
  return (
    <div style={{ backgroundColor: '#fff3cd', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
      <strong>⚠️ Low Stock Alert:</strong> {lowStock.length} items need reorder
    </div>
  );
}

export default App;