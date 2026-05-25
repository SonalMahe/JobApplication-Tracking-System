import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Jobs
  const job1 = await prisma.job.create({
    data: { title: 'Frontend Developer', department: 'Engineering', location: 'Stockholm' },
  });
  const job2 = await prisma.job.create({
    data: { title: 'Backend Developer', department: 'Engineering', location: 'Remote' },
  });
  const job3 = await prisma.job.create({
    data: { title: 'UX Designer', department: 'Design', location: 'Gothenburg' },
  });
  const job4 = await prisma.job.create({
    data: { title: 'Product Manager', department: 'Product', location: 'Malmö' },
  });


  // Hiring Managers
  const manager1 = await prisma.hiringManager.create({
    data: { firstName: 'Anna', lastName: 'Lindqvist', email: 'anna@company.com', department: 'Engineering' },
  });
  const manager2 = await prisma.hiringManager.create({
    data: { firstName: 'Erik', lastName: 'Svensson', email: 'erik@company.com', department: 'Design' },
  });
  const manager3 = await prisma.hiringManager.create({
    data: { firstName: 'Maria', lastName: 'Andersson', email: 'maria@company.com', department: 'Product' },
  });


  
  // Link jobs to managers
  await prisma.jobManager.createMany({
    data: [
      { jobId: job1.id, managerId: manager1.id },
      { jobId: job2.id, managerId: manager1.id },
      { jobId: job3.id, managerId: manager2.id },
      { jobId: job4.id, managerId: manager3.id },
    ],
  });


  // Applicants
  const applicant1 = await prisma.applicant.create({
    data: { firstName: 'Max', lastName: 'Olsen', email: 'max@gmail.com', phoneNumber: '0701234567',  },
  });
  const applicant2 = await prisma.applicant.create({
    data: { firstName: 'Sara', lastName: 'Nilsson', email: 'sara@gmail.com', phoneNumber: '0709876543',  },
  });
  const applicant3 = await prisma.applicant.create({
    data: { firstName: 'Lars', lastName: 'Johansson', email: 'lars@gmail.com', phoneNumber: '0705556666',  },
  });



  // Applications
  const app1 = await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: applicant1.id,
      status: 'under_review',
      applicationDate: new Date('2026-05-01'),
    },
  });
  const app2 = await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: applicant2.id,
      status: 'applied',
      applicationDate: new Date('2026-05-10'),
    },
  });

  const app3 = await prisma.application.create({
    data: {
      jobId: job3.id,
      applicantId: applicant3.id,
      status: 'rejected',
      applicationDate: new Date('2026-05-15'),
    },
  });



  // Interviews
  await prisma.interview.create({
    data: {
      applicationId: app1.id,
      interviewDate: new Date('2026-06-04'),
      interviewerName: 'Anna Lindqvist',
      interviewNotes: 'Strong React and TypeScript skills, good communication.',
      result: 'passed',
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: app2.id,
      interviewDate: new Date('2026-06-10'),
      interviewerName: 'Erik Svensson',
      interviewNotes: 'Good problem-solving skills, but needs improvement in communication.',
      result: 'failed',
    },
  });

  
  // Job Applicants (tracking status per job)
  await prisma.jobApplicant.createMany({
    data: [
      { jobId: job1.id, applicantId: applicant1.id, status: 'shortlisted' },
      { jobId: job2.id, applicantId: applicant2.id, status: 'applied' },
      { jobId: job3.id, applicantId: applicant3.id, status: 'rejected' },
    ],
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
