# LibRead Text Reader Debug Session Progress

## Overview
We are in the middle of a comprehensive debugging session for the LibRead text reader, specifically focused on paragraph indicator synchronization issues and identifying other potential problems in the shared speech synthesis components.

## Current Branch Status
- **Branch**: `debug-text` (created from main)
- **Base Commit**: `6ab0454` - "Implement Text Reader with modular components and localStorage persistence"
- **Working Directory**: Clean (latest changes committed)

## Problems Identified and Status

### ✅ SOLVED: Primary Paragraph Indicator Sync Issue
**Problem**: When using Previous/Next navigation buttons after jumping to a paragraph, the visual indicator would get stuck and not follow speech auto-progression.

**Root Cause**: The `jumpToParagraph` function in `useSpeechSynthesis.ts` was not receiving the `onParagraphChange` callback, so when speech auto-progressed from one paragraph to the next, the visual indicator wasn't updated.

**Solution Applied** (Commit `029e240`):
1. Added `onParagraphChange` parameter to `jumpToParagraph` function
2. Updated `TextToSpeechControls.tsx` to pass the callback when calling `jumpToParagraph`
3. Modified the callback resolution logic to use provided callback or fall back to ref

**Files Changed**:
- `src/hooks/useSpeechSynthesis.ts` - Added callback parameter to `jumpToParagraph`
- `src/components/TextToSpeechControls.tsx` - Pass callback in `handlePrevious` and `handleNext`

**Impact**: This fix applies to both Text Reader (`/text`) and Web Reader (`/web`) since they share the same components.

### 🔍 POTENTIAL ISSUE: Speed Change Callback Problem
**Location**: `useSpeechSynthesis.ts` line 197 in `setRate` function
**Issue**: Similar to the fixed issue, when speed changes during playback, the function uses `onParagraphChangeRef.current || undefined` which might be null in some scenarios.

**Code**:
```typescript
speak(paragraphsRef.current, currentParagraph, onParagraphChangeRef.current || undefined, rate);
```

**Analysis**: This might not be a real issue since `onParagraphChangeRef.current` should be set when speech initially starts (line 66 in speak function). Needs testing to confirm if this actually causes problems.

### 🔍 POTENTIAL ISSUE: Paragraph Click Callback Missing
**Location**: `src/app/text/page.tsx` line 31 in `handleParagraphClick`
**Issue**: When user clicks on a paragraph directly, the call to `jumpToParagraph` doesn't pass the callback.

**Code**:
```typescript
jumpToParagraphRef.current(index, paragraphs); // Missing onParagraphChange callback
```

**Should be**:
```typescript
jumpToParagraphRef.current(index, paragraphs, setCurrentParagraph);
```

**Impact**: This would cause the same sync issue when clicking paragraphs directly (vs using Previous/Next buttons).

## Current Investigation Status

### ✅ COMPLETED
1. **Root cause analysis** of paragraph indicator sync issue
2. **Primary fix implemented** for Previous/Next button navigation
3. **Build and lint verification** - All passing
4. **Initial review** of speech synthesis hook for other callback issues

### 🔄 IN PROGRESS  
**Review of paragraph click handling** in display components - Found potential issue in text reader page

### 📋 PENDING INVESTIGATION
1. **Edge case testing**: Rapid clicking, state changes during speech
2. **Race condition analysis**: Speech cancellation/restart scenarios  
3. **Web reader verification**: Confirm paragraph clicking works correctly there
4. **Speed change testing**: Verify if setRate callback issue actually manifests
5. **Resume/pause testing**: Ensure state consistency during pause/resume cycles

## Next Steps (Prioritized)

### HIGH PRIORITY
1. **Fix paragraph click callback issue** in `src/app/text/page.tsx`
2. **Check web reader paragraph clicking** for same issue in `src/app/web/page.tsx`  
3. **Test speed changes during playback** to see if callback issue manifests

### MEDIUM PRIORITY  
4. **Edge case testing**: Rapid Previous/Next clicking during speech
5. **Race condition testing**: Quick speech cancellation/restart scenarios
6. **Pause/resume state consistency** verification

### LOW PRIORITY
7. **Code review**: Look for other similar callback patterns
8. **Performance review**: Check for unnecessary re-renders or state updates

## Test Scenarios to Validate

### Primary Bug Test (FIXED)
1. Reload page → Click paragraph 3 → Click Previous to paragraph 1 → Let play naturally to paragraph 2
2. **Expected**: Indicator follows speech progression  
3. **Status**: ✅ WORKING

### Paragraph Click Test (NEEDS FIX)
1. Reload page → Click paragraph 3 directly → Let play naturally to paragraph 4
2. **Expected**: Indicator should follow speech progression
3. **Status**: 🔍 NEEDS TESTING after fix

### Speed Change Test (NEEDS TESTING)
1. Start speech → Change speed during playback → Continue listening
2. **Expected**: Indicator should stay synced after speed change
3. **Status**: 🔍 NEEDS TESTING

### Rapid Navigation Test (NEEDS TESTING)
1. Click Previous/Next rapidly multiple times during speech
2. **Expected**: Should handle gracefully without sync issues
3. **Status**: 🔍 NEEDS TESTING

## Technical Architecture Notes

### Shared Components Affected
- `src/hooks/useSpeechSynthesis.ts` - Core speech logic used by all readers
- `src/components/TextToSpeechControls.tsx` - Audio controls used by all readers  
- Any fixes here impact: Text Reader, Web Reader, and future Novel Reader

### State Management Pattern
- **Visual State**: Managed by parent components (`currentParagraph` in page components)
- **Speech State**: Managed by `useSpeechSynthesis` hook (`speechState.currentParagraph`)
- **Sync Mechanism**: `onParagraphChange` callback to update visual state when speech progresses

### Callback Flow Pattern
```
Parent Component 
  ↓ (passes onParagraphChange)
TextToSpeechControls 
  ↓ (passes to speech functions)  
useSpeechSynthesis hook
  ↓ (calls during speech events)
onParagraphChange callback
  ↓ (updates visual state)
Parent Component currentParagraph
```

## Files Currently Under Review
- `src/hooks/useSpeechSynthesis.ts` - Main speech synthesis logic
- `src/components/TextToSpeechControls.tsx` - Audio control buttons
- `src/app/text/page.tsx` - Text reader page implementation  
- `src/app/web/page.tsx` - Web reader page implementation (pending review)
- `src/components/TextDisplay.tsx` - Text content display with clickable paragraphs
- `src/components/ContentDisplay.tsx` - Web content display with clickable paragraphs

## Context for Continuation
We are systematically reviewing all speech synthesis and UI interaction patterns to find and fix callback/sync issues similar to the one we just resolved. The goal is to ensure rock-solid state synchronization between speech progression and visual indicators across all reader types.

The investigation approach is methodical: identify potential issues through code review, create test scenarios, verify problems exist, implement targeted fixes, and validate with comprehensive testing.

Current todo list shows we're in the middle of paragraph click handling review and have several other investigation areas queued up.