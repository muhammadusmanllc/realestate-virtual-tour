/* ===== PROPERTIES MANAGEMENT WITH RESTFUL API ===== */

// ===== PROPERTY DATA MANAGEMENT =====
class PropertyManager {
    constructor() {
        this.properties = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.totalProperties = 0;
        this.apiEndpoint = 'tables/properties';
    }

    // Initialize property system
    async init() {
        try {
            await this.createPropertyTable();
            await this.loadInitialData();
            this.renderProperties();
        } catch (error) {
            console.error('Failed to initialize property system:', error);
            this.loadMockData();
        }
    }

    // Create property table schema
    async createPropertyTable() {
        const schema = {
            name: 'properties',
            fields: [
                { name: 'id', type: 'text', description: 'Unique property ID' },
                { name: 'title', type: 'text', description: 'Property title' },
                { name: 'price', type: 'number', description: 'Property price' },
                { name: 'location', type: 'text', description: 'Property location' },
                { name: 'type', type: 'text', description: 'Property type (sale, rent, luxury)' },
                { name: 'bedrooms', type: 'number', description: 'Number of bedrooms' },
                { name: 'bathrooms', type: 'number', description: 'Number of bathrooms' },
                { name: 'area', type: 'number', description: 'Property area in sq ft' },
                { name: 'description', type: 'rich_text', description: 'Property description' },
                { name: 'images', type: 'array', description: 'Property images' },
                { name: 'features', type: 'array', description: 'Property features' },
                { name: 'status', type: 'text', description: 'Property status' },
                { name: 'featured', type: 'bool', description: 'Is featured property' }
            ]
        };

        // This would typically be called via TableSchemaUpdate
        console.log('Property table schema ready:', schema);
    }

    // Load initial sample data
    async loadInitialData() {
        try {
            const response = await fetch(this.apiEndpoint);
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                this.properties = data.data;
                this.totalProperties = data.total || data.data.length;
            } else {
                // Load sample data if no properties exist
                await this.createSampleProperties();
            }
        } catch (error) {
            console.error('Failed to load properties from API:', error);
            await this.createSampleProperties();
        }
    }

    // Create sample properties
    async createSampleProperties() {
        const sampleProperties = [
            {
                title: 'Modern Downtown Apartment',
                price: 2500,
                location: 'Downtown, New York',
                type: 'rent',
                bedrooms: 2,
                bathrooms: 2,
                area: 1200,
                description: 'Stunning modern apartment in the heart of downtown with breathtaking city views.',
                features: ['City View', 'Modern Kitchen', 'Gym Access', 'Parking'],
                status: 'available',
                featured: true
            },
            {
                title: 'Luxury Family Villa',
                price: 850000,
                location: 'Beverly Hills, CA',
                type: 'sale',
                bedrooms: 5,
                bathrooms: 4,
                area: 3500,
                description: 'Exquisite luxury villa with premium amenities and spacious living areas.',
                features: ['Swimming Pool', 'Garden', 'Garage', 'Security System'],
                status: 'available',
                featured: true
            },
            {
                title: 'Cozy Suburban Home',
                price: 425000,
                location: 'Suburbia, TX',
                type: 'sale',
                bedrooms: 3,
                bathrooms: 2,
                area: 1800,
                description: 'Perfect family home in a quiet suburban neighborhood with great schools nearby.',
                features: ['Backyard', 'Updated Kitchen', 'Fireplace', 'Two-car Garage'],
                status: 'available',
                featured: false
            },
            {
                title: 'Luxury Penthouse Suite',
                price: 8500,
                location: 'Manhattan, NY',
                type: 'luxury',
                bedrooms: 4,
                bathrooms: 3,
                area: 2800,
                description: 'Exclusive penthouse with panoramic city views and premium finishes.',
                features: ['Panoramic Views', 'Private Elevator', 'Concierge', 'Rooftop Access'],
                status: 'available',
                featured: true
            },
            {
                title: 'Charming Studio Apartment',
                price: 1800,
                location: 'Brooklyn, NY',
                type: 'rent',
                bedrooms: 1,
                bathrooms: 1,
                area: 650,
                description: 'Bright and airy studio apartment perfect for young professionals.',
                features: ['High Ceilings', 'Exposed Brick', 'Near Subway', 'Pet-friendly'],
                status: 'available',
                featured: false
            },
            {
                title: 'Executive Office Space',
                price: 750000,
                location: 'Business District, SF',
                type: 'sale',
                bedrooms: 0,
                bathrooms: 2,
                area: 2200,
                description: 'Premium office space in prime business location with modern amenities.',
                features: ['Conference Rooms', 'Reception Area', 'Parking', '24/7 Access'],
                status: 'available',
                featured: false
            }
        ];

        // In a real implementation, these would be sent to the API
        this.properties = sampleProperties.map((prop, index) => ({
            ...prop,
            id: `prop_${Date.now()}_${index}`,
            created_at: Date.now(),
            updated_at: Date.now()
        }));

        console.log('Sample properties created:', this.properties.length);
    }

    // Load more properties from API
    async loadProperties(page = 1, limit = 6, filters = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: page,
                limit: limit,
                ...filters
            });

            const response = await fetch(`${this.apiEndpoint}?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                return {
                    properties: data.data || [],
                    total: data.total || 0,
                    page: data.page || 1
                };
            }
        } catch (error) {
            console.error('Failed to load properties:', error);
        }

        // Return filtered local data as fallback
        return this.getFilteredProperties(filters, page, limit);
    }

    // Filter properties locally
    getFilteredProperties(filters = {}, page = 1, limit = 6) {
        let filtered = [...this.properties];

        // Apply type filter
        if (filters.type && filters.type !== 'all') {
            filtered = filtered.filter(prop => prop.type === filters.type);
        }

        // Apply search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(prop => 
                prop.title.toLowerCase().includes(search) ||
                prop.location.toLowerCase().includes(search) ||
                prop.description.toLowerCase().includes(search)
            );
        }

        // Apply price range filter
        if (filters.minPrice) {
            filtered = filtered.filter(prop => prop.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(prop => prop.price <= filters.maxPrice);
        }

        // Apply bedrooms filter
        if (filters.bedrooms) {
            filtered = filtered.filter(prop => prop.bedrooms >= filters.bedrooms);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedProperties = filtered.slice(startIndex, startIndex + limit);

        return {
            properties: paginatedProperties,
            total: filtered.length,
            page: page
        };
    }

    // Render properties to the DOM
    renderProperties(properties = null) {
        const propertyGrid = document.getElementById('property-grid');
        if (!propertyGrid) return;

        const propsToRender = properties || this.properties;
        
        if (propsToRender.length === 0) {
            propertyGrid.innerHTML = `
                <div class="no-properties">
                    <i class="fas fa-home" style="font-size: 4rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No Properties Found</h3>
                    <p>Try adjusting your search criteria or browse all properties.</p>
                </div>
            `;
            return;
        }

        propertyGrid.innerHTML = propsToRender.map(property => this.createPropertyCard(property)).join('');
        
        // Add animation class
        propertyGrid.classList.add('fade-in');
    }

    // Create individual property card HTML
    createPropertyCard(property) {
        const priceFormatted = this.formatPrice(property.price, property.type);
        const bedroomText = property.bedrooms ? `${property.bedrooms} bed` : '';
        const bathroomText = property.bathrooms ? `${property.bathrooms} bath` : '';
        const areaText = property.area ? `${property.area.toLocaleString()} sqft` : '';
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <div class="property-badge">${this.getPropertyBadge(property.type)}</div>
                </div>
                <div class="property-info">
                    <div class="property-price">${priceFormatted}</div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${property.location}</span>
                    </div>
                    <div class="property-features">
                        ${bedroomText ? `<div class="feature"><i class="fas fa-bed"></i><span>${bedroomText}</span></div>` : ''}
                        ${bathroomText ? `<div class="feature"><i class="fas fa-bath"></i><span>${bathroomText}</span></div>` : ''}
                        ${areaText ? `<div class="feature"><i class="fas fa-ruler-combined"></i><span>${areaText}</span></div>` : ''}
                    </div>
                    <div class="property-actions">
                        <button class="btn-outline" onclick="propertyManager.viewProperty('${property.id}')">
                            View Details
                        </button>
                        <button class="btn-outline" onclick="propertyManager.contactAboutProperty('${property.id}')">
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Format price based on property type
    formatPrice(price, type) {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);

        if (type === 'rent') {
            return `${formatted}/month`;
        }
        return formatted;
    }

    // Get property type badge
    getPropertyBadge(type) {
        const badges = {
            'sale': 'For Sale',
            'rent': 'For Rent', 
            'luxury': 'Luxury',
            'all': 'Available'
        };
        return badges[type] || 'Available';
    }

    // View property details
    viewProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // In a real app, this would navigate to a details page
            window.RealEstatePro.showNotification(`Viewing details for: ${property.title}`, 'info');
            window.RealEstatePro.trackEvent('Property', 'view_details', property.title);
        }
    }

    // Contact about property
    contactAboutProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (property) {
            // Scroll to contact form and pre-fill with property info
            const contactSection = document.getElementById('contact');
            const contactForm = document.getElementById('contact-form');
            
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (contactForm) {
                const messageField = contactForm.querySelector('textarea');
                if (messageField) {
                    messageField.value = `I'm interested in the property: ${property.title} (${property.location})`;
                }
            }
            
            window.RealEstatePro.trackEvent('Property', 'contact', property.title);
        }
    }

    // Add new property (for admin functionality)
    async addProperty(propertyData) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(propertyData)
            });

            if (response.ok) {
                const newProperty = await response.json();
                this.properties.unshift(newProperty);
                this.renderProperties();
                return newProperty;
            }
        } catch (error) {
            console.error('Failed to add property:', error);
        }
        return null;
    }

    // Update property
    async updateProperty(propertyId, updateData) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedProperty = await response.json();
                const index = this.properties.findIndex(p => p.id === propertyId);
                if (index !== -1) {
                    this.properties[index] = updatedProperty;
                    this.renderProperties();
                }
                return updatedProperty;
            }
        } catch (error) {
            console.error('Failed to update property:', error);
        }
        return null;
    }

    // Delete property
    async deleteProperty(propertyId) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${propertyId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.properties = this.properties.filter(p => p.id !== propertyId);
                this.renderProperties();
                return true;
            }
        } catch (error) {
            console.error('Failed to delete property:', error);
        }
        return false;
    }
}

// ===== GLOBAL PROPERTY MANAGER INSTANCE =====
const propertyManager = new PropertyManager();

// ===== LOAD PROPERTIES FUNCTION (called from main.js) =====
async function loadProperties() {
    const filters = {
        type: window.currentFilter || 'all',
        search: window.searchQuery || ''
    };

    try {
        const result = await propertyManager.loadProperties(1, 6, filters);
        propertyManager.renderProperties(result.properties);
        
        // Update property count display if exists
        const countDisplay = document.querySelector('.property-count');
        if (countDisplay) {
            countDisplay.textContent = `Showing ${result.properties.length} of ${result.total} properties`;
        }
        
    } catch (error) {
        console.error('Failed to load properties:', error);
        // Show error message to user
        window.RealEstatePro.showNotification('Failed to load properties. Please try again.', 'error');
    }
}

// ===== PROPERTY SEARCH FUNCTIONALITY =====
function searchProperties(query) {
    window.searchQuery = query;
    loadProperties();
}

// ===== PROPERTY FILTER FUNCTIONALITY =====
function filterProperties(type) {
    window.currentFilter = type;
    loadProperties();
}

// ===== INITIALIZE PROPERTIES WHEN DOM IS LOADED =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await propertyManager.init();
        console.log('Property system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize property system:', error);
    }
});

// ===== PROPERTY-SPECIFIC EVENT HANDLERS =====
document.addEventListener('click', (e) => {
    // Handle property card clicks
    if (e.target.closest('.property-card')) {
        const card = e.target.closest('.property-card');
        const propertyId = card.dataset.propertyId;
        
        // Add click tracking
        window.RealEstatePro.trackEvent('Property', 'card_click', propertyId);
    }
    
    // Handle virtual tour clicks
    if (e.target.closest('.tour-item')) {
        const tourTitle = e.target.closest('.tour-item').querySelector('h3').textContent;
        window.RealEstatePro.trackEvent('VirtualTour', 'click', tourTitle);
    }
});

// ===== ADVANCED SEARCH FUNCTIONALITY =====
class AdvancedPropertySearch {
    constructor() {
        this.filters = {
            type: 'all',
            minPrice: null,
            maxPrice: null,
            bedrooms: null,
            bathrooms: null,
            location: '',
            features: []
        };
    }

    // Create advanced search form
    createAdvancedSearchForm() {
        return `
            <div class="advanced-search-form" style="display: none;">
                <div class="search-row">
                    <select id="property-type-filter">
                        <option value="all">All Types</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                        <option value="luxury">Luxury</option>
                    </select>
                    <input type="number" id="min-price" placeholder="Min Price">
                    <input type="number" id="max-price" placeholder="Max Price">
                </div>
                <div class="search-row">
                    <select id="bedrooms-filter">
                        <option value="">Any Bedrooms</option>
                        <option value="1">1+ Bedrooms</option>
                        <option value="2">2+ Bedrooms</option>
                        <option value="3">3+ Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                    </select>
                    <select id="bathrooms-filter">
                        <option value="">Any Bathrooms</option>
                        <option value="1">1+ Bathrooms</option>
                        <option value="2">2+ Bathrooms</option>
                        <option value="3">3+ Bathrooms</option>
                    </select>
                    <input type="text" id="location-filter" placeholder="Location">
                </div>
                <button type="button" onclick="advancedSearch.applyFilters()">Apply Filters</button>
                <button type="button" onclick="advancedSearch.clearFilters()">Clear All</button>
            </div>
        `;
    }

    // Apply advanced filters
    async applyFilters() {
        this.filters = {
            type: document.getElementById('property-type-filter')?.value || 'all',
            minPrice: parseInt(document.getElementById('min-price')?.value) || null,
            maxPrice: parseInt(document.getElementById('max-price')?.value) || null,
            bedrooms: parseInt(document.getElementById('bedrooms-filter')?.value) || null,
            bathrooms: parseInt(document.getElementById('bathrooms-filter')?.value) || null,
            location: document.getElementById('location-filter')?.value || '',
            search: window.searchQuery || ''
        };

        window.RealEstatePro.showLoading(true);
        const result = await propertyManager.loadProperties(1, 6, this.filters);
        propertyManager.renderProperties(result.properties);
        window.RealEstatePro.showLoading(false);

        window.RealEstatePro.trackEvent('Search', 'advanced_filter', JSON.stringify(this.filters));
    }

    // Clear all filters
    clearFilters() {
        this.filters = {
            type: 'all',
            minPrice: null,
            maxPrice: null,
            bedrooms: null,
            bathrooms: null,
            location: '',
            features: []
        };

        // Reset form fields
        document.getElementById('property-type-filter').value = 'all';
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        document.getElementById('bedrooms-filter').value = '';
        document.getElementById('bathrooms-filter').value = '';
        document.getElementById('location-filter').value = '';

        // Reload all properties
        window.currentFilter = 'all';
        window.searchQuery = '';
        loadProperties();
    }
}

// Initialize advanced search
const advancedSearch = new AdvancedPropertySearch();

// ===== EXPORT FOR GLOBAL ACCESS =====
window.PropertyManager = PropertyManager;
window.propertyManager = propertyManager;
window.loadProperties = loadProperties;
window.searchProperties = searchProperties;
window.filterProperties = filterProperties;