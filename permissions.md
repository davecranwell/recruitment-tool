# Permission Matrix

## Entities

|                   | Superuser | Organisation Owner    | Hiring Manager (e.g recruiter)       | Basic User (e.g interviewer) | Applicant |
| ----------------- | --------- | --------------------- | ------------------------------------ | ---------------------------- | --------- |
| Organisations     | All       | CRUD own              | CR                                   | CR                           | R         |
| Users             | All       | Invite to / Leave org | Invite to / Leave assigned positions | Edit own / Leave org         | Edit own  |
| Positions         | All       | CRUD all in org       | CRUD assigned positions              | R assigned                   | R         |
| Applicant Profile | All       | CRUD ??               | CRUD assigned positions              | R on positions assigned      | CRUD own  |
| Process           | All       | CRUD all in org       | CRUD assigned positions              | R on positions assigned      | None      |
| Stage             | All       | CRUD all in org       | CRUD assigned positions              | R on positions assigned      | None      |
| Comment           | All       | CRUD all in org       | CRUD assigned positions              | CRUD own                     | None      |

## Capabilities

|                                  | Superuser | Organisation Admin | Hiring Manager (e.g recruiter) | Basic User (e.g interviewer) | Applicant       |
| -------------------------------- | --------- | ------------------ | ------------------------------ | ---------------------------- | --------------- |
| View position salary             | Y all     | Y all              | Y assigned positions           | Y if publicised              | Y if publicised |
| View applicant asking salary     | Y all     | Y all              | Y assigned positions           | N                            | Y own           |
| Change applicant stages          | Y all     | Y all              | Y assigned positions           | N                            | N               |
| Change position published status | Y all     | Y all              | Y assigned positions           | N                            | N               |
