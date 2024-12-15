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
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [productForm, setProductForm] = useState({ id: '', name: '', price: '', image: null });
    const [isEditing, setIsEditing] = useState(false);
    const chartRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to log out');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            setAlertMessage('Failed to log out. Please try again.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, salesResponse, ordersResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/products`),
                    fetch(`${process.env.REACT_APP_API_URL}/sales`),
                    fetch(`${process.env.REACT_APP_API_URL}/orders`)
                ]);
                setProducts(await productsResponse.json());
                setSalesData(await salesResponse.json());
                setOrders(await ordersResponse.json());
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current) chartRef.current.destroy();

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
                options: { responsive: true, plugins: { legend: { position: 'top' } } },
            });
        }

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [salesData, activeMenu]);

    if (loading) return <Spinner />;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({ ...productForm, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setProductForm((prevState) => ({ ...prevState, image: file }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price || !productForm.image) {
            alert('Please fill all fields and select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', productForm.image);
        formData.append('name', productForm.name);
        formData.append('price', productForm.price);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProducts((prevProducts) => [...prevProducts, response.data]);
            setProductForm({ id: '', name: '', price: '', image: null });
            setAlertMessage('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            setAlertMessage('Failed to add product.');
        }
    };

    const handleEditProduct = (product) => {
        setProductForm({ id: product.id, name: product.name, price: product.price, image: null });
        setIsEditing(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('price', productForm.price);
        if (productForm.image) formData.append('image', productForm.image);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/products/${productForm.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProducts((prevProducts) =>
                prevProducts.map((product) => (product.id === response.data.id ? response.data : product))
            );
            setProductForm({ id: '', name: '', price: '', image: null });
            setIsEditing(false);
            setAlertMessage('Product updated successfully!');
        } catch (error) {
            console.error('Error updating product:', error);
            setAlertMessage('Failed to update product.');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const getTopSellingProducts = () => {
        return products
            .map((product) => {
                const totalSales = orders.reduce((acc, order) => {
                    if (order.product_id === product.id) return acc + order.amount;
                    return acc;
                }, 0);
                return { ...product, totalSales };
            })
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 5);
    };

    const orderSummary = orders.reduce((acc, order) => {
        acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
        return acc;
    }, {});

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
                            <h3>Analytics Overview</h3>
                            <div className="analytics-cards">
                                <div className="analytics-card"><h4>Total Revenue</h4><p>£{salesData.total}</p></div>
                                <div className="analytics-card"><h4>Total Orders</h4><p>{salesData.sales_count}</p></div>
                                <div className="analytics-card"><h4>Total Customers</h4><p>{salesData.total_buyer}</p></div>
                            </div>
                        </section>
                        <section className="chart"><h3>Sales Report</h3><canvas id="salesChart"></canvas></section>
                        <section className="top-products">
                            <h3>Top Selling Products</h3>
                            <div className="top-products-grid">
                                {getTopSellingProducts().map((product) => (
                                    <div key={product.id} className="top-product-card">
                                        <h4>{product.name}</h4>
                                        <p>Price: £{product.price}</p>
                                        <p>Total Sales: {product.totalSales}</p>
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
                            <input type="text" name="name" placeholder="Name" value={productForm.name} onChange={handleInputChange} required />
                            <input type="number" name="price" placeholder="Price" value={productForm.price} onChange={handleInputChange} required />
                            <input type="file" accept="image/*" onChange={handleFileChange} required={!isEditing} />
                            <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
                            {isEditing && <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>}
                        </form>
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <img src={product.img} alt={product.name} />
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
                        <table>
                            <thead>
                                <tr><th>ID</th><th>Amount</th><th>Status</th><th>Email</th></tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>£{order.amount}</td>
                                        <td>{order.payment_status}</td>
                                        <td>{order.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
                {alertMessage && <div className="alert">{alertMessage}</div>}
            </main>
        </div>
    );
};

export default AdminDashboard;
