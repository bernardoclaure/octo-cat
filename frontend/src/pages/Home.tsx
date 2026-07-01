import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Welcome to OctoCAT Purchase Order Management</h2>
      <p>
        Use the link below to create a new draft purchase order. You can also edit an existing draft by navigating to its edit link.
      </p>
      <Link to="/purchase-orders/new">Create a new Draft Purchase Order</Link>
      <div>
        Create a purchase order and you will be taken to its detail view automatically after saving.
      </div>
    </div>
  );
}

export default Home;
