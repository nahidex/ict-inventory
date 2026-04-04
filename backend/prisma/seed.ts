import {
  PrismaClient,
  AssetStatus,
  PurchaseSource,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 ডেটাবেজ সিডিং শুরু হচ্ছে...");
  
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
  const categories = [
    { name: "ল্যাপটপ", code: "LPT" },
    { name: "মনিটর", code: "MON" },
    { name: "প্রিন্টার", code: "PRN" },
    { name: "ডেস্কটপ", code: "DSK" },
    { name: "স্ক্যানার", code: "SCN" },
    { name: "প্রজেক্টর", code: "PRJ" },
    { name: "ইউপিএস", code: "UPS" },
    { name: "ফটোকপিয়ার", code: "COP" },
    { name: "নেটওয়ার্ক সুইচ", code: "SWT" },
  ];

  const catMap: Record<string, number> = {};
  for (const c of categories) {
    const created = await prisma.category.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: c,
    });
    catMap[c.code] = created.id;
  }

  // ৩. শাখা/ব্রাঞ্চ ডেটা (Branches)
  const branches = [
    { name: "আইসিটি সেল", code: "ICT_CELL", location: "প্রধান ভবন", roomNumber: "৪০১" },
    { name: "প্রশাসন শাখা", code: "ADMIN_SEC", location: "অ্যানেক্স ভবন", roomNumber: "১০২" },
    { name: "হিসাব শাখা", code: "ACCOUNTS", location: "অ্যানেক্স ভবন", roomNumber: "২০৫" },
    { name: "পরিকল্পনা অনুবিভাগ", code: "PLANNING", location: "প্রধান ভবন", roomNumber: "৩য় তলা" },
    { name: "বাজেট শাখা", code: "BUDGET", location: "অ্যানেক্স ভবন", roomNumber: "১০৫" },
    { name: "লাইব্রেরি", code: "LIBRARY", location: "অ্যানেক্স ভবন", roomNumber: "নিচ তলা" },
    { name: "কনফারেন্স রুম", code: "CONF_ROOM", location: "প্রধান ভবন", roomNumber: "২০২" },
  ];

  const branchIds: number[] = [];
  for (const b of branches) {
    const created = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, location: b.location, roomNumber: b.roomNumber },
      create: { ...b, status: "Active" },
    });
    branchIds.push(created.id);
  }

  // ৪. অফিসার (Officers) 
  const officersData = [
    { name: "মোঃ জাহিদুল ইসলাম", designation: "প্রোগ্রামার", email: "zahid@example.com", branchId: branchIds[0], phone: "01711000001", photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/10.jpg" },
    { name: "মোসাম্মত ফারজানা আক্তার", designation: "সহকারী প্রোগ্রামার", email: "farjana@example.com", branchId: branchIds[0], phone: "01811000002", photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/10.jpg" },
    { name: "মোঃ কামরুল হাসান", designation: "সিস্টেম অ্যানালিস্ট", email: "kamrul@example.com", branchId: branchIds[3], phone: "01911000003", photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/11.jpg" },
    { name: "তানজিলা রহমান", designation: "হিসাবরক্ষণ কর্মকর্তা", email: "tanjila@example.com", branchId: branchIds[2], phone: "01511000004", photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/11.jpg" },
    { name: "আহমেদ শরীফ", designation: "প্রশাসনিক কর্মকর্তা", email: "sharif@example.com", branchId: branchIds[1], phone: "01311000005", photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/12.jpg" },
    { name: "নুসরাত জাহান", designation: "লাইব্রেরিয়ান", email: "nusrat@example.com", branchId: branchIds[5], phone: "01611000006", photoUrl: "https://xsgames.co/randomusers/assets/avatars/female/12.jpg" },
    { name: "মোঃ রফিকুল ইসলাম", designation: "অফিস সহকারী", email: "rafiq@example.com", branchId: branchIds[1], phone: "01711000007", photoUrl: "https://xsgames.co/randomusers/assets/avatars/male/13.jpg" },
  ];

  for (const off of officersData) {
    await prisma.officer.upsert({
      where: { email: off.email },
      update: off,
      create: off,
    });
  }

  const allOfficers = await prisma.officer.findMany();

  // ৫. এসেট তৈরি (Assets)
  const brands = ["Dell", "HP", "Lenovo", "Apple", "Samsung", "Asus", "Epson", "Canon", "LG", "Cisco", "TP-Link"];
  const models: Record<string, string[]> = {
    LPT: ["Latitude 5420", "EliteBook 840", "ThinkPad X1", "MacBook Pro M3", "ZenBook 14"],
    MON: ["UltraSharp 24", "Curved 27", "ProDisplay 32", "Gaming 144Hz"],
    PRN: ["L3210 EcoTank", "LaserJet Pro M404n", "ImageClass LBP6230dn", "Pixma G3010"],
    DSK: ["Optiplex 7080", "ProDesk 600 G6", "ThinkCentre M70q"],
    SCN: ["ScanJet Pro 2500", "CanoScan LiDE 400", "Epson Perfection V39"],
    PRJ: ["EB-X06", "ViewSonic PA503X", "BenQ MS560"],
    UPS: ["APC Smart-UPS 1500", "Luminous 1kVA", "CyberPower UT1500"],
    COP: ["Toshiba e-Studio 2523A", "Sharp AR-6020", "Canon iR-2520"],
    SWT: ["Catalyst 2960", "TL-SG1024D", "MikroTik Cloud Core"],
  };

  const sources: PurchaseSource[] = [PurchaseSource.Planning, PurchaseSource.Development, PurchaseSource.Budget_2];

  console.log("📦 ৫০টি ডেমো এসেট তৈরি করা হচ্ছে...");
  
  for (let i = 1; i <= 50; i++) {
    const catCodes = Object.keys(models);
    const randomCatCode = catCodes[Math.floor(Math.random() * catCodes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[randomCatCode];
    const model = modelList[Math.floor(Math.random() * modelList.length)];
    
    // Weighted status: 60% Assigned, 30% Available, 10% Under_Repair
    const dice = Math.random();
    let status = AssetStatus.Available;
    if (dice < 0.6) status = AssetStatus.Assigned;
    else if (dice < 0.9) status = AssetStatus.Available;
    else status = AssetStatus.Under_Repair;

    const source = sources[Math.floor(Math.random() * sources.length)];
    const randomBranchId = branchIds[Math.floor(Math.random() * branchIds.length)];
    
    let currentOfficerId = null;
    if (status === AssetStatus.Assigned) {
      currentOfficerId = allOfficers[Math.floor(Math.random() * allOfficers.length)].id;
    }

    const assetTag = `ICT-2026-${String(i).padStart(3, '0')}`;
    const serialNumber = `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${i}`;
    
    const asset = await prisma.asset.upsert({
      where: { assetTag },
      update: {
        status,
        currentOfficerId,
        branchId: randomBranchId,
      },
      create: {
        assetTag,
        brand,
        model,
        serialNumber,
        categoryId: catMap[randomCatCode],
        branchId: randomBranchId,
        currentOfficerId,
        status,
        purchaseSource: source,
        purchaseDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        locationDetails: "সচিবালয় ভবন, ঢাকা",
      }
    });

    // ৬. অ্যাক্টিভিটি লগ ও অ্যাসাইনমেন্ট রেকর্ড
    if (status === AssetStatus.Assigned && currentOfficerId) {
      const officer = allOfficers.find(o => o.id === currentOfficerId);
      
      // Cleanup old active assignments to prevent duplicates
      await prisma.assignment.updateMany({
        where: { assetId: asset.id, actualReturnDate: null },
        data: { actualReturnDate: new Date() }
      });

      await prisma.assignment.create({
        data: {
          assetId: asset.id,
          officerId: currentOfficerId,
          issueDate: new Date(2025, 0, Math.floor(Math.random() * 28) + 1),
          comments: "সিস্টেম সিডিংয়ের মাধ্যমে বরাদ্দ করা হয়েছে।",
        }
      });

      await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "বরাদ্দ প্রদান",
          description: `অফিসার ${officer?.name} কে অ্যাসেট বরাদ্দ প্রদান করা হয়েছে (Seed Data)`,
        }
      });
    } else {
       await prisma.activityLog.create({
        data: {
          assetId: asset.id,
          actionType: "নিবন্ধন সম্পন্ন",
          description: `অ্যাসেটটি সিস্টেমে নিবন্ধিত করা হয়েছে। (Seed Data)`,
        }
      });
    }
  }

  console.log("✅ ডেটা সিডিং সফলভাবে সম্পন্ন হয়েছে।");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
