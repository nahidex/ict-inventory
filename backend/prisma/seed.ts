import {
  PrismaClient,
  AssetStatus,
  RepairStatus,
  NocStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("বাংলায় বিস্তারিত সিডিং শুরু হচ্ছে...");
  const password = await bcrypt.hash("password123", 10);

  // ১. ইউজার (Users)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "সিস্টেম অ্যাডমিন",
      email: "admin@example.com",
      password,
      role: "ADMIN",
    },
  });

  // ২. ক্যাটাগরি (Categories)
  const lpt = await prisma.category.upsert({
    where: { code: "LPT" },
    update: {},
    create: { name: "ল্যাপটপ", code: "LPT" },
  });
  const mon = await prisma.category.upsert({
    where: { code: "MON" },
    update: {},
    create: { name: "মনিটর", code: "MON" },
  });
  const prn = await prisma.category.upsert({
    where: { code: "PRN" },
    update: {},
    create: { name: "প্রিন্টার", code: "PRN" },
  });

  // ৩. শাখা (Branches)
  const b1 = await prisma.branch.upsert({
    where: { code: "ADMIN_01" },
    update: {},
    create: {
      name: "প্রশাসন শাখা-১",
      code: "ADMIN_01",
      location: "৪র্থ তলা, উত্তর পাশ",
      roomNumber: "৪০২",
      phoneExt: "১১০",
      status: "Active",
    },
  });
  const b2 = await prisma.branch.upsert({
    where: { code: "ICT_DEPT" },
    update: {},
    create: {
      name: "আইসিটি বিভাগ",
      code: "ICT_DEPT",
      location: "৫ম তলা",
      roomNumber: "৫০৫",
      phoneExt: "২২০",
      status: "Active",
    },
  });

  // ৪. অফিসার (Officers)
  const off1 = await prisma.officer.create({
    data: {
      name: "মোঃ রহিম আহমেদ",
      designation: "সহকারী ব্যবস্থাপক",
      department: "অপারেশনস",
      email: "rahim@example.com",
    },
  });
  const off2 = await prisma.officer.create({
    data: {
      name: "করিম উল্লাহ",
      designation: "হিসাবরক্ষণ কর্মকর্তা",
      department: "ফিন্যান্স",
      email: "karim@example.com",
    },
  });

  // ৫. মালামাল (Assets)
  const a1 = await prisma.asset.create({
    data: {
      assetTag: "AST-LPT-২০১",
      categoryId: lpt.id,
      branchId: b1.id,
      brand: "Dell",
      serialNumber: "SN-LPT-২০১",
      status: "Available" as AssetStatus,
      locationDetails: "অ্যাডমিন ডেস্ক-৫",
    },
  });
  const a2 = await prisma.asset.create({
    data: {
      assetTag: "AST-LPT-২০২",
      categoryId: lpt.id,
      branchId: b2.id,
      currentOfficerId: off2.id,
      brand: "HP",
      serialNumber: "SN-LPT-২০২",
      status: "Assigned" as AssetStatus,
      locationDetails: "আইসিটি ল্যাব",
    },
  });
  const a3 = await prisma.asset.create({
    data: {
      assetTag: "AST-MON-২০১",
      categoryId: mon.id,
      branchId: b1.id,
      brand: "Samsung",
      serialNumber: "SN-MON-২০১",
      status: "Available" as AssetStatus,
    },
  });

  // ৬. রক্ষণাবেক্ষণ (Maintenance)
  await prisma.maintenance.create({
    data: {
      assetId: a1.id,
      issueDescription: "ডিসপ্লে সমস্যা",
      vendorName: "ডেইল সার্ভিস সেন্টার",
      repairStatus: "Pending" as RepairStatus,
      sentDate: new Date(),
    },
  });
  await prisma.maintenance.create({
    data: {
      assetId: a3.id,
      issueDescription: "পাওয়ার সমস্যা সমাধান করা হয়েছে",
      vendorName: "স্যামসাং সার্ভিস",
      repairStatus: "Completed" as RepairStatus,
      sentDate: new Date(),
      receiveDate: new Date(),
      repairCost: 1500,
    },
  });

  // ৭. অ্যাসাইনমেন্ট (Assignment)
  await prisma.assignment.create({
    data: {
      assetId: a2.id,
      officerId: off2.id,
      issueDate: new Date(),
      comments: "অফিসিয়াল কাজের জন্য",
    },
  });

  // ৮. এনওসি (NOC)
  await prisma.nocClearance.create({
    data: {
      officerId: off1.id,
      status: "Approved" as NocStatus,
      applicationDate: new Date(),
      approvalDate: new Date(),
      remarks: "সব মালামাল ফেরত পাওয়া গেছে",
    },
  });
  await prisma.nocClearance.create({
    data: {
      officerId: off2.id,
      status: "Pending" as NocStatus,
      applicationDate: new Date(),
    },
  });

  console.log("বাংলায় সিডিং সম্পন্ন হয়েছে!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
