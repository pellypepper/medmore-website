import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Spinner from '../../component/spinner'; 
import axios from 'axios';
import './admin.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");
    const [products, setProducts] = useState([]);
    const [salesData, setSalesData] = useState({ sales_count: 0, total: 0, total_buyer: 0 });
    const [loading, setLoading] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Dashboard'); 
    const [productForm, setProductForm] = useState({ id: '', name: '', price: '', image: null }); // Change img to null
    const [isEditing, setIsEditing] = useState(false);
    const chartRef = useRef(null); 
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate();
    const [isAddingProduct, setIsAddingProduct] = useState(false); // New state for spinner


    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            });
    
            if (!response.ok) {
                throw new Error('Failed to log out');
            }
    
            const data = await response.json();
            console.log(data.message); 
            navigate('/'); 
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to log out. Please try again.');  
          setAlertMessage('Failed to log out. Please try again.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/products`);
                const productsData = await productsResponse.json();

                const salesResponse = await fetch(`${process.env.REACT_APP_API_URL}/sales`);
                const salesData = await salesResponse.json();

                const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/orders`);
                const ordersData = await ordersResponse.json();
                console.log('Fetched orders:', ordersData);

                setProducts(productsData);
                setSalesData(salesData);
                setOrders(ordersData);
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (salesData.sales_count > 0 && activeMenu === 'Dashboard') {
            const ctx = document.getElementById('salesChart').getContext('2d');
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], 
                    datasets: [
                        {
                            label: 'Sales ($)',
                            data: [1200, 1900, 3000, 5000, 2400], 
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                    },
                },
            });
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [salesData, activeMenu]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({ ...productForm, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('Selected File:', file);
        
        if (file) {
            setProductForm(prevState => ({
                ...prevState,
                image: file // Directly set the File object
            }));
        }
    };
    
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsAddingProduct(true);
        // Validation
        if (!productForm.name || !productForm.price) {
            alert('Please enter product name and price');
            return;
        }
    
        if (!productForm.image) {
            alert('Please select an image');
            return;
        }
    
        // const formData = new FormData();
     
        // formData.append('image', productForm.image);
        // console.log('Form Data:', formData);
        
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }
        const formData = new FormData();
        formData.append('image', productForm.image);
        formData.append('name', productForm.name);
        formData.append('price', productForm.price);
        

    
        try {

       
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/products`, 
                formData, 
                {
                    headers: {
            
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
    
            // Correct way to handle axios response
            console.log('New Product Added:', response.data);
           
          
            // Update products list
            setProducts((prevProducts) => [...prevProducts, response.data]);
            
            // Reset form
            setProductForm({ id: '', name: '', price: '', image: null });
            
            setAlertMessage('Product added successfully!');

         
    
        } catch (error) {
            console.log(error.message);
            console.error('Complete Error:', error.response ? error.response.data : error.message);
            alert();
            setAlertMessage(`Failed to add product: ${error.response ? error.response.data.error : error.message}`);
        } finally {
            setIsAddingProduct(false);
        }   
    };
    
    const handleEditProduct = (product) => {
        setProductForm({ id: product.id, name: product.name, price: product.price, image: null });
        setIsEditing(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setIsAddingProduct(true);
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('price', productForm.price);
        if (productForm.image) {
            formData.append('image', productForm.image);
        }
        console.log('Form Data:', formData);
        
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/products/${productForm.id}`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
    
            // Error: response.ok doesn't exist on axios response
            // Instead, check response status
            if (response.status !== 200) {
                throw new Error('Failed to update product');
            }
    
            // Error: response.json() doesn't exist on axios
            // Use response.data instead
            const updatedProduct = response.data;
    
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === updatedProduct.id ? updatedProduct : product
                )
            );
    
            setProductForm({ id: '', name: '', price: '', image: null });
            setIsEditing(false);
            setAlertMessage('Product Updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setIsAddingProduct(false);
        }   
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const getTopSellingProducts = () => {
        const productSales = products.map(product => {
            const totalSales = orders.reduce((acc, order) => {
                if (order.product_id === product.id) {
                    return acc + order.amount;
                }
                return acc;
            }, 0);
            return { ...product, totalSales };
        });
        return productSales.sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);
    };

    const topSellingProducts = getTopSellingProducts();

    const getOrderSummary = () => {
        return orders.reduce((acc, order) => {
            acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
            return acc;
        }, {});
    };

    const orderSummary = getOrderSummary();

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setFadeOut(true);
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setFadeOut(false);
        }
    }, [alertMessage]);

    if (loading) return <Spinner />;


    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li onClick={() => setActiveMenu('Dashboard')} className={activeMenu === 'Dashboard' ? 'active' : ''}>Dashboard</li>
                    <li onClick={() => setActiveMenu('Products')} className={activeMenu === 'Products' ? 'active' : ''}>Products</li>
                    <li onClick={() => setActiveMenu('Orders')} className={activeMenu === 'Orders' ? 'active' : ''}>Orders</li>
                    <li onClick={handleLogout} className="logout-button">Logout</li> 
                </ul>
            </aside>

            <main className="dashboard-content">
                {activeMenu === 'Dashboard' && (
                    <>
                        <section className="analytics">
                            <h3 className='text-center my-3'>Analytics Overview</h3>
                            <div className="analytics-cards mt-2">
                                <div className="analytics-card">
                                    <h4>Total Revenue</h4>
                                    <p>£{salesData.total}</p>
                                </div>
                                <div className="analytics-card">
                                    <h4>Total Orders</h4>
                                    <p>{salesData.sales_count}</p>
                                </div>
                                <div className="analytics-card">
                                    <h4>Total Customers</h4>
                                    <p>{salesData.total_buyer}</p>
                                </div>
                            </div>
                            <div className="order-summary">
                                <h4>Order Summary by Status</h4>
                                <ul>
                                    {Object.entries(orderSummary).map(([status, count]) => (
                                        <li key={status}>{status}: {count}</li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="chart">
                            <h3>Sales Report</h3>
                            <canvas id="salesChart" width="400" height="200"></canvas>
                        </section>

                        <section className="top-products">
                            <h3>Top Selling Products</h3>
                            <div className="top-products-grid">
                                {topSellingProducts.map(product => (
                                    <div className="top-product-card" key={product.id}>
                                        <h4>{product.name}</h4>
                                        <p className="product-price">Price: £{product.price}</p>
                                        <p className="total-sales">Total Sales: {product.totalSales}</p>
                                        <div className="actions">
                                            <button className="view-button">View</button>
                                            <button className="edit-button" onClick={() => handleEditProduct(product)}>Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {activeMenu === 'Products' && (
                    <section className="products">
                        <h3>Product List</h3>
                        <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={productForm.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Product Price"
                                value={productForm.price}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                type="file" // Change to file input
                                name="image"
        
                                placeholder="Product Image"
                                accept="image/*" // Accept image files
                                onChange={handleFileChange} // Handle file change
                                required={!isEditing} // Make required only if not editing
                            />
                            <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
                            {isEditing && (
                                <button type="button" onClick={() => { setProductForm({ id: '', name: '', price: '', img: null }); setIsEditing(false); }}>Cancel</button>
                            )}
                        </form>
                         {isAddingProduct && <Spinner />}
                        <div className="products-grid">
                     
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <img loading="lazy" src={product.img} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p>Price: £{product.price}</p>
                                    <div className="actions">
                                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeMenu === 'Orders' && (
                    <section className="orders">
                        <h3>Order List</h3>
                        {orders.length > 0 ? (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Payment Status</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>£{order.amount}</td>
                                            <td>{order.currency}</td>
                                            <td>{order.email}</td>
                                            <td>{order.address}</td>
                                            <td>{order.payment_status}</td>
                                            <td>{new Date(order.created_at).toLocaleString()}</td>
                                            <td>{new Date(order.updated_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No orders available.</p>
                        )}
                    </section>
                )}
                  {alertMessage && (
                    <div className={`alert-popup ${fadeOut ? "alert-popup-exit" : ""}`}>
                        {alertMessage}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
