// Seed catalogue. Images use stable Unsplash eyewear photos for testing.
// The frontend falls back to /products/placeholder.svg if a URL fails to load.

const IMG = {
  black: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
  round: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
  aviator: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  clear: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80',
  wayfarer: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
  cateye: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
  sport: 'https://images.unsplash.com/photo-1483412468200-72182dbbc544?w=800&q=80',
  gold: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
};

export const products = [
  // ---- Lenskart (value eyeglasses) ----
  { name: 'Vincent Chase Classic Black', brand: 'Lenskart', category: 'eyeglasses', gender: 'unisex', price: 799, mrp: 1499, color: 'Black', frameShape: 'Rectangle', material: 'TR90', images: [IMG.black], description: 'Lightweight everyday rectangle frame with anti-glare lenses. Perfect first pair.' },
  { name: 'John Jacobs Round Tortoise', brand: 'Lenskart', category: 'eyeglasses', gender: 'unisex', price: 999, mrp: 1999, color: 'Tortoise', frameShape: 'Round', material: 'Acetate', images: [IMG.round], description: 'Retro round frame in warm tortoise. Comfortable acetate build.' },
  { name: 'Hustlr Clear Frame', brand: 'Lenskart', category: 'eyeglasses', gender: 'women', price: 699, mrp: 1299, color: 'Transparent', frameShape: 'Cat-eye', material: 'Polycarbonate', images: [IMG.clear], description: 'Trendy transparent cat-eye frame, ultra-light for all-day wear.' },
  { name: 'Vincent Chase Kids Flexi Blue', brand: 'Lenskart', category: 'eyeglasses', gender: 'kids', price: 599, mrp: 1099, color: 'Blue', frameShape: 'Rectangle', material: 'Flexible TR', images: [IMG.black], description: 'Bendable, near-unbreakable frame designed for active kids.' },
  { name: 'Lenskart Air Featherlight', brand: 'Lenskart', category: 'eyeglasses', gender: 'men', price: 1199, mrp: 2499, color: 'Gunmetal', frameShape: 'Rectangle', material: 'Titanium-alloy', images: [IMG.black], description: 'Featherlight rimless-style frame that you barely feel on your face.' },
  { name: 'John Jacobs Browline Amber', brand: 'Lenskart', category: 'eyeglasses', gender: 'men', price: 1099, mrp: 2199, color: 'Amber', frameShape: 'Browline', material: 'Metal + Acetate', images: [IMG.round], description: 'Sophisticated browline frame blending metal and amber acetate.' },

  // ---- Titan (premium eyeglasses + sunglasses) ----
  { name: 'Titan Signature Rimless', brand: 'Titan', category: 'eyeglasses', gender: 'men', price: 2499, mrp: 3999, color: 'Silver', frameShape: 'Rimless', material: 'Stainless Steel', images: [IMG.clear], description: 'Elegant rimless frame with a refined, professional look.' },
  { name: 'Titan Eye+ Bold Black', brand: 'Titan', category: 'eyeglasses', gender: 'unisex', price: 1799, mrp: 2999, color: 'Matte Black', frameShape: 'Square', material: 'Acetate', images: [IMG.black], description: 'Bold matte square frame that makes a statement.' },
  { name: 'Titan Glares Aviator', brand: 'Titan', category: 'sunglasses', gender: 'men', price: 2999, mrp: 4499, color: 'Gold/Green', frameShape: 'Aviator', material: 'Metal', images: [IMG.aviator], description: 'Classic aviator sunglasses with UV-400 polarised lenses.' },
  { name: 'Titan Glares Cat-Eye', brand: 'Titan', category: 'sunglasses', gender: 'women', price: 2799, mrp: 4299, color: 'Rose Gold', frameShape: 'Cat-eye', material: 'Metal', images: [IMG.cateye], description: 'Chic cat-eye sunglasses with gradient tint and UV protection.' },
  { name: 'Titan Sport Wrap', brand: 'Titan', category: 'sunglasses', gender: 'men', price: 2599, mrp: 3999, color: 'Black/Red', frameShape: 'Wrap', material: 'Nylon', images: [IMG.sport], description: 'Wraparound sport sunglasses with anti-slip grip and polarised lenses.' },
  { name: 'Titan Gold Round', brand: 'Titan', category: 'sunglasses', gender: 'unisex', price: 3199, mrp: 4999, color: 'Gold', frameShape: 'Round', material: 'Metal', images: [IMG.gold], description: 'Premium gold round sunglasses with mirrored UV-400 lenses.' },

  // ---- Ray-Ban (iconic sunglasses) ----
  { name: 'Ray-Ban Wayfarer Classic', brand: 'Ray-Ban', category: 'sunglasses', gender: 'unisex', price: 6490, mrp: 7990, color: 'Black', frameShape: 'Wayfarer', material: 'Acetate', images: [IMG.wayfarer], description: 'The legendary Wayfarer. Timeless design with crystal G-15 lenses.' },
  { name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', category: 'sunglasses', gender: 'unisex', price: 6990, mrp: 8490, color: 'Gold/Green', frameShape: 'Aviator', material: 'Metal', images: [IMG.aviator], description: 'The original pilot sunglasses. Iconic teardrop lenses, gold frame.' },
  { name: 'Ray-Ban Round Metal', brand: 'Ray-Ban', category: 'sunglasses', gender: 'unisex', price: 6790, mrp: 8290, color: 'Gold', frameShape: 'Round', material: 'Metal', images: [IMG.gold], description: 'Vintage-inspired round metal sunglasses with a bold personality.' },
  { name: 'Ray-Ban Clubmaster', brand: 'Ray-Ban', category: 'sunglasses', gender: 'men', price: 7290, mrp: 8990, color: 'Black/Gold', frameShape: 'Browline', material: 'Acetate + Metal', images: [IMG.round], description: 'Retro browline Clubmaster — a true style icon since the 50s.' },
  { name: 'Ray-Ban Erika Velvet', brand: 'Ray-Ban', category: 'sunglasses', gender: 'women', price: 5990, mrp: 7490, color: 'Brown', frameShape: 'Round', material: 'Nylon', images: [IMG.cateye], description: 'Soft round Erika frame in velvet finish for an understated look.' },
  { name: 'Ray-Ban Justin Matte', brand: 'Ray-Ban', category: 'sunglasses', gender: 'unisex', price: 5490, mrp: 6990, color: 'Matte Black', frameShape: 'Wayfarer', material: 'Nylon', images: [IMG.wayfarer], description: 'Oversized matte Wayfarer with rubberised finish and bold rivets.' },
];
