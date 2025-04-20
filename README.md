# Quran API

A simple Quran API built with Node.js and Express.js that provides access to Quranic verses, surahs, juz, and the 99 names of Allah.

## Features

### Features
- [x] Arabic Transliteration
- [x] English translation
- [x] Verses meta (juz, sajda, manzil, etc)
- [x] Audio (***Syekh. Mishary Rashid Al-Afasy*** murrotal edition)
- [x] Pagination support for all endpoints
- [x] Ayah range support
- [x] Bearer token authentication
- [x] Get all names of Allah
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

### Allah names
- `GET /names`
  - Returns first 30 names of Allah
  - Query Parameters:
    - `page` (optional, default: 1)
    - `limit` (optional, default: 30)
  - Example: `/names?page=1&limit=20`
  - Requires: Bearer token authentication

## Response Format

### Success Response
```json
{
  "code": 200,
  "status": "OK",
  "message": "Success message",
  "data": {
    "pagination": {
      "total": 100,
      "per_page": 10,
      "current_page": 1,
      "last_page": 10,
      "from": 1,
      "to": 10
    },
    "results": []
  }
}
```

### Error Response
```json
{
  "code": 404,
  "status": "Not Found",
  "message": "Resource not found"
}
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/hellofaizan/quran-api.git
```

2. Install dependencies
```bash
cd quran-api
npm install
```

3. Start the server
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Maintainer

HelloFaizan (mohammadfaizan.in)
