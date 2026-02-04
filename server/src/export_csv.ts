
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const outputDir = path.join(__dirname, '../../csv_export');
  
  // Create output directory if not exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Exporting to ${outputDir}...`);

  // 1. Get List of Tables
  const tables: any[] = await prisma.$queryRaw`SHOW TABLES`;
  const tableNames = tables.map(t => Object.values(t)[0] as string);

  console.log(`Found tables: ${tableNames.join(', ')}`);

  // 2. Export Data for each table
  for (const tableName of tableNames) {
    if (tableName === '_prisma_migrations') continue;

    console.log(`Exporting data for table: ${tableName}`);
    
    // Unsafe query is fine here as we trust the table names from the database itself
    const data: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM ${tableName}`);
    
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')]; // Header row

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header];
          
          if (val === null || val === undefined) {
            return 'NULL'; // Or empty string based on preference
          }
          
          if (val instanceof Date) {
            return `"${val.toISOString()}"`;
          }
          
          if (typeof val === 'string') {
            // Escape double quotes and wrap in quotes
            return `"${val.replace(/"/g, '""')}"`; 
          }
          
          return val;
        });
        csvRows.push(values.join(','));
      }

      fs.writeFileSync(path.join(outputDir, `${tableName}.csv`), csvRows.join('\n'));
    } else {
      // Create empty file with headers if table is empty
      // We need to fetch columns to know headers if data is empty
      const columns: any[] = await prisma.$queryRaw`SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ${tableName}`;
      const headers = columns.map(c => c.COLUMN_NAME);
      fs.writeFileSync(path.join(outputDir, `${tableName}.csv`), headers.join(','));
    }
  }

  // 3. Export Schema Definitions (Data Dictionary)
  console.log('Exporting schema dictionary...');
  const schemaInfo: any[] = await prisma.$queryRaw`
    SELECT 
      TABLE_NAME, 
      COLUMN_NAME, 
      DATA_TYPE, 
      IS_NULLABLE, 
      COLUMN_KEY, 
      COLUMN_DEFAULT, 
      EXTRA 
    FROM information_schema.columns 
    WHERE table_schema = DATABASE()
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `;

  if (schemaInfo.length > 0) {
    const headers = Object.keys(schemaInfo[0]);
    const csvRows = [headers.join(',')];

    for (const row of schemaInfo) {
      const values = headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
        return val;
      });
      csvRows.push(values.join(','));
    }
    
    fs.writeFileSync(path.join(outputDir, '_schema_dictionary.csv'), csvRows.join('\n'));
  }

  console.log('Export completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
