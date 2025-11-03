import type { ListingData, PriceSuggestionResponse } from "../types";

export const filteredListings: ListingData[] = [
  {
    listing: {
      id: 1,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: false,
    },
    is_in_wishlist: true,
  },
  {
    listing: {
      id: 2,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",

      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: false,
    },
    is_in_wishlist: false,
  },
  {
    listing: {
      id: 3,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",
      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: true,
    },
    is_in_wishlist: false,
  },

  {
    listing: {
      id: 4,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: true,
    },
    is_in_wishlist: true,
  },
  {
    listing: {
      id: 5,
      created_at: "2025-10-24T18:53:53.819019Z",
      updated_at: "2025-10-24T18:53:54.473029Z",
      user_id: 1,
      title: "The best hoodie in this world (just trust me bro)",
      description: "i can't believe you are reading this",
      image_urls: ["/images/hoodie.webp"],
      price: 100,
      is_closed: false,
    },
    is_in_wishlist: false,
  },
  {
    listing: {
      id: 6,
      created_at: "2025-10-24T18:44:51.74984Z",
      updated_at: "2025-10-24T18:44:52.3198Z",
      user_id: 1,
      title: "MacBook Pro M2",
      description: "Used for 3 months",
      image_urls: [
        "/images/macbook.webp",
        "/images/hoodie.webp",
        "/images/macbook.webp",
      ],
      price: 1200,
      is_closed: true,
    },
    is_in_wishlist: true,
  },
];

export const listingData: ListingData = {
  listing: {
    id: 2,
    created_at: "2025-10-24T18:44:51.74984Z",
    updated_at: "2025-10-24T18:44:52.3198Z",
    user_id: 1,
    title:
      "MacBook Pro M2 blablabla meowmeowmeow pro max ultra light super mega powerfull",
    description:
      "Used M2 MacBook Pro 13-inch (Late 2022) – Excellent Condition! It features the M2 chip with an upgraded 16GB Unified Memory and a fast 512GB SSD. The condition is flawless; there are no visible scratches or dents on the casing or display. The battery health is 98%, with a very low cycle count (currently 35). Comes complete with the original 67W USB-C Power Adapter, charging cable, and the retail box. Price is firm at $1200. Local pickup or secure shipping available.",
    image_urls: [
      "/images/macbook.webp",
      "/images/hoodie.webp",
      "/images/react-logo.webp",
    ],
    price: 1200,
    is_closed: false,
    user: {
      id: 1,
      created_at: "2025-10-24T18:44:36.309077Z",
      updated_at: "2025-10-26T19:13:10.891468Z",
      email: "daniyarmunsyzbaev@gmail.com",
      name: "Daniyar",
      university: "KBTU",
      phone: "",
      telegram_link: "",
      bio: "",
      avatar_url: "",
    },
  },
  is_in_wishlist: true,
};

export const reportData: PriceSuggestionResponse = {
  suggested_price_min: 320,
  suggested_price_max: 580,
  confidence_level: "high",
  currency: "USD",
  reasoning:
    "The premium full-grain cowhide, reinforced stitching, and classic biker aesthetic indicate a high-quality, durable jacket. The price range reflects its new condition and superior materials, balanced against potential lack of explicit brand recognition.",
};
