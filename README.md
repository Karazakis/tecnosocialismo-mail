# Tecnosocialismo Mail

Interfaccia della futura posta della suite Tecnosocialismo.

## Stato

- accesso tramite l'account unico della suite;
- interfaccia responsive per desktop e mobile;
- cartelle, ricerca, lettura e composizione dimostrative;
- nessun invio o ricezione reale in questa fase.

## Sviluppo

```bash
pnpm install
pnpm dev
```

Per visualizzare localmente la casella completa senza una sessione attiva:

```bash
MAIL_INTERFACE_PREVIEW=true pnpm dev
```

In produzione `MAIL_INTERFACE_PREVIEW` deve rimanere disattivata.
