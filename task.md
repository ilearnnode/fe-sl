# Sports Leagues

## Overview

The goal of this assignment is to evaluate your skills in frontend development,
especially your proficiency with components based, state management and API
integration. The project simulates a simplified component from an online bookmaker
platform.
You are free to use any AI tools to assist you with this task - including for UI/UX
design, layout generation, or even code scaffolding. If you do use any tools, please
include a short .md file describing which ones you used and how they helped. The
focus of this assignment is on your understanding of product logic and
implementation - not whether everything is handcrafted from scratch.
The task is expected to take approximately 90 minutes. If you're unable to complete
all requirements within that time, please provide additional context or explanations in
the .md file.

## Requirements

Build a single-page application (SPA) that consumes the [All Leagues API](https://www.thesportsdb.com/api/v1/json/3/all_leagues.php) and displays
the sports leagues with filtering options.
- Fetch and display a list of sports leagues.
- Display Fields:
  - strLeague
  - strSport
  - strLeagueAlternate
- Add a search bar to filter leagues by name.
- Add a dropdown to filter by sport type (e.g., Soccer, Basketball, Motorsport).
- Use component-based architecture.
- The UI should be responsive and functional as a priority, visual enhancements can be
added if time allows
- The league entities respond to clicks and call the Season Badge API with the league ID to
display a season badge image (can be for any season you like or the first entity in the   response).
- Responses should be cached to avoid repeat calls.

## Tech Stack

The solution is expected to be based on:
- Vue, React or Angular
- Other tools/libraries can be used at your discretion.

## API

All Leagues:
https://www.thesportsdb.com/api/v1/json/3/all_leagues.php
Badge Lookup:
https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=<id>
Documentation: https://www.thesportsdb.com/free_sports_api

## Design

Design decisions are entirely at your discretion.
