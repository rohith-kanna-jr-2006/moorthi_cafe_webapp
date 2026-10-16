import React from 'react';

const FoodCard = ({ name, description, image, price }) => {
  return (
    <div className="food-card">
      <img src={image} alt={name} />
      <div className="content">
        <h3 className="title">{name}</h3>
        <p className="description">{description}</p>
        <p className="price">{price}</p>
      </div>
    </div>
  );
};

export default FoodCard;
