import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const vocovoOrganisation = await prisma.organisation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'VoCoVo Ltd',
      machineName: 'vocovotld',
    },
  })

  const strongbyteOrganisation = await prisma.organisation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Strongbyte Ltd',
      machineName: 'strongbyteltd',
    },
  })

  const humandRecruiter = await prisma.organisation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Humand',
      machineName: 'humand',
      // applicants: {
      //   create: [{ applicantId: applicant.id }],
      // },
    },
  })

  const corriculoRecruiter = await prisma.organisation.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Corriculo',
      machineName: 'corriculo',
      // applicants: {
      //   create: [{ applicantId: applicant.id }],
      // },
    },
  })

  const recruiterUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Recruiter user',
      email: 'foo@bar3.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })

  const applicantUser = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Applicant user',
      email: 'foo@bar2.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      // organisations: {
      //   create: [{ organisationId: vocovo.id }, { organisationId: strongbyte.id }],
      // },
    },
  })

  const humanRecruiternUser = await prisma.user.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Human recruiter user',
      email: 'foo@bar6.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: humandRecruiter.id }],
      },
    },
  })

  const vocovoOrganisationUser = await prisma.user.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'Vocovo org user',
      email: 'foo@bar4.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id }],
      },
    },
  })

  const bothOrganisationsUser = await prisma.user.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      name: 'Both org user',
      email: 'foo@bar5.com',
      password: '$2a$10$Cer44Qb/fNW3flIcCEd.bONiYvyFwQtTewCGvZoeBlby78m94iwF.', // test
      organisations: {
        create: [{ organisationId: vocovoOrganisation.id }, { organisationId: strongbyteOrganisation.id }],
      },
    },
  })

  const user1ApplicantProfile = await prisma.applicantProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      profileName: 'General profile',
      askingSalary: 100000,
      userId: applicantUser.id,
      // organisations: {
      //   create: [{ organisationId: vocovo.id }],
      // },
    },
  })

  const position = await prisma.position.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
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
