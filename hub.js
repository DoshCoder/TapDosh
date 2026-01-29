document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }
    
    // Restaurant Data
    const restaurants = [
        {
            id: 'olas-nutrition-01',
            name: 'Olas Nutrition',
            tagline: 'Authentic Nigerian Cuisine',
            badges: ['🏆 TapDosh Certified', '⚡ Speed Kitchen', '🍗 Chicken King', '🎓 Student Favorite', '🌙 Late Night'],
            quote: 'The juiciest chicken in Tanke, consistently well-packaged. Perfect for late-night student cravings!',
            location: 'Opposite Alhikmah University, Ilorin',
            deliveryTime: '30-45 minutes',
            hours: '8:00 AM - 11:00 PM',
            deliveryFee: '₦500',
            score: '92/100',
            area: 'tanke',
            category: 'chicken'
        },
        {
            id: 'tanke-bites-01',
            name: 'Tanke Bites',
            tagline: 'Quick & Delicious Student Meals',
            badges: ['🏆 TapDosh Certified', '⚡ Speed Kitchen', '🎓 Student Favorite', '🌙 Late Night', '💎 Premium Pick'],
            quote: 'The go-to spot for late-night study snacks. Burgers are consistently fresh and delivery is lightning fast!',
            location: 'Tanke, Near Alhikmah University Back Gate',
            deliveryTime: '20-35 minutes',
            hours: '7:00 AM - 2:00 AM',
            deliveryFee: '₦400',
            score: '88/100',
            area: 'tanke',
            category: 'speed'
        },
        {
            id: 'jollof-king-01',
            name: 'Jollof King',
            tagline: 'The Real Taste of Jollof',
            badges: ['🏆 TapDosh Certified', '👑 Jollof Master', '💎 Premium Pick', '🍗 Chicken King'],
            quote: 'The best Jollof rice in Ilorin - perfectly spiced, never dry, with generous chicken portions.',
            location: 'Adewole, Ilorin',
            deliveryTime: '35-50 minutes',
            hours: '10:00 AM - 10:00 PM',
            deliveryFee: '₦600',
            score: '94/100',
            area: 'adewole',
            category: 'premium'
        }
    ];
    
    // Display Restaurants
    function displayRestaurants(filteredRestaurants) {
        const grid = document.getElementById('restaurantsGrid');
        if (!grid) return;
        
        if (filteredRestaurants.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No restaurants found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = filteredRestaurants.map(restaurant => `
            <div class="restaurant-card" data-area="${restaurant.area}" data-category="${restaurant.category}">
                <div class="restaurant-badges">
                    ${restaurant.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
                
                <div class="restaurant-content">
                    <div class="restaurant-header">
                        <h3 class="restaurant-name">${restaurant.name}</h3>
                        <p class="restaurant-tagline">${restaurant.tagline}</p>
                    </div>
                    
                    <div class="restaurant-quote">
                        <p>${restaurant.quote}</p>
                    </div>
                    
                    <div class="restaurant-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="info-text">
                                ${restaurant.location}
                                <small>${restaurant.deliveryTime}</small>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div class="info-text">
                                ${restaurant.hours}
                                <small>Today's hours</small>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <i class="fas fa-truck"></i>
                            <div class="info-text">
                                ${restaurant.deliveryFee} delivery
                                <small>Within ${restaurant.area}</small>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <i class="fas fa-star"></i>
                            <div class="info-text">
                                Score: ${restaurant.score}
                                <small>TapDosh Certified</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="restaurant-actions">
                        <a href="/restaurants/${restaurant.id}/" class="btn btn-primary">
                            <i class="fas fa-info-circle"></i> View Details
                        </a>
                        <a href="https://wa.me/2349031123030?text=Hello%20TapDosh!%20I'd%20like%20to%20order%20from%20${encodeURIComponent(restaurant.name)}." class="btn btn-whatsapp" target="_blank">
                            <i class="fab fa-whatsapp"></i> Order Now
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Filter and Search
    let selectedBadge = 'all';
    let selectedArea = 'all';
    let selectedCategory = 'all';
    let searchTerm = '';
    
    function filterRestaurants() {
        let filtered = restaurants;
        
        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(r => 
                r.name.toLowerCase().includes(searchTerm) ||
                r.tagline.toLowerCase().includes(searchTerm) ||
                r.quote.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by area
        if (selectedArea !== 'all') {
            filtered = filtered.filter(r => r.area === selectedArea);
        }
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(r => r.category === selectedCategory);
        }
        
        displayRestaurants(filtered);
    }
    
    // Badge Filters
    document.querySelectorAll('.badge-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            document.querySelectorAll('.badge-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            selectedBadge = this.dataset.badge;
            filterRestaurants();
        });
    });
    
    // Location Filters
    document.querySelectorAll('.location-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.location-tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedArea = this.dataset.area;
            filterRestaurants();
        });
    });
    
    // Search Tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.dataset.filter;
            filterRestaurants();
        });
    });
    
    // Search Input
    const searchInput = document.getElementById('restaurantSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            searchTerm = searchInput.value.toLowerCase().trim();
            filterRestaurants();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchTerm = searchInput.value.toLowerCase().trim();
                filterRestaurants();
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#!')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize
    displayRestaurants(restaurants);
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
});