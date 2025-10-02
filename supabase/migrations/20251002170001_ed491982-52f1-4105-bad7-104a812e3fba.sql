-- Insert categories
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
  (gen_random_uuid(), 'Bags & Shoes', 'bags-shoes', 'Stylish bags and footwear', 1, true),
  (gen_random_uuid(), 'Men''s Fashion', 'mens-fashion', 'Clothing and accessories for men', 2, true),
  (gen_random_uuid(), 'Women''s Fashion', 'womens-fashion', 'Clothing and accessories for women', 3, true),
  (gen_random_uuid(), 'Beauty & Fragrance', 'beauty-fragrance', 'Beauty products and fragrances', 4, true);

-- Get category IDs for reference
DO $$
DECLARE
  bags_shoes_id uuid;
  mens_fashion_id uuid;
  womens_fashion_id uuid;
  beauty_fragrance_id uuid;
BEGIN
  SELECT id INTO bags_shoes_id FROM public.categories WHERE slug = 'bags-shoes';
  SELECT id INTO mens_fashion_id FROM public.categories WHERE slug = 'mens-fashion';
  SELECT id INTO womens_fashion_id FROM public.categories WHERE slug = 'womens-fashion';
  SELECT id INTO beauty_fragrance_id FROM public.categories WHERE slug = 'beauty-fragrance';

  -- Insert Men's Fashion Products
  INSERT INTO public.products (id, title, handle, description, brand, category_id, subcategory, tags, images, is_active, is_featured) VALUES
    (gen_random_uuid(), 'Classic White T-Shirt', 'classic-white-tshirt', 'A versatile wardrobe essential', 'StyleCraft', mens_fashion_id, 'Tops', ARRAY['casual', 'essentials'], ARRAY['/lovable-uploads/e407bbfa-0d96-49b7-b9b9-bcd58242333f.png'], true, true),
    (gen_random_uuid(), 'Black T-Shirt', 'black-tshirt', 'Timeless black tee for any occasion', 'StyleCraft', mens_fashion_id, 'Tops', ARRAY['casual', 'essentials'], ARRAY['/lovable-uploads/e056f700-4487-46d1-967e-39e0eb41e922.png'], true, false),
    (gen_random_uuid(), 'Premium Blue Jeans', 'premium-blue-jeans', 'Comfortable denim with a perfect fit', 'DenimCo', mens_fashion_id, 'Bottoms', ARRAY['denim', 'casual'], ARRAY['/lovable-uploads/bfc4fcc3-aa68-47ee-be0b-554cc9eb38c3.png'], true, true),
    (gen_random_uuid(), 'Navy Polo Shirt', 'navy-polo-shirt', 'Smart casual polo in navy', 'PoloHouse', mens_fashion_id, 'Tops', ARRAY['smart-casual'], ARRAY['/lovable-uploads/62770804-21fb-474f-84a8-a4a3f25d70b2.png'], true, false),
    (gen_random_uuid(), 'Grey Hoodie', 'grey-hoodie', 'Cozy hoodie for cool days', 'ComfortWear', mens_fashion_id, 'Outerwear', ARRAY['casual', 'comfort'], ARRAY['/lovable-uploads/40375599-9600-4dd5-95e2-ef8f01ae9427.png'], true, false),
    (gen_random_uuid(), 'White Dress Shirt', 'white-dress-shirt', 'Classic formal shirt', 'FormalFit', mens_fashion_id, 'Formal', ARRAY['formal', 'business'], ARRAY['/lovable-uploads/e11007ab-c8ed-4853-a495-dd474b9e5d9f.png'], true, false);

  -- Insert product variants for men's products
  INSERT INTO public.product_variants (product_id, sku, price, compare_price, stock, size, color, is_active)
  SELECT p.id, 
    CASE 
      WHEN p.handle = 'classic-white-tshirt' THEN 'MTS-WHT-' || size_option
      WHEN p.handle = 'black-tshirt' THEN 'MTS-BLK-' || size_option
      WHEN p.handle = 'premium-blue-jeans' THEN 'MJ-BLU-' || size_option
      WHEN p.handle = 'navy-polo-shirt' THEN 'MP-NAV-' || size_option
      WHEN p.handle = 'grey-hoodie' THEN 'MH-GRY-' || size_option
      WHEN p.handle = 'white-dress-shirt' THEN 'MDS-WHT-' || size_option
    END as sku,
    CASE 
      WHEN p.handle = 'classic-white-tshirt' THEN 8500
      WHEN p.handle = 'black-tshirt' THEN 8500
      WHEN p.handle = 'premium-blue-jeans' THEN 25000
      WHEN p.handle = 'navy-polo-shirt' THEN 12000
      WHEN p.handle = 'grey-hoodie' THEN 18000
      WHEN p.handle = 'white-dress-shirt' THEN 15000
    END as price,
    CASE 
      WHEN p.handle = 'classic-white-tshirt' THEN 12000
      WHEN p.handle = 'black-tshirt' THEN 12000
      WHEN p.handle = 'premium-blue-jeans' THEN 35000
      WHEN p.handle = 'navy-polo-shirt' THEN 18000
      WHEN p.handle = 'grey-hoodie' THEN 25000
      WHEN p.handle = 'white-dress-shirt' THEN 22000
    END as compare_price,
    50 as stock,
    size_option as size,
    CASE 
      WHEN p.handle = 'classic-white-tshirt' THEN 'White'
      WHEN p.handle = 'black-tshirt' THEN 'Black'
      WHEN p.handle = 'premium-blue-jeans' THEN 'Blue'
      WHEN p.handle = 'navy-polo-shirt' THEN 'Navy'
      WHEN p.handle = 'grey-hoodie' THEN 'Grey'
      WHEN p.handle = 'white-dress-shirt' THEN 'White'
    END as color,
    true as is_active
  FROM public.products p
  CROSS JOIN (VALUES ('S'), ('M'), ('L'), ('XL')) AS sizes(size_option)
  WHERE p.category_id = mens_fashion_id;

  -- Insert Women's Fashion Products
  INSERT INTO public.products (id, title, handle, description, brand, category_id, subcategory, tags, images, is_active, is_featured) VALUES
    (gen_random_uuid(), 'Elegant Maxi Dress', 'elegant-maxi-dress', 'Flowing maxi dress for special occasions', 'EleganceWear', womens_fashion_id, 'Dresses', ARRAY['formal', 'elegant'], ARRAY['/lovable-uploads/e407bbfa-0d96-49b7-b9b9-bcd58242333f.png'], true, true),
    (gen_random_uuid(), 'Casual Midi Dress', 'casual-midi-dress', 'Perfect everyday dress', 'CasualChic', womens_fashion_id, 'Dresses', ARRAY['casual'], ARRAY['/lovable-uploads/e056f700-4487-46d1-967e-39e0eb41e922.png'], true, false),
    (gen_random_uuid(), 'Classic Blue Jeans', 'womens-blue-jeans', 'Comfortable denim for everyday wear', 'DenimCo', womens_fashion_id, 'Bottoms', ARRAY['denim', 'casual'], ARRAY['/lovable-uploads/bfc4fcc3-aa68-47ee-be0b-554cc9eb38c3.png'], true, false),
    (gen_random_uuid(), 'White Blouse', 'white-blouse', 'Elegant white blouse', 'BlouseHouse', womens_fashion_id, 'Tops', ARRAY['formal', 'work'], ARRAY['/lovable-uploads/62770804-21fb-474f-84a8-a4a3f25d70b2.png'], true, false);

  -- Insert product variants for women's products
  INSERT INTO public.product_variants (product_id, sku, price, compare_price, stock, size, color, is_active)
  SELECT p.id, 
    CASE 
      WHEN p.handle = 'elegant-maxi-dress' THEN 'WD-MAX-' || size_option
      WHEN p.handle = 'casual-midi-dress' THEN 'WD-MID-' || size_option
      WHEN p.handle = 'womens-blue-jeans' THEN 'WJ-BLU-' || size_option
      WHEN p.handle = 'white-blouse' THEN 'WB-WHT-' || size_option
    END as sku,
    CASE 
      WHEN p.handle = 'elegant-maxi-dress' THEN 45000
      WHEN p.handle = 'casual-midi-dress' THEN 28000
      WHEN p.handle = 'womens-blue-jeans' THEN 22000
      WHEN p.handle = 'white-blouse' THEN 16000
    END as price,
    CASE 
      WHEN p.handle = 'elegant-maxi-dress' THEN 65000
      WHEN p.handle = 'casual-midi-dress' THEN 40000
      WHEN p.handle = 'womens-blue-jeans' THEN 32000
      WHEN p.handle = 'white-blouse' THEN 24000
    END as compare_price,
    45 as stock,
    size_option as size,
    CASE 
      WHEN p.handle = 'elegant-maxi-dress' THEN 'Navy'
      WHEN p.handle = 'casual-midi-dress' THEN 'Black'
      WHEN p.handle = 'womens-blue-jeans' THEN 'Blue'
      WHEN p.handle = 'white-blouse' THEN 'White'
    END as color,
    true as is_active
  FROM public.products p
  CROSS JOIN (VALUES ('XS'), ('S'), ('M'), ('L')) AS sizes(size_option)
  WHERE p.category_id = womens_fashion_id AND p.subcategory IN ('Dresses', 'Bottoms', 'Tops');

  -- Insert Bags & Shoes Products
  INSERT INTO public.products (id, title, handle, description, brand, category_id, subcategory, tags, images, is_active, is_featured) VALUES
    (gen_random_uuid(), 'Classic Leather Handbag', 'classic-leather-handbag', 'Timeless leather handbag', 'LuxeBags', bags_shoes_id, 'Bags', ARRAY['luxury', 'leather'], ARRAY['/lovable-uploads/e407bbfa-0d96-49b7-b9b9-bcd58242333f.png'], true, true),
    (gen_random_uuid(), 'Professional Backpack', 'professional-backpack', 'Stylish and functional backpack', 'UrbanGear', bags_shoes_id, 'Bags', ARRAY['professional', 'casual'], ARRAY['/lovable-uploads/e056f700-4487-46d1-967e-39e0eb41e922.png'], true, false),
    (gen_random_uuid(), 'Men''s Black Dress Shoes', 'mens-black-dress-shoes', 'Classic formal footwear', 'ShoeElite', bags_shoes_id, 'Shoes', ARRAY['formal', 'men'], ARRAY['/lovable-uploads/bfc4fcc3-aa68-47ee-be0b-554cc9eb38c3.png'], true, false),
    (gen_random_uuid(), 'Women''s Black Heels', 'womens-black-heels', 'Elegant heels for any occasion', 'HeelHaven', bags_shoes_id, 'Shoes', ARRAY['formal', 'women'], ARRAY['/lovable-uploads/62770804-21fb-474f-84a8-a4a3f25d70b2.png'], true, false);

  -- Insert product variants for bags & shoes
  INSERT INTO public.product_variants (product_id, sku, price, compare_price, stock, size, color, is_active)
  SELECT p.id, 
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 'HB-BLK-OS'
      WHEN p.handle = 'professional-backpack' THEN 'BP-BLK-OS'
      WHEN p.handle = 'mens-black-dress-shoes' THEN 'MDS-BLK-' || size_option
      WHEN p.handle = 'womens-black-heels' THEN 'WH-BLK-' || size_option
    END as sku,
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 85000
      WHEN p.handle = 'professional-backpack' THEN 42000
      WHEN p.handle = 'mens-black-dress-shoes' THEN 55000
      WHEN p.handle = 'womens-black-heels' THEN 48000
    END as price,
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 120000
      WHEN p.handle = 'professional-backpack' THEN 60000
      WHEN p.handle = 'mens-black-dress-shoes' THEN 75000
      WHEN p.handle = 'womens-black-heels' THEN 68000
    END as compare_price,
    40 as stock,
    CASE 
      WHEN p.subcategory = 'Bags' THEN 'One Size'
      ELSE size_option
    END as size,
    'Black' as color,
    true as is_active
  FROM public.products p
  CROSS JOIN (VALUES ('36'), ('37'), ('38'), ('39'), ('40'), ('41'), ('42')) AS sizes(size_option)
  WHERE p.category_id = bags_shoes_id AND p.subcategory = 'Shoes'
  UNION ALL
  SELECT p.id, 
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 'HB-BLK-OS'
      WHEN p.handle = 'professional-backpack' THEN 'BP-BLK-OS'
    END as sku,
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 85000
      WHEN p.handle = 'professional-backpack' THEN 42000
    END as price,
    CASE 
      WHEN p.handle = 'classic-leather-handbag' THEN 120000
      WHEN p.handle = 'professional-backpack' THEN 60000
    END as compare_price,
    40 as stock,
    'One Size' as size,
    'Black' as color,
    true as is_active
  FROM public.products p
  WHERE p.category_id = bags_shoes_id AND p.subcategory = 'Bags';

  -- Insert Beauty & Fragrance Products
  INSERT INTO public.products (id, title, handle, description, brand, category_id, subcategory, tags, images, is_active, is_featured) VALUES
    (gen_random_uuid(), 'Luxury Face Serum', 'luxury-face-serum', 'Premium anti-aging serum', 'BeautyLux', beauty_fragrance_id, 'Skincare', ARRAY['skincare', 'premium'], ARRAY['/lovable-uploads/e407bbfa-0d96-49b7-b9b9-bcd58242333f.png'], true, true),
    (gen_random_uuid(), 'Daily Moisturizer', 'daily-moisturizer', 'Hydrating daily moisturizer', 'SkinEssentials', beauty_fragrance_id, 'Skincare', ARRAY['skincare', 'daily'], ARRAY['/lovable-uploads/e056f700-4487-46d1-967e-39e0eb41e922.png'], true, false),
    (gen_random_uuid(), 'Red Lipstick', 'red-lipstick', 'Classic red lip color', 'ColorPro', beauty_fragrance_id, 'Makeup', ARRAY['makeup', 'lips'], ARRAY['/lovable-uploads/bfc4fcc3-aa68-47ee-be0b-554cc9eb38c3.png'], true, false),
    (gen_random_uuid(), 'Women''s Perfume', 'womens-perfume', 'Elegant floral fragrance', 'ScentHouse', beauty_fragrance_id, 'Fragrance', ARRAY['fragrance', 'women'], ARRAY['/lovable-uploads/62770804-21fb-474f-84a8-a4a3f25d70b2.png'], true, false);

  -- Insert product variants for beauty products
  INSERT INTO public.product_variants (product_id, sku, price, compare_price, stock, size, color, is_active)
  SELECT p.id, 
    CASE 
      WHEN p.handle = 'luxury-face-serum' THEN 'FS-LUX-30ML'
      WHEN p.handle = 'daily-moisturizer' THEN 'MZ-DAY-50ML'
      WHEN p.handle = 'red-lipstick' THEN 'LP-RED-OS'
      WHEN p.handle = 'womens-perfume' THEN 'PF-FLO-50ML'
    END as sku,
    CASE 
      WHEN p.handle = 'luxury-face-serum' THEN 32000
      WHEN p.handle = 'daily-moisturizer' THEN 15000
      WHEN p.handle = 'red-lipstick' THEN 8500
      WHEN p.handle = 'womens-perfume' THEN 45000
    END as price,
    CASE 
      WHEN p.handle = 'luxury-face-serum' THEN 48000
      WHEN p.handle = 'daily-moisturizer' THEN 22000
      WHEN p.handle = 'red-lipstick' THEN 12000
      WHEN p.handle = 'womens-perfume' THEN 65000
    END as compare_price,
    60 as stock,
    CASE 
      WHEN p.handle = 'luxury-face-serum' THEN '30ml'
      WHEN p.handle = 'daily-moisturizer' THEN '50ml'
      WHEN p.handle = 'red-lipstick' THEN 'One Size'
      WHEN p.handle = 'womens-perfume' THEN '50ml'
    END as size,
    NULL as color,
    true as is_active
  FROM public.products p
  WHERE p.category_id = beauty_fragrance_id;

END $$;