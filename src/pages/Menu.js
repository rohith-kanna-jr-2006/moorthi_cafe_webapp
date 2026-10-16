import React from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const Menu = () => {
  // Illustrative data - label as demo data
  const menuItems = [
    { id: 1, name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', image: 'https://via.placeholder.com/400x300?text=Masala+Dosa', price: '$8.99' },
    { id: 2, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', image: 'https://via.placeholder.com/400x300?text=Idli+Sambar', price: '$7.99' },
    { id: 3, name: 'Filter Coffee', description: 'Traditional South Indian coffee', image: 'https://via.placeholder.com/400x300?text=Filter+Coffee', price: '$2.49' },
    { id: 4, name: 'Vada', description: 'Savory fried lentil doughnut', image: 'https://via.placeholder.com/400x300?text=Vada', price: '$3.99' },
    { id: 5, name: 'Pongal', description: 'Rice and lentil porridge with ghee and cashews', image: 'https://via.placeholder.com/400x300?text=Pongal', price: '$9.99' },
    { id: 6, name: 'Uttapam', description: 'Thick rice pancake with toppings', image: 'https://via.placeholder.com/400x300?text=Uttapam', price: '$8.49' },
  ];

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--ivory">
          <div className="section-title">
            <h2>Our Menu</h2>
            <p>Authentic South Indian dishes</p>
          </div>
          <div className="menu-grid">
            {menuItems.map(item => (
              <Link key={item.id} to={`/menu/${item.id}`} className="food-card-link">
                <FoodCard {...item} />
              </Link>
            ))}
          </div>
          <div className="alert alert-info">
            <strong>Note:</strong> Menu data is illustrative (demo) and not connected to the backend API yet.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Menu;
