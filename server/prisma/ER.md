```mermaid
erDiagram

        PositionEmploymentType {
            FULL FULL
PART PART
CONTRACT CONTRACT
        }
    


        UserRoleType {
            RECRUITER RECRUITER
APPLICANT APPLICANT
ORGANISATION_OWNER ORGANISATION_OWNER
ORGANISATION_MEMBER ORGANISATION_MEMBER
STANDARD STANDARD
        }
    


        ProjectRoleType {
            HIRING_MANAGER HIRING_MANAGER
INTERVIEWER INTERVIEWER
        }
    
  User {
    Int id PK 
    String name  "nullable"
    String email  
    String password  "nullable"
    String refreshTokenHash  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    Boolean isRegisteredWithGoogle  
    String avatarUrl  "nullable"
    Json OAuth2Tokens  "nullable"
    }
  

  ApplicantProfile {
    Int id PK 
    String profileName  
    String askingSalary  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  Organisation {
    Int id PK 
    String name  
    String machineName  
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  ApplicantProfileForOrganisation {
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  Project {
    Int id PK 
    String name  
    String description  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  Position {
    Int id PK 
    String name  
    String description  "nullable"
    DateTime openingDate  "nullable"
    DateTime closingDate  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    PositionEmploymentType employment  "nullable"
    String location  "nullable"
    String salaryRange  "nullable"
    }
  

  UsersInOrganisation {
    DateTime createdAt  
    DateTime updatedAt  
    UserRoleType role  
    }
  

  UserRole {
    Int id PK 
    String name  
    UserRoleType type  
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  UserRolesOfUser {
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  ApplicantProfileForPosition {
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  ProjectUserRole {
    DateTime createdAt  
    DateTime updatedAt  
    ProjectRoleType role  
    }
  

  Stage {
    Int id PK 
    String name  
    String description  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  Pipeline {
    Int id PK 
    String name  
    String description  "nullable"
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  StagesInPipeline {
    Int order  
    DateTime createdAt  
    DateTime updatedAt  
    }
  

  Invitation {
    Int id PK 
    String email  
    UserRoleType role  "nullable"
    DateTime createdAt  
    }
  

  Interview {
    Int id PK 
    DateTime startDateTime  
    DateTime endDateTime  
    DateTime createdAt  
    }
  

  InterviewAttendee {

    }
  
    ApplicantProfile o{--|| User : "user"
    ApplicantProfileForOrganisation o{--|| ApplicantProfile : "applicantProfile"
    ApplicantProfileForOrganisation o{--|| Organisation : "organisation"
    Project o{--|| Organisation : "organisation"
    Position o|--|| PositionEmploymentType : "enum:employment"
    Position o{--|| Organisation : "organisation"
    Position o{--|| Pipeline : "pipeline"
    Position o{--|| Project : "project"
    UsersInOrganisation o|--|| UserRoleType : "enum:role"
    UsersInOrganisation o{--|| Organisation : "organisation"
    UsersInOrganisation o{--|| User : "user"
    UserRole o|--|| UserRoleType : "enum:type"
    UserRole o{--|| Organisation : "organisation"
    UserRolesOfUser o{--|| UserRole : "role"
    UserRolesOfUser o{--|| User : "user"
    ApplicantProfileForPosition o{--|| ApplicantProfile : "applicantProfile"
    ApplicantProfileForPosition o{--|| Position : "position"
    ApplicantProfileForPosition o{--|| Stage : "stage"
    ProjectUserRole o|--|| ProjectRoleType : "enum:role"
    ProjectUserRole o{--|| Project : "project"
    ProjectUserRole o{--|| User : "user"
    StagesInPipeline o{--|| Pipeline : "pipeline"
    StagesInPipeline o{--|| Stage : "stage"
    Invitation o|--|| UserRoleType : "enum:role"
    Invitation o{--|| Organisation : "organisation"
    Interview o{--|| ApplicantProfile : "applicantProfile"
    Interview o{--|| Position : "position"
    Interview o{--|| Stage : "stage"
    InterviewAttendee o{--|| Interview : "interview"
    InterviewAttendee o{--|| User : "user"
```
