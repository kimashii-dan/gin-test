CREATE TABLE IF NOT EXISTS wishlist_listings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    
    CONSTRAINT fk_wishlist_items_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_wishlist_items_listing 
        FOREIGN KEY (listing_id) 
        REFERENCES listings(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT unique_user_listing 
        UNIQUE (user_id, listing_id)
);
