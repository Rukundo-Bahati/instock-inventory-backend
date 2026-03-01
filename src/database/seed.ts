import { DataSource } from 'typeorm';

export async function seedDatabase(dataSource: DataSource) {
  try {
    // Check if company_info table exists and has data
    const companyInfoRepo = dataSource.getRepository('company_info');
    const count = await companyInfoRepo.count();
    
    if (count === 0) {
      // Insert default company info
      await dataSource.query(`
        INSERT INTO "company_info" ("companyName", email, phone, address, website, description)
        VALUES (
          'InStock Inventory Pro',
          'support@instock.com',
          '+250 788 000 000',
          'Kigali, Rwanda',
          'https://instock.com',
          'Professional inventory management system'
        )
      `);
      console.log('✅ Default company info seeded');
    }
  } catch (error) {
    console.log('ℹ️ Seeding skipped or already done:', error.message);
  }
}
