Níže je kompletní podrobný technický popis a instrukce pro vývojáře bota, jak vytvořit frontend mobilní hry "DrunkenPilot" jako fork DrunkPirate s koncepty a vylepšeními, které jsme odsouhlasili. Inspirace stylem i základní funkcionalitou vychází z DrunkPirate.co.uk, ale hra bude rozšířená o plážové questy, vědomostní challenge, pohybové úkoly, jednoduché pití ze společného kelímku a zpracování kartiček v JSON formátu s metadaty pro budoucí rozšíření.

***

# Kompletní instrukce pro implementaci frontend hry DrunkenPilot

## 1. Úvod a základní koncept
- DrunkenPilot je online hra na pití, optimalizovaná pro mobilní zařízení (smartphone, tablet).
- Jednoduché klikání/tapnutí pro otáčení karet (pull card).
- Základní gameplay: hráč "táhne" kartu, která obsahuje úkol, otázku nebo challenge; po splnění se karta označí a tah přejde na dalšího hráče.
- Hra je určena pro skupiny 2–20 hráčů, ideálně hrající společně na jedné lokalitě (např. pláž), sdílející jeden nápoj.
- Karty jsou uloženy v JSON formátu, podpora klíče pro metadata (aktuálně prázdné, ale pro budoucí rozšíření).
- Styl hry a UI by mělo co nejvíce napodobovat DrunkPirate.co.uk (simplicity, barevnost, pirátská tématika, hravý font).

## 2. Technologie
- Frontend: Vue.js 3 (Composition API)
- Styl: CSS3 + případně SCSS, respektování mobilní responzivity (Flexbox/Grid)
- Žádný backend (vše funguje čistě v klientu)
- Data karet: JSON soubor načítaný přímo do aplikace
- Deployment: statický web vhodný i pro PWA (Progressive Web App)
- Offline režim: hra by měla fungovat i bez internetového připojení po načtení stránkových dat

## 3. Struktura JSON karet

Každá karta je objekt ve formě:

```json
{
  "id": 1,
  "type": "quest" | "challenge" | "movement",
  "text": "Popis úkolu nebo otázka.",
  "options": null | ["odpověď A", "odpověď B", "odpověď C", "odpověď D"],
  "correctAnswerIndex": null | 0,
  "metadata": {}
}
```

Popis polí:
- `id`: unikátní identifikátor karty
- `type`: typ úkolu (viz níže)
- `text`: text úkolu nebo otázky
- `options`: seznam odpovědí v případě vědomostních otázek (může být `null` u jiných typů)
- `correctAnswerIndex`: index správné odpovědi v options, nebo `null`
- `metadata`: objekt s dodatečnými daty (pro budoucí rozšíření např. obtížnost, téma)

## 4. Kategorie karet a jejich logika

### 4.1 Plážové questy (type = "quest")
- Úkoly fyzického nebo kreativního charakteru, např. sbírání mušlí, kreslení v písku.
- Pořadatel úkol vyhlašuje a ostatní hodnotí splnění.
- Pokud není splněno, hráč pije (vezme lok společného nápoje).
- Příklad karty:  
```json
{
  "id": 101,
  "type": "quest",
  "text": "Najdi 3 mušle na pláži během 1 minuty.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

### 4.2 Vědomostní challenge (type = "challenge")
- Otázky s možností odpovědí ABCD nebo otevřené otázky bez nápovědy.
- Po vykonání karty pokládá hráč otázku ostatním (v reálném čase mimo aplikaci).
- Nekorektní odpověď znamená, že daný hráč pije.
- Příklad karty s ABCD možnostmi:  
```json
{
  "id": 201,
  "type": "challenge",
  "text": "Jak se jmenuje největší ostrov Kanárských ostrovů?",
  "options": ["Lanzarote", "Tenerife", "Gran Canaria", "Fuerteventura"],
  "correctAnswerIndex": 1,
  "metadata": {}
}
```
- Příklad otevřené otázky:  
```json
{
  "id": 202,
  "type": "challenge",
  "text": "Řekni název pirátského filmu z roku 2003.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

### 4.3 Pohybové úkoly (type = "movement")
- Jednoduché pohybové aktivity přizpůsobené venkovnímu prostředí.
- Příklad: "Skoč třikrát na místě" nebo "Oběhni zeď/keř/stín".
- Pokud nesplní, pije.
- Příklad karty:  
```json
{
  "id": 301,
  "type": "movement",
  "text": "Skoč třikrát na místě.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

## 5. Herní workflow

- Při spuštění hry možnost zadat počet hráčů a jejich jména.
- Hra probíhá po kolech, každý hráč na řadě táhne kartu.
- Karta se zobrazí na obrazovce s textem a případně možnostmi odpovědí pro challenge.
- Po splnění úkolu/tahu následuje potvrzení a přesun tahu na dalšího hráče.
- Při vědomostních otázkách lze v UI vyznačit správnou odpověď pro kontrolu.
- Statistiky o tom, kdo pije, lze vést volitelně (např. počet loků pro každého).
- Na konci hry lze zobrazit jednoduchý přehled (např. kdo pil nejvíc, kdo nejméně).
- Jeden společný kelímek: pití se bere symbolicky jako lok na každý nesplněný úkol.

## 6. Uživatelské rozhraní (UI)

- Hlavní obrazovka: uvítání, nastavení hry, počet hráčů, zadání jmen.
- Herní obrazovka: ukázka aktuálního hráče, karta, tlačítka "Splnil jsem", "Piju", "Další karta".
- Jednoduchá animace otáčení karty při tahu.
- Pro vědomostní otázky: možnost vybrat odpověď z nabízených možností.
- Měření času na plážové questy (vizuální odpočet).
- Styl: pirátské motivy, barevné pozadí, čitelné fonty a velká tlačítka, optimalizace pro dotyk.
- Statistiky a výsledky jako jednoduchý přehled na konci hry.

## 7. Rozšíření a metadaty

- Metadata u karet mohou v budoucnu obsahovat:
  - Obtížnost
  - Kategorie (pláž, vědomosti, pohyb)
  - Témata (např. příroda, film, sport)
  - Jazykové varianty
  - Speciální efekty UI (např. zvuk, animace)

## 8. Doplňkové a technické tipy

- Doporučené komponenty ve Vue:
  - CardDisplay: zobrazení karty s textem a možnostmi odpovědí
  - PlayerList: seznam hráčů a jejich stav
  - GameController: logika tahu a databáze karet načtená z JSON
  - TimerComponent: odpočítávání času pro plážové questy
  - StatsComponent: přehled výsledků a statistik
- Lokalizace textů: držet možnost snadného překladu textů ve hře
- Ukládání hry do localStorage pro pozastavení a pokračování
- Responzivní design: UI přizpůsobeno pro různé velikosti displejů
- Minimální závislosti a čistý kód s komentáři

***

Tento detailní popis slouží jako guideline pro naprogramování jednoduché, ale zábavné a originální mobilní drinking game ve stylu DrunkPirate s přidanými vlastnostmi pro plážové hraní a interakci, přičemž data karet jsou organizována přehledně v JSON formátu s možností budoucího rozšíření[1][2][3].

Zdroje
[1] Drunk Pirate - The Online Drinking Game https://drunkpirate.co.uk
[2] Mastering the Higher or Lower Drinking Game - Smith & Sinclair https://www.smithandsinclair.com/blogs/news/mastering-the-higher-or-lower-drinking-game-strategies-fun-and-responsible-play
[3] How to Turn Any Game into a Drinking Game - Cloudfall Studios https://www.cloudfallstudios.com/blog/2021/5/5/how-to-turn-any-game-into-a-drinking-game
