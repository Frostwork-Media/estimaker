# Estimaker Project Knowledge

## Project Overview
A collaborative estimation tool using Squiggle (a probabilistic programming language) for calculations. It displays a canvas with nodes and connections  between them.

## Pages & Features

### Pages
- Landing page: Public landing page at "/"
- Project list: Project list at "/projects"
- Project Canvas: Main workspace at "/projects/:id"
- New Project: Creation page at "/projects/new"

### Key Features
- Canvas: Main workspace showing nodes and connections
- Sidebar: Right panel showing node details or search
- Variables Table: Table view of all variables in project
- Search: Find and import from Manifold/Metaforecast
- Squiggle Graph: Shows probability distributions

## Development Guidelines

### Testing
- Add tests for new functionality
- Test error cases and edge cases
- Use vitest for testing
- Mock hooks appropriately when testing React components

### Code Style
- Keep changes minimal and focused
- Preserve existing code behavior
- Add error handling for user interactions

### Components
- Nodes have names, links are the values from different people adding their own values
- Variables table allows editing node names and values
- Node editing can happen both in table and canvas views
- Use React hooks at component level, not in handlers

