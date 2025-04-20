# Quran - API

> Quran API with media audio ***Syekh. Mishary Rashid Al-Afasy murrotal***.

### Introduction
This API data source comes from the combination of several parameters from [api.alquran.cloud](https://api.alquran.cloud) and [quran.kemenag.go.id](https://quran.kemenag.go.id) by merging its data to one JSON file with new structure for the better use and performance. Futhermore, this api uses indexed querying techniques with `0(1)` access time which is greatly affects performance.

### Features
- [x] Arabic Transliteration
- [x] English translation
- [x] Verses meta (juz, sajda, manzil, etc)
- [x] Audio (***Syekh. Mishary Rashid Al-Afasy*** murrotal edition)
- [x] Pagination support for all endpoints
- [x] Ayah range support
- [x] Bearer token authentication
- [ ] Tafsir surahs and verses

### Authentication
All API endpoints require authentication using a Bearer token. Include the token in the Authorization header of your requests:

```http
Authorization: Bearer your-token-here
```

Example using curl:
```bash
curl -H "Authorization: Bearer your-token-here" https://api-url/surah/1
```

If no token is provided or if the format is incorrect, the API will respond with a 401 Unauthorized status.

### Data Source
- [api.alquran.cloud](https://api.alquran.cloud) = Quran, Meta Verses, Audio.
- [quran.kemenag.go.id](https://quran.kemenag.go.id) = Indonesia translations and tafsir verses (short/long).
- [Al-Quran-ID-API](https://github.com/bachors/Al-Quran-ID-API) = Indonesia tafsir surah [*note: ambiguous revelation type on surah 13 and 55 in this source. So, I changed it to medinan (according to sahih international data)*]

### API Endpoints

#### List of Surahs
- `GET /surah`
  - Returns a paginated list of all surahs
  - Query Parameters:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 30)
  - Example: `/surah?page=1&limit=10`
  - Requires: Bearer token authentication

#### Specific Surah
- `GET /surah/{surah}`
  - Returns a specific surah with paginated verses
  - Query Parameters:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 10)
  - Example: `/surah/1?page=1&limit=20`
  - Requires: Bearer token authentication

#### Specific Ayah or Ayah Range
- `GET /surah/{surah}/{ayah}`
  - Returns a specific ayah from a surah
  - Example: `/surah/2/255`
  - Requires: Bearer token authentication
- `GET /surah/{surah}/{startAyah-endAyah}`
  - Returns a range of ayahs from a surah
  - Format: startAyah-endAyah (must be valid verse numbers)
  - Example: `/surah/114/1-6`
  - Error Handling:
    - Returns 400 if range format is invalid
    - Returns 404 if range exceeds surah length
  - Response includes:
    - Surah information
    - Ayah range details (start, end, total)
    - All verses in the range with Arabic text, transliteration, translation, and audio
  - Requires: Bearer token authentication

#### Juz Information
- `GET /juz/{juz}`
  - Returns a specific juz with paginated verses
  - Query Parameters:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 10)
  - Example: `/juz/30?page=1&limit=20`
  - Requires: Bearer token authentication

### Response Format

#### Pagination Structure
All paginated endpoints include the following metadata:
```json
{
  "pagination": {
    "totalItems": number,    // Total number of items (verses/surahs)
    "totalPages": number,    // Total number of pages
    "currentPage": number,   // Current page number
    "itemsPerPage": number,  // Number of items per page
    "hasNextPage": boolean,  // Whether there is a next page
    "hasPrevPage": boolean   // Whether there is a previous page
  }
}
```

### Recommended fonts for Al-qur'an
- [quran.musil.com](http://quran.mursil.com/Web-Print-Publishing-Quran-Text-Graphics-Fonts-and-Downloads/fonts-optimized-for-quran)
- [Uthmani](https://groups.google.com/forum/#!topic/colteachers/Y6iKganK0tQ)

### Available Commands
- `yarn` = install all dependencies.
- `yarn start` = run server.
- `yarn dev` = run develop server.

### LICENSE
MIT
