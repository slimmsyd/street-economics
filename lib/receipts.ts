export type Receipt = {
  image: string;
  alt: string;
  context: string;
  aspect?: string;
};

export const RECEIPTS: Receipt[] = [
  {
    image: "/receipts/001.jpg",
    alt: "Discord message about Street Economics culture",
    context: "#thoughts · 6mo",
  },
  {
    image: "/receipts/002.jpg",
    alt: "Discord message about trust and Street Economics",
    context: "#freegame · 1mo",
  },
  {
    image: "/receipts/003.jpg",
    alt: "Discord message about being a Street Economics ambassador",
    context: "#lobby · 2mo",
  },
  {
    image: "/receipts/004.jpg",
    alt: "Discord message about Street Economics going global",
    context: "#lobby · 11mo",
  },
  {
    image: "/receipts/005.jpg",
    alt: "Discord message calling Street Economics a movement",
    context: "discord · 5/30/26",
    aspect: "2.77 / 1",
  },
  {
    image: "/receipts/006.jpg",
    alt: "Discord message saying all roads lead to Street Economics",
    context: "#lobby · 15h",
  },
  {
    image: "/receipts/007.jpg",
    alt: "Discord message saying Street Economics is a household name",
    context: "#lobby · 1d",
  },
  {
    image: "/receipts/008.jpg",
    alt: "Discord message about Street Economics as an ecosystem",
    context: "#thoughts · 4mo",
  },
];
