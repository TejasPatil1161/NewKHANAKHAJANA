import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ShimmerMenu from './ShimmerMenu';
import { CDN_URL } from '../utils/constants';
import { MENU_API } from '../utils/constants';
import { FiClock } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';

const RestaurantMenu = () => {
  const [resInfo, setResInfo] = useState(null);

  const { resId } = useParams();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const data = await fetch(MENU_API + resId);
    const json = await data.json();
    console.log(json);
    setResInfo(json?.data);
  };

  if (resInfo === null) return <ShimmerMenu />;

  const {
    name,
    cuisines,
    costForTwoMessage,
    cloudinaryImageId,
  } = resInfo?.cards?.[2]?.card?.card?.info || {};

  const { deliveryTime } = resInfo?.cards?.[2]?.card?.card?.info?.sla;
  const { avgRating } = resInfo?.cards?.[2]?.card?.card?.info || {};

  // Ensure itemCards defaults to an empty array
  const itemCards = resInfo?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards?.[2]?.card?.card?.itemCards || [];
  console.log(itemCards);

  return (
    <div className="menu">
      <header className="menu-header">
        <div className="menu-header-left">
          <img src={CDN_URL + cloudinaryImageId} alt="Restaurant Info" />
        </div>
        <div className="menu-header-right">
          <div className="top">
            <h1>{name}</h1>
            <h3>{cuisines?.join(', ')}</h3>
          </div>
          <div className="bottom">
            <h4 className="avg-rating">
              <span className="icons">
                <AiOutlineStar />
              </span>
              <span>{avgRating || 'N/A'}</span>
            </h4>
            <h4 className="time">
              <span className="icons">
                <FiClock />
              </span>
              <span> {deliveryTime || '30'} MINS</span>
            </h4>
            <h3>{costForTwoMessage || costForTwo }</h3>
          </div>
        </div>
      </header>

      <div className="menu-main">
        <h2>Menu</h2>
        <h3 className="items">{itemCards.length} items</h3>
        <div className="menu-main-card-container">
          {itemCards.map((item) => (
            <div key={item?.card?.info?.id} className="menu-card">
              <div className="menu-card-left">
                <h2 className="menu-name">{item?.card?.info?.name || 'Unknown'}</h2>
                <h3 className="menu-price">
                  ₹
                  {(item?.card?.info?.price / 100) || (item?.card?.info?.defaultPrice / 100) || 'N/A'}
                </h3>
                <h4 className="menu-description">
                  {item?.card?.info?.description || 'No description'}
                </h4>
              </div>
              <div className="menu-card-right">
                <img src={CDN_URL + (item?.card?.info?.imageId || '')} alt="Menu Info" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;
