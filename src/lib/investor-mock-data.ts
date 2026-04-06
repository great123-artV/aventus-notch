const firstNames = [
  "Liam", "Noah", "Oliver", "James", "Elijah", "William", "Henry", "Lucas", "Benjamin", "Theodore",
  "Emma", "Olivia", "Charlotte", "Amelia", "Sophia", "Mia", "Isabella", "Ava", "Evelyn", "Luna",
  "Mateo", "Levi", "Sebastian", "Jack", "Ezra", "Wyatt", "Kai", "Hudson", "Luca", "Asher",
  "Aria", "Aurora", "Gianna", "Ellie", "Mila", "Layla", "Hazel", "Maya", "Chloe", "Ivy",
  "Aarav", "Arjun", "Vihaan", "Aditya", "Sai", "Ishaan", "Ayaan", "Krishna", "Arnav", "Shaurya",
  "Ananya", "Diya", "Saanvi", "Myra", "Aadhya", "Pari", "Ipsita", "Anvi", "Navya", "Zoya",
  "Yuki", "Haruto", "Riku", "Souta", "Haru", "Hinata", "Kaito", "Asahi", "Yuto", "Hayato",
  "Himari", "Akari", "Ichika", "Sara", "Yui", "Aoi", "Niko", "Hina", "Mei", "Mio",
  "Hans", "Lukas", "Maximilian", "Jakob", "Leon", "Felix", "Finn", "Elias", "Jonas", "Luis",
  "Marie", "Sophie", "Lena", "Emilia", "Mila", "Leni", "Clara", "Hannah", "Lea", "Lina",
  "Jean", "Pierre", "Louis", "Arthur", "Gabriel", "Jules", "Hugo", "Maël", "Lucas", "Adam",
  "Louise", "Alice", "Chloé", "Léa", "Lina", "Mila", "Emma", "Jade", "Manon", "Inès",
  "Santiago", "Mateo", "Matías", "Sebastián", "Diego", "Nicolás", "Samuel", "Alejandro", "Daniel", "Joaquín",
  "Sofía", "Isabella", "Valentina", "Camila", "Luciana", "Victoria", "Martina", "Ximena", "Lucía", "Mariana",
  "Chukwuma", "Olumide", "Babatunde", "Kwame", "Kofi", "Tendai", "Zuberi", "Amadi", "Jabari", "Sekai",
  "Amara", "Zuri", "Nala", "Imani", "Kaya", "Amina", "Sada", "Zola", "Efia", "Dayo"
];

const lastInitials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const countries = [
  { name: "USA", flag: "🇺🇸" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "India", flag: "🇮🇳" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "China", flag: "🇨🇳" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Argentina", flag: "🇦🇷" }
];

export interface Investor {
  id: number;
  name: string;
  countryName: string;
  countryFlag: string;
  amount: number;
  earned: number;
}

export const generateMockInvestors = (count: number): Investor[] => {
  const investors: Investor[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const amount = Math.floor(Math.random() * 50000) + 500; // $500 to $50,500
    const earned = Math.floor(Math.random() * amount * 0.4) + (amount * 0.05); // 5% to 45% profit

    investors.push({
      id: i,
      name: `${firstName} ${lastInitial}.`,
      countryName: country.name,
      countryFlag: country.flag,
      amount: amount,
      earned: earned
    });
  }
  return investors;
};

export const mockInvestors = generateMockInvestors(1000);
