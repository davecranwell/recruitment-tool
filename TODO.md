# To Do list

## Overall

- [x] Sharing of backend permissions rules with front end via session
- [x] Refresh tokens
- [x] Toast prompts for notifications
- [ ] Pipelines must either be made public or finessed to a point where the stages are usable by anyone
- [ ] Pipelines need to be automatically attributed to a project
- [ ] Pipelines need to be automatically inheritted by a position from the project
- [ ] We're getting dangerously near to cookie limits (4096b) at 3135 already. Consider moving to a high-level provider served by an API call?

## Remix

- [x] dynamic regeneration of access tokens with refresh token
- [x] 404/500/403 errors handle by API call in client
- [x] Form generation & validation system
- [x] Form submission errors that are orphaned from fields need displaying somewhere
- [x] Handle form submissions followed by redirects with expiring tokens
- [x] Support session.flash by reorganising how cookies are set
- [ ] Need some dynamic project chooser UI so pagination of projects is still workable

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
- [ ] Finish applying permissions to all entities
  - [ ] Applicant Profiles
  - [ ] Invitations
  - [ ] Organisations
  - [ ] Pipelines
  - [ ] Positions
  - [ ] Projects
  - [ ] Stages
  - [ ] Users
- [ ] Edit users by getting them from DB based on their org relationship, not straight from users, which is basically too open
- [ ] Share back end types with front end
- [ ] Ensure prisma exception filter doesn't throw verbose errors in production
- [ ] Trimming all user input with a Pipe
- [ ] Move permissions to Redis to reduce size of cookie
- [ ] ClassSerializerInterceptor doesn't allow you to specify groups (move to PrismaClasSerializerInterceptorPaginated for now)

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
