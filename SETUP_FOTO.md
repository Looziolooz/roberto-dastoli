# 📸 Setup Foto — Luogo dei Ricordi

## Come aggiungere le foto alla timeline

Le foto che hai condiviso vanno nella cartella `public/photos/` del progetto.
Rinominale esattamente così (nell'ordine delle immagini che hai mandato):

| File da salvare | Foto corrispondente |
|---|---|
| `public/photos/01-neonato-tigre.jpg` | Bambino in costume da tigre (neonato sorridente) |
| `public/photos/02-carnevale.jpg` | Bambino a carnevale con cappello blu |
| `public/photos/03-ritratto.jpg` | Ritratto neonato polo azzurra su sfondo giallo |
| `public/photos/04-spiaggia-bebè.jpg` | Bebè seduto che mangia qualcosa sulla spiaggia di sassi |
| `public/photos/05-spiaggia-bambino.jpg` | Bambino in piedi sulla sabbia aggrappato al palo |
| `public/photos/06-ritratto-teen.jpg` | Ritratto giovane adulto felpa nera (bokeh verde) |
| `public/photos/07-occhiali-aviator.jpg` | Bambino con occhiali da aviatore nel seggiolino rosso |
| `public/photos/08-bambino-mare.jpg` | Bambino che ride al mare (t-shirt verde) |
| `public/photos/09-spiaggia-10anni.jpg` | Bambino ~10 anni con occhiali specchiati alla spiaggia |
| `public/photos/10-best-team.jpg` | Ragazzo a casa con maglietta "Best Team Player" |
| `public/photos/11-teen-bw.jpg` | Foto bianco e nero teen (sigaretta) |
| `public/photos/12-specchio.jpg` | Selfie allo specchio con piumino nero (foto da piccolo dietro) |
| `public/photos/13-ritratto-finale.jpg` | Ritratto giovane con giacca nera su sfondo chiaro |
| `public/photos/14-scuola.jpg` | Foto scolastica — bambino con mento sulle mani, sorriso |

## Passi

1. Crea la cartella `public/photos/` nella root del progetto
2. Copia le foto con i nomi indicati sopra
3. Lancia `npm run dev` — la timeline le mostrerà automaticamente

## Note

- Next.js serve automaticamente tutto ciò che è in `/public`
- Non serve alcuna configurazione aggiuntiva in `next.config.ts`
  (il dominio Supabase è già configurato per le immagini remote)
- Le foto locali in `/public` vengono ottimizzate da `next/image` in automatico
- Formato consigliato: JPG, max 2MB per foto (Next.js le comprimerà on-the-fly)
