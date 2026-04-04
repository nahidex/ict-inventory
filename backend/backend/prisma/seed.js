const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 ডেটাবেজ সিডিং শুরু হচ্ছে (JavaScript)...");
  const password = await bcrypt.hash("password123", 10);

  // ১. ইউজার
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "সিস্টেম অ্যাডমিন",
      email: "admin@example.com",
      password: password,
      role: "ADMIN",
    },
  });

  // ২. ক্যাটাগরি
  const categories = [
    { name: "ল্যাপটপ", code: "LPT" },
    { name: "মনিটর", code: "MON" },
    { name: "প্রিন্টার", code: "PRN" },
    { name: "ডেস্কটপ", code: "DSK" },
    { name: "ইউপিএস", code: "UPS" },
  ];

  const catMap = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: c,
    });
    catMap[c.code] = created.id;
  }

  // ৩. ব্রাঞ্চ
  const branchData = [
    { name: "আইসিটি সেল", code: "ICT_CELL" },
    { name: "প্রশাসন শাখা", code: "ADMIN_SEC" },
    { name: "হিসাব শাখা", code: "ACCOUNTS" },
  ];

  const branchIds = [];
  for (const b of branchData) {
    const created = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name },
      create: { ...b, status: "Active" },
    });
    branchIds.push(created.id);
  }

  // ৪. অফিসার
  const officers = [
    { name: "মোঃ জাহিদুল ইসলাম", email: "zahid@example.com", branchId: branchIds[0] },
    { name: "মোসাম্মত ফারজানা আক্তার", email: "farjana@example.com", branchId: branchIds[0] },
  ];

  for (const off of officers) {
    const exists = await prisma.officer.findFirst({ where: { email: off.email } });
    if (exists) {
      await prisma.officer.update({ where: { id: exists.id }, data: off });
    } else {
      await prisma.officer.create({ data: off });
    }
  }

  const allOfficers = await prisma.officer.findMany();

  // ৫. এসেট
  console.log("📦 ২০টি ডেমো এসেট তৈরি করা হচ্ছে...");
  for (let i = 1; i <= 20; i++) {
    const assetTag = `ICT-2026-${String(i).padStart(3, '0')}`;
    const status = i % 2 === 0 ? "Assigned" : "Available";
    const targetOfficerId = status === "Assigned" ? allOfficers[0].id : null;

    const asset = await prisma.asset.upsert({
      where: { assetTag: assetTag },
      update: { status: status, currentOfficerId: targetOfficerId, branchId: branchIds[0] },
      create: {
        assetTag: assetTag,
        brand: "Dell",
        model: "Latitude 5420",
        serialNumber: `SN-${i}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        categoryId: catMap["LPT"],
        branchId: branchIds[0],
        currentOfficerId: targetOfficerId,
        status: status,
        purchaseSource: "Planning",
        purchaseDate: new Date(),
        locationDetails: "সচিবালয়, ঢাকা",
      }
    });

    if (status === "Assigned") {
      await prisma.assignment.create({
        data: {
          assetId: asset.id,
          officerId: targetOfficerId,
          issueDate: new Date(),
          comments: "সিস্টেম সিডিং।",
        }
      });
    }

    await prisma.activityLog.create({
      data: {
        assetId: asset.id,
        actionType: "নিবন্ধন সম্পন্ন",
        description: "অ্যাসেটটি সিস্টেমে নিবন্ধিত করা হয়েছে।",
      }
    });
  }

  console.log("✅ ডেটা সিডিং সফলভাবে সম্পন্ন হয়েছে!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
