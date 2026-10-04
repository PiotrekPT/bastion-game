# Bastion Lines — Project Specification & Memory

## 1. Koncepcja Gry
Minimalistyczna, taktyczna strategia w czasie rzeczywistym (RTS) na kafelkach (HTML5 Canvas).
Klimat: uproszczona twierdza / minimalistyczny RTS.
Liczba graczy: do 4 graczy (4 strefy startowe w 4 narożnikach planszy).
Tempo: Czas rzeczywisty (wszyscy budują jednocześnie, bez podziału na tury).

## 2. Zasady Technologiczne
- Czysty JavaScript (ES6+), HTML5 Canvas, CSS.
- Zero zewnętrznych frameworków i bundlerów.
- Rozdzielczość Canvas: 800x800 px.
- Siatka: 32x32 kafelki (1 kafelek = 25x25 px).

## 3. Architektura i Ekrany Gry
1. **Menu Główne (Overlay UI na Canvasie lub prosty HTML):**
   - Tytuł: „Bastion Lines”.
   - Przyciski: „Nowa Gra (Solo/Test)”, „Stwórz Grę Online” (placeholder na przyszłość).
   - Wybór liczby graczy: 2–4.
2. **Faza 1: Rozstawienie Twierdzy (Placement Phase — 10 sekund):**
   - Licznik czasu na górze ekranu (odliczanie od 10 do 0).
   - Dozwolone strefy budowy Donżonu (Keep, rozmiar 2x2): wyłącznie wyznaczony narożnik gracza (np. kwadrat 8x8 kafelków w rogu, brak możliwości postawienia na środku mapy).
   - Podświetlenie dozwolonej strefy na zielono/akcentowo, stref zabronionych na czerwono.
3. **Faza 2: Główna Rozgrywka (Live RTS):**
   - Po upływie 10 sekund startuje gra właściwa.
   - Możliwość stawiania i usuwania murów w czasie rzeczywistym.

## 4. Architektura Danych Planszy (Grid 32x32)
- `EMPTY` (0) — puste pole.
- `KEEP` (1) — Donżon (blok 2x2 kafelki, przypisany do konkretnego gracza: P1 niebieski, P2 czerwony, P3 zielony, P4 żółty).
- `WALL` (2) — Mur obronny (1x1 kafelek).

## 5. Aktualny Stan i Następny Krok (Milestone 2)
Implementacja Menu Głównego, siatki 32x32, 4 stref narożnych oraz 10-sekundowej fazy stawiania Twierdzy.