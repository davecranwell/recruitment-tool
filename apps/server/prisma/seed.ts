import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // ORGANISATIONS

  const vocovoOrganisation = await prisma.organisation.create({
    data: {
      name: 'VoCoVo Ltd',
      machineName: 'vocovotld',
    },
  })

  const strongbyteOrganisation = await prisma.organisation.create({
    data: {
      name: 'Strongbyte Ltd',
      machineName: 'strongbyteltd',
    },
  })

  const humandRecruiter = await prisma.organisation.create({
    data: {
      name: 'Humand',
      machineName: 'humand',
      // applicants: {
      //   create: [{ applicantId: applicant.id }],
      // },
    },
  })

  const corriculoRecruiter = await prisma.organisation.create({
    data: {
      name: 'Corriculo',
      machineName: 'corriculo',
      // applicants: {
      //   create: [{ applicantId: applicant.id }],
      // },
    },
  })

  // PROJECTS

  const vocovoOrganisationProject1 = await prisma.project.create({
    data: {
      name: 'VoCoVo Project 1',
      organisationId: vocovoOrganisation.id,
    },
  })
  const vocovoOrganisationProject2 = await prisma.project.create({
    data: {
      name: 'VoCoVo Project 2',
      organisationId: vocovoOrganisation.id,
    },
  })

  const strongbyteOrganisationProject1 = await prisma.project.create({
    data: {
      name: 'Strongbyte Project 1',
      organisationId: strongbyteOrganisation.id,
    },
  })
  const strongbyteOrganisationProject2 = await prisma.project.create({
    data: {
      name: 'Strongbyte Project 2',
      organisationId: strongbyteOrganisation.id,
    },
  })

  // USERS

  const recruiterUser = await prisma.user.create({
    data: {
      name: 'Recruiter for VoCoVo',
      email: 'foo@bar3.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id, role: 'STANDARD' }],
      },
    },
  })

  // TODO we have to figure out how applicants should/should not get an organisation asociated with them
  const applicantUser1 = await prisma.user.create({
    data: {
      name: 'Applicant user',
      email: 'foo@bar2.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })
  const applicantUser2 = await prisma.user.create({
    data: {
      name: 'Applicant user 2',
      email: 'foo@bar21.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })
  const applicantUser3 = await prisma.user.create({
    data: {
      name: 'Applicant user 3',
      email: 'foo@bar22.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })

  /**
   * THis user should have no power at the org level, but should be able to
   * act as a hiring manager for the Lead Software Engineer role
   */
  const humanRecruiternUser = await prisma.user.create({
    data: {
      name: 'Humand standard user',
      email: 'foo@bar6.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [
          { organisationId: humandRecruiter.id, role: 'STANDARD' },
          { organisationId: vocovoOrganisation.id, role: 'STANDARD' },
        ],
      },
    },
  })

  const vocovoOrganisationUser = await prisma.user.create({
    data: {
      name: 'Vocovo org owner',
      email: 'foo@bar4.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id, role: 'ORGANISATION_OWNER' }],
      },
    },
  })

  const vocovoInterviewer = await prisma.user.create({
    data: {
      name: 'Vocovo Interviewer',
      email: 'foo@bar7.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id, role: 'STANDARD' }],
      },
    },
  })

  const bothOrganisationsUser = await prisma.user.create({
    data: {
      name: 'Both org user',
      email: 'foo@bar5.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [
          { organisationId: vocovoOrganisation.id, role: 'STANDARD' },
          { organisationId: strongbyteOrganisation.id, role: 'STANDARD' },
        ],
      },
    },
  })

  // STAGES & PIPELINES
  const standardPipeline = await prisma.pipeline.create({
    data: {
      name: 'Standard pipeline',
      stages: {
        create: [
          {
            order: 1,
            stage: {
              create: {
                name: 'Stage 1',
              },
            },
          },
          {
            order: 2,
            stage: {
              create: {
                name: 'Stage 2',
              },
            },
          },
          {
            order: 3,
            stage: {
              create: {
                name: 'Stage 3',
              },
            },
          },
          {
            order: 4,
            stage: {
              create: {
                name: 'Disqualified',
              },
            },
          },
        ],
      },
    },
  })

  const shortPipeline = await prisma.pipeline.create({
    data: {
      name: 'Short pipeline',
      stages: {
        create: [
          {
            order: 1,
            stage: {
              create: {
                name: 'Offered',
              },
            },
          },
          {
            order: 4,
            stage: {
              create: {
                name: 'Disqualified',
              },
            },
          },
        ],
      },
    },
  })

  // POSITIONS

  const position1 = await prisma.position.create({
    data: {
      name: 'Lead Software Engineer',
      description: 'A description of this role is as follows',
      openingDate: new Date(),
      // closingDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      projectId: vocovoOrganisationProject1.id,
      organisationId: vocovoOrganisation.id,
      // applicantProfiles: {
      //   create: [{ applicantPId: applicantProfile.id }],
      // },
      pipelineId: standardPipeline.id,
    },
  })

  const position2 = await prisma.position.create({
    data: {
      name: 'QA Lead',
      description: 'A description of this role is as follows',
      openingDate: new Date(),
      // closingDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      projectId: vocovoOrganisationProject2.id,
      organisationId: vocovoOrganisation.id,
      // applicantProfiles: {
      //   create: [{ applicantPId: applicantProfile.id }],
      // },
      pipelineId: shortPipeline.id,
    },
  })

  // POSITION USER ROLES

  const position1userRole1 = await prisma.projectUserRole.create({
    data: {
      projectId: vocovoOrganisationProject1.id,
      userId: humanRecruiternUser.id,
      role: 'HIRING_MANAGER',
    },
  })

  const position1userRole2 = await prisma.projectUserRole.create({
    data: {
      projectId: vocovoOrganisationProject2.id,
      userId: vocovoInterviewer.id,
      role: 'INTERVIEWER',
    },
  })

  // APPLICANT PROFILES

  // get standard pipeline first stage Id
  const standardPipelineStages = await prisma.pipeline.findUnique({
    where: { id: standardPipeline.id },
    include: { stages: { orderBy: { order: 'asc' }, include: { stage: true } } },
  })

  const applicant1Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'Applicant 1 General profile',
      askingSalary: '$100000',
      userId: applicantUser1.id,
      organisations: {
        create: {
          organisationId: vocovoOrganisation.id,
        },
      },
      positions: {
        create: {
          stageId: standardPipelineStages.stages[0].stageId,
          positionId: position1.id,
        },
      },
    },
  })

  const applicant2Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'Applicant 2 My profile',
      askingSalary: '£1500000',
      userId: applicantUser2.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const applicant3Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'Applicant 3 First profile',
      askingSalary: '£50000 - £70000',
      userId: applicantUser3.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  // SCORING SYSTEMS

  const scoringSystem1 = await prisma.scoringSystem.create({
    data: {
      name: 'Strong hire to strong no hire',
      type: 'LIKERT',
      schema: [
        { key: 'Strong no hire', val: 25, icon: '😢' },
        { key: 'No hire', val: 50, icon: '🙁' },
        { key: 'Hire', val: 75, icon: '🙂' },
        { key: 'Strong hire', val: 100, icon: '🤩' },
      ],
    },
  })

  const scoringSystem2 = await prisma.scoringSystem.create({
    data: {
      name: '5 star',
      type: 'LINEAR',
      schema: [
        { val: 20, key: '1' },
        { val: 40, key: '2' },
        { val: 60, key: '3' },
        { val: 80, key: '4' },
        { val: 100, key: '5' },
      ],
    },
  })

  // QUESTION SET

  const questions = await prisma.questions.create({
    data: {
      name: 'My standard questions',
      questions: {
        create: [
          { text: 'Where does the rain in spain fall?' },
          { text: 'What is the flightspeed of an unlayden sparrow?' },
        ],
      },
    },
  })

  // INTERVIEW

  const interview1 = await prisma.interview.create({
    data: {
      applicantProfileId: applicant1Profile.id,
      stageId: standardPipelineStages.stages[0].stageId,
      positionId: position1.id,
      scoringSystemId: scoringSystem1.id,
      startDateTime: new Date(),
      endDateTime: new Date(new Date().getTime() + 1000 * 60),
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
