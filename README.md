# Pokedex Manager

Aplikacja internetowa stworzona w technologii React, umożliwiająca zarządzanie kolekcją Pokémonów z wykorzystaniem lokalnej bazy danych JSON Server. Projekt zawiera funkcjonalności związane z przeglądaniem, edycją, tworzeniem, walkami Pokémonów oraz systemem rankingowym.

## Uruchamianie aplikacji

### Wymagania wstępne

- Node.js (zalecana wersja: LTS)
- NPM lub Yarn
- Zainstalowany `json-server`

### Instalacja

1. Zainstaluj zależności:

```bash
npm install
```

2. Uruchom serwer danych (JSON Server):

```bash
npx json-server --watch db.json --port 3000
```

3. Uruchom aplikację developerską:

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: [http://localhost:5173](http://localhost:5173)

## Funkcjonalności

### Autoryzacja

- Obsługa lokalnych użytkowników (przechowywanych w pliku `db.json`)
- Możliwość zapamiętania ulubionych Pokémonów oraz przypisania Pokémonów do Areny

### Strona główna

- Lista 150 Pokémonów z API oraz lokalnie stworzonych
- Wyświetlanie statystyk wygranych i przegranych (W/L)
- Możliwość wyszukiwania i paginacji

### Szczegóły Pokémona

- Widok szczegółów z możliwością dodania do ulubionych i na Arenę
- Synchronizacja danych z lokalnym serwerem

### Arena

- Porównanie dwóch Pokémonów na podstawie ich wagi i doświadczenia
- Zwycięzca otrzymuje dodatkowe doświadczenie i statystykę wygranej
- Przegrany otrzymuje statystykę porażki

### Ranking

- Lista wszystkich Pokémonów posortowana według wybranego kryterium
- Obsługa sortowania po: doświadczeniu, wadze, wzroście, liczbie wygranych i przegranych

### Ulubione

- Lista ulubionych Pokémonów przypisana do aktualnego użytkownika

### Edycja

- Możliwość edycji atrybutów istniejących Pokémonów
- Formularz walidowany za pomocą `React Hook Form` oraz `Zod`
- Obsługa tworzenia nowych Pokémonów z wyborem nieużywanej grafiki (151+)
- Powrót na stronę główną po zapisaniu zmian

## Konwencje

- Projekt oparty na modularnej strukturze komponentów
- Walidacja danych użytkownika i formularzy z użyciem `React Hook Form` i `Zod`
- Stylizacja z wykorzystaniem Tailwind CSS
- Przechowywanie danych i stanu użytkownika w `Context API`