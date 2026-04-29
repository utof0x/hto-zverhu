const base = import.meta.env.BASE_URL;

export interface FinalImage {
  image: string;
  answer: string;
}

export const FINAL_IMAGES_MEN: FinalImage[] = [
  { image: `${base}images/final/m-1.jpg`, answer: "Відповідь 1" },
  { image: `${base}images/final/m-2.jpg`, answer: "Відповідь 2" },
  { image: `${base}images/final/m-3.jpg`, answer: "Відповідь 3" },
  { image: `${base}images/final/m-4.jpg`, answer: "Відповідь 4" },
  { image: `${base}images/final/m-5.jpg`, answer: "Відповідь 5" },
  { image: `${base}images/final/m-6.jpg`, answer: "Відповідь 6" },
  { image: `${base}images/final/m-7.jpg`, answer: "Відповідь 7" },
  { image: `${base}images/final/m-8.jpg`, answer: "Відповідь 8" },
  { image: `${base}images/final/m-9.jpg`, answer: "Відповідь 9" },
  { image: `${base}images/final/m-10.jpg`, answer: "Відповідь 10" },
];

export const FINAL_IMAGES_WOMEN: FinalImage[] = [
  { image: `${base}images/final/w-1.jpg`, answer: "Відповідь 1" },
  { image: `${base}images/final/w-2.jpg`, answer: "Відповідь 2" },
  { image: `${base}images/final/w-3.jpg`, answer: "Відповідь 3" },
  { image: `${base}images/final/w-4.jpg`, answer: "Відповідь 4" },
  { image: `${base}images/final/w-5.jpg`, answer: "Відповідь 5" },
  { image: `${base}images/final/w-6.jpg`, answer: "Відповідь 6" },
  { image: `${base}images/final/w-7.jpg`, answer: "Відповідь 7" },
  { image: `${base}images/final/w-8.jpg`, answer: "Відповідь 8" },
  { image: `${base}images/final/w-9.jpg`, answer: "Відповідь 9" },
  { image: `${base}images/final/w-10.jpg`, answer: "Відповідь 10" },
];
