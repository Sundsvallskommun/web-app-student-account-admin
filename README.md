# Projektnamn

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

APIerna och deras versioner definieras i [`backend/src/config/api-config.ts`](backend/src/config/api-config.ts).

| API                | Version | Används till                                                      |
| ------------------ | ------: | ----------------------------------------------------------------- |
| pupilAccountManager |     1.0 | Skolor, klasser, elever, lösenord, aktivera/inaktivera, resurser |
| education          |     2.0 | Skoldata (skolenheter, klasser, elevinfo, skolplaceringar)        |
| employee           |     2.0 | Elev-/personbild                                                  |
| simulatorserver    |     2.0 | Health check                                                      |

> **Obs!** `pupilAccountManager` har en camelCase-slug och finns på den interna gatewayen (`api-i-test.sundsvall.se`).

### Datakontrakt (TypeScript-typer)

Typerna för API-svaren genereras från respektive APIs OpenAPI-spec och hamnar i `backend/src/data-contracts/<api>/`. Generera om dem när ett API ändras eller en version bumpas i `api-config.ts`:

```
cd backend
yarn generate:contracts
```

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg för steg

1. Klona ner repot.

```
git clone git@github.com:Sundsvallskommun/web-app-student-account-admin.git
```

2. Installera dependencies för både `backend` och `frontend`

```
cd frontend
yarn install

cd backend
yarn install
```

3. Skapa .env-fil för `frontend`

```
cd frontend
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, du måste ha en applikation från WSO2-portalen
- `MUNICIPALITY_ID` anger kommun (Sundsvall = `2281`) och används som sökväg i API-anropen
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

### Session-hantering (Memory / File / Redis)

Backend använder `express-session` för sessionshantering. Session store väljs via miljövariabeln `SESSION_STORE`.

| Värde    | Beskrivning                          | Rekommenderad miljö   |
| -------- | ------------------------------------ | --------------------- |
| `memory` | In-memory store (default)            | Lokal utveckling      |
| `file`   | Filbaserad store (`./data/sessions`) | Lokal test / legacy   |
| `redis`  | Redis-baserad store                  | OpenShift / multi-pod |

I OpenShift används Redis för sessioner, vilket gör backend stateless så att flera poddar kan köras. Med Redis delas även OAuth-token mot API-gatewayn mellan poddarna via Redis (`src/services/api-token-service/redis-api-token.service.ts`). Alla nycklar i Redis prefixas med `REDIS_KEY_PREFIX` (default `student-account-admin`), så att flera applikationer kan dela en Redis-instans utan att krocka.

Följande miljövariabler sätts via Deployment / Helm / ArgoCD:

```
SESSION_STORE=redis
REDIS_HOST=<redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<secret>
# REDIS_KEY_PREFIX=student-account-admin
```

Redis initieras endast när `SESSION_STORE=redis` (`src/utils/initRedis.ts`). Saknas `REDIS_HOST` när Redis är vald kraschar applikationen direkt vid start med:

```
Failed to start app: Error: SESSION_STORE=redis but REDIS_HOST is not set
```

Health-endpointen `/health/up` svarar `503` tills Redis-klienten är redo, så den kan användas som readiness-probe. Lokal utveckling kräver ingen Redis, samma kodbas används i alla miljöer.
