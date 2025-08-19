# CLAUDE.md Best Practices Guide

## Overview

The CLAUDE.md file serves as a project's "constitution" - a centralized documentation hub that transforms Claude from a generic AI assistant into a project-aware expert. This file is automatically loaded into Claude's context when starting a session, making it essential for consistent, high-quality AI assistance.

## File Structure & Organization

### Recommended Sections

#### 1. Project Overview
```markdown
# Project Name
Brief description of what the project does and its main purpose.

## Tech Stack
- Frontend: [Framework/Library]
- Backend: [Technology]
- Database: [Database system]
- Testing: [Testing frameworks]
- Build tools: [Build system]
```

#### 2. Development Commands
```markdown
# Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run lint` - Run linter
- `npm run typecheck` - Run type checking
```

#### 3. Project Structure
```markdown
# File Structure
```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── app/           # Next.js app directory
```
```

#### 4. Code Standards
```markdown
# Code Style
- Use TypeScript for all new files
- Prefer functional components over class components
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible: `import { foo } from 'bar'`
- Add JSDoc comments for complex functions
- Use meaningful variable and function names

# Naming Conventions
- Components: PascalCase (UserProfile.tsx)
- Files: camelCase (userUtils.ts)
- Constants: SCREAMING_SNAKE_CASE
- CSS classes: kebab-case
```

#### 5. Workflow Guidelines
```markdown
# Workflow
- Always run `npm run build` and `npm run lint` before committing
- Create meaningful commit messages following conventional commits
- Test changes locally before pushing
- Use feature branches for new functionality
- NEVER commit sensitive information (API keys, passwords)
```

#### 6. Architecture Patterns
```markdown
# Architecture
- Follow component composition over inheritance
- Use custom hooks for reusable stateful logic
- Keep components small and focused (single responsibility)
- Prefer server components when possible (Next.js)
- Use TypeScript interfaces for all props and data structures
```

#### 7. Important Files & Directories
```markdown
# Key Files
- @package.json - Project dependencies and scripts
- @README.md - Project setup and overview
- @tsconfig.json - TypeScript configuration
- @tailwind.config.js - Styling configuration

# Do Not Modify
- .next/ directory (build output)
- node_modules/ directory
- Auto-generated files
```

## Advanced Features

### File Imports
Use the `@` syntax to reference other files:
```markdown
See @README.md for project setup instructions.
Check @package.json for available npm scripts.
```

### Hierarchical Structure
- Place CLAUDE.md in project root for global context
- Add directory-specific CLAUDE.md files for module-specific instructions
- More specific files override general ones

## Writing Best Practices

### 1. Be Concise Yet Comprehensive
- Focus on essential information that impacts development decisions
- Avoid explaining obvious concepts
- Provide context for "why" not just "what"

### 2. Use Clear Structure
- Use markdown headings for organization
- Employ bullet points for easy scanning
- Bold important rules or restrictions
- Use code blocks for examples

### 3. Emphasize Critical Information
```markdown
**IMPORTANT:** Always run tests before committing
**YOU MUST:** Use TypeScript for all new components
**NEVER:** Commit API keys or sensitive data
```

### 4. Provide Examples
```markdown
# Good Component Structure
```typescript
interface Props {
  title: string;
  onClick: () => void;
}

export default function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}
```
```

### 5. Keep It Living Documentation
- Update when project structure changes
- Add new commands as they're introduced
- Remove outdated information
- Review periodically for accuracy

## Quick Tips

### Using Claude Code Features
- Press `#` during a session to quickly add memories
- Use `/memory` command to edit CLAUDE.md files
- Restart sessions to reload updated instructions

### Performance Optimization
- Keep file under 2000 lines for optimal performance
- Use imports for large sections instead of inline content
- Focus on frequently-used information

### Team Collaboration
- Check CLAUDE.md into version control
- Use consistent structure across projects
- Document team-specific conventions
- Create project-specific guidelines

## Common Mistakes to Avoid

1. **Over-documentation** - Don't document every minor detail
2. **Stale information** - Remove outdated instructions
3. **Generic content** - Make it specific to your project
4. **Missing rationale** - Explain why rules exist
5. **Poor organization** - Use clear headings and structure

## Template Structure

```markdown
# [Project Name]

## Tech Stack
[List technologies used]

# Commands
[List development commands]

# Code Style
[Coding standards and conventions]

# Architecture
[Project structure and patterns]

# Workflow
[Development and deployment process]

# Key Files
[Important files and their purposes]

# Do Not Touch
[Files/directories to avoid modifying]
```

## Conclusion

An effective CLAUDE.md file transforms your AI assistant from a generic helper into a project expert. Invest time in creating and maintaining this file - it pays dividends in development efficiency and code quality consistency.

Remember: The best CLAUDE.md file is one that evolves with your project and reflects your actual development practices.