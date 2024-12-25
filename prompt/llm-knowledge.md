Estimaker Project Knowledge
Architecture Overview
Estimaker appears to be a tool for creating and visualizing estimates using nodes in a graph structure. The core components include:
Node Types

EstimateNode: Contains variable names and estimates
DerivativeNode: Handles squiggle content and calculations
MetaforecastNode: Integrates with metaforecast data
ManifoldNode: Integrates with manifold market data
ImageNode: Handles image display

Core Components

Wrapper.tsx: Provides the core node UI structure
VariablesTable.tsx: Manages estimate variables and their values
store.ts: Handles state management using TinyBase

Previous Visualization Integration
The project previously had integration with Squiggle visualization libraries:

Used @quri/squiggle-components for distribution visualization
Distribution graphs were displayed beneath nodes
Referenced in tailwind.config.js which includes:
javascriptCopycontent: [
  "./node_modules/@quri/squiggle-components/dist/**/*.js",
]


Squiggle Integration Details
The project integrates with several Squiggle packages:

@quri/squiggle-lang: Core language and parsing
@quri/squiggle-ui: React components for QURI projects
@quri/squiggle-components: Visualization components

Contains specific widgets like DistWidget for distribution visualization
Has components for different chart types and playgrounds

State Management

Uses TinyBase for state management
Maintains store of nodes and their relationships
Handles variable names and estimate values
Supports multiplayer functionality through PartyKit

Current Features

Variable management through table interface
Node creation and linking
Support for various node types (estimates, derivatives, metaforecast, manifold)
Collaborative editing support

Missing Functionality

Distribution visualization (previously implemented, currently removed)
Real-time graph updates based on estimates
Interactive visualization components

Known Dependencies

Core dependencies on Squiggle libraries
TinyBase for state management
PartyKit for multiplayer features
Tailwind for styling

Technical Notes

Node values are stored in a structured format that previously supported visualization
The system has infrastructure for handling mathematical calculations and distributions
Clear separation between node structure and content rendering

This document should be updated as we learn more about the system or make significant changes to its architecture.

EstimateNode: Contains variable names and estimates
- Successfully implements Squiggle visualization through modal dialogs
- Each estimate row shows user avatar, value, and graph toggle
- Uses ValueRow component for consistent display pattern

DerivativeNode: Handles squiggle content and calculations
- Implementation of visualization still in progress
- Contains both formula value and calculated medians
- Shares ValueRow component with EstimateNode but may need different handling for formula display

Visualization Integration
- Currently working for EstimateNodes using @quri/squiggle-components
- SquiggleChart component used to display distributions
- Modal pattern established for graph display to manage space constraints
- Further investigation needed for derivative node visualization

Component Architecture
- ValueRow: Shared component handling both estimate and derivative displays
- Maintains consistent UI patterns while allowing for different styling (indigo for estimates, emerald for derivatives)