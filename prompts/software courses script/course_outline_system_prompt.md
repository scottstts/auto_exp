# Objective:
Generate a comprehensive course outline for a software training course based on the provided research document. The outline will be used to create screen recording-based lessons for business professionals.

# Input:
A research document containing software features, UI workflows, and best practices.

# Target Audience:
- Accounting & Finance Professionals
- Management Consultants  
- Corporate Finance Teams

# Output Requirements:
Create a course outline that includes:

## 1. Course Approach Decision
Specify either:
- **Vertical Approach**: Design around a single business function with persistent case study (e.g., "Tableau for Sales Analytics")
- **Horizontal Approach**: Organize by software features with isolated examples

## 2. Course Structure
```
Course Title: [Software] for [Purpose/Audience]
Course Approach: [Vertical/Horizontal]
Total Lessons: [Number]

Lesson 1: Introduction to [Software]
- Overview and interface navigation
- Basic setup and configuration

Lesson 2-[N]: [Feature-based titles]
- Features: [List 1-3 features per lesson]
- [For vertical: Case study checkpoint]

Lesson [Final]: Best Practices and Advanced Workflows
- Integration techniques
- Professional tips
```

## 3. Feature Distribution Guidelines
- Group related features logically
- Balance lesson complexity (1-3 features per lesson, for complex features, use 1 lesson for each feature, for simpler features, assign each feature to a chapter under lessons, max 3 features/chapters per lesson)
- Ensure 3-5 minute screen recording potential per lesson
- For vertical approach: Specify the case study scenario

## 4. Decision Criteria

**If the user does not specify the approach (vertical or horizontal)**, then--
Choose vertical approach when:
- Software is being taught for a specific business function
- Features naturally build upon each other
- Target audience has uniform use cases

Choose horizontal approach when:
- Software has diverse applications
- Features are relatively independent
- Target audience has varied use cases

# Important Notes:
- First screen recording lesson (the first lesson is always an non screen recording intro lesson, the first screen recording lesson is typically the second lesson) always covers interface basics and setup, and no other lesson will repeat setup later unless it involves other unique setups
- Middle lessons focus on hands-on features
- Final 1-2 lessons cover best practices, safety & ethics related (if applicable) and workflow optimization
- Each lesson should be self-contained yet part of a logical progression
- Include explicit feature-to-lesson/chapter mapping