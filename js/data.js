// ========================================================
// MHT — My Holiday Trip | Travel • Explore • Memories
// Singapore, Malaysia & Global Luxury Stays & Holiday Tours
// ========================================================

const MHT_DEFAULT_DATA = {
  brand: {
    name: "My Holiday Trip",
    shortName: "MHT",
    fullName: "My Holiday Trip — Singapore & Malaysia Tours",
    tagline: "Travel | Explore | Memories • Always Save 10% on Every Booking",
    logo: "images/mht-logo.jpg",
    phoneIndia: "+91 98938 54811",
    phone: "+91 98938 54811",
    whatsapp: "919893854811",
    email: "info@myholidaytrip.in",
    website: "www.myholidaytrip.in",
    headquarters: "India (+91 98938 54811)",
    advantageDiscountPercent: 10,
    supportHours: "24/7 Dedicated Client Concierge"
  },

  destinations: [
    { id: "all", name: "All Destinations" },
    { id: "singapore-malaysia", name: "Singapore & Malaysia (Combo)" },
    { id: "singapore", name: "Singapore & Sentosa" },
    { id: "malaysia", name: "Malaysia (All Regions)" },
    { id: "kuala-lumpur", name: "Kuala Lumpur, Malaysia" },
    { id: "langkawi", name: "Langkawi Island, Malaysia" },
    { id: "penang", name: "Penang, Malaysia" },
    { id: "genting", name: "Genting Highlands, Malaysia" },
    { id: "goa", name: "Goa Beachfront, India" },
    { id: "rajasthan", name: "Rajasthan Heritage, India" },
    { id: "pachmarhi", name: "Pachmarhi Hills, India" }
  ],

  destinationThemes: {
    "singapore-malaysia": {
      title: "Singapore & Malaysia 6N/7D Tour",
      subtitle: "Marina Bay Sands, Sentosa, Universal Studios, KLCC & Genting Highlands 2-country signature package.",
      price: "From ₹62,999 / person (10% OFF)",
      image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=2160&q=85",
      filterKey: "singapore"
    },
    "singapore": {
      title: "Hotels in Singapore & Sentosa",
      subtitle: "Marina Bay Sands, Gardens by the Bay, Orchard Road & Sentosa luxury partner stays.",
      price: "From ₹8,820 / night",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=2160&q=85",
      filterKey: "singapore"
    },
    "malaysia": {
      title: "My Holiday Trip - Malaysia",
      subtitle: "Kuala Lumpur, Langkawi, Penang & Genting Highlands luxury partner stays.",
      price: "From ₹5,310 / night",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=2160&q=85",
      filterKey: "malaysia"
    },
    "kuala-lumpur": {
      title: "Hotels in Kuala Lumpur, Malaysia",
      subtitle: "Petronas Twin Towers, Bukit Bintang & KLCC luxury suites.",
      price: "From ₹7,020 / night",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2160&q=85",
      filterKey: "malaysia"
    },
    "langkawi": {
      title: "Hotels in Langkawi Island, Malaysia",
      subtitle: "Pantai Cenang Beach, SkyBridge & Private Overwater Villas.",
      price: "From ₹8,550 / night",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2160&q=85",
      filterKey: "malaysia"
    },
    "penang": {
      title: "Hotels in Penang (George Town), Malaysia",
      subtitle: "UNESCO George Town, Heritage Mansions & Culinary Delights.",
      price: "From ₹6,120 / night",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2160&q=85",
      filterKey: "malaysia"
    },
    "genting": {
      title: "Hotels in Genting Highlands, Malaysia",
      subtitle: "Highland Theme Parks & SkyWay Cable Car Views.",
      price: "From ₹5,310 / night",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2160&q=85",
      filterKey: "malaysia"
    },
    "goa": {
      title: "Hotels in Goa Beachfront, India",
      subtitle: "Calangute, Candolim & Sunset Luxury Beach Resorts.",
      price: "From ₹5,220 / night",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2160&q=85",
      filterKey: "goa"
    },
    "rajasthan": {
      title: "Hotels in Rajasthan (Jaipur & Udaipur), India",
      subtitle: "Royal Havelis, Palace Stays & Thar Desert Camel Caravans.",
      price: "From ₹6,480 / night",
      image: "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=2160&q=85",
      filterKey: "rajasthan"
    },
    "pachmarhi": {
      title: "Hotels in Pachmarhi Hills, India",
      subtitle: "Queen of Satpura, Serene Pine Valleys & Waterfalls.",
      price: "From ₹4,050 / night",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2160&q=85",
      filterKey: "pachmarhi"
    },
    "all": {
      title: "My Holiday Trip — Singapore, Malaysia & Global",
      subtitle: "Verified Luxury Partner Properties with Guaranteed 10% Savings.",
      price: "From ₹3,420 / night",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2160&q=85",
      filterKey: "all"
    }
  },

  partnerHotels: [
    {
      id: "mht-sg-marina-bay-sands",
      name: "Marina Bay Sands Luxury Resort",
      city: "Singapore",
      country: "Singapore",
      destinationCategory: "singapore",
      stars: 5,
      badge: "Iconic SkyPark Pool",
      address: "10 Bayfront Avenue, Marina Bay, Singapore 018956",
      rackRate: 38000,
      clientDiscountPercent: 10,
      discountedRate: 34200,
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "World-renowned 5-star landmark featuring the legendary rooftop Infinity Pool, Sands SkyPark Observation Deck, luxury casino, Michelin-starred dining, and direct connection to Gardens by the Bay.",
      rating: 5.0,
      reviewsCount: 1420,
      amenities: [
        "World's Largest Rooftop Infinity Pool",
        "Sands SkyPark Observation Deck Access",
        "Daily Gourmet Buffet Breakfast at Spago",
        "Direct Walkway to Gardens by the Bay",
        "MHT 10% Advantage VIP Privilege Applied",
        "Banyan Tree Spa & Fitness Centre"
      ],
      roomTypes: [
        { id: "deluxe_city", name: "Deluxe Room (City Skyline View)", rack: 38000, clientPrice: 34200, description: "Spacious 39 sqm king room overlooking Marina Bay.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" },
        { id: "premier_bay", name: "Premier Room (Gardens by the Bay View)", rack: 45000, clientPrice: 40500, description: "47 sqm suite with deep soaking bathtub and supertree views.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
        { id: "club_suite", name: "Club Suite (Club55 VIP Lounge Access)", rack: 60000, clientPrice: 54000, description: "VIP check-in, complimentary afternoon tea and evening cocktails.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" }
      ],
      mealPlans: [
        { id: "ro", name: "Room Only", pricePerNight: 0, description: "Accommodations only" },
        { id: "bb", name: "International Buffet Breakfast at Rise", pricePerNight: 2800, description: "Daily lavish multi-cuisine spread" }
      ],
      addOns: [
        { id: "skypark_pass", name: "Sands SkyPark Observation Deck FastPass", price: 1800, icon: "sparkles" },
        { id: "gardens_pass", name: "Gardens by the Bay Cloud Forest & Flower Dome Tickets", price: 2400, icon: "flower" }
      ],
      partnerContact: "+91 98938 54811"
    },
    {
      id: "mht-sg-parkroyal-marina",
      name: "PARKROYAL COLLECTION Marina Bay",
      city: "Singapore",
      country: "Singapore",
      destinationCategory: "singapore",
      stars: 5,
      badge: "Garden Sanctuary 5★",
      address: "6 Raffles Boulevard, Marina Square, Singapore 039594",
      rackRate: 24000,
      clientDiscountPercent: 10,
      discountedRate: 21600,
      image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Singapore's first 'Garden-in-a-Hotel' featuring over 2,400 trees and plants, mineral water swimming pool with 1,380 fiber-optic lights, and eco-luxury rooms minutes from Esplanade and Suntec City.",
      rating: 4.9,
      reviewsCount: 960,
      amenities: [
        "Outdoor Mineral Water Swimming Pool",
        "Atrium Skylight & Birdcage Pavilions",
        "Farm-to-Table Breakfast at Peppermint",
        "MHT 10% Advantage Privilege Rate",
        "Ultra High-Speed Wi-Fi"
      ],
      roomTypes: [
        { id: "urban_deluxe", name: "Urban Deluxe Room", rack: 24000, clientPrice: 21600, description: "33 sqm designer room with private balcony.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" },
        { id: "signature_marina", name: "Signature Marina Bay View Room", rack: 29000, clientPrice: 26100, description: "Unobstructed views of Marina Bay Sands & the waterfront.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" }
      ],
      mealPlans: [
        { id: "ro", name: "Room Only", pricePerNight: 0, description: "Standard Stay" },
        { id: "bb", name: "Buffet Breakfast Included", pricePerNight: 1900, description: "Daily Farm-to-Table Breakfast" }
      ],
      addOns: [
        { id: "sentosa_transfer", name: "Sentosa Express & Cable Car Day Pass", price: 2100, icon: "compass" }
      ],
      partnerContact: "+91 98938 54811"
    },
    {
      id: "mht-sg-hotel-boss",
      name: "Hotel Boss Singapore (Lavender & Bugis)",
      city: "Singapore",
      country: "Singapore",
      destinationCategory: "singapore",
      stars: 4,
      badge: "Best Value Central",
      address: "500 Jalan Sultan, Bugis / Lavender, Singapore 199020",
      rackRate: 9800,
      clientDiscountPercent: 10,
      discountedRate: 8820,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Superbly situated 4-star hotel within walking distance of Lavender MRT station, Bugis Junction, and Little India. Features outdoor swimming pool, sky terrace, and multiple dining options.",
      rating: 4.7,
      reviewsCount: 1120,
      amenities: [
        "Outdoor Swimming Pool & Sun Deck",
        "Direct Proximity to Lavender MRT",
        "Free High-Speed Wi-Fi",
        "MHT 10% Advantage Client Discount"
      ],
      roomTypes: [
        { id: "superior_queen", name: "Superior Queen Room", rack: 9800, clientPrice: 8820, description: "Modern air-conditioned room with city views.", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" },
        { id: "premier_balcony", name: "Premier Room with Private Balcony", rack: 12500, clientPrice: 11250, description: "Balcony room with pool & city skyline vistas.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" }
      ],
      mealPlans: [
        { id: "ro", name: "Room Only", pricePerNight: 0, description: "Room Stay" },
        { id: "bb", name: "Daily Breakfast Spread", pricePerNight: 1100, description: "Buffet Breakfast" }
      ],
      addOns: [
        { id: "night_safari", name: "Singapore Night Safari with Tram Ride", price: 2900, icon: "moon" }
      ],
      partnerContact: "+91 98938 54811"
    },
    {
      id: "mht-kl-grand",
      name: "The Grand Pavilion Suites KLCC",
      city: "Kuala Lumpur",
      country: "Malaysia",
      destinationCategory: "malaysia",
      stars: 5,
      badge: "Petronas Towers View",
      address: "Jalan Pinang, Kuala Lumpur City Centre (KLCC), 50450 Kuala Lumpur, Malaysia",
      rackRate: 7800,
      clientDiscountPercent: 10,
      discountedRate: 7020,
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Iconic 5-star hotel in the heart of Kuala Lumpur offering direct skyline views of the Petronas Twin Towers, rooftop infinity pool, wellness spa, and seamless covered walkway access to Suria KLCC and Pavilion shopping malls.",
      rating: 4.9,
      reviewsCount: 840,
      amenities: [
        "Rooftop Infinity Pool Overlooking Twin Towers",
        "Complimentary International Buffet Breakfast",
        "Ultra High-Speed Fiber Wi-Fi",
        "Airport Limousine Transfer on Request",
        "24/7 Room Dining & Executive Club Lounge",
        "MHT Advantage Guaranteed 10% Member Rate",
        "Fitness Studio & Steam Sauna",
        "Direct SkyBridge Access to KLCC Mall"
      ],
      highlights: [
        "Direct unobstructed view of Petronas Twin Towers",
        "5-minute stroll to Bukit Bintang nightlife & shopping",
        "MHT Client Dedicated WhatsApp Concierge & Priority Early Check-in"
      ],
      policies: {
        checkin: "14:00 (2:00 PM)",
        checkout: "12:00 (12:00 PM)",
        cancellation: "Free cancellation up to 48 hours prior to arrival",
        children: "Children under 6 stay free sharing existing bedding"
      },
      mealPlans: [
        { id: "room_only", name: "Room Only (European Plan)", pricePerNight: 0, tag: "Standard" },
        { id: "breakfast", name: "Gourmet International Buffet Breakfast", pricePerNight: 650, tag: "Popular", default: true },
        { id: "half_board", name: "Half Board (Breakfast + 3-Course Dinner)", pricePerNight: 1600, tag: "Best Value" }
      ],
      addOns: [
        { id: "airport_transfer", name: "KLIA Airport Private Mercedes Pickup", price: 1800, icon: "car" },
        { id: "late_checkout", name: "Guaranteed Late Check-out until 4:00 PM", price: 900, icon: "clock" },
        { id: "honeymoon_setup", name: "Celebration Floral & Cake Setup", price: 1200, icon: "heart" },
        { id: "extra_bed", name: "Extra Rollaway Bed with Linen", price: 1100, icon: "bed" }
      ],
      roomTypes: [
        {
          id: "rm-deluxe",
          name: "Deluxe City View King Room",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          sqft: "420 sq.ft (39 m²)",
          rack: 7800,
          clientPrice: 7020,
          capacity: "2 Adults",
          bed: "1 Royal King Bed",
          features: ["City Skyline View", "Marble Rain Shower", "Nespresso Coffee Machine", "Smart LED TV"]
        },
        {
          id: "rm-klcc-suite",
          name: "KLCC Petronas Twin Towers Suite",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
          sqft: "650 sq.ft (60 m²)",
          rack: 11500,
          clientPrice: 10350,
          capacity: "2 Adults + 1 Child",
          bed: "1 Royal King Bed + Separate Living Lounge",
          features: ["Direct Twin Towers View", "Deep Soaking Jacuzzi Tub", "Club Lounge Access", "Evening Cocktails"]
        },
        {
          id: "rm-presidential",
          name: "Executive Club Presidential Penthouse",
          image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
          sqft: "1,150 sq.ft (107 m²)",
          rack: 18500,
          clientPrice: 16650,
          capacity: "4 Adults",
          bed: "2 King En-suites with Private Balcony",
          features: ["Panoramic 360° Skyline View", "Private Butler Service", "Complimentary Minibar", "VIP Airport Transfer Included"]
        }
      ],
      partnerContact: "+60 3 2182 8888"
    },
    {
      id: "mht-langkawi-resort",
      name: "Langkawi Azure Beachfront Resort & Spa",
      city: "Langkawi Island",
      country: "Malaysia",
      destinationCategory: "malaysia",
      stars: 5,
      badge: "Private Beach Resort",
      address: "Pantai Cenang Beach, 07000 Langkawi, Kedah, Malaysia",
      rackRate: 9500,
      clientDiscountPercent: 10,
      discountedRate: 8550,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Pristine beachfront sanctuary nestled along turquoise Andaman waters with private white-sand beach, multi-tier infinity lagoon pools, overwater sunset cabanas, and world-class Ayurvedic spa.",
      rating: 4.9,
      reviewsCount: 720,
      amenities: [
        "Direct Private White Sand Beach Access",
        "Multi-Tier Infinity Lagoon Pools",
        "Beachside Candlelight Dining",
        "Complimentary Tropical Breakfast Buffet",
        "Catamaran & Watersports Concierge",
        "MHT Guaranteed 10% Client Privilege",
        "Ayurvedic Herbal Wellness Spa",
        "Kids Beach Playground & Club"
      ],
      highlights: [
        "Steps away from Pantai Cenang turquoise waves",
        "Complimentary sunset mocktail & live acoustic sessions",
        "Private speedboat dock for Island Hopping trips"
      ],
      policies: {
        checkin: "15:00 (3:00 PM)",
        checkout: "12:00 (12:00 PM)",
        cancellation: "Free cancellation up to 72 hours before arrival",
        children: "Children under 10 stay free"
      },
      mealPlans: [
        { id: "breakfast", name: "Tropical Gourmet Breakfast Buffet Included", pricePerNight: 0, tag: "Included", default: true },
        { id: "half_board", name: "Half Board (Breakfast + Seafood Beach BBQ Dinner)", pricePerNight: 1750, tag: "Seafood Feast" }
      ],
      addOns: [
        { id: "mangrove_tour", name: "Kilim Geoforest Mangrove Safari Tickets (2 Pax)", price: 2200, icon: "compass" },
        { id: "airport_transfer", name: "Langkawi Airport AC Minivan Transfer", price: 950, icon: "car" },
        { id: "sunset_dinner", name: "Private Candlelight Beach Dinner for Couple", price: 2800, icon: "heart" }
      ],
      roomTypes: [
        {
          id: "rm-sea-chalet",
          name: "Andaman Sea View Beach Chalet",
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
          sqft: "510 sq.ft (47 m²)",
          rack: 9500,
          clientPrice: 8550,
          capacity: "2 Adults",
          bed: "1 King Bed with Private Balcony",
          features: ["Panoramic Sea Views", "Private Sun Deck", "Tropical Outdoor Rain Shower", "Fruit Basket"]
        },
        {
          id: "rm-overwater",
          name: "Overwater Lagoon Private Villa",
          image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
          sqft: "820 sq.ft (76 m²)",
          rack: 16000,
          clientPrice: 14400,
          capacity: "2 Adults + 1 Child",
          bed: "1 Royal King Overwater Villa with Jacuzzi",
          features: ["Direct Water Access Ladder", "Glass Floor Fish Viewing Panel", "Private Plunge Pool", "Dedicated Butler"]
        }
      ],
      partnerContact: "+60 4 955 8899"
    },
    {
      id: "mht-penang-heritage",
      name: "George Town Heritage Luxury Mansion",
      city: "Penang",
      country: "Malaysia",
      destinationCategory: "malaysia",
      stars: 5,
      badge: "UNESCO Heritage Zone",
      address: "Farquhar Street, George Town, 10200 Penang, Malaysia",
      rackRate: 6800,
      clientDiscountPercent: 10,
      discountedRate: 6120,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Majestically restored 19th-century colonial British and Straits Chinese mansion located inside Penang's world-renowned UNESCO World Heritage Zone. Renowned for antique teak carvings, artisanal courtyard breakfasts, and immediate proximity to famous street murals and hawker food.",
      rating: 4.8,
      reviewsCount: 460,
      amenities: [
        "Antique Colonial Courtyard & Gardens",
        "Famous Penang Nyonya Gourmet Breakfast",
        "High-Speed Fiber Wi-Fi",
        "Walking Distance to Armenia Street Murals",
        "Complimentary Afternoon Heritage High Tea",
        "MHT Exclusive 10% Client Privilege",
        "Free Heritage Trishaw City Tour"
      ],
      highlights: [
        "Authentic UNESCO World Heritage mansion experience",
        "Steps away from famous Penang street food lanes",
        "Personalized trishaw concierge"
      ],
      policies: {
        checkin: "14:00",
        checkout: "12:00",
        cancellation: "Free cancellation up to 48 hours prior",
        children: "All ages welcome"
      },
      mealPlans: [
        { id: "breakfast", name: "Authentic Penang Nyonya Breakfast Included", pricePerNight: 0, tag: "Included", default: true },
        { id: "high_tea", name: "High Tea & Heritage Dinner Special", pricePerNight: 1200, tag: "Gourmet" }
      ],
      addOns: [
        { id: "trishaw_tour", name: "2-Hour Heritage Trishaw Murals Tour", price: 800, icon: "map" },
        { id: "penang_hill", name: "Penang Hill Funicular Train Fast Lane Tickets", price: 1100, icon: "ticket" }
      ],
      roomTypes: [
        {
          id: "rm-straits",
          name: "Straits Heritage Teak Suite",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
          sqft: "460 sq.ft (43 m²)",
          rack: 6800,
          clientPrice: 6120,
          capacity: "2 Adults",
          bed: "1 King Four-Poster Bed",
          features: ["Antique Teak Furnishings", "Courtyard View", "Clawfoot Tub", "Complimentary High Tea"]
        },
        {
          id: "rm-governor",
          name: "Governor's Grand Balcony Suite",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          sqft: "750 sq.ft (70 m²)",
          rack: 10500,
          clientPrice: 9450,
          capacity: "2 Adults + 1 Child",
          bed: "1 Royal King Suite with Verandah",
          features: ["Private Colonial Verandah", "Handmade Brass Tub", "Evening Cocktail Service"]
        }
      ],
      partnerContact: "+60 4 263 7788"
    },
    {
      id: "mht-genting-resort",
      name: "Highland Cloudview Palace & Resort",
      city: "Genting Highlands",
      country: "Malaysia",
      destinationCategory: "malaysia",
      stars: 4,
      badge: "Theme Park & SkyWay Cable Car",
      address: "Genting Highlands Resort, 69000 Pahang, Malaysia",
      rackRate: 5900,
      clientDiscountPercent: 10,
      discountedRate: 5310,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Cool mountain mist resort perched 6,000 feet above sea level at the peak of Genting Highlands. Offers temperature-controlled rooms, direct indoor walkway connections to SkyAvenue dining & shopping, SkyWorlds outdoor theme park, and Awana SkyWay Cable Car.",
      rating: 4.7,
      reviewsCount: 610,
      amenities: [
        "Direct SkyBridge to Genting SkyWorlds Theme Park",
        "Mountain Cloudview Glass Windows",
        "Heated Indoor Swimming Pool & Sauna",
        "Buffet Breakfast Included",
        "Awana SkyWay Express Ticketing Desk",
        "MHT Guaranteed 10% Savings"
      ],
      highlights: [
        "Escape the tropical heat in 16°C–20°C alpine cool weather",
        "Direct walkway to Skytropolis & SkyAvenue mall",
        "Complimentary SkyWay cable car voucher on 2+ nights stay"
      ],
      policies: {
        checkin: "15:00",
        checkout: "12:00",
        cancellation: "Free cancellation up to 48 hours prior",
        children: "Children under 12 stay free with parents"
      },
      mealPlans: [
        { id: "breakfast", name: "Alpine Buffet Breakfast Included", pricePerNight: 0, tag: "Included", default: true }
      ],
      addOns: [
        { id: "skyworlds_pass", name: "Genting SkyWorlds 1-Day Pass (Adult)", price: 2100, icon: "ticket" },
        { id: "cable_car_vip", name: "Awana SkyWay Glass Gondola VIP Ticket", price: 650, icon: "mountain" }
      ],
      roomTypes: [
        {
          id: "rm-cloud-sup",
          name: "Cloudview Superior Room",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
          sqft: "380 sq.ft (35 m²)",
          rack: 5900,
          clientPrice: 5310,
          capacity: "2 Adults",
          bed: "1 King or 2 Queen Beds",
          features: ["Mountain Mist View", "Heated Bathroom", "High-Speed Wi-Fi"]
        },
        {
          id: "rm-sky-family",
          name: "Skyline Family Chalet Suite",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          sqft: "700 sq.ft (65 m²)",
          rack: 9200,
          clientPrice: 8280,
          capacity: "4 Adults",
          bed: "2 King En-suite Bedrooms",
          features: ["Panoramic Ridge Views", "Spacious Family Lounge", "Kids Play Corner"]
        }
      ],
      partnerContact: "+60 3 6101 1118"
    },
    {
      id: "mht-goa-resort",
      name: "Baywatch Azure Beach Resort",
      city: "Goa",
      country: "India",
      destinationCategory: "goa",
      stars: 5,
      badge: "Beachfront Luxury",
      address: "Candolim Beach Road, North Goa",
      rackRate: 8500,
      clientDiscountPercent: 10,
      discountedRate: 7650,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Direct beach access with infinity pool, sea-view cabanas, sunbeds, and fresh Goan & international seafood grills.",
      rating: 4.9,
      reviewsCount: 680,
      amenities: [
        "Direct Beach Access",
        "Infinity Swimming Pool",
        "Buffet Breakfast Included",
        "Spa & Wellness",
        "MHT 10% Client Rate"
      ],
      highlights: ["Direct Candolim beach access", "Sunset pool bar", "Free water sports vouchers"],
      policies: { checkin: "14:00", checkout: "11:00", cancellation: "Free cancellation up to 48 hours prior", children: "Children welcome" },
      mealPlans: [
        { id: "breakfast", name: "Buffet Breakfast Included", pricePerNight: 0, tag: "Included", default: true }
      ],
      addOns: [
        { id: "scuba_trip", name: "Grand Island Scuba Diving with Photos", price: 2500, icon: "compass" },
        { id: "airport_goa", name: "Mopa/Dabolim Airport Cab Transfer", price: 1600, icon: "car" }
      ],
      roomTypes: [
        {
          id: "rm-goa-villa",
          name: "Garden Villa Sea View Room",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
          sqft: "440 sq.ft",
          rack: 8500,
          clientPrice: 7650,
          capacity: "2 Adults",
          bed: "1 King Bed with Balcony",
          features: ["Sea View", "Pool Access", "Free Breakfast"]
        }
      ],
      partnerContact: "+91 98938 54811"
    }
  ],

  tourPackages: [
    {
      id: "mht-pkg-singapore-malaysia-6n7d",
      title: "Singapore & Malaysia 6N/7D Tour Package",
      subtitle: "2 Countries | Endless Memories • Marina Bay Sands, Universal Studios, Sentosa, KLCC & Genting Highlands",
      destination: "Singapore & Malaysia (2 Countries)",
      country: "Singapore & Malaysia",
      category: "singapore-malaysia",
      duration: "7 Days / 6 Nights",
      badge: "⭐ Official Signature 2-Country Tour",
      standardPrice: 69999,
      discountPercent: 10,
      clientPrice: 62999,
      priceUnit: "per person (Ex. India Airfare Included)",
      image: "images/singapore-malaysia-brochure.jpg",
      brochureImage: "images/singapore-malaysia-brochure.jpg",
      gallery: [
        "images/singapore-malaysia-brochure.jpg",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Two destinations, one unforgettable journey! Complete 6 Nights / 7 Days all-inclusive package covering Singapore (Marina Bay Sands, Gardens by the Bay, Sentosa Island, Universal Studios) and Malaysia (Kuala Lumpur, Petronas Twin Towers, Genting Highlands & Batu Caves). Includes return flights, handpicked hotels, daily breakfast, and guided coach transfers with 24/7 dedicated support.",
      travelTiers: [
        { id: "budget_3star", name: "Budget Package (3★ Hotels)", pricePerPerson: 62999, standardPrice: 69999, default: true, badge: "Best Value" },
        { id: "standard_4star", name: "Standard Package (4★ Hotels)", pricePerPerson: 85499, standardPrice: 94999, badge: "Most Popular" },
        { id: "premium_5star", name: "Premium Package (5★ Luxury Hotels)", pricePerPerson: 125999, standardPrice: 139999, badge: "5★ VIP Elite" }
      ],
      inclusions: [
        "Return Airfare (Ex. India)",
        "6 Nights Accommodation in Handpicked Hotels",
        "Daily Lavish International Buffet Breakfast",
        "All Airport, Inter-City & Sightseeing Transfers by AC Coach",
        "English Speaking Professional Tour Guide",
        "Universal Studios Singapore Full Day Admission Pass",
        "Sentosa Island Cable Car & Wings of Time Show Tickets",
        "Awana SkyWay Gondola Cable Car Ride to Genting",
        "Batu Caves, Merlion Park & Gardens by the Bay Sightseeing",
        "All Applicable Government Taxes & GST"
      ],
      exclusions: [
        "Singapore E-Visa Fee (Approx SGD 30 + service charges)",
        "Optional Singapore Night Safari Pass",
        "Personal expenses, laundry & mini-bar charges",
        "Travel Insurance (Available as Add-on)"
      ],
      experienceAddOns: [
        { id: "night_safari_opt", name: "Singapore Night Safari with Tram & Animal Show", price: 3200, icon: "moon" },
        { id: "universal_express", name: "Universal Studios Singapore Express VIP Pass", price: 4500, icon: "sparkles" },
        { id: "skyworlds_genting", name: "Genting SkyWorlds Outdoor Theme Park Day Pass", price: 2400, icon: "ticket" }
      ],
      visaInfo: {
        singapore: "Singapore: E-Visa required. Processing time: 3-5 working days. Visa Fee: Approx. SGD 30 + service charges.",
        malaysia: "Malaysia: Visa-free entry for Indian passport holders (Currently extended through 2026 for eligible short tourist stays)."
      },
      bestTimeToVisit: {
        singapore: "Feb - Apr, Jul - Sep",
        malaysia: "Mar - Oct (West Coast including Kuala Lumpur, Langkawi, Penang)"
      },
      contacts: {
        india: "+91 98938 54811",
        email: "info@myholidaytrip.in",
        website: "www.myholidaytrip.in"
      },
      itinerary: [
        {
          day: "Day 1",
          title: "Arrival in Singapore & Marina Bay Sunset",
          desc: "Warm arrival at Singapore Changi Airport. Private coach transfer to hotel. Visit Merlion Park, admire the Marina Bay Sands architectural wonder, and witness the mesmerizing Spectra light & water show at Gardens by the Bay.",
          image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 2",
          title: "Singapore City Tour & Cultural Discovery",
          desc: "Half-day guided city tour covering historic Chinatown, Little India's vibrant markets, and shopping on Orchard Road. Evening free for leisure or optional Singapore Night Safari adventure.",
          image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 3",
          title: "Sentosa Island Cable Car & Wings of Time",
          desc: "Scenic Singapore Cable Car ride into Sentosa Island. Meet celebrities at Madame Tussauds, relax on Siloso Beach, and enjoy the multi-sensory Wings of Time evening fireworks & water extravaganza.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 4",
          title: "Universal Studios Singapore Adventure",
          desc: "Full-day thrilling entertainment at Universal Studios Singapore on Sentosa. Experience Battlestar Galactica, Transformers The Ride 3D, and Jurassic Park Rapids. Evening free for Bugis Street shopping.",
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 5",
          title: "Transfer to Kuala Lumpur & Petronas Twin Towers",
          desc: "Deluxe AC coach transfer from Singapore to Kuala Lumpur, Malaysia. Hotel check-in. Evening orientation city tour with photo stops at Petronas Twin Towers and vibrant shopping/dining at Bukit Bintang.",
          image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 6",
          title: "Genting Highlands & Sacred Batu Caves",
          desc: "Climb the colorful 272 steps at Batu Caves temple. Ascend via Awana SkyWay Cable Car over lush tropical rainforest to Genting Highlands for mountain breeze, casinos, and theme park excitement.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 7",
          title: "Kuala Lumpur Sightseeing & Departure",
          desc: "Morning city sightseeing covering King's Palace (Istana Negara) and National Mosque. Enjoy souvenir shopping before scheduled coach transfer to KLIA International Airport for your return flight with endless memories.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      id: "pkg-malaysia-kl-genting",
      title: "Kuala Lumpur & Genting Highlands Discovery",
      destination: "Kuala Lumpur • Batu Caves • Genting Highlands",
      country: "Malaysia",
      category: "malaysia",
      duration: "4 Days / 3 Nights",
      badge: "Top Malaysia Tour",
      standardPrice: 24000,
      discountPercent: 10,
      clientPrice: 21600,
      priceUnit: "per person (Twin Sharing)",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Experience the vibrant metropolis of Kuala Lumpur (Petronas Towers, KL Tower, Merdeka Square) and escape to the clouds at Genting Highlands with Awana SkyWay Cable Car and theme parks. Includes premium partner hotel stays with guaranteed 10% client savings.",
      travelTiers: [
        { id: "deluxe_4star", name: "Deluxe 4-Star Partner Hotels", pricePerPerson: 21600, standardPrice: 24000, default: true },
        { id: "luxury_5star", name: "Luxury 5-Star KLCC & Highland Suites", pricePerPerson: 28800, standardPrice: 32000 }
      ],
      inclusions: [
        "3 Nights in 4/5-Star Partner Hotels (KL + Genting)",
        "Airport Transfers & Sightseeing in Dedicated AC Vehicle",
        "Awana SkyWay Gondola Cable Car Return Tickets",
        "Batu Caves & Murugan Temple Guided Tour",
        "Daily International Buffet Breakfast",
        "Kuala Lumpur City Tour with Photo Stops at Petronas Towers",
        "All Tolls, Parking & Driver Allowances",
        "MHT 10% Client Privilege Applied"
      ],
      exclusions: [
        "International Flight Airfare",
        "Malaysia Tourist Visa Fee (if applicable)",
        "Personal Shopping & Extra Meals",
        "Theme Park Entry Tickets (Available as Add-on)"
      ],
      experienceAddOns: [
        { id: "skyworlds_ticket", name: "Genting SkyWorlds Outdoor Theme Park Full Day Pass", price: 2200, icon: "ticket" },
        { id: "kl_tower_dinner", name: "Atmosphere 360 Revolving Dinner at KL Tower", price: 3400, icon: "utensils" },
        { id: "sunway_lagoon", name: "Sunway Lagoon Theme Park Day Trip with Transfers", price: 3100, icon: "waves" }
      ],
      itinerary: [
        {
          day: "Day 1",
          title: "Arrival in Kuala Lumpur & Vibrant City Tour",
          desc: "Warm welcome at Kuala Lumpur International Airport (KLIA). Private transfer to partner hotel. In the evening, visit the illuminated Petronas Twin Towers, KLCC Park Musical Fountain, and explore the bustling street food alleys of Jalan Alor.",
          image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 2",
          title: "Batu Caves & Scenic Awana SkyWay to Genting",
          desc: "Morning visit to the iconic rainbow steps and 140-ft golden Murugan statue at Batu Caves. Drive up to Awana Station and ride the spectacular glass-bottom cable car gliding over ancient rainforests up to Genting Highlands.",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 3",
          title: "Genting SkyWorlds Theme Park & Luxury Shopping",
          desc: "Full day of thrill rides, roller coasters, and entertainment at Genting SkyWorlds and Skytropolis indoor park. Shop world brands at Genting Premium Outlets before comfortable evening transfer back to Kuala Lumpur.",
          image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
        },
        {
          day: "Day 4",
          title: "Putrajaya Pink Mosque & Departure Transfer",
          desc: "Check out from hotel. Tour Putrajaya—the garden administrative capital—with photo stops at the floating Putra Pink Mosque and Perdana Putra palace before drop-off at KLIA Airport for departure.",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      id: "pkg-malaysia-langkawi",
      title: "Langkawi Island Paradise & Cable Car SkyBridge",
      destination: "Langkawi Island (Andaman Sea)",
      country: "Malaysia",
      category: "malaysia",
      duration: "4 Days / 3 Nights",
      badge: "Tropical Beach & Island",
      standardPrice: 26000,
      discountPercent: 10,
      clientPrice: 23400,
      priceUnit: "per person (Twin Sharing)",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Unwind on Langkawi's duty-free tropical island with private beach resort accommodation, Kilim Geoforest mangrove boat safari with eagle feeding, and SkyCab cable car.",
      travelTiers: [
        { id: "resort_deluxe", name: "Beachfront 4-Star Resort Chalet", pricePerPerson: 23400, standardPrice: 26000, default: true },
        { id: "overwater_5star", name: "Overwater 5-Star Luxury Villa", pricePerPerson: 36000, standardPrice: 40000 }
      ],
      inclusions: [
        "3 Nights in Beachfront 5-Star Partner Resort",
        "Private AC Transfers for All Sightseeing",
        "Langkawi SkyCab Cable Car & Curved SkyBridge Tickets",
        "Kilim Geoforest Mangrove Safari Boat with Eagle Feeding",
        "Daily Seaside Buffet Breakfast",
        "Island Hopping Boat Tour (Dayang Bunting Marble Island)",
        "MHT Exclusive 10% Client Privilege"
      ],
      exclusions: [
        "Air tickets to Langkawi",
        "Water sports not mentioned",
        "Personal expenses"
      ],
      experienceAddOns: [
        { id: "catamaran_sunset", name: "Catamaran Sunset Cruise with Free-flow BBQ Dinner", price: 3800, icon: "ship" },
        { id: "jet_ski_tour", name: "Dayang Bunting 4-Hour Jet Ski Island Safari", price: 4200, icon: "waves" }
      ],
      itinerary: [
        { day: "Day 1", title: "Arrival in Langkawi & Beach Sunset", desc: "Airport pickup to Pantai Cenang resort. Relax by the beach with tropical sunset cocktails.", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 2", title: "SkyCab Cable Car & SkyBridge", desc: "Ascend Mt. Mat Cincang via cable car. Walk on the iconic Langkawi curved SkyBridge suspended over rainforests.", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 3", title: "Mangrove Safari & Island Hopping", desc: "Speedboat safari through mangrove caves, eagle feeding, and swimming in freshwater Pregnant Maiden lake.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 4", title: "Duty-Free Shopping & Departure", desc: "Kuah town duty-free shopping and departure transfer to Langkawi Airport.", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    {
      id: "pkg-malaysia-singapore-twin",
      title: "Malaysia & Singapore Twin Wonder Extravaganza",
      destination: "Kuala Lumpur • Genting • Singapore",
      country: "Malaysia & Singapore",
      category: "malaysia",
      duration: "6 Days / 5 Nights",
      badge: "Ultimate Southeast Asia",
      standardPrice: 44000,
      discountPercent: 10,
      clientPrice: 39600,
      priceUnit: "per person (Twin Sharing)",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "The ultimate 2-country grand vacation combining the best of Malaysia (KL & Genting) and Singapore (Marina Bay Sands, Sentosa Island, Universal Studios, and Gardens by the Bay).",
      travelTiers: [
        { id: "deluxe_tier", name: "Deluxe 4-Star City Hotels", pricePerPerson: 39600, standardPrice: 44000, default: true },
        { id: "vip_tier", name: "5-Star Marina Bay & KLCC Luxury", pricePerPerson: 54000, standardPrice: 60000 }
      ],
      inclusions: [
        "3 Nights in Kuala Lumpur & 2 Nights in Singapore (4/5-Star Hotels)",
        "Luxury AC Coach Cross-Border Transfer (KL to Singapore)",
        "Singapore City Tour with Merlion Park & Marina Bay",
        "Sentosa Island Cable Car & Wings of Time Show",
        "Gardens by the Bay (Flower Dome & Cloud Forest)",
        "Batu Caves & Genting Highlands Day Trip",
        "Daily Buffet Breakfasts & MHT 10% Advantage"
      ],
      exclusions: ["Universal Studios Express Pass", "Singapore Visa", "Personal meals"],
      experienceAddOns: [
        { id: "universal_ticket", name: "Universal Studios Singapore Full Day Pass", price: 5200, icon: "ticket" },
        { id: "night_safari", name: "Singapore Night Safari with Tram Ride", price: 3400, icon: "moon" }
      ],
      itinerary: [
        { day: "Day 1", title: "Arrival in Kuala Lumpur", desc: "KLIA airport pickup. Check in to KL hotel. Evening KLCC Twin Towers & night market.", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 2", title: "Genting Cable Car & Batu Caves", desc: "Full day excursion to Genting Highlands and Batu Caves.", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 3", title: "Kuala Lumpur to Singapore Express", desc: "Scenic coach drive across the Johor Strait into Singapore. Evening Marina Bay light show.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 4", title: "Sentosa Island & Cable Car", desc: "Cable car to Sentosa, Madame Tussauds, and Wings of Time laser show.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 5", title: "Gardens by the Bay & Supertrees", desc: "Visit Cloud Forest waterfall & Supertree Grove.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80" },
        { day: "Day 6", title: "Departure from Singapore", desc: "Transfer to Singapore Changi Airport.", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80" }
      ]
    }
  ]
};

// Initial Seed Bookings with Commission Data for Admin
const MHT_INITIAL_BOOKINGS = [
  {
    id: "MHT-849201",
    type: "Partner Hotel Booking",
    hotelName: "The Grand Pavilion Suites KLCC",
    city: "Kuala Lumpur, Malaysia",
    roomType: "KLCC Twin Towers View Suite",
    guestName: "Rajesh & Sunita Patel",
    guestPhone: "+91 98261 44552",
    checkin: "2026-10-12",
    checkout: "2026-10-15",
    nights: 3,
    totalAmount: "₹31,050",
    grossNumeric: 31050,
    hotelCommissionPercent: 15,
    commissionEarned: 4658,
    clientSavings: 3450,
    payoutStatus: "Settled / Received",
    timestamp: "2026-10-05T10:30:00.000Z",
    status: "Confirmed (10% MHT Advantage Rate)"
  },
  {
    id: "MHT-732910",
    type: "Partner Hotel Booking",
    hotelName: "Langkawi Azure Beachfront Resort & Spa",
    city: "Langkawi Island, Malaysia",
    roomType: "Andaman Sea View Chalet",
    guestName: "Vikram Malhotra",
    guestPhone: "+91 94250 88219",
    checkin: "2026-10-18",
    checkout: "2026-10-22",
    nights: 4,
    totalAmount: "₹34,200",
    grossNumeric: 34200,
    hotelCommissionPercent: 15,
    commissionEarned: 5130,
    clientSavings: 3800,
    payoutStatus: "Settled / Received",
    timestamp: "2026-10-04T14:15:00.000Z",
    status: "Confirmed (10% MHT Advantage Rate)"
  },
  {
    id: "MHT-621849",
    type: "Partner Hotel Booking",
    hotelName: "George Town Heritage Luxury Mansion",
    city: "Penang, Malaysia",
    roomType: "Straits Heritage Suite",
    guestName: "Pooja Mehta",
    guestPhone: "+91 98270 33114",
    checkin: "2026-10-24",
    checkout: "2026-10-26",
    nights: 2,
    totalAmount: "₹12,240",
    grossNumeric: 12240,
    hotelCommissionPercent: 15,
    commissionEarned: 1836,
    clientSavings: 1360,
    payoutStatus: "Pending Payout",
    timestamp: "2026-10-06T09:45:00.000Z",
    status: "Confirmed (10% MHT Advantage Rate)"
  },
  {
    id: "MHT-519283",
    type: "Partner Hotel Booking",
    hotelName: "Highland Cloudview Palace & Resort",
    city: "Genting Highlands, Malaysia",
    roomType: "Cloudview Deluxe Room",
    guestName: "Amit & Neha Verma",
    guestPhone: "+91 91110 55442",
    checkin: "2026-10-28",
    checkout: "2026-10-30",
    nights: 2,
    totalAmount: "₹10,620",
    grossNumeric: 10620,
    hotelCommissionPercent: 15,
    commissionEarned: 1593,
    clientSavings: 1180,
    payoutStatus: "Settled / Received",
    timestamp: "2026-10-06T16:20:00.000Z",
    status: "Confirmed (10% MHT Advantage Rate)"
  },
  {
    id: "MHT-493821",
    type: "Partner Hotel Booking",
    hotelName: "Langkawi Azure Beachfront Resort & Spa",
    city: "Langkawi, Malaysia",
    roomType: "Deluxe Ocean View Room",
    guestName: "Manish Agarwal",
    guestPhone: "+91 98260 77112",
    checkin: "2026-11-02",
    checkout: "2026-11-04",
    nights: 2,
    totalAmount: "₹17,100",
    grossNumeric: 17100,
    hotelCommissionPercent: 15,
    commissionEarned: 2565,
    clientSavings: 1900,
    payoutStatus: "Settled / Received",
    timestamp: "2026-10-07T11:00:00.000Z",
    status: "Confirmed (10% MHT Advantage Rate)"
  }
];

// LocalStorage Store Class
class MHTStore {
  constructor() {
    this.storageKey = 'mht_global_store_v1';
    this.bookingsKey = 'mht_client_bookings_v1';
    this.init();
  }

  init() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      this.saveData(MHT_DEFAULT_DATA);
    }
    const storedBookings = localStorage.getItem(this.bookingsKey);
    if (!storedBookings) {
      localStorage.setItem(this.bookingsKey, JSON.stringify(MHT_INITIAL_BOOKINGS));
    }
  }

  get data() {
    return this.getData();
  }

  getDestinationThemes() {
    return this.getData().destinationThemes || MHT_DEFAULT_DATA.destinationThemes;
  }

  getData() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return MHT_DEFAULT_DATA;
    try {
      const parsed = JSON.parse(raw);
      parsed.destinationThemes = MHT_DEFAULT_DATA.destinationThemes;
      parsed.brand = MHT_DEFAULT_DATA.brand;
      return parsed;
    } catch (e) {
      return MHT_DEFAULT_DATA;
    }
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getHotels() {
    return this.getData().partnerHotels || [];
  }

  getTourPackages() {
    return this.getData().tourPackages || [];
  }

  addHotel(hotel) {
    const data = this.getData();
    const discount = hotel.clientDiscountPercent || 10;
    hotel.discountedRate = Math.round(hotel.rackRate * (1 - discount / 100));
    hotel.partnerCommissionPercent = hotel.partnerCommissionPercent || 15;
    hotel.id = 'mht-hotel-' + Date.now();
    data.partnerHotels.unshift(hotel);
    this.saveData(data);
    return hotel;
  }

  addTourPackage(pkg) {
    const data = this.getData();
    const discount = pkg.discountPercent || 10;
    pkg.clientPrice = Math.round(pkg.standardPrice * (1 - discount / 100));
    pkg.id = 'mht-pkg-' + Date.now();
    data.tourPackages.unshift(pkg);
    this.saveData(data);
    return pkg;
  }

  deleteHotel(id) {
    const data = this.getData();
    data.partnerHotels = data.partnerHotels.filter(h => h.id !== id);
    this.saveData(data);
  }

  deleteTour(id) {
    const data = this.getData();
    data.tourPackages = data.tourPackages.filter(p => p.id !== id);
    this.saveData(data);
  }

  getBookings() {
    const raw = localStorage.getItem(this.bookingsKey);
    return raw ? JSON.parse(raw) : MHT_INITIAL_BOOKINGS;
  }

  saveBooking(booking) {
    const bookings = this.getBookings();
    booking.id = 'MHT-' + Math.floor(100000 + Math.random() * 900000);
    booking.timestamp = new Date().toISOString();
    booking.status = 'Confirmed (10% MHT Advantage Rate)';

    // Extract numeric total amount
    const rawDigits = (booking.totalAmount || '').toString().replace(/[^0-9]/g, '');
    const numAmount = parseInt(rawDigits) || 5000;
    booking.grossNumeric = numAmount;

    // Calculate Partner Hotel Commission (default 15%) & Client Savings (10%)
    const commissionRate = booking.hotelCommissionPercent || 15;
    booking.hotelCommissionPercent = commissionRate;
    booking.commissionEarned = Math.round(numAmount * (commissionRate / 100));
    booking.clientSavings = Math.round(numAmount * (10 / 90));
    booking.payoutStatus = booking.payoutStatus || 'Pending Payout';

    bookings.unshift(booking);
    localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
    return booking;
  }

  toggleBookingPayoutStatus(bookingId) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      target.payoutStatus = (target.payoutStatus === 'Settled / Received') ? 'Pending Payout' : 'Settled / Received';
      localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
      return target;
    }
    return null;
  }

  // User & Auth Management
  getUser() {
    const raw = localStorage.getItem('mht_user_profile');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u.name === 'Rajesh Sharma' || !u.name) {
          u.name = 'Priya Sharma';
        }
        if (u.phone === '+91 98260 55443' || u.phone === '9826055443' || u.phone === '+91 76780 92934' || u.phone === '7678092934') {
          u.phone = '+91 98938 54811';
        }
        return u;
      } catch (e) {
        console.error('Error parsing user profile', e);
      }
    }
    return MHT_DEFAULT_USER;
  }

  setUser(user) {
    localStorage.setItem('mht_user_profile', JSON.stringify(user));
    return user;
  }

  loginWithOTP(phone, otp) {
    const cleanOtp = (otp || '').trim();
    if (cleanOtp === '1234' || cleanOtp.length === 4) {
      const existing = this.getUser();
      const user = {
        ...existing,
        isLoggedIn: true,
        phone: phone || existing.phone,
        name: existing.name || 'Priya Sharma',
        memberId: existing.memberId || 'MHT-VIP-8821',
        lastLogin: new Date().toISOString()
      };
      this.setUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid OTP. Please enter 1234.' };
  }

  logout() {
    const user = this.getUser();
    user.isLoggedIn = false;
    this.setUser(user);
    return user;
  }

  getVouchers() {
    return MHT_REWARD_VOUCHERS;
  }

  getUserSavingsSummary() {
    const bookings = this.getBookings();
    let totalSpent = 0;
    let totalSaved = 0;
    let totalStandardRack = 0;

    bookings.forEach(b => {
      const gross = b.grossNumeric || parseInt((b.totalAmount || '').toString().replace(/[^0-9]/g, '')) || 0;
      const saved = b.clientSavings || Math.round(gross * (10 / 90));
      totalSpent += gross;
      totalSaved += saved;
      totalStandardRack += (gross + saved);
    });

    // Add baseline loyalty savings if fresh
    if (totalSaved === 0) {
      totalSaved = 14580;
      totalSpent = 131220;
      totalStandardRack = 145800;
    }

    return {
      totalSpent,
      totalSaved,
      totalStandardRack,
      bookingsCount: bookings.length,
      vouchersAvailableCount: MHT_REWARD_VOUCHERS.length,
      advantageDiscountPercent: 10,
      nextTierGoal: 25000,
      savingsProgressPercent: Math.min(100, Math.round((totalSaved / 25000) * 100))
    };
  }
}

// User Profile Data
const MHT_DEFAULT_USER = {
  isLoggedIn: true,
  name: "Priya Sharma",
  phone: "+91 98938 54811",
  email: "priya.sharma@myholidaytrip.in",
  memberId: "MHT-VIP-8821",
  tier: "MHT Advantage Club Elite",
  discountPercent: 10,
  joinedDate: "Jan 2024",
  city: "Global Elite Member",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
};

// Reward Vouchers for Next Trips
const MHT_REWARD_VOUCHERS = [
  {
    id: "vouch-1",
    code: "MHTMALAYSIA10",
    title: "10% Extra on Malaysia Luxury Stays",
    discount: "10% OFF",
    category: "Malaysia Hotels",
    description: "Applicable on all 5-star & boutique partner hotels in Kuala Lumpur, Langkawi, Penang & Genting.",
    minSpend: "₹10,000",
    validTill: "31 Dec 2026",
    color: "from-amber-500 to-orange-600",
    badge: "Most Popular",
    destination: "malaysia"
  },
  {
    id: "vouch-2",
    code: "NEXTTRIP2000",
    title: "₹2,000 Instant Cash Voucher",
    discount: "₹2,000 OFF",
    category: "Tour Packages",
    description: "Flat ₹2,000 deduction on any 4D3N or 5D4N Malaysia holiday tour package booking.",
    minSpend: "₹30,000",
    validTill: "30 Nov 2026",
    color: "from-blue-600 to-indigo-700",
    badge: "Holiday Special",
    destination: "tours"
  },
  {
    id: "vouch-3",
    code: "LANGKAWISUNSET",
    title: "Complimentary Sunset Yacht Cruise",
    discount: "FREE UPGRADE",
    category: "Langkawi Stays",
    description: "Free shared luxury catamaran sunset cruise with BBQ dinner for 2 guests on Langkawi stays.",
    minSpend: "3+ Nights",
    validTill: "31 Dec 2026",
    color: "from-emerald-500 to-teal-700",
    badge: "VIP Perk",
    destination: "langkawi"
  },
  {
    id: "vouch-4",
    code: "GOAVIPDINING",
    title: "Romantic Beachfront Candlelight Dinner",
    discount: "WORTH ₹3,500",
    category: "Goa Beachfront",
    description: "Complimentary 3-course private beach dinner at Taj Fort Aguada or Alila Diwa partner properties.",
    minSpend: "2+ Nights",
    validTill: "15 Oct 2026",
    color: "from-rose-500 to-pink-600",
    badge: "Dining Perk",
    destination: "goa"
  },
  {
    id: "vouch-5",
    code: "EARLYBIRD5",
    title: "5% Additional Early Bird Discount",
    discount: "EXTRA 5% OFF",
    category: "Advance Bookings",
    description: "Stackable 5% discount on top of your 10% Advantage rate when booked 30 days prior to check-in.",
    minSpend: "No Minimum",
    validTill: "31 Dec 2026",
    color: "from-purple-600 to-indigo-800",
    badge: "Smart Saver",
    destination: "hotels"
  }
];

// Global Initialization
window.MHTStoreInstance = new MHTStore();
window.MHT_DATA = window.MHTStoreInstance.getData();
window.MHT_DEFAULT_USER = MHT_DEFAULT_USER;
window.MHT_REWARD_VOUCHERS = MHT_REWARD_VOUCHERS;
