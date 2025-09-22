import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { getEconomy } from "../../services/apiService";
import "./Rewards.css";

const Rewards = () => {
  const [economy, setEconomy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("shop");

  useEffect(() => {
    const fetchEconomy = async () => {
      try {
        const data = await getEconomy();
        setEconomy(data);
      } catch (error) {
        console.error("Error fetching economy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEconomy();
  }, []);

  const renderShopItem = (item) => (
    <div key={item.id} className="shop-item">
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <div className="item-sustainability">
          <span className="sustainability-label">Sustainability:</span>
          <div className="sustainability-rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < item.sustainability ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="item-purchase">
        <div className="item-price">
          <span className="price-value">{item.price}</span>
          <span className="price-currency">{item.currency}</span>
        </div>
        <Button variant="primary" size="small">
          Buy
        </Button>
      </div>
    </div>
  );

  const renderMarketOrder = (order, type) => (
    <div key={order.id} className={`market-order ${type}`}>
      <div className="order-info">
        <h3 className="order-item">{order.item}</h3>
        <div className="order-details">
          <span className="order-quantity">{order.quantity} units</span>
          <span className="order-price">₹{order.price}</span>
        </div>
      </div>
      <div className="order-action">
        <span className="order-by">
          {type === "buy" ? order.buyer : order.seller}
        </span>
        <Button variant={type === "buy" ? "secondary" : "primary"} size="small">
          {type === "buy" ? "Sell" : "Buy"}
        </Button>
      </div>
    </div>
  );

  if (loading) return <div>Loading rewards...</div>;
  if (!economy) return <div>No rewards available</div>;

  return (
    <Card className="rewards-widget">
      <div className="card-header">
        <h2 className="card-title">Rewards & Marketplace</h2>
      </div>

      <div className="rewards-tabs">
        <Button
          variant={activeTab === "shop" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("shop")}
        >
          Shop
        </Button>
        <Button
          variant={activeTab === "marketplace" ? "primary" : "outline"}
          size="small"
          onClick={() => setActiveTab("marketplace")}
        >
          Marketplace
        </Button>
      </div>

      {activeTab === "shop" && (
        <div className="shop-section">
          <div className="shop-categories">
            <Button variant="outline" size="small">
              Seeds
            </Button>
            <Button variant="outline" size="small">
              Tools
            </Button>
            <Button variant="outline" size="small">
              Cosmetics
            </Button>
          </div>

          <div className="shop-items">
            {economy.shop.seeds.map(renderShopItem)}
            {economy.shop.tools.map(renderShopItem)}
            {economy.shop.cosmetics.map(renderShopItem)}
          </div>
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="marketplace-section">
          <div className="marketplace-header">
            <h3 className="marketplace-title">Buy Orders</h3>
          </div>
          <div className="marketplace-list">
            {economy.marketplace.buyOrders.map((order) =>
              renderMarketOrder(order, "buy")
            )}
          </div>

          <div className="marketplace-header">
            <h3 className="marketplace-title">Sell Orders</h3>
          </div>
          <div className="marketplace-list">
            {economy.marketplace.sellOrders.map((order) =>
              renderMarketOrder(order, "sell")
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Rewards;
