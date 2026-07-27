"use client";

import { FormEvent, useMemo, useState } from "react";
import type { SuiteUser } from "@/lib/session";

type Folder = "inbox" | "starred" | "sent" | "drafts" | "archive" | "trash";

type Message = {
  id: number;
  folder: Exclude<Folder, "starred">;
  sender: string;
  address: string;
  subject: string;
  preview: string;
  paragraphs: string[];
  time: string;
  date: string;
  unread: boolean;
  starred: boolean;
  label?: "Progetto" | "Personale" | "Aggiornamenti";
  attachment?: string;
  accent: string;
};

type Draft = { to: string; subject: string; body: string };

const folders: Array<{ id: Folder; label: string; icon: IconName }> = [
  { id: "inbox", label: "In arrivo", icon: "inbox" },
  { id: "starred", label: "Speciali", icon: "star" },
  { id: "sent", label: "Inviati", icon: "send" },
  { id: "drafts", label: "Bozze", icon: "file" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "trash", label: "Cestino", icon: "trash" },
];

const folderTitles: Record<Folder, string> = {
  inbox: "In arrivo",
  starred: "Speciali",
  sent: "Inviati",
  drafts: "Bozze",
  archive: "Archivio",
  trash: "Cestino",
};

const initialMessages: Message[] = [
  {
    id: 1,
    folder: "inbox",
    sender: "Rizoma",
    address: "Aggiornamento del servizio · esempio",
    subject: "Una ricerca più aperta comincia dai collegamenti",
    preview: "Abbiamo preparato una nuova lettura dei risultati e degli spazi che li connettono.",
    paragraphs: [
      "Ciao, questa è un’anteprima dimostrativa della posta Tecnosocialismo.",
      "Rizoma ha una nuova vista dedicata ai collegamenti fra fonti, idee e documenti. L’obiettivo è rendere la ricerca meno verticale e più facile da esplorare.",
      "Quando il servizio email sarà collegato, qui troverai aggiornamenti reali e potrai rispondere direttamente dalla tua casella.",
    ],
    time: "10:42",
    date: "26 luglio 2026",
    unread: true,
    starred: true,
    label: "Aggiornamenti",
    accent: "#ff5a0a",
  },
  {
    id: 2,
    folder: "inbox",
    sender: "Cloud",
    address: "Il tuo archivio · esempio",
    subject: "Il quaderno condiviso è pronto da aprire",
    preview: "Tre nuovi materiali sono stati raccolti nella cartella Progetti aperti.",
    paragraphs: [
      "Tre nuovi materiali sono stati aggiunti alla cartella dimostrativa Progetti aperti.",
      "Dalla posta potrai aprire documenti, immagini e video senza perdere il messaggio da cui provengono. Questa funzione verrà collegata allo storage in una fase successiva.",
    ],
    time: "09:18",
    date: "26 luglio 2026",
    unread: true,
    starred: false,
    label: "Progetto",
    attachment: "Quaderno aperto.pdf",
    accent: "#7668ff",
  },
  {
    id: 3,
    folder: "inbox",
    sender: "Marta",
    address: "Conversazione dimostrativa",
    subject: "Ci vediamo giovedì per mettere insieme le idee?",
    preview: "Ho riordinato gli appunti dell’ultima riunione, possiamo partire da quelli.",
    paragraphs: [
      "Ciao! Ho riordinato gli appunti dell’ultima riunione e segnato i punti su cui vale la pena tornare.",
      "Se per te va bene, giovedì possiamo rileggerli insieme e trasformarli in una traccia più chiara. Ti mando il documento appena la condivisione sarà attiva.",
      "A presto,\nMarta",
    ],
    time: "Ieri",
    date: "25 luglio 2026",
    unread: false,
    starred: false,
    label: "Personale",
    accent: "#129c83",
  },
  {
    id: 4,
    folder: "inbox",
    sender: "Iskra",
    address: "Assistente · esempio",
    subject: "La tua conversazione è ancora qui",
    preview: "Riprendi il filo sulla tecnologia civica dal punto in cui lo avevi lasciato.",
    paragraphs: [
      "La conversazione dimostrativa sulla tecnologia civica è stata conservata.",
      "In futuro potrai ricevere riepiloghi richiesti da te, continuare su Iskra oppure archiviare tutto nel tuo Cloud con un solo gesto.",
    ],
    time: "Ieri",
    date: "25 luglio 2026",
    unread: false,
    starred: true,
    label: "Aggiornamenti",
    accent: "#ff8a33",
  },
  {
    id: 5,
    folder: "sent",
    sender: "A: gruppo di lavoro",
    address: "Messaggio dimostrativo",
    subject: "Materiali per il laboratorio di sabato",
    preview: "Ho raccolto tutto in una sola cartella, così possiamo commentare insieme.",
    paragraphs: [
      "Ho raccolto i materiali in una sola cartella, così possiamo commentarli insieme prima di sabato.",
      "Questa è posta dimostrativa: nessun messaggio è stato realmente inviato.",
    ],
    time: "23 lug",
    date: "23 luglio 2026",
    unread: false,
    starred: false,
    label: "Progetto",
    accent: "#4667d8",
  },
  {
    id: 6,
    folder: "archive",
    sender: "Quaderno urbano",
    address: "Newsletter dimostrativa",
    subject: "Cinque modi per leggere una città",
    preview: "Mappe, percorsi, racconti e dati pubblici per vedere quello che di solito resta nascosto.",
    paragraphs: [
      "Una città non è solo una mappa: è l’insieme delle persone, dei tempi e dei percorsi che la attraversano.",
      "Questo messaggio serve a mostrare come apparirà una newsletter archiviata nella futura casella.",
    ],
    time: "18 lug",
    date: "18 luglio 2026",
    unread: false,
    starred: false,
    accent: "#d44b69",
  },
  {
    id: 7,
    folder: "trash",
    sender: "Notifica di esempio",
    address: "Messaggio eliminato",
    subject: "Una vecchia notifica",
    preview: "Questo elemento mostra il comportamento del cestino.",
    paragraphs: ["Questo è un messaggio dimostrativo già spostato nel cestino."],
    time: "11 lug",
    date: "11 luglio 2026",
    unread: false,
    starred: false,
    accent: "#88857e",
  },
];

const suiteLinks = [
  { label: "Home", href: "https://tecnosocialismo.com", mark: "T" },
  { label: "Iskra", href: "https://iskra.tecnosocialismo.com/chat", mark: "I" },
  { label: "Rizoma", href: "https://rizoma.tecnosocialismo.com", mark: "R" },
  { label: "Cloud", href: "https://cloud.tecnosocialismo.com", mark: "C" },
  { label: "Mail", href: "https://mail.tecnosocialismo.com", mark: "M", current: true },
  { label: "Video", href: "https://video.tecnosocialismo.com", mark: "V" },
  { label: "Social", href: "https://social.tecnosocialismo.com", mark: "S" },
  { label: "Sport", href: "https://sport.tecnosocialismo.com", mark: "F" },
  { label: "Market", href: "https://market.tecnosocialismo.com", mark: "K" },
  { label: "Lavoro", href: "https://lavoro.tecnosocialismo.com", mark: "L" },
  { label: "Azienda", href: "https://azienda.tecnosocialismo.com", mark: "Z" },
  { label: "Messaggi", href: "https://messaggi.tecnosocialismo.com", mark: "G" },
  { label: "Militant", href: "https://militant.tecnosocialismo.com", mark: "P" },
  { label: "Account", href: "https://login.tecnosocialismo.com", mark: "A" },
];

export function MailApp({ user }: { user: SuiteUser | null }) {
  if (!user) return <Welcome />;
  return <Mailbox user={user} />;
}

function Mailbox({ user }: { user: SuiteUser }) {
  const [messages, setMessages] = useState(initialMessages);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [query, setQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ to: "", subject: "", body: "" });
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasOpenedMessage, setHasOpenedMessage] = useState(false);

  const visible = useMemo(() => {
    const clean = query.trim().toLocaleLowerCase("it");
    return messages.filter((message) => {
      const inFolder = folder === "starred" ? message.starred && message.folder !== "trash" : message.folder === folder;
      if (!inFolder) return false;
      if (!clean) return true;
      return [message.sender, message.subject, message.preview, message.label]
        .filter(Boolean)
        .some((part) => part!.toLocaleLowerCase("it").includes(clean));
    });
  }, [folder, messages, query]);

  const selected = messages.find((message) => message.id === selectedId) ?? visible[0] ?? null;
  const unread = messages.filter((message) => message.folder === "inbox" && message.unread).length;

  function chooseFolder(next: Folder) {
    setFolder(next);
    setQuery("");
    const first = messages.find((message) => next === "starred" ? message.starred && message.folder !== "trash" : message.folder === next);
    setSelectedId(first?.id ?? null);
    setHasOpenedMessage(false);
    setMenuOpen(false);
  }

  function openMessage(message: Message) {
    setSelectedId(message.id);
    setHasOpenedMessage(true);
    if (message.unread) {
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, unread: false } : item));
    }
  }

  function patchSelected(patch: Partial<Message>) {
    if (!selected) return;
    setMessages((current) => current.map((item) => item.id === selected.id ? { ...item, ...patch } : item));
  }

  function moveSelected(nextFolder: Message["folder"], copy: string) {
    if (!selected) return;
    const currentIndex = visible.findIndex((message) => message.id === selected.id);
    const next = visible[currentIndex + 1] ?? visible[currentIndex - 1] ?? null;
    setMessages((current) => current.map((item) => item.id === selected.id ? { ...item, folder: nextFolder } : item));
    setSelectedId(next?.id ?? null);
    showNotice(copy);
  }

  function showNotice(copy: string) {
    setNotice(copy);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function submitCompose(event: FormEvent) {
    event.preventDefault();
    setComposeOpen(false);
    setDraft({ to: "", subject: "", body: "" });
    showNotice("Interfaccia pronta. L’invio reale verrà collegato nella prossima fase.");
  }

  function closeCompose() {
    if (draft.to || draft.subject || draft.body) showNotice("Bozza conservata per questa sessione.");
    setComposeOpen(false);
  }

  return (
    <main className="mail-shell">
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="side-head">
          <a className="wordmark" href="https://tecnosocialismo.com" aria-label="Tecnosocialismo">
            <span className="wordmark-dot" />
            <span>TECNO<br />SOCIALISMO</span>
          </a>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Chiudi menu"><Icon name="close" /></button>
        </div>

        <button className="compose-button" onClick={() => { setComposeOpen(true); setMenuOpen(false); }}>
          <Icon name="edit" /><span>Scrivi</span>
        </button>

        <nav className="folder-nav" aria-label="Cartelle della posta">
          {folders.map((item) => (
            <button key={item.id} className={folder === item.id ? "active" : ""} onClick={() => chooseFolder(item.id)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.id === "inbox" && unread > 0 && <b>{unread}</b>}
              {item.id === "drafts" && (draft.to || draft.subject || draft.body) && <b>1</b>}
            </button>
          ))}
        </nav>

        <section className="labels">
          <p>ETICHETTE</p>
          <button onClick={() => { chooseFolder("inbox"); setQuery("progetto"); }}><i className="label-project" />Progetto</button>
          <button onClick={() => { chooseFolder("inbox"); setQuery("personale"); }}><i className="label-personal" />Personale</button>
          <button onClick={() => { chooseFolder("inbox"); setQuery("aggiornamenti"); }}><i className="label-update" />Aggiornamenti</button>
        </section>

        <section className="suite-links">
          <p>LA SUITE</p>
          <div>{suiteLinks.map((link) => <a className={link.current ? "current" : ""} aria-current={link.current ? "page" : undefined} key={link.label} href={link.href}><span>{link.mark}</span>{link.label}</a>)}</div>
        </section>

        <div className="interface-badge"><i /> Anteprima interfaccia</div>
      </aside>

      {menuOpen && <button className="menu-scrim" aria-label="Chiudi menu" onClick={() => setMenuOpen(false)} />}

      <section className="mail-main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Apri menu"><Icon name="menu" /></button>
          <div className="mobile-logo"><span className="wordmark-dot" /> MAIL</div>
          <label className="search-box">
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca nella posta" />
            {query && <button onClick={() => setQuery("")} aria-label="Cancella ricerca"><Icon name="close" /></button>}
          </label>
          <a className="account-chip" href="https://login.tecnosocialismo.com" title={user.email}>
            <span>{initials(user.name)}</span>
            <div><strong>{user.name}</strong><small>Account unico</small></div>
          </a>
        </header>

        <div className="demo-strip"><span>DEMO</span> Stai esplorando l’interfaccia: nessuna email viene ancora inviata o ricevuta.</div>

        <div className="mail-columns">
          <section className={`message-column ${selected ? "has-selection" : ""}`}>
            <div className="list-head">
              <div><p>POSTA</p><h1>{folderTitles[folder]}</h1></div>
              <button aria-label="Aggiorna" onClick={() => showNotice("La casella dimostrativa è aggiornata.")}><Icon name="refresh" /></button>
            </div>
            <div className="list-tools">
              <button onClick={() => setMessages((current) => current.map((message) => message.folder === folder ? { ...message, unread: false } : message))}><Icon name="check" /> Segna letti</button>
              <span>{visible.length} {visible.length === 1 ? "messaggio" : "messaggi"}</span>
            </div>

            <div className="message-list">
              {visible.length ? visible.map((message) => (
                <button key={message.id} className={`message-row ${message.unread ? "unread" : ""} ${selected?.id === message.id ? "selected" : ""}`} onClick={() => openMessage(message)}>
                  <span className="avatar" style={{ "--avatar": message.accent } as React.CSSProperties}>{initials(message.sender)}</span>
                  <span className="message-content">
                    <span className="message-meta"><strong>{message.sender}</strong><time>{message.time}</time></span>
                    <span className="message-subject">{message.subject}</span>
                    <span className="message-preview">{message.preview}</span>
                    <span className="message-flags">
                      {message.label && <i className={`tag tag-${message.label.toLocaleLowerCase("it")}`}>{message.label}</i>}
                      {message.attachment && <i className="attachment-flag"><Icon name="paperclip" /> 1</i>}
                    </span>
                  </span>
                  <span className="unread-dot" />
                </button>
              )) : (
                <div className="empty-list"><span><Icon name="mail" /></span><strong>Qui non c’è niente.</strong><p>Quando arriveranno nuovi messaggi, li troverai in questo spazio.</p></div>
              )}
            </div>
          </section>

          <section className={`reading-pane ${selected && hasOpenedMessage ? "is-open" : ""}`}>
            {selected ? (
              <>
                <div className="reader-toolbar">
                  <button className="back-button" onClick={() => { setSelectedId(null); setHasOpenedMessage(false); }} aria-label="Torna ai messaggi"><Icon name="back" /></button>
                  <button onClick={() => moveSelected("archive", "Messaggio archiviato.")} title="Archivia"><Icon name="archive" /></button>
                  <button onClick={() => patchSelected({ unread: !selected.unread })} title={selected.unread ? "Segna come letto" : "Segna come da leggere"}><Icon name={selected.unread ? "mailOpen" : "mail"} /></button>
                  <button onClick={() => moveSelected("trash", "Messaggio spostato nel cestino.")} title="Sposta nel cestino"><Icon name="trash" /></button>
                  <span />
                  <button className={selected.starred ? "is-starred" : ""} onClick={() => patchSelected({ starred: !selected.starred })} title="Speciale"><Icon name="star" /></button>
                  <button title="Altre azioni" onClick={() => showNotice("Le altre azioni verranno aggiunte con il servizio reale.")}><Icon name="more" /></button>
                </div>

                <article className="message-reader">
                  <div className="reader-kicker"><span>{selected.label ?? "Messaggio"}</span><time>{selected.date}</time></div>
                  <h2>{selected.subject}</h2>
                  <div className="sender-row">
                    <span className="avatar large" style={{ "--avatar": selected.accent } as React.CSSProperties}>{initials(selected.sender)}</span>
                    <div><strong>{selected.sender}</strong><small>{selected.address}</small></div>
                    <button onClick={() => { setDraft({ to: selected.sender, subject: `Re: ${selected.subject}`, body: "" }); setComposeOpen(true); }}><Icon name="reply" /> Rispondi</button>
                  </div>
                  <div className="reader-body">
                    {selected.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    {selected.attachment && (
                      <button className="attachment-card" onClick={() => showNotice("L’apertura degli allegati verrà collegata al Cloud.")}>
                        <span>PDF</span><div><strong>{selected.attachment}</strong><small>Documento dimostrativo · 2,4 MB</small></div><Icon name="download" />
                      </button>
                    )}
                  </div>
                  <div className="reader-actions">
                    <button onClick={() => { setDraft({ to: selected.sender, subject: `Re: ${selected.subject}`, body: "" }); setComposeOpen(true); }}><Icon name="reply" /> Rispondi</button>
                    <button onClick={() => { setDraft({ to: "", subject: `Fwd: ${selected.subject}`, body: "" }); setComposeOpen(true); }}><Icon name="forward" /> Inoltra</button>
                  </div>
                </article>
              </>
            ) : (
              <div className="reader-empty"><span><Icon name="spark" /></span><p>Apri un messaggio<br />per leggerlo qui.</p></div>
            )}
          </section>
        </div>
      </section>

      {composeOpen && (
        <div className="compose-layer">
          <button className="compose-scrim" aria-label="Chiudi nuovo messaggio" onClick={closeCompose} />
          <form className="compose-window" onSubmit={submitCompose}>
            <header><div><span className="wordmark-dot" /><strong>Nuovo messaggio</strong></div><button type="button" onClick={closeCompose} aria-label="Chiudi"><Icon name="close" /></button></header>
            <label><span>A</span><input type="text" value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} placeholder="Nome o indirizzo" required /></label>
            <label><span>Oggetto</span><input type="text" value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} placeholder="Di cosa vuoi parlare?" required /></label>
            <textarea value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Scrivi qui…" required />
            <footer>
              <div><button type="button" title="Allega" onClick={() => showNotice("Gli allegati verranno collegati al Cloud.")}><Icon name="paperclip" /></button><button type="button" title="Formattazione"><Icon name="text" /></button></div>
              <span>Invio disattivato nella demo</span>
              <button className="send-button" type="submit">Invia <Icon name="send" /></button>
            </footer>
          </form>
        </div>
      )}

      {notice && <div className="toast" role="status"><Icon name="spark" />{notice}</div>}
    </main>
  );
}

function Welcome() {
  const loginUrl = `https://login.tecnosocialismo.com?returnTo=${encodeURIComponent("https://mail.tecnosocialismo.com")}`;
  return (
    <main className="welcome-shell">
      <nav className="welcome-nav">
        <a className="welcome-brand" href="https://tecnosocialismo.com"><span className="wordmark-dot" /><strong>TECNOSOCIALISMO</strong></a>
        <div><span>MAIL · INTERFACCIA ALFA</span><SuiteMenu /></div>
      </nav>
      <section className="welcome-copy">
        <p className="eyebrow">UN POSTO PER PARLARSI</p>
        <h1>La posta torna<br /><em>alle persone.</em></h1>
        <p>Chiara, calma, connessa agli strumenti che usi. Questa è la prima anteprima della posta Tecnosocialismo.</p>
        <a className="welcome-cta" href={loginUrl}>Entra con il tuo account <Icon name="arrow" /></a>
        <small><i /> Interfaccia dimostrativa · invio e ricezione arriveranno dopo</small>
      </section>
      <section className="welcome-visual" aria-label="Anteprima della posta">
        <div className="visual-grid" />
        <div className="mail-orbit orbit-a" /><div className="mail-orbit orbit-b" />
        <div className="envelope"><span className="envelope-flap" /><i className="spark-core" /></div>
        <article className="floating-mail floating-one"><span>R</span><div><b>Rizoma</b><small>Nuovi collegamenti da esplorare</small></div><time>ora</time></article>
        <article className="floating-mail floating-two"><span>C</span><div><b>Cloud</b><small>Un documento condiviso con te</small></div><time>ieri</time></article>
        <div className="signal signal-one" /><div className="signal signal-two" /><div className="signal signal-three" />
      </section>
      <footer className="welcome-footer"><span>Un solo account</span><span>Connessa alla suite</span><span>Progettata in Italia</span></footer>
    </main>
  );
}

function SuiteMenu() {
  return <details className="welcome-suite"><summary>Servizi <span>＋</span></summary><div>{suiteLinks.map((link) => <a className={link.current ? "current" : ""} aria-current={link.current ? "page" : undefined} href={link.href} key={link.label}><i>{link.mark}</i>{link.label}<b>↗</b></a>)}</div></details>;
}

type IconName = "archive" | "arrow" | "back" | "check" | "close" | "download" | "edit" | "file" | "forward" | "inbox" | "mail" | "mailOpen" | "menu" | "more" | "paperclip" | "refresh" | "reply" | "search" | "send" | "spark" | "star" | "text" | "trash";

const iconPaths: Record<IconName, React.ReactNode> = {
  archive: <><path d="M4 7h16"/><path d="M5 7v13h14V7"/><path d="M3 3h18v4H3z"/><path d="M9 11h6"/></>,
  arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
  back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
  check: <><path d="m4 12 4 4L20 5"/></>,
  close: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
  download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  file: <><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5"/></>,
  forward: <><path d="m15 17 5-5-5-5"/><path d="M20 12H9a5 5 0 0 0-5 5v2"/></>,
  inbox: <><path d="M4 4h16v16H4z"/><path d="m4 13 4-3h8l4 3"/><path d="M8 13a4 4 0 0 0 8 0"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></>,
  mailOpen: <><path d="m3 9 9-6 9 6v11H3z"/><path d="m3 10 9 6 9-6"/></>,
  menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  paperclip: <path d="m21 11-8 8a6 6 0 0 1-8-8l9-9a4 4 0 0 1 6 6l-9 9a2 2 0 0 1-3-3l8-8"/>,
  refresh: <><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M18 12a6 6 0 0 0-10-4L4 12"/><path d="M6 12a6 6 0 0 0 10 4l4-4"/></>,
  reply: <><path d="m9 17-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v2"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  spark: <><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/></>,
  star: <path d="m12 2.5 3 6.1 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1Z"/>,
  text: <><path d="M5 7V4h14v3"/><path d="M9 20h6"/><path d="M12 4v16"/></>,
  trash: <><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m6 7 1 14h10l1-14"/></>,
};

function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{iconPaths[name]}</svg>;
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase("it") || "TS";
}
