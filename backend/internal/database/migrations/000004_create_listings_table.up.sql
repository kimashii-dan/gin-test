CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] DEFAULT '{}',
    price DOUBLE PRECISION NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE
);