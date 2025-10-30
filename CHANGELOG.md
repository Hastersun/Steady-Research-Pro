# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced project documentation with badges and better structure
- Comprehensive CONTRIBUTING.md guide
- Issue and PR templates for better collaboration
- CODE_OF_CONDUCT.md for community guidelines
- SECURITY.md for vulnerability reporting
- FEATURES.md showcasing detailed features
- FAQ.md with frequently asked questions
- Updated package.json with proper metadata and keywords

### Changed
- Improved README.md and README.en.md with clearer sections
- Better project structure documentation

## [1.0.6] - 2025-01-27

### Changed
- Removed creativity parameter control from SidePanel
- Simplified research configuration interface
- Depth level now displayed on a single row
- Fixed temperature value at 0.7 for consistent generation quality

### Improved
- Configuration panel layout and usability

## [1.0.5] - 2025-01-27

### Removed
- SourcesTable component to simplify the interface

### Changed
- Simplified main interface layout
- Focused on core research functionality

### Improved
- Reduced UI complexity
- Enhanced user experience
- Optimized page load performance

## [1.0.4] - 2025-01-27

### Removed
- Temperature (creativity) parameter control from OllamaPanel
- Temperature slider and related event listeners

### Changed
- Model configuration interface adjusted to two-column layout

### Improved
- Focused on core model management functionality
- Cleaner interface

## [1.0.3] - 2025-01-27

### Removed
- Quick test feature from OllamaPanel
- Related code and event listeners

### Changed
- Simplified interface focusing on model management and service status monitoring

### Improved
- Overall user experience
- Interface cleanliness and simplicity

## [1.0.2] - 2025-01-27

### Fixed
- All TypeScript type errors in ResearchAgentUI.astro
- Type inference issues with currentStep variable
- All TypeScript issues in OllamaPanel.astro
- Removed dependency on non-existent modules

### Changed
- Optimized component communication mechanism
- Improved error handling and boundary checks

### Improved
- Code structure and maintainability
- Clearer component responsibilities

## [1.0.1] - 2025-01-27

### Fixed
- TypeScript type errors throughout the codebase
- Property access errors on 'never' types
- Added proper type assertions and null checks

### Removed
- Deprecated @tailwindcss/line-clamp plugin (now built into Tailwind CSS v3.3+)

### Changed
- Refactored to custom-event based communication mechanism
- Optimized component communication

### Improved
- Code structure and maintainability
- Component responsibility separation

## [1.0.0] - Initial Release

### Added
- Core research assistant functionality
- Astro + Tailwind CSS + Ollama integration
- Multi-AI service support (Ollama, OpenAI, DeepSeek, Claude, Gemini)
- Multi-source search integration (Bing, Google)
- Real-time progress tracking
- Streaming data support
- Responsive UI design
- Research plan generation
- Information aggregation and synthesis
- Source tracking and citation

### Features
- Intelligent research planning
- Multi-source search and aggregation
- Real-time progress visualization
- Chain-of-thought reasoning display
- Flexible AI model selection
- Local and cloud AI support
- Privacy-focused local operation mode

---

## Legend

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes
- `Improved` for enhancements and optimizations

[Unreleased]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.6...HEAD
[1.0.6]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Hastersun/Steady-Research-Pro/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Hastersun/Steady-Research-Pro/releases/tag/v1.0.0
