# Casper Custom

Fork personalizzato di [TryGhost/Casper](https://github.com/TryGhost/Casper) per `adrianoamalfi.com`, mantenuto in modo da poter recepire gli aggiornamenti upstream senza perdere le personalizzazioni editoriali e visive.

Il repository usa tre riferimenti principali:

- `origin/custom`: branch di lavoro del fork
- `origin/upstream`: mirror del branch `main` di Casper
- `custom`: branch locale che viene ribasato sopra `origin/upstream`

## Development

Prerequisiti:

- Node.js
- Yarn

Comandi principali dalla root del tema:

```bash
# installa le dipendenze
yarn install

# sviluppo locale con watch CSS/assets
yarn dev

# build degli asset compilati
./node_modules/.bin/gulp build

# crea il pacchetto zip del tema
yarn zip

# aggiorna il fork su origin/upstream, builda e pusha
yarn sync-upstream
```

Note operative:

- gli stili sorgente vivono in `/assets/css/`
- gli asset compilati finiscono in `/assets/built/`
- gli script custom principali sono in `/assets/js/brand-core.js`, `/assets/js/brand-post.js` e `/assets/js/code-enhancements.js`
- il blocco di override CSS del fork vive in coda a `/assets/css/screen.css`

## Struttura Del Tema

Template core:

- `default.hbs`: layout principale, header, footer, asset e script condizionali
- `index.hbs`: homepage editoriale con topic hubs, galleria foto e feed cronologico
- `post.hbs`: articolo singolo
- `page.hbs`: pagina generica
- `author.hbs`: archivio autore
- `tag.hbs`: archivio tag
- `error.hbs` e `error-404.hbs`: pagine di errore

Template personalizzati del fork:

- `custom-photo.hbs`: template per singolo post fotografico
- `page-photos.hbs`: landing dell’archivio fotografie sullo slug `/photos/`
- `page-ai-art.hbs`: landing dell’archivio AI Art sullo slug `/ai-art/`
- `page-about.hbs`: pagina about dedicata
- `index-photos.hbs`: indice fotografie
- `index-ai-art.hbs`: indice immagini AI
- `index-tech-digest.hbs`: indice per il hub tech digest
- `index-tech-scratchpad.hbs`: indice per appunti e scratchpad tecnici
- `sitemap.hbs`: sitemap editoriale

Partial rilevanti:

- `/partials/brand/*`: sezioni editoriali e di brand del fork
- `/partials/media/*`: componenti immagine responsive
- `/partials/post-card.hbs`: card del feed
- `/partials/icons/*`: icone inline SVG, incluse quelle aggiunte per il fork

## Personalizzazioni Disponibili In Ghost

Il tema espone impostazioni custom via `package.json` per controllare:

- layout della navigazione
- font titolo e font body
- schema colore chiaro/scuro/auto
- stile dell’immagine del post
- copy della CTA in fondo ai post
- link social del footer/header
- visibilità cover homepage
- stile dell’header homepage
- layout del feed

## Workflow Upstream

Il fork è pensato per restare vicino a Casper senza fare merge distruttivi.

Regola di base:

- `origin/upstream` deve rispecchiare Casper `main`
- `custom` contiene solo i commit del fork
- gli aggiornamenti si integrano con `rebase`, non con merge permanenti

Flusso manuale:

```bash
git fetch origin
git checkout custom
git rebase origin/upstream
./node_modules/.bin/gulp build
git push --force-with-lease origin custom
```

Shortcut locale:

```bash
yarn sync-upstream
```

Se il rebase trova conflitti:

```bash
git status
# risolvi i file segnalati
git add <file-risolti>
git rebase --continue
git push --force-with-lease origin custom
```

Per annullare:

```bash
git rebase --abort
```

## GitHub Actions

Workflow presenti nel repository:

- `.github/workflows/sync-upstream.yml`
  Aggiorna il mirror `upstream`, prova il rebase automatico di `custom` e scrive un riepilogo nella run se trova conflitti. Il trigger schedulato gira ogni lunedi alle `06:00 UTC`, oltre al trigger manuale `workflow_dispatch`.

- `.github/workflows/test.yml`
  Installa le dipendenze e valida il tema su push e pull request.

- `.github/workflows/deploy-theme.yml`
  Esegue test e deploy del tema su Ghost quando viene aggiornato il branch `main`.

## Flusso Fotografico E AI Art

Il tema supporta due archivi visivi separati.

Fotografie:

- usa il tag interno `#photos`
- assegna ai post fotografici il template `custom-photo`
- crea una pagina con slug `photos` per usare `page-photos.hbs`
- la homepage mostra una selezione recente dal flusso fotografico
- il campo `feature_image_caption` viene usato come nota visibile sotto l’immagine

AI Art:

- usa il tag interno `#ai-art-and-images`
- crea una pagina con slug `ai-art` per usare `page-ai-art.hbs`
- l’archivio AI resta separato dal flusso fotografico

## Immagini Responsive

Il tema usa la pipeline responsive nativa di Ghost tramite partial `<picture>`.

Formati e fallback:

- `AVIF` come formato preferito
- `WebP` come fallback intermedio
- immagine Ghost standard come fallback finale

Dimensioni configurate in `package.json` sotto `config.image_sizes`:

- `xxs`: 30px
- `xs`: 100px
- `s`: 300px
- `m`: 600px
- `l`: 1000px
- `xl`: 2000px
- `xxl`: 2400px

Partial media riutilizzabili:

- `partials/media/picture-hero.hbs`
- `partials/media/picture-card.hbs`
- `partials/media/picture-ui.hbs`

Regole implementate:

- solo le hero above-the-fold usano `fetchpriority="high"` e `loading="eager"`
- card, thumbnail e media secondari usano `loading="lazy"`
- i wrapper riservano spazio tramite `aspect-ratio` per ridurre CLS

## Note Sul Fork

Per ridurre i conflitti con upstream:

- preferisci nuove sezioni dentro `partials/brand/`
- centralizza il comportamento custom in `assets/js/brand-core.js` e `assets/js/brand-post.js`
- usa `assets/css/screen.css` come punto di override principale
- evita modifiche estese ai template core quando una partial o un componente dedicato basta

## Licenza

Fork basato su Casper, distribuito sotto [MIT](LICENSE).

Copyright originale Casper: Ghost Foundation.
Personalizzazioni del fork: Adriano Amalfi.
