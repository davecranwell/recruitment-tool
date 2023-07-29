# ADR

## SelectUser component

This component used to select users within an organisation is going to display all possible users by default with client-side searching. As a tool aimed at small companies, i'm choosing to defer any thought into server-side searching (or filtering) until a time that the number of users warrants that kind of effort.

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

Projects are not needed actively most of the time, but they support the workflow of users, and answer the question of who can create a new job position: If a "hiring manager" is attributable to a position, but no positions have been created yet, how do we allow someone to create the first position? If "Hiring manager" were an attribute of a user-organisation relationship, how do we prevent the hiring manager of one department seeing all the jobs opened by another department - inc. their salaries?

Projects allow us to create mutually exclusive bubbles in which hiring managers can be assiged to the project without departments seeing each other. They mean the relationships between the hiring manager and their interviewers (or any other lower role) can be managed in isolation per department.

Projects therefore have configuration: the roles of the users involved in them, and potentially settings concerning other department-level processes. Most of the time however, the project is of little interest - it will appear like an arbitrary grouping.

Organisation owners may want to see the entire set of projects on their own. Everyone else will probably want to see the projects only as a heading above the _positions_ which are of much greater interest to them.

Projects should therefore have an area to configure them, which is hidden to all but organisation owners, and the references to project names should be relegated in the UI in favour of position information

## Position Approvals

A position gains approval after a set number of approvals (as defined in the Project). Since awareness of successful approval must go to someone, we'll say that all hiring managers responsible for the project in which the position lives, get notified.

Approvals are given by users assigned to the project as a financial manager role. They may need an RBAC action of their own since "manage" is given to the org admin, and hiring managers should not be able to approve their own requested positions. At the moment I think hiring managers are given "manage" status which is too much.

## Pipelines

A default pipeline, meeting a simplistic definition in the server code, will be associated with each organisation upon creation. No two organisations will use the same pipeline. Stages in a pipeline will be created by users of the org (assuming the default stages/pipeline isn't good enough). We're doing this to avoid all orgs sharing a handful of pipelines, which ties too many unpredictable concerns across customers, to too few db entities.

Positions will all use the same pipeline as defined at the Project level. Positions in the same project cannot have different pipelines.

We're allowing people to create organisations. We've realised this is necessary because adding a pipeline for new jobs requires a pipeline to be chosen by the user. In tern this means pipelines must a) already exist in the DB to choose and b) should be unique to the org, so that users may rename or reorder their pipeline stages c) we don't want thousands of jobs from thousands of customers all hung to the same 2 or 3 pipelines. Therefore, to make this work we're going to have to assign pipelines to organisations, otherwise when a project is created and a default pipeline chosen, we won't be able to limit the list of pipelines to just those in the org.

## Event types

Events are actions performed by one user that have relevance to another user: things they would expect to be notified of happening. Our event types related to Positions, and ApplicantProfileForPosition to begin with. _All events are in the past tense_.

_Everything_ can be:

- Created
- Updated
- Deleted

In addition...

Positions can be:

- Approved

ApplicantProfileForPosition can be:

- Stage changed
- Disqualified

## Consent

Consent is required for all people of any type within the system. For thosen given access to the app as users, consent will be gained through some kind of disclaimer accepted while completing the signup.

For applicants, consent will either be gained by (in future) agreeing as part of the job application process - such as if the app generates job application forms - or by users of the app directly sending out consent requests. In consultation with recruiters, other consent systems apparently tend to work retroactively. In one example, the applicant is directly sent an email saying "We've gained your information through X or Y (e.g linkedin or a human referal) is it ok to add it ot the system to continue with your application?".

Applicants unwilling to consent will basically not be able to use applican, and nor will applicans users be able to consider them for jobs. This tradeoff will have to be made really clear, such as "If you do not consent to be stored in this database we will process no more of your information and you will not be considered for the job for which you have applied".

### RTBF

This will likely be done by overwriting users or applicants with some kind of mask, while also deleting any kind of contact information and files associated with the user. This way the referential integrity of the database remains, while the forgetting of the user is made possible. Google workspace does something similar and leaves around comments attributed to "Deleted user". I want to consider perhaps identifying an applicant by their first and last initials e.g Dave Cranwell might become "D**\* C**\*\*\*\*\*" which might help someone remember who they once were, but wouldn't be useful to someone else accessing the system maliciously.

The final note here is that users will need to be emailed an assurance that their data has been removed. This might be done by a queue in which their email is added, then deleted upon action. This would mean the main user/applicant record email can be removed without worrying about the queued message losing that information.

Removal might require the user's email address to be hashed, rendering it useless as an email address but findable using string comparison in case users need to know if their record has been deleted.

### Right Of Access

Right Of Access requests will be possible only by logged in users. For regular users this will be easy because they already have a login. For applicants this will be harder because although they have a user there is no password set. However it would be reasonable to force them to complete a full account creation before giving them access to their data. As an applicant they would gain accessto Applican then navigate to a GDPR area. It would need to be generically branded regardless which brand was using applican for their hiring.

### Revoking consent

### Privacy notice

Naturally, we need one that links to the RTBF form.
