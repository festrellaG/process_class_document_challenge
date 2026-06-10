# Challenge de redaction and unredaction

[English version](README.en.md)

Este repositorio contiene solo la solucion del challenge. La API expone dos endpoints:

1. `POST /api/challenge/redact`
2. `POST /api/challenge/unredact`

## Estructura

1. `api/src/controllers/challengeController.js`: recibe las peticiones HTTP.
2. `api/src/services/redactionService.js`: contiene la logica de parseo, redaccion y restauracion.
3. `api/src/routes/challengeRoutes.js`: define las rutas publicas.
4. `api/src/app.js`: arma la aplicacion Express.
5. `api/src/server.js`: arranca el servidor.

## Requisitos

1. Node.js 18 o superior.
2. npm.

## Instalacion

Entra a la carpeta `api` y ejecuta:

```bash
npm install
```

## Ejecucion

Levanta el servidor con:

```bash
node src/server.js
```

Por defecto escucha en:

1. `http://localhost:3000`

## Prueba rapida

### Redactar

Envía un `POST` a `http://localhost:3000/api/challenge/redact` con un JSON como este:

```json
{
  "censoredTerms": "\"Project Falcon\", confidential, 'internal use only'",
  "documentText": "Project Falcon is confidential. This file is for internal use only."
}
```

Respuesta esperada:

{
    "redactedText": "XXXX is XXXX. This file is for XXXX.",
    "parsedTerms": [
        "internal use only",
        "Project Falcon",
        "confidential"
    ],
    "key": "8CBEC5037D23930B"
}

### Desredactar

Con la `key` devuelta por el endpoint anterior y el redactedText agregar en documentText, envía un `POST` a `http://localhost:3000/api/challenge/unredact`:

```json
{
  "key": "8CBEC5037D23930B",
  "documentText": "XXXX is XXXX. This file is for XXXX."
}
```

Respuesta esperada:

{
    "unredactedText": "Project Falcon is confidential. This file is for internal use only."
}

## Notas

1. La key que se genera es unicamente en memoria, se tendria que implementar otra solución para guardarla en otro lado de forma
segura
