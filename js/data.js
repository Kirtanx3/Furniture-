/**
 * Atelier & Grain - Bespoke Furniture Data Engine
 * Product catalog, timber species library, finishes, bases, and pricing logic.
 */

const FURNITURE_CATALOG = {
    products: {
        'dining-table': {
            id: 'dining-table',
            name: 'The Solstice Bespoke Dining Table',
            tagline: 'Sculptural hardwood centerpiece engineered for unforgettable gatherings.',
            category: 'Dining',
            basePrice: 2450,
            baseLeadTimeWeeks: 4,
            image: 'assets/images/hero-dining.jpg',
            styles: [
                {
                    id: 'live-edge',
                    name: 'Organic Live Edge',
                    desc: 'Preserves the tree’s natural external bark contour, debarked and hand-sanded to butter-smooth perfection.',
                    price: 220,
                    icon: 'fa-tree'
                },
                {
                    id: 'minimalist-slab',
                    name: 'Architectural Floating Slab',
                    desc: 'Crisp rectilinear geometry with subtle under-bevel for a light, floating silhouette.',
                    price: 0,
                    icon: 'fa-cube'
                },
                {
                    id: 'trestle-heirloom',
                    name: 'Nordic Mortise Trestle',
                    desc: 'Traditional keyed tenon joinery featuring an exposed architectural crossbeam.',
                    price: 340,
                    icon: 'fa-shapes'
                },
                {
                    id: 'fluted-pedestal',
                    name: 'Fluted Monolith Pedestals',
                    desc: 'Dual sculptural fluted timber pedestals offering unlimited legroom and zero corner-post obstruction.',
                    price: 490,
                    icon: 'fa-monument'
                }
            ],
            dimensionLimits: {
                length: { min: 160, max: 320, default: 220, step: 10, unit: 'cm', pricePerUnit: 14 },
                width: { min: 80, max: 120, default: 100, step: 5, unit: 'cm', pricePerUnit: 11 },
                thickness: { min: 4, max: 7, default: 5, step: 1, unit: 'cm', pricePerUnit: 45 }
            },
            guestCalculator: (len) => {
                if (len < 180) return 'Seats 4–6 Guests';
                if (len < 240) return 'Comfortably Seats 6–8 Guests';
                if (len < 280) return 'Seats 8–10 Guests';
                return 'Grand Dining: Seats 10–14 Guests';
            }
        },
        'lounge-chair': {
            id: 'lounge-chair',
            name: 'The Astrid Sculptural Lounge Armchair',
            tagline: 'Organic contours, steam-bent timber, and plush architectural comfort.',
            category: 'Lounge & Seating',
            basePrice: 1280,
            baseLeadTimeWeeks: 3,
            image: 'assets/images/lounge-chair.jpg',
            styles: [
                {
                    id: 'sculptural-sling',
                    name: 'Organic Scandinavian Curve',
                    desc: 'Continuous steam-bent solid wood armrests flowing effortlessly into tapered rear legs.',
                    price: 0,
                    icon: 'fa-couch'
                },
                {
                    id: 'bauhaus-cantilever',
                    name: 'Bauhaus Architectural Sling',
                    desc: 'Suspended ergonomic seat frame with gentle flex for floating lumbar support.',
                    price: 180,
                    icon: 'fa-chair'
                },
                {
                    id: 'cane-accent',
                    name: 'Handwoven Natural Cane Back',
                    desc: 'Breathable artisanal cane webbing set inside a mortised hardwood perimeter.',
                    price: 240,
                    icon: 'fa-feather'
                },
                {
                    id: 'minimalist-wishbone',
                    name: 'Sculpted Wishbone Lounge',
                    desc: 'Low-slung profile with a carved circular back-rail inspired by mid-century Danish masters.',
                    price: 150,
                    icon: 'fa-circle-notch'
                }
            ],
            dimensionLimits: {
                length: { min: 75, max: 95, default: 82, step: 2, unit: 'cm', pricePerUnit: 8 },
                width: { min: 70, max: 90, default: 78, step: 2, unit: 'cm', pricePerUnit: 8 },
                thickness: { min: 3, max: 5, default: 4, step: 1, unit: 'cm', pricePerUnit: 20 }
            },
            guestCalculator: () => 'Ergonomic 1-Person Lounge'
        },
        'executive-desk': {
            id: 'executive-desk',
            name: 'The Metropolis Executive Studio Desk',
            tagline: 'Command your focus with integrated cable channels and seamless solid hardwood.',
            category: 'Workspace',
            basePrice: 2150,
            baseLeadTimeWeeks: 4,
            image: 'assets/images/executive-desk.jpg',
            styles: [
                {
                    id: 'floating-cantilever',
                    name: 'Floating Cantilever Slab',
                    desc: 'Ultra-clean profile with hidden steel sub-frame allowing generous floating knee room.',
                    price: 0,
                    icon: 'fa-desktop'
                },
                {
                    id: 'architect-drawers',
                    name: 'Dual Soft-Close Dovetail Drawers',
                    desc: 'Flawlessly concealed drawers lined with Spanish cedar and soft-close Austrian runners.',
                    price: 360,
                    icon: 'fa-box-archive'
                },
                {
                    id: 'slender-studio',
                    name: 'Slender Minimalist Studio',
                    desc: 'Turned tapered pencil legs with an integrated solid brass organizer drop tray.',
                    price: 140,
                    icon: 'fa-pen-ruler'
                },
                {
                    id: 'dual-pedestal',
                    name: 'Executive Fluted Pedestals',
                    desc: 'Twin architectural timber fluted columns concealing power wiring and filing storage.',
                    price: 520,
                    icon: 'fa-columns'
                }
            ],
            dimensionLimits: {
                length: { min: 140, max: 240, default: 175, step: 5, unit: 'cm', pricePerUnit: 12 },
                width: { min: 70, max: 100, default: 80, step: 5, unit: 'cm', pricePerUnit: 10 },
                thickness: { min: 4, max: 6, default: 4, step: 1, unit: 'cm', pricePerUnit: 35 }
            },
            guestCalculator: () => 'Executive Solo Workspace'
        },
        'coffee-table': {
            id: 'coffee-table',
            name: 'The Kyoto Pebble Organic Coffee Table',
            tagline: 'Soft, flowing asymmetric geometry designed to ground your living sanctuary.',
            category: 'Living',
            basePrice: 1150,
            baseLeadTimeWeeks: 3,
            image: 'assets/images/coffee-table.jpg',
            styles: [
                {
                    id: 'pebble-organic',
                    name: 'River Pebble Asymmetric',
                    desc: 'Harmonious organic curves inspired by Japanese rock gardens, hand-beveled along all edges.',
                    price: 120,
                    icon: 'fa-gem'
                },
                {
                    id: 'low-zen',
                    name: 'Low-Profile Zen Platform',
                    desc: 'Grounded architectural cantilever hovering 28cm off the ground with a shadow line base.',
                    price: 0,
                    icon: 'fa-layer-group'
                },
                {
                    id: 'tiered-hybrid',
                    name: 'Dual-Tiered Sculptural',
                    desc: 'Two offset floating timber planes providing dual-level styling and curated book storage.',
                    price: 290,
                    icon: 'fa-bars-staggered'
                },
                {
                    id: 'round-crossbeam',
                    name: 'Round Radial Cross-Beam',
                    desc: 'Substantial round top supported by interlocking four-way architectural timber crossbeams.',
                    price: 160,
                    icon: 'fa-circle'
                }
            ],
            dimensionLimits: {
                length: { min: 110, max: 180, default: 140, step: 5, unit: 'cm', pricePerUnit: 9 },
                width: { min: 70, max: 110, default: 90, step: 5, unit: 'cm', pricePerUnit: 8 },
                thickness: { min: 4, max: 6, default: 5, step: 1, unit: 'cm', pricePerUnit: 25 }
            },
            guestCalculator: () => 'Living Centerpiece (4–6 Seater Lounge)'
        }
    },

    woods: [
        {
            id: 'american-walnut',
            name: 'American Black Walnut',
            botanical: 'Juglans nigra',
            origin: 'Allegheny Mountains, Pennsylvania (FSC Certified)',
            tag: 'Most Popular Heirloom',
            desc: 'Celebrated for its deep chocolate brown core, swirling cathedral grain, and subtle amber highlights. Unrivaled dimensional stability and rich tactile warmth.',
            hardness: '1,010 lbf',
            hardnessPct: 74,
            baseColor: '#3a2518',
            secondaryColor: '#22150d',
            highlightColor: '#5a3b27',
            grainFrequency: 14.0,
            roughness: 0.38,
            metalness: 0.05,
            priceMultiplier: 1.25,
            badge: 'Certified Sustainable'
        },
        {
            id: 'white-oak',
            name: 'European White Oak',
            botanical: 'Quercus alba',
            origin: 'Spessart Forest, Germany / Appalchia',
            tag: 'Scandinavian Minimalist',
            desc: 'Renowned for its serene warm-bisque tone, striking medullary ray flakes, and tight straight grain. Naturally dense and highly resistant to moisture.',
            hardness: '1,360 lbf',
            hardnessPct: 88,
            baseColor: '#bda688',
            secondaryColor: '#957f62',
            highlightColor: '#d6c1a5',
            grainFrequency: 18.0,
            roughness: 0.45,
            metalness: 0.04,
            priceMultiplier: 1.0,
            badge: 'Old-Growth Stewardship'
        },
        {
            id: 'hard-maple',
            name: 'Hard Rock Sugar Maple',
            botanical: 'Acer saccharum',
            origin: 'Green Mountains, Vermont',
            tag: 'Luminous & Ultra-Durable',
            desc: 'Silky, dense, and naturally radiant with a soft cream-blonde complexion and gentle ripple chatoyancy. Incredibly wear-resistant.',
            hardness: '1,450 lbf',
            hardnessPct: 94,
            baseColor: '#decab1',
            secondaryColor: '#c2ab90',
            highlightColor: '#ede0cb',
            grainFrequency: 22.0,
            roughness: 0.32,
            metalness: 0.03,
            priceMultiplier: 1.05,
            badge: 'High Impact Resistant'
        },
        {
            id: 'smoked-ash',
            name: 'Smoked Japanese Ash',
            botanical: 'Fraxinus mandshurica',
            origin: 'Hokkaido, Japan (Thermally Cured)',
            tag: 'Dramatic Charcoal Architectural',
            desc: 'Thermally treated under oxygen-deprived steam to achieve an intensely deep espresso-charcoal patina that penetrates through the entire hardwood core.',
            hardness: '1,320 lbf',
            hardnessPct: 85,
            baseColor: '#272321',
            secondaryColor: '#171514',
            highlightColor: '#453f3c',
            grainFrequency: 16.0,
            roughness: 0.52,
            metalness: 0.08,
            priceMultiplier: 1.20,
            badge: 'Thermo-Treated'
        },
        {
            id: 'reclaimed-chestnut',
            name: 'Reclaimed 1890s Chestnut',
            botanical: 'Castanea dentata',
            origin: 'Salvaged Historic Timber, Virginia',
            tag: 'One-of-a-Kind Provenance',
            desc: 'Irreplaceable American timber salvaged from historic 19th-century barns. Deep antique patina, authentic hand-hewn saw kerfs, and subtle character nail marks.',
            hardness: '1,180 lbf',
            hardnessPct: 78,
            baseColor: '#784d2d',
            secondaryColor: '#4e2f18',
            highlightColor: '#96633d',
            grainFrequency: 12.0,
            roughness: 0.60,
            metalness: 0.02,
            priceMultiplier: 1.35,
            badge: '100% Historic Salvage'
        },
        {
            id: 'royal-teak',
            name: 'Royal Plantation Teak',
            botanical: 'Tectona grandis',
            origin: 'Sustainable Plantation, Central America',
            tag: 'Naturally Weather-Resistant',
            desc: 'Golden-honey timber naturally saturated with protective silica and organic oils. Exceptional resistance against wine, water, and humidity with warm luster.',
            hardness: '1,070 lbf',
            hardnessPct: 72,
            baseColor: '#966432',
            secondaryColor: '#6e431a',
            highlightColor: '#b88147',
            grainFrequency: 15.0,
            roughness: 0.40,
            metalness: 0.06,
            priceMultiplier: 1.30,
            badge: 'Zero Chemical Sealants'
        }
    ],

    finishes: [
        {
            id: 'raw-matte',
            name: 'Natural Raw Satin',
            desc: 'Ultra-low sheen matte hardwax oil. Retains the untreated organic warmth and velvety grain texture of the raw timber.',
            sheen: 'Dead Matte (5%)',
            tintHex: '#ffffff',
            opacity: 0.0,
            price: 0
        },
        {
            id: 'warm-honey',
            name: 'Warm Amber Honey',
            desc: 'Golden sun-kissed organic linseed formulation that amplifies deep grain rings and brings glowing warmth into the room.',
            sheen: 'Satin Lustre (18%)',
            tintHex: '#e8a946',
            opacity: 0.18,
            price: 120
        },
        {
            id: 'espresso-truffle',
            name: 'Espresso Rich Truffle',
            desc: 'Deep smoky dark cocoa stain hand-rubbed in three coats for high-contrast architectural interiors.',
            sheen: 'Subtle Matte (12%)',
            tintHex: '#1e1109',
            opacity: 0.35,
            price: 150
        },
        {
            id: 'nordic-bleached',
            name: 'Nordic Chalk Washed',
            desc: 'Scandinavian lime-wash effect that softens grain contrasts into a dreamy, luminous coastal aesthetic.',
            sheen: 'Velvet Matte (8%)',
            tintHex: '#f5efe6',
            opacity: 0.28,
            price: 140
        },
        {
            id: 'ebonized-obsidian',
            name: 'Ebonized Obsidian',
            desc: 'Deep black mineral tannin reaction (Shou Sugi Ban inspired) that turns the wood pitch black while highlighting grain relief.',
            sheen: 'Architectural Matte (10%)',
            tintHex: '#0f0e0e',
            opacity: 0.55,
            price: 180
        },
        {
            id: 'cognac-patina',
            name: 'Vintage Cognac Glaze',
            desc: 'Warm caramel leather tones with hand-burnished subtle edge gradients, reminiscent of heirloom antique violins.',
            sheen: 'Warm Satin (22%)',
            tintHex: '#994a1b',
            opacity: 0.25,
            price: 160
        }
    ],

    legs: [
        {
            id: 'steel-black',
            name: 'Matte Black Steel (Trapezoid)',
            material: 'Heavy 8mm Structural Steel',
            desc: 'Industrial-grade laser cut steel powder-coated in micro-textured black raven finish.',
            colorHex: '#1f2022',
            metalness: 0.65,
            roughness: 0.35,
            price: 0,
            icon: 'fa-square'
        },
        {
            id: 'brushed-brass',
            name: 'Brushed Champagne Brass',
            material: 'Solid Architectural Brass',
            desc: 'Hand-burnished warm champagne brass with invisible ceramic nano-seal against fingerprints.',
            colorHex: '#cfab6b',
            metalness: 0.88,
            roughness: 0.25,
            price: 380,
            icon: 'fa-shield-halved'
        },
        {
            id: 'solid-matching-wood',
            name: 'Matching Solid Timber Legs',
            material: 'Matching Hardwood Species',
            desc: 'Turned and sculpted from the exact same tree lumber run for unified grain harmony.',
            colorHex: null, // matches chosen wood
            metalness: 0.05,
            roughness: 0.45,
            price: 260,
            icon: 'fa-tree'
        },
        {
            id: 'fluted-pedestal-base',
            name: 'Fluted Column Pedestals',
            material: 'Architectural Fluted Timber',
            desc: 'Monolithic circular fluted columns with internal counter-weighting for supreme sturdiness.',
            colorHex: null, // matches chosen wood
            metalness: 0.08,
            roughness: 0.42,
            price: 450,
            icon: 'fa-monument'
        },
        {
            id: 'spider-steel',
            name: 'Sculptural Spider Matrix',
            material: 'Artisan Welded Steel',
            desc: 'Geometrically crossing central steel blades allowing chairs to tuck in smoothly on all 4 sides.',
            colorHex: '#282a2d',
            metalness: 0.75,
            roughness: 0.3,
            price: 320,
            icon: 'fa-asterisk'
        }
    ],

    edges: [
        {
            id: 'live-edge',
            name: 'Organic Live Edge',
            desc: 'Natural bark edge hand-sculpted to preserve every natural contour.',
            price: 180
        },
        {
            id: 'reverse-bevel',
            name: 'Swiss Reverse Bevel',
            desc: '45-degree knife bevel on the underside creating a razor-thin floating appearance.',
            price: 120
        },
        {
            id: 'rounded-chamfer',
            name: 'Tactile Rounded Bullnose',
            desc: 'Smooth 12mm hand-radiused edge, soft and family-friendly.',
            price: 0
        },
        {
            id: 'crisp-square',
            name: 'Architectural 90° Square',
            desc: 'Clean, museum-grade crisp rectilinear edge with micro-eased corner.',
            price: 0
        }
    ],

    addons: [
        {
            id: 'brass-bowtie',
            name: 'Solid Brass Dutchman Bowties',
            desc: 'Two hand-chiseled butterfly keys inlaid into natural timber checks for artisanal beauty.',
            price: 160,
            icon: 'fa-infinity'
        },
        {
            id: 'qi-wireless',
            name: 'Concealed Fast Qi Desk Charger',
            desc: 'Sub-surface inductive charger milled into the wood underside. No visible wires.',
            price: 140,
            icon: 'fa-bolt'
        },
        {
            id: 'artisan-plate',
            name: 'Personalized Brass Monogram Plate',
            desc: 'Recessed solid brass plate stamped with your family monogram and master artisan serial number.',
            price: 85,
            icon: 'fa-signature'
        },
        {
            id: 'ceramic-shield',
            name: 'Hydrophobic Ceramic Shield Treatment',
            desc: 'Food-safe molecular nanocoat repelling wine, coffee, and oil without altering the natural touch.',
            price: 125,
            icon: 'fa-droplet-slash'
        }
    ],

    lookbook: [
        {
            title: 'The Tribeca Penthouse Residence',
            category: 'dining',
            wood: 'American Black Walnut',
            finish: 'Natural Raw Satin',
            base: 'Matte Black Steel',
            image: 'assets/images/hero-dining.jpg',
            specs: '300cm × 110cm • Seats 10',
            quote: '“The walnut slab anchors our entire great room. Guests can’t stop touching the live edge grain.”'
        },
        {
            title: 'Hearthstone Haven Living Lounge',
            category: 'seating',
            wood: 'European White Oak',
            finish: 'Warm Amber Honey',
            base: 'Matching Solid Timber',
            image: 'assets/images/lounge-chair.jpg',
            specs: 'Astrid Chair in Cream Bouclé',
            quote: '“The joinery is flawless. It feels like an art piece you can sink into for hours.”'
        },
        {
            title: 'The SoHo Architect Studio',
            category: 'workspace',
            wood: 'European White Oak',
            finish: 'Nordic Chalk Washed',
            base: 'Solid Brass Inlays',
            image: 'assets/images/executive-desk.jpg',
            specs: '180cm × 85cm • Dual Soft-Close Drawers',
            quote: '“No clutter, pure tactile inspiration every single workday morning.”'
        },
        {
            title: 'Carmel Coastal Meadow Villa',
            category: 'living',
            wood: 'American Black Walnut',
            finish: 'Warm Amber Honey',
            base: 'Sculptural Organic Timber',
            image: 'assets/images/coffee-table.jpg',
            specs: '150cm × 95cm Asymmetric Pebble',
            quote: '“The pebble shape harmonizes with the soft linen sofas like it grew there organically.”'
        }
    ],

    testimonials: [
        {
            name: 'Elena Rostova',
            title: 'Lead Architect, Rostova Studio',
            location: 'New York, NY',
            rating: 5,
            text: 'As an architect, material truth is everything. Atelier & Grain’s live-edge walnut dining table is museum-caliber craftsmanship. The 3D customizer allowed us to match our client’s exact room dimensions down to the centimeter.',
            verified: true,
            piece: 'Solstice Table in American Walnut'
        },
        {
            name: 'Marcus & Clara Vance',
            title: 'Homeowners',
            location: 'Austin, TX',
            rating: 5,
            text: 'We ordered the wood sample box first. The weight and grain of the White Oak was so superior to mass-market furniture that we ordered the table and chairs immediately. Delivery arrived on time in bespoke wooden crates.',
            verified: true,
            piece: 'Horizon Table + 6 Astrid Chairs'
        },
        {
            name: 'David Sterling',
            title: 'Interior Design Director',
            location: 'London, UK',
            rating: 5,
            text: 'The ability to select custom wood species, finishes, and brass leg details in real-time made specifying for our luxury penthouse project effortless. A truly modern atelier experience.',
            verified: true,
            piece: 'Metropolis Executive Desk'
        }
    ]
};
