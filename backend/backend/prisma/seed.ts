import { PrismaClient, AssetStatus, RepairStatus, NocStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Final Seeding...');
  const password = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { name: 'Admin', email: 'admin@example.com', password, role: 'ADMIN' } });
  const lpt = await prisma.category.upsert({ where: { code: 'LPT' }, update: {}, create: { name: 'Laptop', code: 'LPT' } });
  const mon = await prisma.category.upsert({ where: { code: 'MON' }, update: {}, create: { name: 'Monitor', code: 'MON' } });
  const off1 = await prisma.officer.create({ data: { name: 'Rahim', department: 'Ops' } });
  const off2 = await prisma.officer.create({ data: { name: 'Karim', department: 'Fin' } });
  const a1 = await prisma.asset.create({ data: { assetTag: 'AST-201', categoryId: lpt.id, brand: 'Dell', serialNumber: 'SN201', status: 'Available' as AssetStatus } });
  const a2 = await prisma.asset.create({ data: { assetTag: 'AST-202', categoryId: lpt.id, brand: 'HP', serialNumber: 'SN202', status: 'Assigned' as AssetStatus } });
  const a3 = await prisma.asset.create({ data: { assetTag: 'AST-301', categoryId: mon.id, brand: 'Samsung', serialNumber: 'SN301', status: 'Available' as AssetStatus } });
  await prisma.maintenance.create({ data: { assetId: a1.id, issueDescription: 'Flicker', vendorName: 'Dell Service', repairStatus: 'In_Progress' as RepairStatus, sentDate: new Date() } });
  await prisma.maintenance.create({ data: { assetId: a3.id, issueDescription: 'Power', vendorName: 'Samsung', repairStatus: 'Completed' as RepairStatus, sentDate: new Date(), receiveDate: new Date(), repairCost: 1500 } });
  await prisma.assignment.create({ data: { assetId: a2.id, officerId: off2.id, issueDate: new Date() } });
  await prisma.nocClearance.create({ data: { officerId: off1.id, status: 'Approved' as NocStatus, applicationDate: new Date(), clearanceDate: new Date() } });
  await prisma.nocClearance.create({ data: { officerId: off2.id, status: 'Pending' as NocStatus, applicationDate: new Date() } });
  console.log('Seeding Done!');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.());