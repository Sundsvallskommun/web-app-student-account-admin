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
