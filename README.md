# NutriTrack – Frontend

Browserbasierte Single-Page-Application zur Erfassung und Auswertung der täglichen Kalorienzufuhr. Nutzer melden sich per Auth0 an, legen Mahlzeiten mit Makronährstoffen an und sehen automatisch die berechneten Kalorien. Jeder Nutzer sieht nur seine eigenen Daten.

Dieses Repository enthält das **Frontend**. Das Backend (REST-API) liegt unter [NutriTrack](https://github.com/Michelinchen/NutriTrack).

- **Live-Frontend:** https://nutritrack-frontend-q0wc.onrender.com
- **Live-Backend:** https://nutritrack-1-gqy2.onrender.com
- Modul: Webtechnologien · HTW Berlin · Prof. Dr. Arif Wider

## Autor
- Michael Kecker – Matrikelnummer: 600971

## Tech-Stack
- **Vue 3** mit **Composition API** (`<script setup>`)
- **TypeScript**
- **Vite** (Build & Dev-Server)
- **Axios** (HTTP-Kommunikation mit dem Backend)
- **Auth0** (`@auth0/auth0-vue`) – Login / Multi-User
- **Bootstrap 5** (Styling)
- **Vue Router**
- **Vitest** + **@vue/test-utils** (Tests)

## Funktionen (Use Cases)
1. Mahlzeit hinzufügen
2. Mahlzeit löschen
3. Mahlzeit bearbeiten
4. Suchfunktion (Live-Filter nach Name)
5. Favoriten markieren
6. Favoriten anzeigen (Filter)
7. Multi-User via Auth0 (Trennung über `owner`)
8. Gesamtkalorien-Anzeige der angezeigten Mahlzeiten

## Projektstruktur
```
src/
├─ components/MealList.vue     # Hauptkomponente: Formular + Liste + Filter
├─ services/mealService.ts     # Axios-Aufrufe an die Backend-API
├─ types/meal.ts               # MealEntry & Macronutrient (TypeScript-Typen)
├─ views/HomeView.vue          # rendert MealList
├─ App.vue                     # Navbar, Login/Logout, RouterView
└─ main.ts                     # App-Bootstrap, Auth0- & Bootstrap-Einbindung
```

## Lokale Entwicklung

### Voraussetzungen
- Node.js (siehe `engines` in `package.json`, empfohlen ≥ 22.12)

### Installation
```bash
npm install
```

### Umgebungsvariablen
Konfiguriert über `.env.development` (lokal) bzw. `.env.production` (Deploy):

```bash
VITE_API_BASE_URL=http://localhost:8080        # URL des Backends
VITE_AUTH0_DOMAIN=<dein-auth0-tenant>.auth0.com
VITE_AUTH0_CLIENT_ID=<deine-auth0-client-id>
```
> Die Auth0-SPA-Client-ID ist öffentlich (sie wird ohnehin im Browser ausgeliefert) und stellt kein Geheimnis dar.

### Starten
```bash
npm run dev
```
Läuft standardmäßig auf `http://localhost:5173`.

### Produktions-Build
```bash
npm run build     # Ausgabe nach dist/
```

## Tests
```bash
npm run test:unit
```
Komponententests (`src/components/__tests__/MealList.spec.ts`) mit **Vitest**. `axios` und `@auth0/auth0-vue` werden gemockt; asynchrones Laden wird mit `flushPromises()` abgewartet.

## CI/CD
Bei jedem Push auf `main` führt **GitHub Actions** (`.github/workflows/npm.yml`) automatisch `npm ci` und die Tests aus.

## Deployment
Deployment als **Static Site** auf [Render](https://render.com):
- Build Command: `npm install; npm run build`
- Publish Directory: `dist`

Die Auth0 *Allowed Callback / Logout / Web Origin URLs* müssen die Live-Frontend-URL enthalten, damit der Login in Produktion funktioniert.
