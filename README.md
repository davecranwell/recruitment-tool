# Links

- [Client readme](client/README.md)
- [Server readme](<(server/README.md)>)
- [Server ER diagram](server/prisma/ER.md)
- [Permissions](permissions.md)

## Random Thoughts

### Projects

Projects are not needed most of the time, but they answer the question of who can create a new job position: If a "hiring manager" is attributable to a position, but no positions have been created yet, how do we allow someone to create the first position? It's a chicken/egg problem. If "Hiring manager" were an attribute of a user-organisation relationship, how do we prevent the hiring manager of one department seeing all the jobs opened by another department - inc. their salaries?

Projects allow us to create mutually exclusive bubbles in which hiring managers can be assiged to the project without departments seeing each other. They mean the relationships between the hiring manager and their interviewers (or any other lower role) can be managed in isolation per department.

Projects therefore have configuration: the roles of the users involved in them, and potentially settings concerning other department-level processes. Most of the time however, the project is of little interest - it will appear like an arbitrary grouping.

Organisation owners may want to see the entire set of projects on their own. Everyone else will probably want to see the projects only as a heading above the _positions_ which are of much greater interest to them.

Projects should therefore have an area to configure them, which is hidden to all but organisation owners, and the references to project names should be relegated in the UI in favour of position information
