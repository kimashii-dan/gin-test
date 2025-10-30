CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_wishlists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wishlist_listings (
    wishlist_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    PRIMARY KEY (wishlist_id, listing_id),
    CONSTRAINT fk_wishlist_listings_wishlist FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_listings_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);