ALTER TABLE properties ADD COLUMN property_category VARCHAR(50);

-- Set default category based on existing property_type
UPDATE properties SET property_category = 'Residential' WHERE property_type IN ('Apartment', 'Villa', 'Plot', 'Penthouse');
UPDATE properties SET property_category = 'Commercial' WHERE property_type IN ('Commercial', 'Office', 'Retail', 'Warehouse');

-- Anything not matching defaults to Residential
UPDATE properties SET property_category = 'Residential' WHERE property_category IS NULL;

-- Now make it NOT NULL
ALTER TABLE properties ALTER COLUMN property_category SET NOT NULL;
