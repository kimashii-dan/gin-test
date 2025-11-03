CREATE TABLE ai_price_reports (
    id SERIAL PRIMARY KEY,
    suggested_price_min   DOUBLE PRECISION NOT NULL,
    suggested_price_max   DOUBLE PRECISION NOT NULL,
    currency              VARCHAR(16) NOT NULL,
    confidence_level      VARCHAR(64),
    reasoning             TEXT,
    listing_id            INTEGER NOT NULL UNIQUE,

    CONSTRAINT fk_listing
        FOREIGN KEY (listing_id)
        REFERENCES listings (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
