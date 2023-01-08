# Fly Setup

```bash
curl -L https://fly.io/install.sh | sh
# and add the following to ~/.bashrc
export FLYCTL_INSTALL="/home/dave/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
```

# Running

`pnpm run docker:run`
`pnpm run dev`

## Regenerating prisma client

`pnpm run db:generate`
`pnpm run db:migrate`

# Links

- [Client readme](client/README.md)
- [Server readme](<(server/README.md)>)
- [Server ER diagram](server/prisma/ER.md)
- [Permissions](permissions.md)

# ADR

## API path logic

Routes which CREATE are always part of their own module & service. So creating an interview - even though it's inextricably part of a position - require the use of the `/interview` service not `/position/x/interview`.

Routes which GET can exist almost anywhere convenient. So getting the interview for the position just created, might be better done through `/position/x/interview/y`

## Interviews/Assessments

Applicants can be scorable at any point in their lifetime in the system, whether in interview or not. Therefore Assessments have been created to allow a many-to-one relationship with applicants at any point in the pipeline and so that any number of users can create an assessment without needing to go through "an interview". e.g An Assessment could be made when they first are added to the role, based on how suitable they appear prior to any interviewing.

Assessments have optional names, so that when connected to an interview this name might be blank (or the name of the interview) but when undertaken at any other time might be named to idenfity what is being assessed. For example other ATS allow users to rate an applicant on their Value For Money (their perceived worth based on their asking salary) or their Notice Period (shorter being more convenient).

Assessments without a connected interview are assumed to be a generalised asssessment of the candidate as a whole.

We might need a global, limited way of choosing which scoring system assessments use outside of interviews. In an interview the scoring system can be configured on the interview itself. But outside an interview, how do we prevent users choosing a scoring system inconsistent with other assessments made? This idea might be called an `Assessment group` perhaps?

Assessments can be created both in direct response to an interview and partially/incompletely without an interview associated.

### Scoring

Scoring of an assessment will occur based on schemas defined in this code and stored in the DB like:

### Questions

Questions are automatically versioned. If a set of questions is attached to an interview on which an assessment has been completed or started, or the interview has started, the next edit to those questions generates a new version which does not overwrite the first

Questions are part of an Interview not an Assessment. Since an Assessment can sometimes only exist after an interview, the Assessment needs to know which questions to take notes on and this means that without an Interview identifying the correct questions to use, there is no knowledge of which question to use before an Assessment is complete. ~~Assessments~~ therefore must copy the questions used from the Interview at the point of beginning the assessment, but taking a copy at the start of the interview, preventing any changes to questions that happen to occur during the interview from preventing the interview continuing.

```js
schema: [
  { val: 25, key: "strong no hire"}
  { val: 50, key: "no hire"}
  { val: 75, key: "hire"}
  { val: 100, key: "strong hire"}
]
```

All scores will range from 0-100 to allow insertion of new scores using whole numbers. 0-1 or 0-10 is also suitable but right now this feels like it could be a more user-friendly way of seeing the score in the data.

## Projects

Projects are not needed most of the time, but they answer the question of who can create a new job position: If a "hiring manager" is attributable to a position, but no positions have been created yet, how do we allow someone to create the first position? It's a chicken/egg problem. If "Hiring manager" were an attribute of a user-organisation relationship, how do we prevent the hiring manager of one department seeing all the jobs opened by another department - inc. their salaries?

Projects allow us to create mutually exclusive bubbles in which hiring managers can be assiged to the project without departments seeing each other. They mean the relationships between the hiring manager and their interviewers (or any other lower role) can be managed in isolation per department.

Projects therefore have configuration: the roles of the users involved in them, and potentially settings concerning other department-level processes. Most of the time however, the project is of little interest - it will appear like an arbitrary grouping.

Organisation owners may want to see the entire set of projects on their own. Everyone else will probably want to see the projects only as a heading above the _positions_ which are of much greater interest to them.

Projects should therefore have an area to configure them, which is hidden to all but organisation owners, and the references to project names should be relegated in the UI in favour of position information
