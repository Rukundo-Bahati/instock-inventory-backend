-- Create company_info table
CREATE TABLE IF NOT EXISTS "company_info" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "companyName" varchar NOT NULL,
  "email" varchar NOT NULL,
  "phone" varchar NOT NULL,
  "address" text NOT NULL,
  "website" varchar,
  "description" text,
  "createdAt" timestamp DEFAULT NOW(),
  "updatedAt" timestamp DEFAULT NOW()
);

-- Insert default company info
INSERT INTO "company_info" (id, "companyName", email, phone, address, website, description)
VALUES (
  uuid_generate_v4(),
  'InStock Inventory Pro',
  'support@instock.com',
  '+250 788 000 000',
  'Kigali, Rwanda',
  'https://instock.com',
  'Professional inventory management system'
)
ON CONFLICT DO NOTHING;
