# Redaction and unredaction challenge

[Version en espanol](README.md)

This repository contains only the challenge solution. The API exposes two endpoints:

1. `POST /api/challenge/redact`
2. `POST /api/challenge/unredact`

## Structure

1. `api/src/controllers/challengeController.js`: receives the HTTP requests.
2. `api/src/services/redactionService.js`: contains the parsing, redaction, and restoration logic.
3. `api/src/routes/challengeRoutes.js`: defines the public routes.
4. `api/src/app.js`: builds the Express application.
5. `api/src/server.js`: starts the server.

## Requirements

1. Node.js 18 or higher.
2. npm.

## Installation

Go into the `api` folder and run:

```bash
npm install
```

## Run

Start the server with:

```bash
node src/server.js
```

By default, it listens on:

1. `http://localhost:3000`

## Quick test

### Using Postman

This repository includes a ready-to-use collection in [Challenges.postman_collection.json](Challenges.postman_collection.json).

Steps:

1. Import [Challenges.postman_collection.json](Challenges.postman_collection.json) into Postman.
2. Start the API with `node src/server.js` from [api](api).
3. Run the redact request.
4. Copy the key from the response and replace it in the unredact request body.
5. Run unredact and confirm the original text is restored.

### Redact

Send a `POST` request to `http://localhost:3000/api/challenge/redact` with a JSON body like this:

```json
{
  "censoredTerms": "\"Project Falcon\", confidential, 'internal use only'",
  "documentText": "Project Falcon is confidential. This file is for internal use only."
}
```

Expected response:

```json
{
  "redactedText": "XXXX is XXXX. This file is for XXXX.",
  "parsedTerms": [
    "internal use only",
    "Project Falcon",
    "confidential"
  ],
  "key": "8CBEC5037D23930B"
}
```

### Unredact

Using the `key` returned by the previous endpoint and the `redactedText` in `documentText`, send a `POST` request to `http://localhost:3000/api/challenge/unredact`:

```json
{
  "key": "8CBEC5037D23930B",
  "documentText": "XXXX is XXXX. This file is for XXXX."
}
```

Expected response:

```json
{
  "unredactedText": "Project Falcon is confidential. This file is for internal use only."
}
```

## Notes

1. The generated key is only stored in memory. A production-ready version should persist it in a secure storage mechanism.
2. The unredact request in the collection includes a sample key; you must replace it with the real key returned by redact.