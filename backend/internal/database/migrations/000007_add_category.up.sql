ALTER TABLE listings
ADD COLUMN category TEXT NOT NULL DEFAULT 'Furniture';


ALTER TABLE listings
ADD CONSTRAINT category_check
CHECK (category IN ('Electronics', 'Furniture', 'Books', 'Clothing', 'Services'));