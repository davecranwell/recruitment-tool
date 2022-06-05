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

  const applicantUser = await prisma.user.create({
    data: {
      name: 'Applicant user',
      email: 'foo@bar2.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })

  const humanRecruiternUser = await prisma.user.create({
    data: {
      name: 'Human recruiter user',
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

  const user1ApplicantProfile = await prisma.applicantProfile.create({
    data: {
      profileName: 'General profile',
      askingSalary: 100000,
      userId: applicantUser.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const position = await prisma.position.create({
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
