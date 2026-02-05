# IONOS: Website auf Cloud Server (Data Center + Canvas) deployen

Diese Anleitung beschreibt den **kompletten Ablauf**: Domain vom WP-Hosting trennen (ohne Vertrag zu kündigen) → IONOS Cloud (Data Center mit Canvas) anlegen → Website hochladen → Domain mit dem neuen Server verbinden.

**Sehr detaillierte Schritt-für-Schritt-Anleitung (alles übernommen):** [DEPLOYMENT-SCHRITT-FUER-SCHRITT.md](DEPLOYMENT-SCHRITT-FUER-SCHRITT.md) – dort finden Sie z. B. genau: **vCPU → rechts → Netzwerk → Primäre IPv4**, Firewall, SSH, Apache, PHP, `.env.deploy`, Deploy-Skript, DNS und optional SSL.

**Sicherheit:** Keine Passwörter, API-Keys oder Tokens in den Chat oder in öffentliche Dateien eintragen. Alle Zugangsdaten gehören in die lokale Datei **`.env.deploy`** (wird nicht ins Git übernommen).

---

## Von Anfang an – Ihre Situation (ki-prozessnavigator.de)

**Ausgangslage:** Die WP-Host-Website ist zurückgesetzt, die Domain **ki-prozessnavigator.de** ist frei. Als Nächstes legen Sie im **DCD (Data Center Designer)** von IONOS einen **vCPU Server** an und verbinden die Domain später mit der Server-IP.

**Erster Schritt im DCD: vCPU anlegen – HDD oder SSD?**

| | **SSD** | **HDD** |
|---|--------|--------|
| **Geschwindigkeit** | Deutlich schneller (Lese-/Schreibzugriffe) | Langsamer |
| **Für schnelle Website** | **Empfohlen:** schnellere Ladezeiten, bessere Antwortzeiten für PHP und Webserver | Reicht für wenig Traffic, aber Seiten reagieren träger |
| **Kosten** | Teurer pro GB | Günstiger pro GB |
| **Größe für diese Website** | **30–50 GB** reichen für statische Seite + PHP | Wenn HDD: ähnliche Größe, aber langsamer |

**Empfehlung für ki-prozessnavigator.de (schnelle Website):** **SSD** wählen – z. B. **30–40 GB SSD** als Boot-Volume mit Ubuntu-Image. Damit ist die Seite schnell und der Aufpreis gegenüber HDD meist überschaubar. HDD nur, wenn das Budget sehr knapp ist und etwas langsamere Ladezeiten akzeptabel sind.

**Grober Ablauf danach (detailliert in den Phasen unten):**

1. **DCD:** Data Center mit Canvas anlegen → **vCPU Server** auf Canvas ziehen → mit **Internetzugang** verbinden (→ öffentliche IP).
2. **Storage:** **SSD-Storage** hinzufügen, Image **Ubuntu 22.04** wählen, **„Von Gerät booten“** ankreuzen, Passwort und/oder SSH-Key eintragen.
3. **Provision** starten → warten bis „Running“ → **IP notieren**.
4. **Server** per SSH einrichten (Webserver, Webroot, optional PHP).
5. **Lokal:** `.env.deploy` mit der IP ausfüllen, Deploy-Skript ausführen.
6. **Domain:** In IONOS unter **Domain & SSL** → **ki-prozessnavigator.de** → **DNS** den A-Record auf die **öffentliche IP** des vCPU Servers setzen.

---

## Muss ich die aktuelle Website löschen und die Domain trennen?

**Kurz:** Sie müssen die alte Website nicht manuell „zurücksetzen“ oder „löschen“. Sie **trennen nur die Domain vom WordPress-Hosting** (oder beenden das Hosting), damit die Domain auf die neue Server-IP zeigen kann. Die **Domain** bleibt bei IONOS; Sie ändern nur, **wohin** sie zeigt (per DNS).

### Wichtig: Domains im gleichen Vertrag wie WP Hosting

**Wenn Ihre Domain(en) im WP Hosting Start-Vertrag enthalten sind** (z. B. 4 Domains in einem Paket): **Kündigen Sie den Vertrag nicht.** Sie würden sonst Domain und Hosting gemeinsam verlieren.

Stattdessen:

- **Domain vom Hosting trennen:** In IONOS die Domain, die aktuell mit dem WordPress-Hosting verbunden ist, **vom Hosting „abkoppeln“** (Domain-Zuweisung zum WP-Hosting aufheben). Die Domain bleibt im Vertrag, zeigt aber nicht mehr auf die alte WordPress-Instanz.
- **Dann:** DNS A-Records (Phase 5) auf die neue Server-IP setzen.

Der Vertrag mit Ihren Domains bleibt bestehen; nur die **Zuordnung** der einen Domain zum WordPress-Hosting entfällt. So behalten Sie alle Domains und wechseln nur den „Ort“ der Website.

### Was passiert konkret?

| Frage | Antwort |
|-------|--------|
| **Alte Website löschen?** | Nein. Wenn Sie nur die **Domain vom Hosting trennen**, bleibt die WordPress-Instanz vorübergehend bestehen, zeigt aber nicht mehr Ihre Domain. Wenn Sie das Hosting später kündigen, entfällt der Speicher – manuelles Löschen ist nicht nötig. |
| **Website „zurücksetzen“?** | Nein. Sie wechseln nur den Ort: von WP Hosting auf den neuen Cloud Server. |
| **Domain „disconnecten“?** | **Nicht den Vertrag kündigen.** Die Domain bleibt bei IONOS (im bestehenden Vertrag). Sie **trennen nur die Zuordnung** der Domain zum WP-Hosting („Domain vom Hosting trennen“). Anschließend setzen Sie die DNS-Einträge so, dass die Domain auf die neue Server-IP zeigt. |
| **Reihenfolge?** | Erst **neuen Server aufsetzen** und **Website deployen** (Phase 2, 3, 4). Dann **Domain vom Hosting trennen** (Phase 1), danach **DNS umstellen** (Phase 5). So kurze Ausfallzeit. |

### Empfohlene Reihenfolge (ohne lange Ausfallzeit)

1. **Zuerst:** Data Center mit Canvas anlegen, VPS bauen, Website deployen (Phase 2, 3, 4).
2. **Dann:** Domain vom WP-Hosting trennen (Phase 1) – **nicht** den ganzen Vertrag kündigen, wenn die Domains darin enthalten sind.
3. **Zum Schluss:** DNS A-Records auf die neue Server-IP setzen (Phase 5).

So ist die neue Website fertig; Sie schalten nur die Domain um und behalten Ihren Vertrag inkl. aller Domains.

---

## Übersicht der Phasen

| Phase | Kurzbeschreibung |
|-------|------------------|
| 1 | Domain vom WP-Hosting trennen (Domain-Zuordnung aufheben; Vertrag nicht kündigen, wenn Domains darin sind) |
| 2 | IONOS Cloud: Data Center mit Canvas erstellen, **vCPU Server** anlegen, mit Internetzugang verbinden → **öffentliche IP** erhalten |
| 3 | Server vorbereiten (Webroot, Webserver, optional PHP) |
| 4 | Lokal: `.env.deploy` anlegen und Deploy-Skript ausführen |
| 5 | **Domain mit der Server-IP verbinden:** DNS A-Record(s) auf die öffentliche IP des vCPU Servers setzen |

---

## Phase 1: Domain von WP Hosting Start freigeben

Die Domain liegt aktuell am **WP Hosting Start**-Paket. Damit sie auf Ihren neuen IONOS Cloud Server zeigen kann, muss die **Zuordnung zum WordPress-Hosting** aufgehoben werden.

### Option A (empfohlen, wenn Domains im Vertrag sind): Domain vom Hosting trennen

**Wenn Ihre Domains im WP Hosting Start-Vertrag enthalten sind** (z. B. mehrere Domains in einem Paket): **Nicht kündigen.** Nur die Domain, die auf die neue Website zeigen soll, vom WordPress-Hosting „trennen“.

1. Im **IONOS Kundenbereich** anmelden: [my.ionos.com](https://my.ionos.com).
2. **Hosting & WordPress** (oder **Verträge**) → Ihr **WP Hosting Start**-Paket auswählen.
3. Die **Domain**, die aktuell mit dem WordPress-Hosting verbunden ist, finden (Domain-Zuordnung / verknüpfte Domain).
4. **Domain vom Hosting trennen** („Zuordnung aufheben“, „Domain entfernen“ o. ä. – Bezeichnung kann bei IONOS variieren). Damit zeigt die Domain nicht mehr auf die alte WordPress-Instanz; sie bleibt aber im Vertrag und ist unter **Domain & SSL** weiter nutzbar.
5. In **Phase 5** die DNS A-Records dieser Domain auf die neue Server-IP setzen.

So behalten Sie den Vertrag inkl. aller Domains und wechseln nur, wohin die eine Domain zeigt.

### Über die „Projekteinstellungen“ (wie in Ihrem Kundenbereich)

In den **Projekteinstellungen** Ihres WordPress-Projekts (Projektname, Domain, Vertrag „WordPress Hosting Start“) haben Sie zwei relevante Punkte:

- **Domain (mit den drei Punkten …)**  
  Über die drei Punkte neben der Domain (z. B. `ki-prozessnavigator.de`) können Sie die Domain vom Projekt **trennen** (Domain-Zuordnung zum WordPress-Hosting aufheben). Die Domain bleibt im Vertrag und ist danach unter **Domain & SSL** weiter nutzbar – **dort können Sie weiterhin die DNS-Einträge bearbeiten** und den A-Record auf die neue Server-IP setzen.

- **Website deinstallieren**  
  Damit löschen Sie die WordPress-Website inkl. aller Daten auf dem Hosting. Der **Vertrag** (und damit Ihre Domains) bleibt bestehen. Nach dem Deinstallieren ist die Domain nicht mehr mit einer laufenden WordPress-Instanz verbunden; Sie können die Domain danach wie gewohnt per DNS auf Ihren Cloud Server zeigen.

**Nach dem Deinstallieren: „Domain zurücksetzen“**  
Unter **Domain & SSL** → Ihre Domain (z. B. `ki-prozessnavigator.de`) sehen Sie u. a. **„Domain zurücksetzen“** mit dem Link **„Verwendungsart oder DNS zurücksetzen“**. **Ja – diesen Schritt sollten Sie ausführen:** Damit setzt IONOS Verwendungsart und DNS der Domain in einen neutralen Zustand; die Domain bleibt im Vertrag, zeigt aber nicht mehr auf das alte (gelöschte) WordPress. Danach gehen Sie auf **„DNS-Einstellungen anpassen“** und tragen den **A-Record** auf die **öffentliche IP Ihres Cloud-Servers** ein (Phase 5). Ohne Zurücksetzen kann die Domain noch an die alte Hosting-Konfiguration gebunden sein.

**„Beides zurücksetzen“ – lösche ich die Domain?**  
Nein. Auf der Seite **„Domain-Einstellungen zurücksetzen“** werden nur die **Verknüpfungen zu externen Diensten** (z. B. „Domain Verification“, „Gmail Setup“) aufgehoben; die zugehörigen DNS-Einträge werden entfernt. Die **Domain selbst wird nicht gelöscht** – sie bleibt bei IONOS im Vertrag und registriert. Sie können **beide Einträge** (beide Checkboxen) auswählen und zurücksetzen; danach ist die Domain „neutral“ und Sie tragen den A-Record auf Ihre neue Server-IP ein. **Hinweis:** Wenn Sie die Domain für E-Mail mit Gmail/Google Workspace nutzen, werden die Gmail-DNS-Einträge entfernt – E-Mail kann danach eingeschränkt sein, bis Sie die MX-/SPF-Einträge für Gmail ggf. wieder eintragen.

**Reihenfolge, die Sie beschreiben:**  
Sie können zuerst **Website deinstallieren** und die **Domain trennen** (über die drei Punkte), dann den **Cloud Server** aufsetzen und die neue Website deployen, und **zum Schluss** unter **Domain & SSL** → Ihre Domain → **DNS** den A-Record auf die neue Server-IP eintragen. **Ja – DNS eintragen geht danach uneingeschränkt:** Die Domain bleibt in Ihrem IONOS-Vertrag; Sie ändern nur das Ziel der Domain (per A-Record).

**Noch kürzere Ausfallzeit:** Wenn Sie möchten, können Sie zuerst den Cloud Server bauen und die neue Website deployen, **dann** Website deinstallieren + Domain trennen, **dann** DNS umstellen. Dann wechselt die Domain nahtlos von der alten auf die neue Seite.

### Option B: Nur das WordPress-Hosting beenden (wenn Domain getrennt buchbar ist)

Falls Ihre Domain **nicht** im gleichen Vertrag wie das Hosting liegt (z. B. Domain separat unter „Domain & SSL“):

1. **Menü → Mein Konto → Verträge & Abos**.
2. Den **WP Hosting Start**-Vertrag (nur das Hosting-Produkt) auswählen.
3. **Nur den Hosting-Vertrag** kündigen (nicht „Gesamten Vertrag“, sonst können Domains mit betroffen sein).
4. Nach Ablauf ist die Domain nicht mehr an dieses Hosting gebunden; DNS in Phase 5 auf die neue Server-IP setzen.

### Option C: Domain in einen anderen Vertrag verschieben

Falls die Domain beim Ändern/Kündigen des Hostings mit betroffen wäre, können Sie in **Domain & SSL** prüfen, ob die Domain in einen anderen IONOS-Vertrag verschoben werden kann. Dazu ggf. IONOS Support nutzen („Domain mit Hosting umziehen“).

### Google Workspace / E-Mail mit der IONOS-Domain

**Bekommen Sie Probleme mit Google Workspace?** Nein – **nicht dauerhaft**. Die Domain bleibt bei Google Workspace verifiziert. Entscheidend ist: Nach dem Zurücksetzen der Domain-Einstellungen bei IONOS („Gmail Setup“ / „Domain Verification“) entfernt IONOS die zugehörigen **DNS-Einträge** (MX, SPF, DKIM). E-Mail funktioniert dann so lange nicht zuverlässig, bis Sie diese Einträge **wieder bei IONOS eintragen**.

**Was Sie tun müssen:**

1. **A-Record** für die Website auf die neue Cloud-Server-IP setzen (Phase 5).
2. **Google-Workspace-DNS wieder eintragen** unter **Domain & SSL** → Ihre Domain → **DNS**:
   - **MX-Einträge** (wie im Google Admin angezeigt, z. B. auf die Google-Mail-Server),
   - **SPF** (TXT-Eintrag, falls Sie ihn nutzen),
   - **DKIM** (TXT-Eintrag aus dem Google Admin unter „Authentifizierung“ / Domains).

**Wo Sie die Werte finden:** [Google Admin](https://admin.google.com) → **Konto** → **Domains** → Ihre Domain → Anleitung zu DNS-Einträgen bzw. die konkreten Werte anzeigen.

**Ergebnis:** Website zeigt auf Ihren Cloud-Server, E-Mail läuft weiter über Google Workspace – beides gleichzeitig über dieselbe Domain ist unproblematisch. Sie lösen die Domain nicht von Google Workspace; Sie stellen nur bei IONOS (dem DNS-Anbieter) wieder die gleichen Mail-Einträge ein.

### Vor der Kündigung

- **Backup:** Falls Sie WordPress-Inhalte noch brauchen, vorher per FTP/SFTP und Datenbank-Export sichern.
- **E-Mails:** Wenn die Domain für E-Mail genutzt wird (z. B. Google Workspace), nach dem Zurücksetzen der Domain die MX-/SPF-/DKIM-Einträge bei IONOS wieder eintragen (siehe Abschnitt „Google Workspace / E-Mail mit der IONOS-Domain“).

---

## Phase 2: IONOS Cloud – Data Center mit Canvas und Server anlegen

Sie haben zwei Wege, um einen Server zu bekommen, auf den Sie per SSH/SCP deployen können:

- **Weg 1 (klassisch):** IONOS Cloud Server (VPS) über **Servers & Cloud** im Kundenbereich bestellen.
- **Weg 2 (DCD/Canvas):** Im **Data Center Designer (DCD)** ein Data Center im **Canvas-Modus** anlegen und darin eine VM (Compute Engine) erstellen.

Beide Wege liefern eine **öffentliche IP** und **SSH-Zugang**. Das Deploy-Skript nutzt genau das (Host, User, Webroot).

### Weg 1: Klassischer IONOS Cloud Server (VPS)

1. Anmeldung: [my.ionos.com](https://my.ionos.com) → **Servers & Cloud**.
2. **Infrastructure → Server → Create → Cloud Server**.
3. Servername, Konfiguration (z. B. kleinste sinnvolle Größe für eine statische Seite), **Image**: z. B. **Ubuntu**.
4. **Data Center / Region** wählen (z. B. Deutschland für DSGVO-Nähe).
5. **Public IP** zuweisen (neu oder vorhanden).
6. **Passwort** setzen und optional **SSH-Key** hinterlegen (empfohlen).
7. **Create** → Server wird angelegt. **IP-Adresse** und Zugangsdaten notieren (für `.env.deploy`: `IONOS_HOST` = IP oder Hostname).

### Weg 2: Data Center mit Canvas (DCD) – vCPU Server Schritt für Schritt

---

**Sie sind hier: vCPU ist mit Internetzugang verbunden (über LAN 1).**

Auf dem Canvas sehen Sie: **Internetzugang** → **LAN 1** → **vCPU Server** (z. B. „Unbenannter vC“, 4 vCPUs, 16 GB RAM, HDD 0 MB | SSD 0 MB). Danach geht es so weiter:

| Schritt | Was Sie tun |
|--------|--------------|
| **1. VM konfigurieren** | Auf den **vCPU Server** (die Box auf dem Canvas) klicken – oder auf den **blauen Pfeil-Button** (→) am Server. **Tab „Einstellungen“:** Name (z. B. „ki-prozessnavigator-web“), Größe (vCPU/RAM), ggf. Passwort oder SSH-Key. **Tab „Storage“:** Dort **Betriebssystem Ubuntu** festlegen – HDD- oder SSD-Volume hinzufügen/auswählen und als **Image** **Ubuntu** wählen (Boot-Volume). **Speichern.** |
| **2. Optional: Speicher** | Für eine kleine Website reicht es oft ohne extra Speicher. Wenn Sie mehr Platz brauchen: Aus der **Palette** links **HDD Storage** oder **SSD Storage** auf den Canvas ziehen und mit dem vCPU Server verbinden. |
| **3. Provision starten** | Auf den **blauen Play-Button** (▶) am vCPU Server klicken (oder oben **Provision** wählen). Bestätigen. Der Server wird jetzt erstellt und gestartet. |
| **4. Warten & IP notieren** | Einige Minuten warten, bis der Status „Running“ ist. Dann die **öffentliche IP** des Servers anzeigen lassen (beim vCPU-Element oder in der Übersicht) und **aufschreiben** – diese IP brauchen Sie für Deploy und für die Domain (DNS). |

Danach: Phase 3 (Server per SSH einrichten), Phase 4 (Deploy mit `.env.deploy`), Phase 5 (Domain in IONOS auf diese IP zeigen).

---

#### 2.1 Data Center anlegen

1. **Data Center Designer (DCD)** öffnen: [dcd.ionos.com](https://dcd.ionos.com).
2. Mit Ihrem IONOS-Account anmelden (E-Mail + Passwort, ggf. 2FA).
3. Links: **Virtual Data Centers** → Erstellmodus auf **Canvas** stellen (Dropdown „Create in Canvas“).
4. **Create in Canvas** klicken.
5. **Name** (z. B. „KI-Prozessnavigator“), **Region** wählen (z. B. Deutschland).
6. Optional: **Create default network security group** aktivieren.
7. **Create** → Ein leeres Data Center mit **Canvas** (Workspace) wird angelegt.

#### 2.2 vCPU Server auf dem Canvas aufbauen (IP entsteht durch Verbindung mit Internetzugang)

Im Workspace sehen Sie links die **Palette** und in der Mitte den **Canvas**. Oft ist bereits **„Internetzugang“** platziert – daran verbinden Sie den **vCPU Server**, damit er eine **öffentliche IP** bekommt. Diese IP brauchen Sie für Deploy (`.env.deploy`) und für die **DNS-Verbindung mit Ihrer Domain** (Phase 5).

**Schritt A – vCPU Server auf den Canvas ziehen**

1. In der **Palette** (linke Seitenleiste) nach **„vCPU Server“** suchen.
2. **vCPU Server** per **Drag & Drop** auf den Canvas ziehen und neben „Internetzugang“ ablegen.
3. Das Element können Sie jederzeit verschieben (Hinweis unten: „Dieses Element können Sie verschieben“).

**Schritt B – Internetzugang verbinden (= öffentliche IP erzeugen)**

1. Das **„Internetzugang“**-Element hat einen **grünen Verbindungspunkt**.
2. **Verbinden:** Von diesem Punkt eine Linie zum **vCPU Server** ziehen (oder umgekehrt).
3. Durch diese Verbindung erhält der vCPU Server eine **öffentliche IP**. Ohne Verbindung mit Internetzugang gibt es keine öffentliche IP.
4. **Diese IP später notieren** – sie ist Ihr `IONOS_HOST` und der **Zielwert für den DNS A-Record** Ihrer Domain (Phase 5).

**Schritt C – Optional: Speicher**

- Für eine kleine Website reicht der Standard-Speicher der VM.
- Falls Sie mehr Platz brauchen: Aus der Palette **„HDD Storage“** oder **„SSD Storage“** auf den Canvas ziehen und mit dem vCPU Server verbinden.

**Schritt D – vCPU Server konfigurieren**

1. Auf den **vCPU Server** auf dem Canvas klicken (oder auf den **blauen Pfeil-Button** → neben dem Server).
2. **Tab „Einstellungen“:** Name (z. B. „ki-prozessnavigator-web“), Größe (vCPU/RAM) anpassen, ggf. Passwort oder SSH-Key.
3. **Tab „Storage“:** Hier legen Sie das **Betriebssystem (Ubuntu)** fest. Ein **HDD-** oder **SSD-Volume** zum vCPU Server hinzufügen (oder vorhandenes auswählen) und als **Image** **Ubuntu** wählen – dieses Volume ist dann das Boot-Volume. Ohne Storage mit Image kann der Server nicht starten.
4. **Speichern.** Die öffentliche IP bekommt der Server automatisch durch die Verbindung mit Internetzugang/LAN 1.

**Restliche Angaben beim Storage (Passwort, SSH-Key):**

| Angabe | Woher / wie erstellen |
|--------|------------------------|
| **Standard** (Dropdown) | Einfach **Standard** lassen – das ist die SSD-Leistungsstufe. |
| **Passwort** | **Selbst festlegen:** Ein sicheres Passwort ausdenken (z. B. 12+ Zeichen, Groß-/Kleinbuchstaben, Zahlen, Sonderzeichen) und **notieren** – Sie brauchen es später für den SSH-Login. In das Feld **Passwort** eintragen. |
| **SSH-Keys** | **Optional, aber empfohlen.** Sie legen den Key **lokal auf Ihrem PC** an und fügen nur den **öffentlichen** Key bei IONOS ein. **So erstellen Sie einen SSH-Key (Windows, PowerShell):** `ssh-keygen -t ed25519 -C "ihre-email@beispiel.de"` – Enter drücken (Standardpfad), Passphrase optional. Den **öffentlichen** Key anzeigen: `Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub` – die ausgegebene **eine Zeile** kopieren und in das IONOS-Feld unter „SSH-Keys jetzt hinzufügen“ einfügen, dann speichern. Sie brauchen **entweder Passwort oder SSH-Key** (mindestens eines); mit SSH-Key ist der Login sicherer. |
| **Nicht konfiguriert** | Kann oft leer bleiben; betrifft z. B. erweiterte Netzwerk-/Cloud-Init-Optionen. |

Ohne **Passwort** oder **SSH-Key** bleibt der Button „SSD-Storage hinzufügen“ oft deaktiviert – also mindestens ein sicheres Passwort eintragen (und speichern), dann können Sie hinzufügen.

**SSH-Key im Terminal erstellen (PowerShell):**

1. **Neuen Key anlegen** (nur nötig, wenn noch keiner existiert):  
   `ssh-keygen -t ed25519 -C "ihre-email@beispiel.de"`  
   Enter drücken (Standardpfad `C:\Users\IhrName\.ssh\id_ed25519`), Passphrase optional (oder leer lassen).

2. **Öffentlichen Key anzeigen** (diese Zeile bei IONOS einfügen):  
   `Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub`  
   Die ausgegebene **eine Zeile** (beginnt mit `ssh-ed25519 …`) kopieren und bei IONOS unter „SSH-Keys jetzt hinzufügen“ in das Textfeld einfügen.

**Schritt E – Provision starten**

1. Auf den **blauen Play-Button** (▶) am vCPU Server klicken – oder oben in der Leiste **„Provision“** wählen.
2. Bestätigen. Der vCPU Server wird jetzt erstellt und gestartet.
3. **Warten**, bis der Status „Running“ ist (einige Minuten).
4. **Öffentliche IP notieren** (beim vCPU-Element oder in der Übersicht anzeigen lassen).  
   → Diese IP später in **`.env.deploy`** als `IONOS_HOST` eintragen und in **Phase 5** für den **DNS A-Record** Ihrer Domain verwenden.

#### 2.3 Nach dem Provisioning (IP notieren, Firewall, DNS vorbereiten)

**Grüner Haken = Provisioning abgeschlossen** – die VM läuft. IP, Firewall und Ports sind jetzt sichtbar.

**Wo Sie IP, Firewall und Ports im DCD finden:**

| Was | Wo im DCD |
|-----|-----------|
| **Öffentliche IP** | Auf den **vCPU Server** (Cube) auf dem Canvas **klicken** → **rechts** öffnet sich das Detail-Panel → Bereich **„Netzwerk“** (bzw. Network) öffnen → dort **„Primäre IPv4“** (bzw. Primary IPv4) – das ist Ihre öffentliche IP. Alternativ: Links **Virtual Data Centers** → Data Center öffnen → Liste der Ressourcen (VMs) mit zugeordneter IP. |
| **Firewall / Ports** | Links in der Navigation: **Security** → **Network Security Groups** (oder beim Data Center: zugeordnete Security Group öffnen). Dort **Regeln** anzeigen und ggf. **eingehende Regeln** für Port **22** (SSH), **80** (HTTP), **443** (HTTPS) anlegen. Oder: Beim **Cube/VM** klicken → im Detail-Panel den Bereich **Netzwerk / Security** öffnen. |
| **Ports** | Die Ports (22, 80, 443) werden durch die **Firewall-Regeln** (Network Security Group) gesteuert. Wenn Sie beim Anlegen „default network security group“ aktiviert haben, prüfen Sie dort, ob 22, 80, 443 **eingehend** erlaubt sind. |

**Firewall im DCD anlegen (wenn „Firewall inaktiv“ angezeigt wird):**

1. **Network Security Group (NSG) anlegen oder auswählen**  
   - Im DCD links: **Menü** (≡) → **Security** → **Network Security Groups**.  
   - Oben das **Rechenzentrum** auswählen (Dropdown, z. B. „KI-Prozessnavigator“).  
   - Falls noch **keine** NSG existiert: **Create** bzw. **Anlegen** → **Custom** oder **Default** NSG erstellen (Name z. B. „Webserver-Firewall“).  
   - Bestehende NSG auswählen: auf den **Namen** klicken oder **View & Edit**.

2. **Regeln anlegen (Ports 22, 80, 443 eingehend)**  
   - **Create Firewall Rule** (bzw. **Firewall-Regel erstellen**) wählen.  
   - **Schnellweg mit Vorlagen:** **Rule from template** → **Generic Webserver** auswählen (erlaubt 80, 443) → **Create**. Danach erneut **Rule from template** → **Remote Access Linux** (erlaubt Port 22) → **Create**.  
   - **Oder manuell** drei Regeln anlegen (jeweils **Protocol:** TCP, **Type:** INGRESS, **Port Range Start** = **End** = jeweiliger Port, **Source IP** leer = von überall):

     | Name      | Protocol | Type   | Port Start | Port End |
     |-----------|----------|--------|------------|----------|
     | SSH       | TCP      | INGRESS| 22         | 22       |
     | HTTP      | TCP      | INGRESS| 80         | 80       |
     | HTTPS     | TCP      | INGRESS| 443        | 443      |

   - Jede Regel mit **Create** bestätigen.

3. **NSG mit dem vCPU Server verbinden**  
   - Entweder: Beim **vCPU Server** im Canvas klicken → **Einstellungen** → **Netzwerk-Sicherheitsgruppen** → die angelegte NSG auswählen und zuweisen.  
   - Oder unter **Security** → **Network Security Groups** → Ihre NSG → **Attach** / Server oder NIC zu dieser NSG zuordnen (z. B. Ihren vCPU Server auswählen).  
   - Änderungen ggf. **provisionieren**.

Danach ist die Firewall aktiv; Ports 22, 80 und 443 sind für eingehende Verbindungen offen.

Falls die IP im Panel nicht sofort erscheint: Provisioning kann 1–2 Minuten nach dem grünen Haken brauchen, bis die Netzwerk-Zuweisung steht. Seite ggf. neu laden oder das VM-Element erneut anklicken.

- **Öffentliche IP notieren:** Die IP des vCPU Servers ist Ihr **IONOS_HOST** für `.env.deploy` und der **Zielwert für den DNS A-Record** Ihrer Domain (Phase 5).
- **SSH-Zugang:** Mit dieser IP und dem gesetzten Passwort (oder SSH-Key) per SSH verbinden (z. B. `ssh root@IHRE_IP`).
- **Firewall im DCD:** Falls eine „Network Security Group“ aktiv ist, Port **22** (SSH) und **80** (HTTP) bzw. **443** (HTTPS) für eingehende Verbindungen freigeben.
- **`.env.deploy`:** Diese IP als `IONOS_HOST` eintragen und Deploy ausführen (Phase 4).
- **Domain verbinden:** In Phase 5 den DNS A-Record Ihrer Domain auf genau diese IP setzen – dann zeigt die Domain auf Ihren vCPU Server.

#### 2.4 Sichere Verbindung gegen Angriffe (SSH härten)

**Ist SSH unsicher?** SSH selbst ist **kryptographisch sehr sicher**. Das Risiko entsteht meist durch **Passwort-Login**, den **Standard-Port 22** (wird von Bots dauerhaft gescannt) und lockere Einstellungen. Mit den folgenden Maßnahmen wird die Verbindung deutlich robuster:

| Maßnahme | Warum sicherer |
|----------|-----------------|
| **SSH-Key statt Passwort** | Kein Brute-Force auf Passwörter; Key liegt nur bei Ihnen. In der VM beim Anlegen **SSH-Key hinterlegen** und später **Passwort-Login deaktivieren**. |
| **Passwort-Login abschalten** | Nach Einrichtung des Keys auf dem Server: `PasswordAuthentication no` in `/etc/ssh/sshd_config`, dann `systemctl restart sshd`. Nur noch Key-Login möglich. |
| **Nicht als root einloggen** | Benutzer anlegen (z. B. `deploy`), Key dort eintragen, mit `sudo` arbeiten. In `.env.deploy`: `IONOS_USER=deploy`. |
| **Fail2ban** | Blockt IPs nach mehreren fehlgeschlagenen Login-Versuchen: `apt install fail2ban` und für SSH aktivieren. |
| **Optional: anderer SSH-Port** | Port z. B. auf 2222 ändern (`Port 2222` in `sshd_config`), in DCD/Firewall diesen Port statt 22 freigeben. In `.env.deploy`: `IONOS_PORT=2222`. Weniger automatische Scans auf Port 22. |
| **Firewall: nur nötige Ports** | Im DCD und auf dem Server (UFW) nur **22** (oder Ihren SSH-Port), **80** und **443** von außen erlauben. |

**Empfohlene Reihenfolge:** (1) Beim Anlegen der VM **SSH-Key** hinterlegen und testen, (2) per SSH einloggen, (3) **Passwort-Login deaktivieren**, (4) optional **Fail2ban** und **eigenen SSH-Port** einrichten. Danach ist SSH gegenüber typischen Angriffen gut abgesichert.

**Noch höhere Sicherheit (optional):** SSH nur aus einem bestimmten Netz erlauben (z. B. Ihre feste IP in der Firewall eintragen) oder Zugang über einen **VPN** legen und SSH nur im internen Netz anbieten – dann ist Port 22 von außen gar nicht erreichbar.

---

## Phase 3: Server vorbereiten (einmalig)

Nach dem ersten Login per SSH richten Sie den Webserver und das Webroot ein.

### 3.1 SSH – exakter Befehl

Auf Ihrem **Windows-PC** (PowerShell oder CMD):

```bash
ssh root@IHRE_IP
```

- **IHRE_IP** durch die notierte **Primäre IPv4** des vCPU Servers ersetzen (z. B. `ssh root@123.45.67.89`).
- Beim ersten Mal erscheint: `Are you sure you want to continue connecting (yes/no)?` → **`yes`** eingeben und Enter.
- Passwort eingeben (das Sie beim Anlegen der VM/Storage gesetzt haben) oder bei SSH-Key: kein Passwort nötig.

Sie sind dann auf dem Server eingeloggt (Prompt z. B. `root@…`).

### 3.2 Webserver und Webroot – exakte Befehle

**Alle Befehle auf dem Server ausführen** (nach SSH-Login). Webroot = `/var/www/html`.

```bash
apt update && apt upgrade -y
apt install -y apache2
systemctl start apache2
systemctl enable apache2
```

- DocumentRoot ist bei Ubuntu Apache standardmäßig `/var/www/html`. Das Deploy-Skript lädt dorthin hoch.

### 3.3 PHP (optional, für Formulare) – exakte Befehle

Wenn Sie die Kontakt-/Checklisten-Formulare (PHP) nutzen wollen:

```bash
apt install -y php libapache2-mod-php php-mbstring php-curl
systemctl restart apache2
```

Danach auf dem Server `php/config.php` anpassen (E-Mail, SMTP, ALLOWED_ORIGINS, CSRF_SECRET) – siehe Abschnitt [php/config.php auf dem Server](#phpconfigphp-auf-dem-server-anpassen).

### 3.4 Rechte und Firewall

- **Webroot-Rechte (optional, nach Deploy):**  
  `chown -R www-data:www-data /var/www/html`  
  (Damit Apache die Dateien lesen kann.)
- **Firewall:** Ports 22, 80, 443 sind bereits im DCD (Network Security Group) freigegeben. Auf dem Server UFW nur aktivieren, wenn gewünscht: `ufw allow 22,80,443/tcp && ufw enable`.

---

## Phase 4: Lokales Deploy mit Zugangsdaten aus `.env.deploy`

Alle sensiblen Werte bleiben **lokal** in **`.env.deploy`**. Keine Tokens/Passwörter im Chat oder in Repo-Dateien.

### 4.1 Konfiguration anlegen

1. Im **Projektordner** die Datei **`.env.deploy.example`** als **`.env.deploy`** kopieren.
2. **`.env.deploy`** bearbeiten und mit Ihren Werten füllen:

| Variable         | Bedeutung |
|------------------|-----------|
| `IONOS_HOST`     | IP oder Hostname des Cloud Servers (z. B. aus Phase 2) |
| `IONOS_USER`     | SSH-Benutzer (z. B. `root` oder ein Benutzer mit Schreibrechten) |
| `IONOS_WEBROOT`  | Verzeichnis auf dem Server für die Website (z. B. `/var/www/html`) |
| `IONOS_PORT`     | Optional, Standard: `22` |
| `IONOS_SSH_KEY`  | Optional: Pfad zu Ihrem privaten SSH-Key (z. B. `C:\Users\IhrName\.ssh\id_rsa`) für passwortlosen Zugang |

Beispiel (Werte nur lokal eintragen, nicht committen):

```env
IONOS_HOST=123.45.67.89
IONOS_USER=root
IONOS_WEBROOT=/var/www/html
IONOS_PORT=22
# IONOS_SSH_KEY=C:\Users\IhrName\.ssh\id_rsa
```

### 4.2 Deploy ausführen

Im Projektordner in **PowerShell**:

```powershell
.\deploy-ionos.ps1
```

- Beim ersten Mal ggf. SSH-Host-Key mit `yes` bestätigen.
- Wenn **kein** `IONOS_SSH_KEY` gesetzt ist: Passwort für den SSH-Benutzer eingeben.

Das Skript legt ein temporäres Verzeichnis an, kopiert die nötigen Dateien (HTML, CSS, JS, assets, includes, php) und lädt sie per **SCP** in `IONOS_WEBROOT` hoch.

---

## Phase 5: Domain mit dem vCPU Server verbinden (DNS)

Sobald die Website auf dem vCPU Server läuft, verbinden Sie die Domain mit der **öffentlichen IP** des vCPU Servers – die gleiche IP, die Sie in Phase 2 notiert und in `.env.deploy` als `IONOS_HOST` eingetragen haben.

1. **IONOS Kundenbereich** [my.ionos.com](https://my.ionos.com) → **Domain & SSL** → Ihre Domain auswählen.
2. **Falls Sie die Website bereits deinstalliert haben:** Auf **„Domain zurücksetzen“** → **„Verwendungsart oder DNS zurücksetzen“** klicken. Damit ist die Domain nicht mehr an das alte Hosting gebunden; danach können Sie die DNS-Einträge sauber setzen.
3. **„DNS-Einstellungen anpassen“** (bzw. Reiter **DNS**) öffnen.
4. **A-Record** für die Domain (und ggf. für `www`) auf die **öffentliche IP Ihres vCPU Servers** setzen:
   - **Name:** `@` (für die Hauptdomain) bzw. `www` (für www).
   - **Wert / Ziel:** Die IP aus Phase 2 – dieselbe wie in `.env.deploy` (`IONOS_HOST`), z. B. `123.45.67.89`.
   - **TTL:** z. B. 3600 oder Standard.
5. Alte Einträge, die noch auf das WP Hosting zeigen, anpassen oder entfernen.
6. **Speichern.** DNS-Änderungen können bis zu einigen Stunden brauchen (meist deutlich kürzer).

Danach zeigt **ihredomain.de** (und ggf. **www.ihredomain.de**) auf Ihren vCPU Server. **https://ihredomain.de** (nach SSL-Einrichtung) bzw. **http://ihredomain.de** liefern dann Ihre neue Website.

**SSL:** Für HTTPS einen TLS-Zertifikat auf dem Server einrichten (z. B. Let’s Encrypt mit Certbot) oder IONOS SSL-Produkte nutzen, sofern Sie sie gebucht haben.

---

## Schritt-für-Schritt-Checkliste (zum Abhaken)

| Schritt | Inhalt |
|--------|--------|
| 1 | **IP notieren** – vCPU auf Canvas klicken → rechts **Netzwerk** → **Primäre IPv4** kopieren/notieren |
| 2 | **Firewall im DCD** – Ports 22, 80, 443 eingehend prüfen/anlegen (Menü → **Security** → **Network Security Groups**) |
| 3 | **SSH** – `ssh root@IHRE_IP` (IHRE_IP ersetzen), Host-Key mit `yes` bestätigen, Passwort eingeben |
| 4 | **Webserver** – siehe [Phase 3 – exakte Befehle](#phase-3-server-vorbereiten-einmalig) (apt update, apache2, Webroot `/var/www/html`) |
| 5 | **PHP** – siehe [Phase 3.2](#32-php-optional-für-formulare) (apt install php …) |
| 6 | **`.env.deploy`** – aus `.env.deploy.example` kopieren, `IONOS_HOST` = Ihre notierte IP, `IONOS_USER` = root, `IONOS_WEBROOT` = `/var/www/html` |
| 7 | **Deploy** – `.\deploy-ionos.ps1` ausführen, Test mit `http://IHRE_IP` im Browser |
| 8 | **Rechte (optional)** – auf dem Server: `sudo chown -R www-data:www-data /var/www/html` |
| 9 | **Domain** – IONOS → **Domain & SSL** → **ki-prozessnavigator.de** → **DNS** → A-Record für **@** und **www** auf die Primäre IPv4 setzen |
| 10 | **SSL (optional)** – auf dem Server Certbot für Let’s Encrypt einrichten (siehe [SSL (optional)](#ssl-optional)) |

---

## SSL (optional)

Für HTTPS (Let’s Encrypt) auf dem Server nach Domain-Anbindung:

```bash
apt install -y certbot python3-certbot-apache
certbot --apache -d ki-prozessnavigator.de -d www.ki-prozessnavigator.de
```

Certbot fragt nach E-Mail und Bestätigung; danach wird die Seite per HTTPS ausgeliefert.

---

## php/config.php auf dem Server anpassen

Nach dem Deploy liegt `php/config.php` im Webroot (z. B. `/var/www/html/php/config.php`). Auf dem Server bearbeiten:

```bash
sudo nano /var/www/html/php/config.php
```

**Anzupassen:**

| Einstellung | Bedeutung | Beispiel |
|-------------|-----------|----------|
| **RECIPIENT_EMAIL** | E-Mail-Adresse, an die Formular-Nachrichten gehen | `d.buchele@ki-prozessnavigator.de` |
| **SMTP_HOST / SMTP_PORT** | SMTP-Server (z. B. Gmail, IONOS Mail) | Gmail: `smtp.gmail.com`, Port `587` |
| **SMTP_USERNAME / SMTP_PASSWORD** | SMTP-Login; bei Gmail: **App-Passwort** (nicht normales Passwort) | [Google App-Passwort](https://support.google.com/accounts/answer/185833) |
| **ALLOWED_ORIGINS** | Domains, von denen Formulare akzeptiert werden | `https://ki-prozessnavigator.de`, `https://www.ki-prozessnavigator.de` (nach SSL) bzw. vorher `http://…` |
| **CSRF_SECRET** | Geheimer Schlüssel für CSRF-Schutz – **einmalig setzen und nicht ändern** | Langer Zufallswert (im Projekt ggf. schon gesetzt) |

Speichern: `Ctrl+O`, Enter, `Ctrl+X`. Webserver muss nicht neu gestartet werden.

---

## Kurz-Checkliste

- [ ] Phase 1: Domain vom WP-Hosting getrennt (oder nur Hosting gekündigt, wenn Domains separat sind)
- [ ] Phase 2: Data Center mit Canvas erstellt, **vCPU Server** angelegt, mit **Internetzugang** verbunden, **öffentliche IP notiert**
- [ ] Phase 3: Webserver (Apache/Nginx) und Webroot eingerichtet, ggf. PHP
- [ ] Phase 4: `.env.deploy` mit **IONOS_HOST = IP des vCPU Servers** ausgefüllt, `.\deploy-ionos.ps1` erfolgreich ausgeführt
- [ ] Phase 5: **Domain mit IP verbunden:** DNS A-Record(s) für Domain (und www) auf die **öffentliche IP des vCPU Servers** gesetzt
- [ ] Keine Passwörter/Keys im Chat oder in öffentlichen Dateien – nur in `.env.deploy`

---

## Referenzen

- IONOS Cloud Server anlegen: [IONOS Help – Creating a Cloud Server](https://www.ionos.com/help/server-cloud-infrastructure/server-administration/creating-a-cloud-server/)
- Data Center Designer (DCD), Canvas: [docs.ionos.com – Create a Data Center](https://docs.ionos.com/cloud/set-up-ionos-cloud/get-started/create-data-center), [Use the Canvas Mode](https://docs.ionos.com/cloud/set-up-ionos-cloud/get-started/create-data-center/use-canvas)
- DCD Login: [dcd.ionos.com](https://dcd.ionos.com)
- DNS bei IONOS: [IONOS Hilfe – DNS-Verwaltung](https://www.ionos.de/hilfe/domains/allgemeine-informationen-zu-dns-einstellungen/dns-verwaltung-im-ionos-kundenkonto/)
