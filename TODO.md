# To Do list

## Where you left off

- In the middle of adding interviews. You've allowed an interview to be created and validated that all the data with which to do so is allowed by the user.
- You're in the middle of creating a UI to create an interview and you're getting the list of interviewers from the project role relationships

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

## Remix

- [x] dynamic regeneration of access tokens with refresh token
- [x] 404/500/403 errors handled generically by API call function in client
- [x] Form generation & validation system
- [x] Form submission errors that are orphaned from fields need displaying somewhere
- [x] Handle form submissions followed by redirects with expiring tokens
- [x] Support session.flash by reorganising how cookies are set
- [ ] Need some dynamic project chooser UI so pagination of projects is still workable
- [ ] Better ErrorBoundaries so we can still display some branded chrome around most error messages

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
  - [ ] Applicant Profiles
  - [ ] Invitations
  - [ ] Organisations
  - [ ] Pipelines
  - [ ] Positions
  - [ ] Projects
  - [ ] Stages
  - [ ] Users
- [ ] Blocking known users failed auth (nb: preventing brute force of any user already limited by rate limiting)
- [ ] Edit users by getting them from DB based on their org relationship, not straight from users, which is basically too open
- [ ] Share back end types with front end
- [ ] Ensure prisma exception filter doesn't throw verbose errors in production
- [ ] Trimming all user input with a Pipe
- [ ] Move permissions to Redis to reduce size of cookie
- [ ] ClassSerializerInterceptor doesn't allow you to specify groups (move to PrismaClasSerializerInterceptorPaginated for now)
- [ ] Sendgrid implementation in invitation service should be extracted to own service
- [ ] make salting rounds for bcrypt a config var

## Features

- [x] Allow user to swap between the organisations of which they're a member
- [x] Inviting/adding new users
- [x] Advancing candidates to each stage through select UI
- [ ] Allocating users to a project
- [ ] Allowing an email to be written and sent when stages change (or soon after)
- [ ] Changing user role
- [ ] 2FA
- [ ] RTBF
- [ ] Sending an email to candidates as they are invited to interview
- [ ] internal email templating system using mjml
- [ ] Invitations to an org expire
- [ ] Saving unsubmitted form content

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
