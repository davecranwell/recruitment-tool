# To Do list

## Overall

- [x] Sharing of backend permissions rules with front end via session
- [x] Refresh tokens
- [x] Allow user to swap between their organisations of which they're a member
- [ ] Pipelines must either be made public or finessed to a point where the stages are usable by anyone
- [ ] Pipelines need to be automatically attributed to a project
- [ ] Pipelines need to be automatically inheritted by a position from the project

## Front end

- [x] 404/500/403 errors handle by API call in client
- [x] Form generation & validation system
- [x] Form submission errors that are orphaned from fields need displaying somewhere
- [ ] Need some dynamic project chooser UI so pagination of projects is still workable

## Back end

- [x] Generate OpenAPI docs
- [x] Generate ER diagram from prisma schema
- [x] Cache permissions across session
- [x] Validate URL params
- [x] Validate request data
- [x] Throw suitable errors when API calls are wrong
- [x] CASL Permissions system for all entities in backend
- [x] Pagination
- [x] Rate limiting
- [ ] Share back end types with front end
- [ ] Invitations to an org expire
- [ ] Ensure prisma exception filter doesn't throw verbose errors in production

## Features

- [ ] Inviting/adding new users
- [ ] Changing user role
- [ ] 2FA
- [ ] RTBF
- [ ] Advancing candidates to each stage through select UI
- [ ] Allocating users to a project
- [ ] Sending an email to candidates as they reach each stage
