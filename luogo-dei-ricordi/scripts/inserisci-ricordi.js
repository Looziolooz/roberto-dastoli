const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function inserisciRicordi() {
  console.log('Inserimento ricordi in corso...');
  
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

inserisciRicordi();
