export type PromiseContent = {
  id: string;
  category: "peace" | "strength" | "rest" | "hope" | "purpose";
  kind: "scripture" | "encouragement";
  text: string;
  reference?: string;
};

export const PROMISES: PromiseContent[] = [
  {
    id: "isaiah-26-3",
    category: "peace",
    kind: "scripture",
    text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee.",
    reference: "Isaiah 26:3 (KJV)",
  },
  {
    id: "matthew-11-28",
    category: "rest",
    kind: "scripture",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
    reference: "Matthew 11:28 (KJV)",
  },
  {
    id: "isaiah-40-31",
    category: "strength",
    kind: "scripture",
    text: "They that wait upon the Lord shall renew their strength.",
    reference: "Isaiah 40:31 (KJV)",
  },
  {
    id: "psalm-46-10",
    category: "peace",
    kind: "scripture",
    text: "Be still, and know that I am God.",
    reference: "Psalm 46:10 (KJV)",
  },
  {
    id: "philippians-4-6-7",
    category: "peace",
    kind: "scripture",
    text: "The peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    reference: "Philippians 4:7 (KJV)",
  },
  {
    id: "psalm-55-22",
    category: "strength",
    kind: "scripture",
    text: "Cast thy burden upon the Lord, and he shall sustain thee.",
    reference: "Psalm 55:22 (KJV)",
  },
  {
    id: "jeremiah-29-11",
    category: "hope",
    kind: "scripture",
    text: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil.",
    reference: "Jeremiah 29:11 (KJV)",
  },
  {
    id: "psalm-121-2",
    category: "strength",
    kind: "scripture",
    text: "My help cometh from the Lord, which made heaven and earth.",
    reference: "Psalm 121:2 (KJV)",
  },
  {
    id: "proverbs-3-5",
    category: "purpose",
    kind: "scripture",
    text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    reference: "Proverbs 3:5 (KJV)",
  },
  {
    id: "psalm-23-4",
    category: "peace",
    kind: "scripture",
    text: "I will fear no evil: for thou art with me.",
    reference: "Psalm 23:4 (KJV)",
  },
  {
    id: "gentle-01",
    category: "rest",
    kind: "encouragement",
    text: "You do not have to solve the whole week today. Be faithful to the next small thing.",
  },
  {
    id: "gentle-02",
    category: "peace",
    kind: "encouragement",
    text: "Your inbox can wait for one quiet breath. Peace is allowed to meet you here, too.",
  },
  {
    id: "gentle-03",
    category: "strength",
    kind: "encouragement",
    text: "You have made it through hard days before. You are not carrying this one alone.",
  },
  {
    id: "gentle-04",
    category: "purpose",
    kind: "encouragement",
    text: "The work matters, but your worth was never measured by what you finish today.",
  },
  {
    id: "gentle-05",
    category: "hope",
    kind: "encouragement",
    text: "There is still goodness ahead that you cannot see from this moment.",
  },
];

export function choosePromise(previousPromiseId?: string | null) {
  const eligible =
    PROMISES.filter((item) => item.id !== previousPromiseId) || PROMISES;
  return eligible[Math.floor(Math.random() * eligible.length)] ?? PROMISES[0];
}

export function getPromiseById(id: string) {
  return PROMISES.find((item) => item.id === id);
}
