# Objective: 
Generate a detailed course outline expansion document for a software course based on a minimal course outline and a comprehensive course research info-pack provided as input. Both the outline and the research info-pack will be attached. 

# Goal: 
The generated document will serve as a comprehensive guide for screen recording production. Each lesson's section should provide detailed, actionable instructions for recording software demonstrations, with granular step-by-step guidance that enables a recorder to execute the screen recording without ambiguity, understanding its place within the overall course structure.

# Input: 
1. A course outline containing:
   - List of lesson titles
   - Course approach specification (vertical or horizontal)
   - Any predetermined features or topics to cover
   - Feature-to-lesson or feature-to-chapter mapping (if specified)
   - Case study scenarios (if provided for vertical approach)
2. The course content research info-pack containing:
   - Detailed software feature information
   - Step-by-step procedures for using features
   - Feature groupings or dependencies (if applicable)
   - Technical specifications and best practices

# Course Approach:
The course will follow one of two approaches (as specified in the input):
- **Vertical Approach**: Uses a persistent case study scenario throughout the course. Learners explore relevant software features within the context of a specific business function (e.g., "Excel for Financial Analysis"). If no case study is provided in the course outline, create an appropriate, realistic business scenario that aligns with the learner profiles.
- **Horizontal Approach**: Organized by software features. Each feature uses isolated case studies specific to demonstrating that feature's capabilities. Create mini-scenarios for each feature demonstration as needed.

# Output: 
A single, comprehensive expansion document covering all lessons from the input outline. When feature-to-lesson mapping is provided in the input, follow that structure exactly. Output should be only the content of the expansion document, with NO additional annotation or explanation outside of it.

# Learner Profile
## Accounting & Finance Professionals
These are time-poor early-career professionals in professional services. Their key pain points include repetitive tasks and competitive work environments. They want to become more efficient, free up time, and stand out professionally. Messaging should emphasize time-saving, automation, and real-world success stories.

## Management Consultants
Also in professional services, these individuals face high pressure to deliver results using client-specific software. Their goal is to upskill quickly and confidently. Effective messaging focuses on fast onboarding, mastering client tools, and efficient training that aligns with project demands.

## Corporate Finance Teams
CFOs and in-house finance staff are under pressure from tight reporting deadlines and outdated processes. Their goals include automation, better data analysis, and improved communication of financial insights. Messaging should highlight efficiency gains, modern tools, and enhanced internal influence.

# **VERY Important** Requirements
* The expansion document must provide **actionable, granular screen recording guidance** for each feature covered
* **Software Setup**: Include account creation, workspace setup, and initial configuration ONLY in the first screen recording lesson. Do not repeat setup instructions in subsequent lessons unless a feature requires unique setup steps
* Maintain continuity and logical flow across lessons while ensuring each lesson can stand alone for recording purposes
* The structure hierarchy must follow strictly the input course outline
* **Feature Distribution**: 
  - If the course outline or research pack provides explicit feature-to-lesson or feature-to-chapter mapping, follow that structure exactly
  - Otherwise, body lessons (middle lessons) should contain **max 3 features per lesson**
  - Some lessons may have only 1-2 features if that better serves the learning objectives or feature complexity
* Each feature guide must be detailed enough that a recorder can execute without additional clarification
* **Rule of thumb**: It's better to thoroughly explore one feature across multiple angles than to rush through many features superficially
* Estimated recording time per lesson should be **3-5 minutes** when following the guide
* For vertical approach courses, maintain case study continuity across lessons
* For horizontal approach courses, ensure each feature demonstration is self-contained
* First lesson typically introduces the software interface and navigation basics
* Last 1-2 lessons may be more conceptual (best practices, workflow optimization, etc.)

# Structure:
For every lesson in the provided outline, structure its section using the following format:

## For Introduction/Theory Lessons (typically first and last lessons):
```markdown
# Lesson 1 – [title] 

## Prior
[For lesson one, simply say "The first lesson", and no additional explanation needed in the Prior section.]

## This lesson
### Overview
[High-level introduction to the software/topic]
### Key Concepts
[Essential concepts to understand before hands-on work]
### Navigation Basics (if applicable)
[Basic interface orientation]

## Future 
### Next lesson 
[What features/topics will be introduced next]
### Will cover 
[A list of all upcoming lessons, must be the full list]
```

## For Screen Recording Lessons (body lessons):
```markdown
# Lesson [X] – [title]

## Prior
### Last lesson 
[What features/functions were covered in the last lesson]
### Introduced
[List of all features learned in previous lessons, must be the full list]
[For vertical approach: Current status of the case study]

## This lesson [number of features based on input structure or max 3 if not specified]

### Software Setup (ONLY for first screen recording lesson)
#### Account Creation & Initial Configuration
[Step-by-step guide for:
- Creating account/logging in
- Setting up workspace
- Configuring initial preferences
- Any necessary installations or plugins]

### Feature 1: [Feature Name]
#### Context
[When/why to use this feature]
[For vertical approach: How this fits into the case study]
[For horizontal approach: Specific scenario for this feature]

#### Screen Recording Guide
**Note: The following structure is an example. Adapt the sections and steps based on the specific software and feature being demonstrated. Add any additional sections necessary for clear guidance.**

1. **Starting Point** (Example)
   - Open [specific menu/tab/window]
   - Ensure [specific settings/view]
   
2. **Step-by-Step Actions** (Example - adapt based on software)
   - Click on [specific button/menu item]
   - You will see [describe what appears]
   - Select [specific option] from [dropdown/menu]
   - Notice [highlight important UI elements]
   - Enter [specific values/text] in [field names]
   - The result shows [expected outcome]
   
3. **Key Points to Emphasize** (Example)
   - [Important shortcuts/tips]
   - [Common mistakes to avoid]
   - [Best practices for this feature]

**Additional sections to include as needed:**
- Data preparation requirements
- Prerequisites or dependencies
- Alternative methods
- Troubleshooting common issues
- Performance considerations
- Integration with other features

#### Expected Outcome
[What the learner should see/achieve after completing these steps]

### Feature 2: [Feature Name]
[Follow same structure as Feature 1]

## Future 
### Next lesson 
[What features will be introduced next]
[For vertical approach: How the case study will progress]
### Will cover 
[List of remaining lessons, must be the full list]
```

## For Conclusion/Best Practices Lessons:
```markdown
# Lesson [Final] – [title]

## Prior
### Last lesson 
[Final features covered]
### Introduced
[Comprehensive list of all features learned, must be the full list]
[For vertical approach: Final case study outcome]

## This lesson
### Workflow Integration
[How to combine learned features effectively]
### Best Practices
[Professional tips and efficiency techniques]
### Common Pitfalls
[What to avoid in real-world usage]
### Next Steps
[How to continue learning beyond this course]

## Future 
[Simply say "The last lesson"]
```

# Additional Guidelines for Screen Recording Instructions:
* **The Screen Recording Guide structure is flexible** - adapt sections based on the specific software and feature complexity
* For the first screen recording lesson, include software setup steps (account creation, workspace configuration, initial settings)
* Use precise terminology for UI elements (e.g., "ribbon", "dialog box", "dropdown menu")
* Include exact button names and menu paths
* Specify keyboard shortcuts where applicable
* Note any version-specific differences if relevant
* Include expected system responses and wait times
* Highlight visual cues and indicators
* For data entry, provide exact sample values
* Indicate when to pause for explanation during recording
* Add any additional guide sections that would help create a clear, professional screen recording