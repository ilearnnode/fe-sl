# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sports League viewer single-page application that displays and filters sports leagues data from TheSportsDB API.

## Core Requirements

- Fetch and display sports leagues from: https://www.thesportsdb.com/api/v1/json/3/all_leagues.php
- Display fields: strLeague, strSport, strLeagueAlternate
- Search bar for filtering leagues by name
- Dropdown filter for sport types
- Click on league to fetch season badge from: https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id={id}
- Cache API responses to avoid duplicate calls
- Responsive, functional UI (visual polish secondary)
- Component-based architecture (Vue, React, or Angular)

## Tech stack

- Vue
- Vite
- Typescript
- Tailwind
- pnpm