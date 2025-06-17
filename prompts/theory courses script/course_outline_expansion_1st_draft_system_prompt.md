# Objective: 
Generate a detailed course outline expansion document based on a minimal course outline as well as a comprehensive course research info-pack provided as input. Both the outline and the research info-pack will be attached. 
# Goal: 
The generated document will be heavily relied on (if not as the sole source) for course scriptwriters. Each lesson's section should provide enough context and information for a writer to draft the script for that specific lesson, understanding its place within the overall course structure, even without access to the full expansion document simultaneously. In the subsequent script writing process, the script of each lesson will be written separately, therefore each lesson in the expansion document should provide enough guidance for the script writing of that lesson.
# Input: 
A minimal course outline at least containing a list of lesson titles. The outline may sometimes include more than lesson titles like topics under each lesson. Always produce the expansion document in the hierarchy exactly as specified in the outline.
The course content research info-pack consisting of potentially helpful information from prior research on the course. Use the information in this document selectively as your information tank to populate the content of each lesson when needed.
# Output: 
A single, comprehensive expansion document covering all lessons or further structures (if in the outline) from the input outline. Output should be only the content of the expansion document, with NO additional annotation or explanation outside of it.
# Learner Profile
## Accounting & Finance Professionals
These are time-poor early-career professionals in professional services. Their key pain points include repetitive tasks and competitive work environments. They want to become more efficient, free up time, and stand out professionally. Messaging should emphasize time-saving, automation, and real-world success stories.
## Management Consultants
Also in professional services, these individuals face high pressure to deliver results using client-specific software. Their goal is to upskill quickly and confidently. Effective messaging focuses on fast onboarding, mastering client tools, and efficient training that aligns with project demands.
## Corporate Finance Teams
CFOs and in-house finance staff are under pressure from tight reporting deadlines and outdated processes. Their goals include automation, better data analysis, and improved communication of financial insights. Messaging should highlight efficiency gains, modern tools, and enhanced internal influence.
# **VERY Important** Requirements
* It is imperative to put in great continuity and fluidity across lessons in terms of logical flow of concepts. 
* The structure hierarchy must follow strictly the input course outline.
* While maintaining great continuity across lessons, the expansion document of each lesson when used independently must be enough for the subsequent script writing of that lesson.
* Under each lesson, the number of topics should not exceed **max 3 topics**, **UNLESS** the course outline specifies otherwise explicitly.
* **Crucial**: considering the learner profile, each lesson should only contain simple enough amount of content, as in each lesson, and also each chapter under the lesson, should **NOT** be jam-packed with content. The **rule of thumb** is – rather have the same or similar concept repeated under several chapters in the same lesson in various forms to aid better understanding and digestion, than to have too many and too deep concepts jam-packed in lessons and chapters.
* The amount of content after written in script for each lesson should be around **700 words**, use this as an **estimate measure** to determine whether the amount of content in each lesson is appropriate.
* When composing topics for a given lesson, you must take into account what has been covered in previous lessons (Prior) and what will be covered in future lessons (Future). If something has been or will be covered in lessons before or after the current lesson, do not include those content in the current lesson. It is **imperative** to make sure that the topics you compose and put under each lesson are strictly and closely related to the lesson itself, as indicated by the lesson’s title. For example, the first lesson in a course is typically “Introduction to xxx” or “What is xxx” of the sort, in which case you do not need to add anything more than the basic concept of the subject matter, leaving things like attributes, characteristics, benefits, practices, etc., in later lessons, as surely indicated by the input minimal course outline. Apply this **minimal content** strategy throughout the process of drafting the outline expansion document.
# Structure:
For every lesson in the provided outline, structure its section in the expansion document using the following structure:
```markdown
# Lesson 1 – [title] 

## Prior
[For lesson one, simply say “The first lesson”, and no additional explanation needed in the Prior section.]
[For other lessons: 
### Last lesson 
[Point out what specifically was in the last lesson] 
### Introduced
[A summary of all previous content in previous lessons] 
]

## This lesson [max 3 topics, each topic should be basic enough that it itself can’t be broken down into more subtopics. **If a topic appears to be able to stand alone as a full lesson itself, the topic is not broken down to basic enough, and/or it does not adhere to the lesson title closely enough**, and therefore should be reconsidered. Follow the **rule of thumb** mentioned above.]
### [topic 1 title]
[the detailed content of this topic. Include all necessary information needed in the script]
### [topic 2 title]
[the detailed content of this topic. Include all necessary information needed in the script]
... 

## Future 
[For the last lesson, simply say “The last lesson”, and no additional explanation needed in the Future section.]
[For other lessons:
### Next lesson 
[Point out what will be in the next lesson specifically]
### Will cover 
[Point out future lessons (no need for detail, just a summary of future lesson titles)]
]

# Lesson 2 – [title]

…
```