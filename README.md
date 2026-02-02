# Flyball Team Finder - Chrome Extension

Find flyball teams near you with this simple Chrome extension. Search by location or use GPS to discover local teams.

## Features

- **Use My Location** - One-click GPS-based team search
- **Search by Postcode/City** - Find teams near any location
- **Distance Sorting** - See the 6 nearest teams to your location
- **Direct Links** - Click any team to view their full profile on Flyball Hub

## Installation

### From Chrome Web Store
*(Coming soon)*

### Developer Mode (Load Unpacked)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `flyball-team-finder-extension` folder
6. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon in your Chrome toolbar
2. Either:
   - Click **"Use my location"** to find teams near you
   - Enter a postcode or city and click **Search**
3. View the 6 nearest teams with distances
4. Click any team to see their full profile on Flyball Hub

## Icons

The extension requires icon files at:
- `icons/icon16.png` (16x16)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

Generate these from the Flyball Hub logo or use placeholder icons for development.

## API

This extension uses the public Flyball Hub API:
- Teams: `https://app.flyballhub.com/api/v1/teams`
- Geocoding: OpenStreetMap Nominatim (free)

## Privacy

- Location data is only used to calculate distances to teams
- No data is stored or sent to third parties
- All team data comes from the public Flyball Hub API

## Links

- [Flyball Hub](https://flyballhub.com)
- [Team Finder](https://flyballhub.com/team-finder)

---

Powered by [Flyball Hub](https://flyballhub.com)
