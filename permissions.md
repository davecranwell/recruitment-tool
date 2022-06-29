# Permission Matrix

## Entities

|                   | Superuser | Organisation Owner (e.g HR) | Hiring Manager (e.g recruiter)       | Basic User (e.g interviewer) | Applicant |
| ----------------- | --------- | --------------------------- | ------------------------------------ | ---------------------------- | --------- |
| Organisations     | All       | CRUD own                    | CR                                   | CR                           | R         |
| Projects          | All       | CRUD all in org             | CRUD all to which assigned           | CR all to which assigned     | R         |
| Positions         | All       | CRUD all in org             | RUD assigned by project              | R assigned by project        | R         |
| Users             | All       | Invite to / Leave org       | Invite to / Leave assigned positions | Edit own / Leave org         | Edit own  |
| Applicant Profile | All       | CRUD ??                     | CRUD assigned positions              | R on positions assigned      | CRUD own  |
| Process           | All       | CRUD all in org             | CRUD assigned positions              | R on positions assigned      | None      |
| Stage             | All       | CRUD all in org             | CRUD assigned positions              | R on positions assigned      | None      |
| Comment           | All       | CRUD all in org             | CRUD assigned positions              | CRUD own                     | None      |

## Capabilities

|                                  | Superuser | Organisation Admin | Hiring Manager (e.g recruiter) | Basic User (e.g interviewer) | Applicant       |
| -------------------------------- | --------- | ------------------ | ------------------------------ | ---------------------------- | --------------- |
| View position salary             | Y all     | Y all              | Y assigned positions           | Y if publicised              | Y if publicised |
| View applicant asking salary     | Y all     | Y all              | Y assigned positions           | N                            | Y own           |
| Change applicant stages          | Y all     | Y all              | Y assigned positions           | N                            | N               |
| Change position published status | Y all     | Y all              | Y assigned positions           | N                            | N               |
