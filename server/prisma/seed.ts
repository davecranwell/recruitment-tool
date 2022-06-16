import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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

  const recruiterUser = await prisma.user.create({
    data: {
      name: 'Recruiter user',
      email: 'foo@bar3.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
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
      name: 'Humand recruiter user',
      email: 'foo@bar6.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: humandRecruiter.id, role: 'STANDARD' }],
      },
    },
  })

  const vocovoOrganisationUser = await prisma.user.create({
    data: {
      name: 'Vocovo org user',
      email: 'foo@bar4.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id, role: 'STANDARD' }],
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

  const applicant1Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'General profile',
      askingSalary: 100000,
      userId: applicantUser1.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const applicant2Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'My profile',
      askingSalary: 1500000,
      userId: applicantUser2.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const applicant3Profile = await prisma.applicantProfile.create({
    data: {
      profileName: 'First profile',
      askingSalary: 50000,
      userId: applicantUser3.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const position1 = await prisma.position.create({
    data: {
      name: 'Lead Software Engineer',
      description: 'A description of this role is as follows',
      openingDate: new Date(),
      // closingDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      organisationId: vocovoOrganisation.id,
      // applicantProfiles: {
      //   create: [{ applicantPId: applicantProfile.id }],
      // },
    },
  })

  const position2 = await prisma.position.create({
    data: {
      name: 'QA Lead',
      description: 'A description of this role is as follows',
      openingDate: new Date(),
      // closingDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
      organisationId: vocovoOrganisation.id,
      // applicantProfiles: {
      //   create: [{ applicantPId: applicantProfile.id }],
      // },
    },
  })

  const position1userRole1 = await prisma.positionUserRole.create({
    data: {
      positionId: position1.id,
      userId: humanRecruiternUser.id,
      role: 'HIRING_MANAGER',
    },
  })

  const position1userRole2 = await prisma.positionUserRole.create({
    data: {
      positionId: position1.id,
      userId: vocovoInterviewer.id,
      role: 'INTERVIEWER',
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
