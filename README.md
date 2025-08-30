Below is a complete detailed technical description and instructions for developers on how to create a frontend mobile game "DrunkenPilot" as a fork of DrunkPirate with concepts and improvements that we have agreed upon. The inspiration for style and basic functionality comes from DrunkPirate.co.uk, but the game will be expanded with beach quests, knowledge challenges, movement tasks, simple drinking from a shared cup, and card processing in JSON format with metadata for future extensions.

***

# Complete Instructions for DrunkenPilot Frontend Game Implementation

## 1. Introduction and Basic Concept
- DrunkenPilot is an online drinking game, optimized for mobile devices (smartphone, tablet).
- Simple clicking/tapping to flip cards (pull card).
- Basic gameplay: player "draws" a card that contains a task, question, or challenge; after completion, the card is marked and the turn passes to the next player.
- The game is designed for groups of 2–20 players, ideally playing together at one location (e.g., beach), sharing one drink.
- Cards are stored in JSON format, supporting metadata keys (currently empty, but for future extensions).
- The game style and UI should mimic DrunkPirate.co.uk as much as possible (simplicity, colorfulness, pirate theme, playful font).

## 2. Technology
- Frontend: Vue.js 3 (Composition API)
- Style: CSS3 + possibly SCSS, respecting mobile responsiveness (Flexbox/Grid)
- No backend (everything works purely on the client)
- Card data: JSON file loaded directly into the application
- Deployment: static web suitable for PWA (Progressive Web App)
- Offline mode: the game should work even without internet connection after loading page data

## 3. JSON Card Structure

Each card is an object in the form:

```json
{
  "id": 1,
  "type": "quest" | "challenge" | "movement",
  "text": "Task description or question.",
  "options": null | ["answer A", "answer B", "answer C", "answer D"],
  "correctAnswerIndex": null | 0,
  "metadata": {}
}
```

Field descriptions:
- `id`: unique card identifier
- `type`: task type (see below)
- `text`: task or question text
- `options`: list of answers for knowledge questions (can be `null` for other types)
- `correctAnswerIndex`: index of correct answer in options, or `null`
- `metadata`: object with additional data (for future extensions e.g. difficulty, theme)

## 4. Card Categories and Their Logic

### 4.1 Beach Quests (type = "quest")
- Physical or creative tasks, e.g., collecting shells, drawing in sand.
- The task organizer announces the task and others judge its completion.
- If not completed, the player drinks (takes a sip of the shared drink).
- Example card:  
```json
{
  "id": 101,
  "type": "quest",
  "text": "Find 3 shells on the beach within 1 minute.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

### 4.2 Knowledge Challenge (type = "challenge")
- Questions with ABCD answer options or open questions without hints.
- After executing the card, the player asks the question to others (in real-time outside the application).
- Incorrect answer means that player drinks.
- Example card with ABCD options:  
```json
{
  "id": 201,
  "type": "challenge",
  "text": "What is the name of the largest island in the Canary Islands?",
  "options": ["Lanzarote", "Tenerife", "Gran Canaria", "Fuerteventura"],
  "correctAnswerIndex": 1,
  "metadata": {}
}
```
- Example open question:  
```json
{
  "id": 202,
  "type": "challenge",
  "text": "Name a pirate movie from 2003.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

### 4.3 Movement Tasks (type = "movement")
- Simple physical activities adapted to outdoor environment.
- Example: "Jump three times in place" or "Run around a wall/bush/shadow".
- If not completed, drinks.
- Example card:  
```json
{
  "id": 301,
  "type": "movement",
  "text": "Jump three times in place.",
  "options": null,
  "correctAnswerIndex": null,
  "metadata": {}
}
```

## 5. Game Workflow

- When starting the game, option to enter number of players and their names.
- Game proceeds in rounds, each player in turn draws a card.
- Card is displayed on screen with text and possibly answer options for challenges.
- After completing the task/turn, confirmation follows and turn moves to next player.
- For knowledge questions, correct answer can be marked in UI for verification.
- Statistics about who drinks can be kept optionally (e.g., number of sips for each player).
- At the end of the game, simple overview can be displayed (e.g., who drank most, who least).
- One shared cup: drinking is taken symbolically as a sip for each failed task.

## 6. User Interface (UI)

- Main screen: welcome, game settings, number of players, name entry.
- Game screen: display of current player, card, buttons "I completed it", "I drink", "Next card".
- Simple card flip animation when drawing.
- For knowledge questions: option to select answer from offered choices.
- Time measurement for beach quests (visual countdown).
- Style: pirate motifs, colorful background, readable fonts and large buttons, touch optimization.
- Statistics and results as simple overview at the end of the game.

## 7. Extensions and Metadata

- Card metadata may contain in the future:
  - Difficulty
  - Category (beach, knowledge, movement)
  - Themes (e.g., nature, film, sport)
  - Language variants
  - Special UI effects (e.g., sound, animation)

## 8. Additional and Technical Tips

- Recommended Vue components:
  - CardDisplay: card display with text and answer options
  - PlayerList: list of players and their status
  - GameController: turn logic and card database loaded from JSON
  - TimerComponent: countdown for beach quests
  - StatsComponent: results and statistics overview
- Text localization: maintain possibility for easy text translation in the game
- Save game to localStorage for pause and continue
- Responsive design: UI adapted for various display sizes
- Minimal dependencies and clean code with comments

***

This detailed description serves as a guideline for programming a simple but fun and original mobile drinking game in the style of DrunkPirate with added features for beach play and interaction, while card data is organized clearly in JSON format with possibility for future extensions[1][2][3].

Sources
[1] Drunk Pirate - The Online Drinking Game https://drunkpirate.co.uk
[2] Mastering the Higher or Lower Drinking Game - Smith & Sinclair https://www.smithandsinclair.com/blogs/news/mastering-the-higher-or-lower-drinking-game-strategies-fun-and-responsible-play
[3] How to Turn Any Game into a Drinking Game - Cloudfall Studios https://www.cloudfallstudios.com/blog/2021/5/5/how-to-turn-any-game-into-a-drinking-game
