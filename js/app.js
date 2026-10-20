/**
 * Atelier & Grain - Main Application & State Manager
 * Dynamic reactive state, live pricing calculations, interactive studio controls,
 * cart & commission drawer, spec sheet generator, and modals.
 */

class AtelierApp {
    constructor() {
        this.studio3D = null;
        this.currentUnit = 'cm'; // 'cm' or 'in'
        this.currentCurrency = 'USD';
        this.currencyRates = { USD: 1.0, EUR: 0.92, GBP: 0.79, CAD: 1.36 };
        this.currencySymbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$' };

        // Configuration State
        this.state = {
            product: FURNITURE_CATALOG.products['dining-table'],
            style: FURNITURE_CATALOG.products['dining-table'].styles[0],
            wood: FURNITURE_CATALOG.woods[0], // American Walnut
            finish: FURNITURE_CATALOG.finishes[0], // Natural Raw Satin
            leg: FURNITURE_CATALOG.legs[0], // Matte Black Steel
            edge: FURNITURE_CATALOG.edges[0], // Live Edge
            dimensions: {
                length: 220,
                width: 100,
                thickness: 5
            },
            addons: ['brass-bowtie']
        };

        this.cart = [];
        this.init();
    }

    init() {
        // Initialize 3D Studio
        if (typeof FurnitureStudio3D !== 'undefined') {
            this.studio3D = new FurnitureStudio3D('viewport3dContainer');
        }

        // Render UI panels
        this.renderProductTypeNav();
        this.renderStepPanels();
        this.renderLookbook();
        this.renderTimberLibrary();
        this.renderTestimonials();

        // Bind DOM events
        this.bindEvents();

        // Initial 3D update & price calculate
        this.update3DModel();
        this.calculatePrice();
        this.updateLiveSpecsPill();
    }

    /* ==========================================================================
       RENDERERS FOR CONFIGURATOR CONTROLS
       ========================================================================== */

    renderProductTypeNav() {
        const navContainer = document.getElementById('productNavContainer');
        if (!navContainer) return;

        navContainer.innerHTML = '';
        Object.values(FURNITURE_CATALOG.products).forEach(prod => {
            const btn = document.createElement('button');
            btn.className = `product-nav-btn ${prod.id === this.state.product.id ? 'active' : ''}`;
            btn.dataset.productId = prod.id;
            
            let iconClass = 'fa-couch';
            if (prod.id === 'dining-table') iconClass = 'fa-utensils';
            else if (prod.id === 'executive-desk') iconClass = 'fa-briefcase';
            else if (prod.id === 'coffee-table') iconClass = 'fa-mug-hot';

            btn.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${prod.name.split(' ')[1] || prod.name}</span>`;
            btn.addEventListener('click', () => this.switchProduct(prod.id));
            navContainer.appendChild(btn);
        });
    }

    switchProduct(productId) {
        const prod = FURNITURE_CATALOG.products[productId];
        if (!prod) return;

        this.state.product = prod;
        this.state.style = prod.styles[0];
        this.state.dimensions = {
            length: prod.dimensionLimits.length.default,
            width: prod.dimensionLimits.width.default,
            thickness: prod.dimensionLimits.thickness.default
        };

        // Update Nav UI
        document.querySelectorAll('.product-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.productId === productId);
        });

        // Re-render styles and dimensions step
        this.renderStylesPane();
        this.renderDimensionsPane();

        // Refresh 3D Model & Price
        this.update3DModel();
        this.calculatePrice();
        this.updateLiveSpecsPill();

        this.showToast(`Switched studio to ${prod.name}`);
    }

    renderStepPanels() {
        this.renderStylesPane();
        this.renderWoodsPane();
        this.renderFinishesPane();
        this.renderLegsPane();
        this.renderDimensionsPane();
    }

    renderStylesPane() {
        const pane = document.getElementById('stylesGrid');
        if (!pane) return;

        pane.innerHTML = '';
        this.state.product.styles.forEach(st => {
            const card = document.createElement('div');
            card.className = `style-choice-card ${st.id === this.state.style.id ? 'active' : ''}`;
            card.innerHTML = `
                <div>
                    <div class="style-icon"><i class="fa-solid ${st.icon}"></i></div>
                    <h4>${st.name}</h4>
                    <p>${st.desc}</p>
                </div>
                <div class="style-card-price">${st.price === 0 ? 'Included' : `+${this.formatCurrency(st.price)}`}</div>
            `;
            card.addEventListener('click', () => {
                this.state.style = st;
                this.renderStylesPane();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            pane.appendChild(card);
        });
    }

    renderWoodsPane() {
        const pane = document.getElementById('woodsGrid');
        if (!pane) return;

        pane.innerHTML = '';
        FURNITURE_CATALOG.woods.forEach(w => {
            const card = document.createElement('div');
            card.className = `wood-swatch-card ${w.id === this.state.wood.id ? 'active' : ''}`;
            card.innerHTML = `
                <div class="swatch-color-pill" style="background: linear-gradient(135deg, ${w.baseColor} 0%, ${w.secondaryColor} 100%);"></div>
                <h4>${w.name}</h4>
                <span class="wood-swatch-origin">${w.origin}</span>
                <p>${w.desc}</p>
                <div class="swatch-footer-meta">
                    <span class="swatch-hardness"><i class="fa-solid fa-shield-halved"></i> Janka: ${w.hardness}</span>
                    <span class="swatch-multiplier">${w.priceMultiplier === 1 ? 'Standard' : `+${Math.round((w.priceMultiplier - 1) * 100)}%`}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                this.state.wood = w;
                this.renderWoodsPane();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            pane.appendChild(card);
        });
    }

    renderFinishesPane() {
        const pane = document.getElementById('finishesGrid');
        if (!pane) return;

        pane.innerHTML = '';
        FURNITURE_CATALOG.finishes.forEach(fin => {
            const tile = document.createElement('div');
            tile.className = `finish-tile ${fin.id === this.state.finish.id ? 'active' : ''}`;
            tile.innerHTML = `
                <div class="finish-color-circle" style="background: ${fin.id === 'raw-matte' ? 'linear-gradient(135deg, #a48259, #6d4b27)' : fin.tintHex};"></div>
                <h5>${fin.name}</h5>
                <span class="finish-sheen">${fin.sheen}</span>
                <span class="finish-price-tag">${fin.price === 0 ? 'Standard' : `+${this.formatCurrency(fin.price)}`}</span>
            `;
            tile.addEventListener('click', () => {
                this.state.finish = fin;
                this.renderFinishesPane();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            pane.appendChild(tile);
        });
    }

    renderLegsPane() {
        const pane = document.getElementById('legsGrid');
        if (!pane) return;

        pane.innerHTML = '';
        FURNITURE_CATALOG.legs.forEach(leg => {
            const card = document.createElement('div');
            card.className = `leg-card ${leg.id === this.state.leg.id ? 'active' : ''}`;
            const dotColor = leg.colorHex || this.state.wood.baseColor;
            card.innerHTML = `
                <div class="leg-header">
                    <div class="leg-icon-dot" style="background: ${dotColor};"></div>
                    <i class="fa-solid ${leg.icon}"></i>
                </div>
                <h4>${leg.name}</h4>
                <p>${leg.desc}</p>
                <div class="leg-card-price">${leg.price === 0 ? 'Included' : `+${this.formatCurrency(leg.price)}`}</div>
            `;
            card.addEventListener('click', () => {
                this.state.leg = leg;
                this.renderLegsPane();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            pane.appendChild(card);
        });
    }

    renderDimensionsPane() {
        const pane = document.getElementById('dimensionsPane');
        if (!pane) return;

        const limits = this.state.product.dimensionLimits;
        const dims = this.state.dimensions;

        pane.innerHTML = `
            <div class="dimension-group">
                <div class="dim-control-row">
                    <div class="dim-header-label">
                        <span class="dim-title"><i class="fa-solid fa-arrows-left-right"></i> Length (Span)</span>
                        <span class="dim-val-display" id="dimLenDisplay">${this.formatDimension(dims.length)}</span>
                    </div>
                    <input type="range" class="dim-slider" id="sliderLength" 
                        min="${limits.length.min}" max="${limits.length.max}" step="${limits.length.step}" value="${dims.length}">
                </div>

                <div class="dim-control-row">
                    <div class="dim-header-label">
                        <span class="dim-title"><i class="fa-solid fa-arrows-up-down"></i> Width (Depth)</span>
                        <span class="dim-val-display" id="dimWidthDisplay">${this.formatDimension(dims.width)}</span>
                    </div>
                    <input type="range" class="dim-slider" id="sliderWidth" 
                        min="${limits.width.min}" max="${limits.width.max}" step="${limits.width.step}" value="${dims.width}">
                </div>

                <div class="dim-control-row">
                    <div class="dim-header-label">
                        <span class="dim-title"><i class="fa-solid fa-layer-group"></i> Slab Thickness</span>
                        <span class="dim-val-display" id="dimThickDisplay">${this.formatDimension(dims.thickness)}</span>
                    </div>
                    <input type="range" class="dim-slider" id="sliderThickness" 
                        min="${limits.thickness.min}" max="${limits.thickness.max}" step="${limits.thickness.step}" value="${dims.thickness}">
                </div>

                <div class="seats-calculator-pill">
                    <i class="fa-solid fa-users"></i>
                    <span id="capacityCalcDisplay">${this.state.product.guestCalculator(dims.length)}</span>
                </div>
            </div>

            <h4 style="margin: 1.5rem 0 0.75rem 0; font-size: 1.15rem;">Edge Silhouette Profile</h4>
            <div class="edge-profiles-grid" id="edgeProfilesGrid"></div>

            <h4 style="margin: 1.5rem 0 0.75rem 0; font-size: 1.15rem;">Artisan Inlays & Smart Features</h4>
            <div class="addons-checklist" id="addonsChecklist"></div>
        `;

        // Render Edge Profiles
        const edgeGrid = document.getElementById('edgeProfilesGrid');
        FURNITURE_CATALOG.edges.forEach(e => {
            const btn = document.createElement('div');
            btn.className = `edge-pill-btn ${e.id === this.state.edge.id ? 'active' : ''}`;
            btn.innerHTML = `
                <h5>${e.name}</h5>
                <span>${e.price === 0 ? 'Standard' : `+${this.formatCurrency(e.price)}`}</span>
            `;
            btn.addEventListener('click', () => {
                this.state.edge = e;
                this.renderDimensionsPane();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            edgeGrid.appendChild(btn);
        });

        // Render Addons
        const addonList = document.getElementById('addonsChecklist');
        FURNITURE_CATALOG.addons.forEach(add => {
            const isChecked = this.state.addons.includes(add.id);
            const row = document.createElement('div');
            row.className = `addon-checkbox-row ${isChecked ? 'checked' : ''}`;
            row.innerHTML = `
                <div class="addon-info-left">
                    <div class="addon-check-box"><i class="fa-solid fa-check"></i></div>
                    <div class="addon-text">
                        <h5>${add.name}</h5>
                        <p>${add.desc}</p>
                    </div>
                </div>
                <div class="addon-price">+${this.formatCurrency(add.price)}</div>
            `;
            row.addEventListener('click', () => {
                if (isChecked) {
                    this.state.addons = this.state.addons.filter(id => id !== add.id);
                } else {
                    this.state.addons.push(add.id);
                }
                this.renderDimensionsPane();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
            });
            addonList.appendChild(row);
        });

        // Bind Sliders
        const sL = document.getElementById('sliderLength');
        const sW = document.getElementById('sliderWidth');
        const sT = document.getElementById('sliderThickness');

        sL.addEventListener('input', (e) => {
            this.state.dimensions.length = parseInt(e.target.value);
            document.getElementById('dimLenDisplay').textContent = this.formatDimension(this.state.dimensions.length);
            document.getElementById('capacityCalcDisplay').textContent = this.state.product.guestCalculator(this.state.dimensions.length);
            this.update3DModel();
            this.calculatePrice();
            this.updateLiveSpecsPill();
        });

        sW.addEventListener('input', (e) => {
            this.state.dimensions.width = parseInt(e.target.value);
            document.getElementById('dimWidthDisplay').textContent = this.formatDimension(this.state.dimensions.width);
            this.update3DModel();
            this.calculatePrice();
            this.updateLiveSpecsPill();
        });

        sT.addEventListener('input', (e) => {
            this.state.dimensions.thickness = parseInt(e.target.value);
            document.getElementById('dimThickDisplay').textContent = this.formatDimension(this.state.dimensions.thickness);
            this.update3DModel();
            this.calculatePrice();
            this.updateLiveSpecsPill();
        });
    }

    /* ==========================================================================
       PRICE CALCULATION ENGINE
       ========================================================================== */

    calculatePrice() {
        const prod = this.state.product;
        let price = prod.basePrice;

        // Wood multiplier
        price *= this.state.wood.priceMultiplier;

        // Style adjustment
        price += this.state.style.price;

        // Finish adjustment
        price += this.state.finish.price;

        // Leg adjustment
        price += this.state.leg.price;

        // Edge profile adjustment
        price += this.state.edge.price;

        // Sizing variance from default
        const limits = prod.dimensionLimits;
        const lenDiff = this.state.dimensions.length - limits.length.default;
        if (lenDiff > 0) price += lenDiff * limits.length.pricePerUnit;

        const widthDiff = this.state.dimensions.width - limits.width.default;
        if (widthDiff > 0) price += widthDiff * limits.width.pricePerUnit;

        const thickDiff = this.state.dimensions.thickness - limits.thickness.default;
        if (thickDiff > 0) price += thickDiff * limits.thickness.pricePerUnit;

        // Addons
        this.state.addons.forEach(aid => {
            const add = FURNITURE_CATALOG.addons.find(a => a.id === aid);
            if (add) price += add.price;
        });

        this.currentCalculatedPrice = Math.round(price);

        // Update Price Displays
        const priceDisplay = document.getElementById('calculatedPriceDisplay');
        if (priceDisplay) {
            priceDisplay.textContent = this.formatCurrency(this.currentCalculatedPrice);
        }

        const affirmRate = Math.round(this.currentCalculatedPrice / 12);
        const affirmDisplay = document.getElementById('affirmRateDisplay');
        if (affirmDisplay) {
            affirmDisplay.textContent = `Or ${this.formatCurrency(affirmRate)}/mo with 0% APR financing`;
        }

        return this.currentCalculatedPrice;
    }

    updateLiveSpecsPill() {
        const pillText = document.getElementById('liveSpecPillText');
        if (pillText) {
            pillText.textContent = `${this.state.wood.name} • ${this.state.style.name} • ${this.state.dimensions.length}${this.currentUnit}`;
        }
    }

    update3DModel() {
        if (this.studio3D) {
            this.studio3D.updateModel(this.state);
        }
    }

    /* ==========================================================================
       LOOKBOOK & TIMBER LIBRARY & REVIEWS
       ========================================================================== */

    renderLookbook() {
        const container = document.getElementById('lookbookGrid');
        if (!container) return;

        container.innerHTML = '';
        FURNITURE_CATALOG.lookbook.forEach(item => {
            const card = document.createElement('div');
            card.className = `lookbook-card lookbook-cat-${item.category}`;
            card.innerHTML = `
                <div class="lookbook-card-media">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="lookbook-card-overlay">
                        <span class="lookbook-specs-badge">${item.specs}</span>
                        <h4>${item.title}</h4>
                        <p class="lookbook-quote">${item.quote}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderTimberLibrary() {
        const container = document.getElementById('timberSpecimensList');
        if (!container) return;

        container.innerHTML = '';
        FURNITURE_CATALOG.woods.forEach(w => {
            const card = document.createElement('div');
            card.className = `timber-specimen-card ${w.id === this.state.wood.id ? 'active' : ''}`;
            card.innerHTML = `
                <div class="timber-specimen-header">
                    <span class="mono-tag" style="font-size: 0.65rem;">${w.tag}</span>
                    <div class="timber-color-dot" style="background: ${w.baseColor};"></div>
                </div>
                <h4>${w.name}</h4>
                <span class="timber-origin"><i class="fa-solid fa-location-dot"></i> ${w.origin}</span>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem;">${w.desc}</p>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted);">
                    <span>Hardness: ${w.hardness}</span>
                    <span style="color: var(--gold-light);">Density: ${w.hardnessPct}%</span>
                </div>
                <div class="timber-janka-bar">
                    <div class="timber-janka-fill" style="width: ${w.hardnessPct}%;"></div>
                </div>
            `;
            card.addEventListener('click', () => {
                this.state.wood = w;
                this.renderWoodsPane();
                this.renderTimberLibrary();
                this.update3DModel();
                this.calculatePrice();
                this.updateLiveSpecsPill();
                // Smooth scroll to configurator
                document.getElementById('customizerStudio').scrollIntoView({ behavior: 'smooth' });
                this.showToast(`Selected ${w.name} for customizer`);
            });
            container.appendChild(card);
        });
    }

    renderTestimonials() {
        const container = document.getElementById('testimonialsGrid');
        if (!container) return;

        container.innerHTML = '';
        FURNITURE_CATALOG.testimonials.forEach(t => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div>
                    <div class="test-stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(t.rating)}
                    </div>
                    <p class="test-text">“${t.text}”</p>
                </div>
                <div class="test-author-row">
                    <div>
                        <div class="test-name">${t.name}</div>
                        <div class="test-role">${t.title} — ${t.location}</div>
                    </div>
                    <span class="test-piece-tag">${t.piece}</span>
                </div>
            `;
            container.appendChild(card);
        });
    }

    /* ==========================================================================
       CART & COMMISSION DRAWER & SPEC SHEET MODAL
       ========================================================================== */

    addToCart() {
        const snapshotUrl = this.studio3D ? this.studio3D.captureSnapshot() : this.state.product.image;
        const item = {
            id: 'build-' + Date.now(),
            productName: this.state.product.name,
            woodName: this.state.wood.name,
            styleName: this.state.style.name,
            finishName: this.state.finish.name,
            legName: this.state.leg.name,
            dimensions: `${this.state.dimensions.length}cm × ${this.state.dimensions.width}cm × ${this.state.dimensions.thickness}cm`,
            addons: this.state.addons.map(aid => FURNITURE_CATALOG.addons.find(a => a.id === aid)?.name).filter(Boolean),
            price: this.currentCalculatedPrice,
            image: snapshotUrl
        };

        this.cart.push(item);
        this.updateCartBadge();
        this.renderCartDrawer();
        this.openDrawer('cartDrawerBackdrop');
        this.showToast('Commission build added to your workshop order!');
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-count-badge');
        badges.forEach(b => {
            b.textContent = this.cart.length;
            b.style.display = this.cart.length > 0 ? 'flex' : 'none';
        });
    }

    renderCartDrawer() {
        const content = document.getElementById('cartDrawerContent');
        const subtotalElem = document.getElementById('drawerSubtotal');
        const totalElem = document.getElementById('drawerTotal');
        if (!content) return;

        if (this.cart.length === 0) {
            content.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-couch"></i>
                    <h4>Your Atelier Workshop is Empty</h4>
                    <p style="font-size: 0.88rem; margin-top: 0.5rem;">Configure your dream timber furniture piece in the 3D studio and commission your build.</p>
                </div>
            `;
            if (subtotalElem) subtotalElem.textContent = this.formatCurrency(0);
            if (totalElem) totalElem.textContent = this.formatCurrency(0);
            return;
        }

        content.innerHTML = '';
        let total = 0;
        this.cart.forEach((item, idx) => {
            total += item.price;
            const card = document.createElement('div');
            card.className = 'cart-item-card';
            card.innerHTML = `
                <h4 class="cart-item-title">${item.productName}</h4>
                <ul class="cart-item-specs-list">
                    <li><strong style="color: var(--text-primary);">${item.woodName}</strong> (${item.finishName})</li>
                    <li>Style: ${item.styleName} • Legs: ${item.legName}</li>
                    <li>Dimensions: ${item.dimensions}</li>
                    ${item.addons.length ? `<li>Inlays: ${item.addons.join(', ')}</li>` : ''}
                </ul>
                <div class="cart-item-price-row">
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-light);">${this.formatCurrency(item.price)}</span>
                    <button class="btn-remove-item" data-idx="${idx}"><i class="fa-solid fa-trash-can"></i> Remove</button>
                </div>
            `;
            card.querySelector('.btn-remove-item').addEventListener('click', () => {
                this.cart.splice(idx, 1);
                this.updateCartBadge();
                this.renderCartDrawer();
            });
            content.appendChild(card);
        });

        if (subtotalElem) subtotalElem.textContent = this.formatCurrency(total);
        if (totalElem) totalElem.textContent = this.formatCurrency(total);
    }

    openSpecSheetModal() {
        const modal = document.getElementById('specSheetModal');
        const preview = document.getElementById('specSheetImgPreview');
        const content = document.getElementById('specSheetTableContent');
        if (!modal || !content) return;

        // Capture live snapshot from 3D canvas
        const snapshot = this.studio3D ? this.studio3D.captureSnapshot() : this.state.product.image;
        if (preview) {
            preview.innerHTML = `<img src="${snapshot}" alt="3D Customizer Snapshot">`;
        }

        const addonNames = this.state.addons.map(aid => FURNITURE_CATALOG.addons.find(a => a.id === aid)?.name).filter(Boolean);

        content.innerHTML = `
            <div class="spec-table-row">
                <span class="spec-table-label">Furniture Model</span>
                <span class="spec-table-val">${this.state.product.name}</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Timber Species</span>
                <span class="spec-table-val">${this.state.wood.name} (${this.state.wood.botanical})</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Harvest Provenance</span>
                <span class="spec-table-val">${this.state.wood.origin}</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Silhouette & Style</span>
                <span class="spec-table-val">${this.state.style.name}</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Surface Finish / Stain</span>
                <span class="spec-table-val">${this.state.finish.name} (${this.state.finish.sheen})</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Base & Leg Architecture</span>
                <span class="spec-table-val">${this.state.leg.name}</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Bespoke Dimensions</span>
                <span class="spec-table-val">${this.state.dimensions.length}cm L × ${this.state.dimensions.width}cm W × ${this.state.dimensions.thickness}cm T</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Edge Profile</span>
                <span class="spec-table-val">${this.state.edge.name}</span>
            </div>
            <div class="spec-table-row">
                <span class="spec-table-label">Handcrafted Inlays</span>
                <span class="spec-table-val">${addonNames.length ? addonNames.join(', ') : 'None'}</span>
            </div>
            <div class="spec-table-row" style="border-bottom: none; margin-top: 0.5rem; padding-top: 1rem;">
                <span class="spec-table-label" style="font-size: 1.1rem; color: var(--text-primary); font-weight: 700;">Commission Estimate</span>
                <span class="spec-table-val" style="font-size: 1.5rem; color: var(--gold-light);">${this.formatCurrency(this.currentCalculatedPrice)}</span>
            </div>
        `;

        modal.classList.add('open');
    }

    openDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        if (drawer) drawer.classList.add('open');
    }

    closeDrawer(drawerId) {
        const drawer = document.getElementById(drawerId);
        if (drawer) drawer.classList.remove('open');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('open');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('open');
    }

    /* ==========================================================================
       UTILITIES & EVENT BINDINGS
       ========================================================================== */

    bindEvents() {
        // Sticky Header on scroll
        const header = document.querySelector('.site-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });

        // Configurator Step Tabs
        const stepTabs = document.querySelectorAll('.step-tab-btn');
        stepTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                stepTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetStep = tab.dataset.step;
                document.querySelectorAll('.step-content-pane').forEach(p => {
                    p.classList.toggle('active', p.id === `stepPane-${targetStep}`);
                });
            });
        });

        // Viewport 3D HUD buttons
        const camBtns = document.querySelectorAll('.cam-btn');
        camBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                camBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (this.studio3D) this.studio3D.setCameraView(btn.dataset.view);
            });
        });

        const lightBtns = document.querySelectorAll('.light-btn');
        lightBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                lightBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (this.studio3D) this.studio3D.setLightingEnvironment(btn.dataset.light);
                this.showToast(`Switched lighting to ${btn.title}`);
            });
        });

        const btnExplode = document.getElementById('btnExplodeView');
        if (btnExplode) {
            btnExplode.addEventListener('click', () => {
                if (this.studio3D) {
                    this.studio3D.toggleExplode();
                    this.showToast(this.studio3D.isExploded ? 'Exploded joinery inspection mode' : 'Assembled studio mode');
                }
            });
        }

        const btnSnapshot = document.getElementById('btnSnapshot');
        if (btnSnapshot) {
            btnSnapshot.addEventListener('click', () => {
                this.openSpecSheetModal();
            });
        }

        // Unit switcher
        const unitToggle = document.getElementById('unitToggleBtn');
        if (unitToggle) {
            unitToggle.addEventListener('click', () => {
                this.currentUnit = this.currentUnit === 'cm' ? 'in' : 'cm';
                unitToggle.querySelectorAll('span').forEach(sp => {
                    sp.classList.toggle('active', sp.dataset.unit === this.currentUnit);
                });
                this.renderDimensionsPane();
                this.updateLiveSpecsPill();
                this.showToast(`Dimensions updated to ${this.currentUnit.toUpperCase()}`);
            });
        }

        // Add to Cart
        const btnCommission = document.getElementById('btnCommissionMain');
        if (btnCommission) {
            btnCommission.addEventListener('click', () => this.addToCart());
        }

        // Cart Drawer Trigger
        const cartTrigger = document.getElementById('navCartTrigger');
        if (cartTrigger) {
            cartTrigger.addEventListener('click', () => {
                this.renderCartDrawer();
                this.openDrawer('cartDrawerBackdrop');
            });
        }

        const btnCloseCart = document.getElementById('btnCloseCartDrawer');
        if (btnCloseCart) {
            btnCloseCart.addEventListener('click', () => this.closeDrawer('cartDrawerBackdrop'));
        }

        // Close drawer backdrop
        const drawerBackdrop = document.getElementById('cartDrawerBackdrop');
        if (drawerBackdrop) {
            drawerBackdrop.addEventListener('click', (e) => {
                if (e.target === drawerBackdrop) this.closeDrawer('cartDrawerBackdrop');
            });
        }

        // Spec Sheet Trigger
        const btnSpecSheet = document.getElementById('btnDownloadSpecSheet');
        if (btnSpecSheet) {
            btnSpecSheet.addEventListener('click', () => this.openSpecSheetModal());
        }

        // Close Modals
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('open');
            });
        });

        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').classList.remove('open');
            });
        });

        // Sample Box Triggers
        const btnSampleBox = document.getElementById('btnOrderSampleBox');
        if (btnSampleBox) {
            btnSampleBox.addEventListener('click', () => this.openModal('sampleBoxModal'));
        }

        // Consultation Triggers
        const btnConsult = document.getElementById('btnBookConsultation');
        if (btnConsult) {
            btnConsult.addEventListener('click', () => this.openModal('consultationModal'));
        }

        // Lookbook Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.lookbook-card').forEach(card => {
                    if (filter === 'all' || card.classList.contains(`lookbook-cat-${filter}`)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Sample Box form submit
        const sampleForm = document.getElementById('sampleBoxForm');
        if (sampleForm) {
            sampleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.closeModal('sampleBoxModal');
                this.showToast('Complimentary timber swatch kit dispatched! Expect delivery in 2–3 business days.');
                sampleForm.reset();
            });
        }

        // Consultation form submit
        const consultForm = document.getElementById('consultationForm');
        if (consultForm) {
            consultForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.closeModal('consultationModal');
                this.showToast('Master artisan consultation confirmed! Calendar invite sent.');
                consultForm.reset();
            });
        }
    }

    formatDimension(cmVal) {
        if (this.currentUnit === 'in') {
            const inVal = Math.round(cmVal / 2.54);
            return `${inVal} in`;
        }
        return `${cmVal} cm`;
    }

    formatCurrency(amount) {
        const rate = this.currencyRates[this.currentCurrency] || 1.0;
        const sym = this.currencySymbols[this.currentCurrency] || '$';
        const converted = Math.round(amount * rate);
        return `${sym}${converted.toLocaleString()}`;
    }

    showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'atelier-toast';
        toast.innerHTML = `
            <i class="fa-solid fa-gem"></i>
            <p>${message}</p>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
    window.atelierApp = new AtelierApp();
});
