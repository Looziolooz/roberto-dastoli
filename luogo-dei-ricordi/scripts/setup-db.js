const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ewjkywegaxyhpzapzmxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3amt5d2VnYXh5aHB6YXB6bXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ1MzUwMywiZXhwIjoyMDkwMDI5NTAzfQ.sB-4ZVzvlKFUvkVI6Ns7gppX9ireWktzcHZVoiw4q_E';

const supabase = createClient(supabaseUrl, supabaseKey);

const fotoCronologiche = [
  { url: 'image_0.jpg', data_foto: '2010-01-01', descrizione: 'Il piccolo Tigro', tag: ['Infanzia'] },
  { url: 'image_1.jpg', data_foto: '2010-02-15', descrizione: 'Carnevale!', tag: ['Scuola', 'Infanzia'] },
  { url: 'image_2.jpg', data_foto: '2010-06-01', descrizione: 'Polo celeste', tag: ['Infanzia'] },
  { url: 'image_3.jpg', data_foto: '2010-12-01', descrizione: 'Primi giochi all\'aperto', tag: ['Infanzia'] },
  { url: 'image_4.jpg', data_foto: '2011-07-01', descrizione: 'Al mare tra gli ombrelloni', tag: ['Mare', 'Infanzia'] },
  { url: 'image_5.jpg', data_foto: '2012-09-01', descrizione: 'Ritratto sereno', tag: ['Giovinezza'] },
  { url: 'image_6.jpg', data_foto: '2012-05-01', descrizione: 'Occhiali da sole da grande', tag: ['Infanzia'] },
  { url: 'image_7.jpg', data_foto: '2013-08-01', descrizione: 'Giochi in acqua', tag: ['Mare', 'Infanzia'] },
  { url: 'image_8.jpg', data_foto: '2014-07-15', descrizione: 'Relax in spiaggia', tag: ['Mare', 'Giovinezza'] },
  { url: 'image_9.jpg', data_foto: '2015-10-01', descrizione: 'Best Team Player', tag: ['Sport', 'Giovinezza'] },
  { url: 'image_10.jpg', data_foto: '2016-01-01', descrizione: 'Foto finale', tag: ['Giovinezza'] },
];

async function setup() {
  console.log('Creazione tabella ricordi...');
  
  const { error: createError } = await supabase.rpc('create_table_ricordi', {});
  
  // Create table using raw SQL
  const { error: tableError } = await supabase.from('ricordi').select('id').limit(1);
  
  if (tableError && tableError.code === '42P01') {
    console.log('Tabella non esiste, creo...');
    // Table doesn't exist, need to create it via SQL
    // Try using the schema builder
    const { error } = await supabase.schema.createTable('ricordi', (table) => {
      table.uuid('id').primaryKey();
      table.text('url').notNull();
      table.date('data_foto');
      table.text('descrizione');
      table.specificType('tag', 'text[]');
      table.timestamp('created_at').defaultTo('now()');
    });
  }
  
  console.log('Inserimento ricordi...');
  
  for (const foto of fotoCronologiche) {
    const { data, error } = await supabase
      .from('ricordi')
      .insert([foto]);
    
    if (error) {
      console.error(`Errore inserimento ${foto.url}:`, error.message);
    } else {
      console.log(`✓ Inserito: ${foto.descrizione}`);
    }
  }
  
  console.log('Completato!');
}

setup().catch(console.error);
