const fs = require('fs');
const path = require('path');

class RestaurantGenerator {
  constructor() {
    this.baseDir = __dirname;
    this.restaurantsPath = path.join(this.baseDir, 'restaurants');
  }

  ensureDirectories() {
    const dirs = [
      this.restaurantsPath,
      path.join(this.restaurantsPath, 'olas-nutrition-01'),
      path.join(this.restaurantsPath, 'tanke-bites-01'),
      path.join(this.restaurantsPath, 'jollof-king-01')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  generateBadgesHTML(badges) {
    const badgeConfig = {
      'tapdosh-certified': { emoji: '🏆', name: 'TapDosh Certified' },
      'speed-kitchen': { emoji: '⚡', name: 'Speed Kitchen' },
      'jollof-master': { emoji: '👑', name: 'Jollof Master' },
      'chicken-king': { emoji: '🍗', name: 'Chicken King' },
      'student-favorite': { emoji: '🎓', name: 'Student Favorite' },
      'late-night': { emoji: '🌙', name: 'Late Night' },
      'premium-pick': { emoji: '💎', name: 'Premium Pick' }
    };

    let badgesHTML = '';
    badges.forEach(badgeId => {
      const badge = badgeConfig[badgeId];
      if (badge) {
        badgesHTML += `<span class="badge medium">${badge.emoji} ${badge.name}</span>`;
      }
    });
    
    return badgesHTML;
  }

  generateRestaurantHTML(restaurant, certification, menu) {
    const badgesHTML = this.generateBadgesHTML(certification.badges);
    
    const whatsappMessage = `Hello TapDosh! I'd like to order from ${restaurant.name}.%0A%0ARestaurant: ${restaurant.name}%0ALocation: ${restaurant.location.address}%0A%0APlease send me your menu and payment details.%0A%0AThank you!`;
    
    const whatsappUrl = `https://wa.me/2349031123030?text=${whatsappMessage}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${restaurant.name} | TapDosh Certified</title>
    <meta name="description" content="${restaurant.tagline}. TapDosh certified restaurant serving ${restaurant.location.area} area.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/hub.css">
    <link rel="stylesheet" href="/restaurant.css">
</head>
<body>
    <header class="restaurant-header">
        <div class="container">
            <nav class="restaurant-nav">
                <a href="/" class="back-link">
                    <i class="fas fa-arrow-left"></i> Back to TapDosh
                </a>
                <div class="restaurant-logo">
                    <h1>${restaurant.name}</h1>
                    <p class="restaurant-tagline">${restaurant.tagline}</p>
                </div>
                <a href="${whatsappUrl}" class="order-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> Order via TapDosh
                </a>
            </nav>
        </div>
    </header>

    <section class="restaurant-hero">
        <div class="container">
            <div class="hero-content">
                <div class="certification-badge">
                    <span class="badge-score">${certification.overallScore}/100</span>
                    <span class="badge-text">TapDosh Certified</span>
                </div>
                
                <div class="restaurant-badges">
                    ${badgesHTML}
                </div>
                
                <h2 class="restaurant-title">${restaurant.name}</h2>
                <p class="restaurant-subtitle">${restaurant.tagline}</p>
                
                <div class="restaurant-info-grid">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Location</strong>
                            <p>${restaurant.location.address}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Open Now</strong>
                            <p>${restaurant.operating_hours.monday}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-truck"></i>
                        <div>
                            <strong>Delivery</strong>
                            <p>₦${restaurant.delivery_fee} • ${restaurant.delivery_time}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-graduation-cap"></i>
                        <div>
                            <strong>Student Discount</strong>
                            <p>${restaurant.student_discount}% with ID</p>
                        </div>
                    </div>
                </div>
                
                <div class="hero-actions">
                    <a href="${whatsappUrl}" class="btn btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> Order Now
                    </a>
                    <a href="#menu" class="btn btn-secondary">
                        <i class="fas fa-utensils"></i> View Menu
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section class="tester-section">
        <div class="container">
            <div class="tester-quote-card">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <div class="quote-content">
                    <p class="quote-text">"${certification.testerQuote}"</p>
                    <p class="quote-author">— TapDosh Quality Tester</p>
                    <p class="quote-date">Tested on ${certification.lastTestDate}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="menu-section" id="menu">
        <div class="container">
            <h2 class="section-title">Menu Highlights</h2>
            <p class="section-subtitle">Most popular items from our certification tests</p>
            
            <div class="menu-grid">
                ${menu.map(item => `
                <div class="menu-item" data-id="${item.id}">
                    <div class="menu-item-header">
                        <h3>${item.name}</h3>
                        <span class="menu-price">₦${item.price}</span>
                    </div>
                    <p class="menu-description">${item.description}</p>
                    <div class="menu-tags">
                        ${item.tags.map(tag => `<span class="menu-tag">${tag}</span>`).join('')}
                    </div>
                    <button class="add-to-order" data-item='${JSON.stringify(item).replace(/'/g, "&#39;")}'>
                        <i class="fas fa-plus"></i> Add to Order
                    </button>
                </div>
                `).join('')}
            </div>
            
            <div class="menu-note">
                <i class="fas fa-info-circle"></i>
                <p><strong>Full menu available on WhatsApp:</strong> Message us for complete menu, prices, and to place your order.</p>
            </div>
        </div>
    </section>

    <section class="delivery-section">
        <div class="container">
            <h2 class="section-title">Delivery Information</h2>
            
            <div class="delivery-grid">
                <div class="delivery-card">
                    <div class="delivery-icon">
                        <i class="fas fa-map"></i>
                    </div>
                    <h3>Delivery Areas</h3>
                    <ul class="delivery-areas">
                        ${restaurant.delivery_areas.map(area => `<li><i class="fas fa-check"></i> ${area}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="delivery-card">
                    <div class="delivery-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>Operating Hours</h3>
                    <div class="hours-list">
                        ${Object.entries(restaurant.operating_hours).map(([day, hours]) => `
                        <div class="hour-item">
                            <span class="day">${day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                            <span class="time">${hours}</span>
                        </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="delivery-card">
                    <div class="delivery-icon">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <h3>Payment Methods</h3>
                    <ul class="payment-methods">
                        ${restaurant.payment_methods.map(method => {
                          const methodNames = {
                            'bank_transfer': 'Bank Transfer',
                            'cash_on_delivery': 'Cash on Delivery'
                          };
                          return `<li><i class="fas fa-check"></i> ${methodNames[method] || method}</li>`;
                        }).join('')}
                    </ul>
                    <p class="payment-note"><i class="fas fa-shield-alt"></i> Payment details provided via WhatsApp after order confirmation</p>
                </div>
            </div>
        </div>
    </section>

    <section class="restaurant-cta">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Order ${restaurant.name}?</h2>
                <p>Click below to chat with our TapDosh concierge on WhatsApp. We'll handle everything from order to delivery.</p>
                <a href="${whatsappUrl}" class="cta-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> Order via TapDosh Concierge
                </a>
                <p class="cta-note"><i class="fas fa-lock"></i> Your payment details are secure and only shared via WhatsApp</p>
            </div>
        </div>
    </section>

    <footer class="restaurant-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <div class="logo">Tap<span>Dosh</span></div>
                    <p class="tagline">Certified Food Concierge</p>
                </div>
                
                <div class="footer-links">
                    <a href="/">Browse All Restaurants</a>
                    <a href="/#how-it-works">How TapDosh Works</a>
                    <a href="/#certification">Our Certification</a>
                    <a href="${whatsappUrl}" target="_blank">Contact Concierge</a>
                </div>
                
                <div class="footer-note">
                    <p><i class="fas fa-award"></i> This restaurant is TapDosh Certified</p>
                    <p>Last tested: ${certification.lastTestDate} | Score: ${certification.overallScore}/100</p>
                </div>
            </div>
        </div>
    </footer>

    <div class="order-modal" id="orderModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add to Order</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p id="modalItemText"></p>
                <p>This item will be added to your WhatsApp order. Continue to chat with our concierge?</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="cancelOrder">Cancel</button>
                <a href="#" class="btn btn-whatsapp" target="_blank" id="confirmOrder">
                    <i class="fab fa-whatsapp"></i> Continue to WhatsApp
                </a>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const orderModal = document.getElementById('orderModal');
            const modalItemText = document.getElementById('modalItemText');
            const confirmOrder = document.getElementById('confirmOrder');
            let currentItem = null;
            
            document.querySelectorAll('.add-to-order').forEach(button => {
                button.addEventListener('click', function() {
                    try {
                        const itemData = this.getAttribute('data-item');
                        currentItem = JSON.parse(itemData.replace(/&#39;/g, "'"));
                        
                        modalItemText.textContent = 'Add "' + currentItem.name + '" (₦' + currentItem.price + ') to your order?';
                        
                        const message = encodeURIComponent(
                            'Hello TapDosh! I\\'d like to order from ${restaurant.name}.\\n\\n' +
                            'Item: ' + currentItem.name + '\\n' +
                            'Price: ₦' + currentItem.price + '\\n\\n' +
                            'Please send me the full menu and payment details.\\n\\nThank you!'
                        );
                        
                        confirmOrder.href = 'https://wa.me/2349031123030?text=' + message;
                        orderModal.style.display = 'flex';
                    } catch (error) {
                        console.error('Error parsing item data:', error);
                    }
                });
            });
            
            document.querySelectorAll('.close-modal, #cancelOrder').forEach(button => {
                button.addEventListener('click', function() {
                    orderModal.style.display = 'none';
                });
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === orderModal) {
                    orderModal.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>`;
  }

  generateAllSites() {
    this.ensureDirectories();
    
    const dataFile = path.join(this.restaurantsPath, 'data.json');
    
    if (!fs.existsSync(dataFile)) {
      console.error('❌ data.json not found');
      return;
    }
    
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      
      console.log(`📊 Found ${data.length} restaurants`);
      
      data.forEach(config => {
        const restaurantDir = path.join(this.restaurantsPath, config.restaurant.id);
        
        if (!fs.existsSync(restaurantDir)) {
          fs.mkdirSync(restaurantDir, { recursive: true });
        }
        
        // Generate HTML
        const html = this.generateRestaurantHTML(
          config.restaurant,
          config.certification,
          config.menu_highlights
        );
        
        // Write files
        fs.writeFileSync(path.join(restaurantDir, 'index.html'), html);
        fs.writeFileSync(path.join(restaurantDir, 'config.json'), JSON.stringify(config, null, 2));
        
        console.log(`✅ Generated site for: ${config.restaurant.name}`);
      });
      
      console.log('✅ All restaurant sites generated successfully!');
      
    } catch (error) {
      console.error('❌ Error generating sites:', error);
    }
  }
}

// Run generator if called directly
if (require.main === module) {
  const generator = new RestaurantGenerator();
  generator.generateAllSites();
}

module.exports = RestaurantGenerator;