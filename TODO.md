# To Do list

## Where you left off

- We're allowing people to create organisations. We've realised this is necessary because adding a pipeline for new jobs requires a pipeline to be chosen by the user. In tern this means pipelines must a) already exist in the DB to choose and b) should be unique to the org, so that users may rename or reorder their pipeline stages c) we don't want thousands of jobs from thousands of customers all hung to the same 2 or 3 pipelines.

## Core journey

- [ ] 1. Employer creates a position/role/job
- [ ] 1b. Org owner approves the position
- [ ] 2. Employer or Recruiter receives Applicant to add to hiring process of a specific job
- [ ] 3. Recruiter adds Applicant to position/role/job linking their Linkedin, CV and adds further data like asking salary
- [ ] 4. Hiring Manager reviews Applicant based on their CV
- [ ] 5. Hiring manager optionally scores Applicant based on their suitabilty before considering to advance them to the next stage
- [ ] 6. All applicants go into the same column for unreviewed new applicants. The date they were added is visible to make some kind of ordering possible.
- [ ] 7. Hiring manager moves an applicant into the suitable stage-related column
- [ ] 8. Hiring manager creates an interview for the stage, assigning Reviewers X and Y to it.
- [ ] 9. The interview's date/time is clearly displayed alongside the stage for this Applican
- [ ] 10. Hiring manager can see whether the applicant has been notified of the interview yet
- [ ] 11. Reviewers X and Y receive invitations via email
- [ ] 12. Each interview has a meeting description and/or link - such as to a Google Meet or Zoom call.
- [ ] 13. Reviewers X and Y assess the Applicant and provide a score for the interview
- [ ] 14. Hiring Manager repeats steps 2-7 repeatedly
- [ ] 15. Hiring Manager now compares the scores of multiple interviews
- [ ] 16. Hiring Manager moves only high-scoring Applicants onto next stage
- [ ] 17. Hiring Manager repeats 10-11 until offer ready to be made to eligible Applicant

## Overall

- [x] Sharing of backend permissions rules with front end via session
- [x] Refresh tokens
- [x] Toast prompts for notifications
- [x] Monorepo codebase
- [x] Add Google Auth with calendar access
- [ ] Pipelines must either be made public or finessed to a point where the stages are usable by anyone
- [ ] Pipelines need to be automatically attributed to a project
- [ ] Pipelines need to be automatically inheritted by a position from the project
- [ ] We're getting dangerously near to cookie limits (4096b) at 3135 already. Consider moving to a high-level provider served by an API call?
- [ ] Allow refresh tokens to be used multiple times for a brief period (10s) to account for multiple refresh calls in a short space of time (this will solve the need for sharing of cookies between parallel fetches in remix router)
- [ ] Interviews need to be cancellable

## Remix

- [x] dynamic regeneration of access tokens with refresh token
- [x] 404/500/403 errors handled generically by API call function in client
- [x] Form generation & validation system
- [x] Form submission errors that are orphaned from fields need displaying somewhere
- [x] Handle form submissions followed by redirects with expiring tokens
- [x] Support session.flash by reorganising how cookies are set
- [x] Better ErrorBoundaries so we can still display some branded chrome around most error messages

## Nest

- [x] Generate OpenAPI docs
- [x] Generate ER diagram from prisma schema
- [x] Pagination
- [x] Validate URL params
- [x] Validate request data
- [x] Rate limiting
- [x] CASL Permissions system for all entities in backend
- [x] Throw suitable errors when API calls are wrong
- [x] Cache permissions across session in JWT
- [x] Send invitations to orgs via email
- [x] Compress permissions in jwt using CASL pack/unpack
- [x] Ensure Google auth doesn't bypass invitation system: [technically it can't because a user using google auth without registering would have no organisations associated]
- [ ] Finish applying permissions to all entities
  - [x] Pipelines (irrelevant: through position)
  - [x] Positions
  - [x] Projects
  - [x] Stages (irrelevant: through pipeline)
  - [ ] Users
  - [ ] Applicant Profiles
  - [ ] Invitations
  - [ ] Organisations
- [ ] Blocking known users failed auth (nb: preventing brute force of any user already limited by rate limiting)
- [ ] Edit users by getting them from DB based on their org relationship, not straight from users, which is basically too open
- [ ] Share back end types with front end
- [ ] Ensure prisma exception filter doesn't throw verbose errors in production
- [ ] Trimming all user input with a Pipe
- [ ] Move permissions to Redis to reduce size of cookie
- [ ] ClassSerializerInterceptor doesn't allow you to specify groups (move to PrismaClasSerializerInterceptorPaginated for now)
- [ ] Sendgrid implementation in invitation service should be extracted to own service
- [ ] make salting rounds for bcrypt a config var
- [ ] Ensure all strings are max-length tested in DTOs

## Features

- [x] Allow user to swap between the organisations of which they're a member
- [x] Inviting/adding new users
- [x] Advancing candidates to each stage through select UI
- [x] Approvals (e.g for hiring)
- [x] Allocating users to a project
- [x] Changing user role
- [x] Saving unsubmitted form content (done for assessments only)
- [ ] 2FA https://wanago.io/2021/03/08/api-nestjs-two-factor-authentication/
- [ ] Allowing an email to be written and sent when stages change (or soon after)
- [ ] RTBF
- [ ] Sending an email to candidates as they are invited to interview
- [ ] internal email templating system using mjml
- [ ] Invitations to an org expire
- [ ] Score a candidate in multiple ways using assessments
- [ ] Multiple scoring system schemas

## Potential Names

- Candidate
- Hiring
- job hunting
- skills
- Skillful
- Screening
- Qualifing
- Winner
- Jobs
- Placement
- Careers
- Prospect
- Applicant
- Recruiting
- Selecting
- Choosing
- Interview: intrvoo (available) intavoo (not available) int
