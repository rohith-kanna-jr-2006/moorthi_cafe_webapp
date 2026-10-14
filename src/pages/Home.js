import React from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const Home = () => {
  // illustrative data - label as demo data
  const featuredItems = [
    { id: 1, name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', image: 'https://via.placeholder.com/400x300?text=Masala+Dosa', price: '$8.99' },
    { id: 2, name: 'Filter Coffee', description: 'Traditional South Indian coffee', image: 'https://via.placeholder.com/400x300?text=Filter+Coffee', price: '$2.49' },
    { id: 3, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', image: 'https://via.placeholder.com/400x300?text=Idli+Sambar', price: '$7.99' },
    { id: 4, name: 'Vada', description: 'Savory fried lentil doughnut', image: 'https://via.placeholder.com/400x300?text=Vada', price: '$3.99' },
    { id: 5, name: 'Pongal', description: 'Rice and lentil porridge with ghee and cashews', image: 'https://via.placeholder.com/400x300?text=Pongal', price: '$9.99' },
    { id: 6, name: 'Uttapam', description: 'Thick rice pancake with toppings', image: 'https://via.placeholder.com/400x300?text=Uttapam', price: '$8.49' },
  ];

  return (
    <div className="site-shell">
      <div className="page-container">
        {/* Hero Section */}
        <section className="section--cream">
          <div className="hero-media">
            {/* Using placeholder image - in real implementation, this would be replaced with actual food photo */}
            <img src="https://via.placeholder.com/1200x600?text=South+Indian+Thali+Meal" alt="Traditional South Indian thali meal" className="hero-image" />
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">100% Pure Vegetarian Heritage</span>
              </div>
              <h1 className="hero-title">Authentic Heritage Flavors of South India</h1>
              <p className="hero-description">
                Celebrating time-honored vegetarian culinary traditions, slow-roasted spices hand-ground on granite stones, and aromatic, froth-crested brass filter coffee brewed fresh every morning.
              </p>
              <div className="hero-actions">
                <Link to="/menu" className="btn btn-primary">Explore Menu Preview</Link>
                <Link to="/about" className="btn btn-secondary">Our Story</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="section--ivory">
          <div className="featured-header">
            <div className="featured-tag">From Our Tiffin Hearth</div>
            <h2 className="featured-title">Featured Tiffin Delicacies</h2>
            <p className="featured-description">
              Each recipe honors century-old proportion guidelines, fermented at controlled ambient temperature and toasted over heavy cast-iron tawas.
            </p>
            <Link to="/menu" className="btn btn-link">View Complete Tiffin Selection</Link>
          </div>
          <div className="featured-grid">
            {featuredItems.map(item => (
              <Link key={item.id} to={`/menu/${item.id}`} className="food-card-link">
                <FoodCard {...item} />
              </Link>
            ))}
          </div>
        </section>

        {/* Additional sections could be added later */}
      </div>
    </div>
  );
};

export default Home;
