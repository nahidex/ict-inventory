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
  const b3 = await prisma.branch.upsert({
    where: { code: "HR_SEC" },
    update: {},
    create: {
      name: "এইচআর শাখা",
      code: "HR_SEC",
      location: "৩য় তলা",
      roomNumber: "৩০১",
      phoneExt: "৩১০",
      status: "Active",
    },
  });

  // ৪. অফিসার (Officers) 
  const officersData = [
    { name: "মোঃ রহিম আহমেদ", designation: "সহকারী ব্যবস্থাপক", department: "অপারেশনস", email: "rahim@example.com", branchId: b1.id },
    { name: "করিম উল্লাহ", designation: "হিসাবরক্ষণ কর্মকর্তা", department: "ফিন্যান্স", email: "karim@example.com", branchId: b1.id },
    { name: "নাসরিন সুলতানা", designation: "সিনিয়র সিস্টেম অ্যানালিস্ট", department: "আইসিটি", email: "nasrin@example.com", branchId: b2.id },
    { name: "আরিফুল ইসলাম", designation: "প্রোগ্রামার", department: "আইসিটি", email: "ariful@example.com", branchId: b2.id },
    { name: "ফাতেমা জোহরা", designation: "ডেপুটি ডিরেক্টর", department: "প্রশাসন", email: "fatema@example.com", branchId: b1.id },
    { name: "সাকিব আল হাসান", designation: "অ্যাসিস্ট্যান্ট ডিরেক্টর", department: "এইচআর", email: "sakib@example.com", branchId: b3.id },
    { name: "কামরুল হাসান", designation: "সেকশন অফিসার", department: "জেনারেল সার্ভিস", email: "kamrul@example.com", branchId: b3.id },
    { name: "লুৎফুর রহমান", designation: "টেকনিক্যাল পার্সোনাল", department: "আইসিটি", email: "lutfur@example.com", branchId: b2.id },
    { name: "শারমিন আক্তার", designation: "অফিস সহকারী", department: "প্রশাসন", email: "sharmin@example.com", branchId: b1.id },
    { name: "তামিম ইকবাল", designation: "মার্কেটিং অফিসার", department: "অপারেশনস", email: "tamim@example.com", branchId: b1.id },
    { name: "মুশফিকুর রহিম", designation: "ডেটা এন্ট্রি অপারেটর", department: "আইসিটি", email: "mushfiq@example.com", branchId: b2.id },
    { name: "মাহমুদুল্লাহ রিয়াদ", designation: "নিরাপত্তা ইনচার্জ", department: "প্রশাসন", email: "mahmudullah@example.com", branchId: b1.id },
  ];

  console.log(`${officersData.length} জন অফিসারের তথ্য সিড করা হচ্ছে...`);

  // Use create instead of upsert if email is not unique in schema
  for (const off of officersData) {
    const existing = await prisma.officer.findFirst({ where: { email: off.email } });
    if (!existing) {
      await prisma.officer.create({ data: off });
    } else {
      await prisma.officer.update({ where: { id: existing.id }, data: off });
    }
  }

  const allOfficers = await prisma.officer.findMany();

  // ৫. মালামাল (Assets)
  await prisma.asset.upsert({
    where: { assetTag: "AST-LPT-২০১" },
    update: {},
    create: {
      assetTag: "AST-LPT-২০১",
      categoryId: lpt.id,
      branchId: b1.id,
      brand: "Dell",
      serialNumber: "SN-LPT-২০১",
      status: "Available" as AssetStatus,
      locationDetails: "অ্যাডমিন ডেস্ক-৫",
    },
  });

  const a2 = await prisma.asset.upsert({
    where: { assetTag: "AST-LPT-২০২" },
    update: {},
    create: {
      assetTag: "AST-LPT-২০২",
      categoryId: lpt.id,
      branchId: b2.id,
      currentOfficerId: allOfficers.find(o => o.email === "nasrin@example.com")?.id,
      brand: "HP",
      serialNumber: "SN-LPT-২০২",
      status: "Assigned" as AssetStatus,
      locationDetails: "আইসিটি ল্যাব",
    },
  });

  console.log("সব তথ্য সফলভাবে সিড করা হয়েছে!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
