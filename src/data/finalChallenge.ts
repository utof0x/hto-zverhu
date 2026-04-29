const base = import.meta.env.BASE_URL;

export interface FinalImage {
  image: string;
  answer: string;
}

export const FINAL_IMAGES_MEN: FinalImage[] = [
  { image: `${base}images/final/m-1.jpg`, answer: "Меріда" },
  { image: `${base}images/final/m-2.jpg`, answer: "Покахонтас" },
  { image: `${base}images/final/m-3.jpg`, answer: "Мулан" },
  { image: `${base}images/final/m-4.jpg`, answer: "Аврора" },
  { image: `${base}images/final/m-5.jpg`, answer: "Бель" },
  { image: `${base}images/final/m-6.jpg`, answer: "Тіана" },
  { image: `${base}images/final/m-7.jpg`, answer: "Попелюшка" },
  { image: `${base}images/final/m-8.jpg`, answer: "Білосніжка" },
  { image: `${base}images/final/m-9.jpg`, answer: "Ельза" },
  { image: `${base}images/final/m-10.jpg`, answer: "Жасмін" },
];

export const FINAL_IMAGES_WOMEN: FinalImage[] = [
  { image: `${base}images/final/w-1.jpg`, answer: "Альфа Ромео" },
  { image: `${base}images/final/w-2.jpg`, answer: "Форд" },
  { image: `${base}images/final/w-3.jpg`, answer: "Бентлі" },
  { image: `${base}images/final/w-4.jpg`, answer: "Субару" },
  { image: `${base}images/final/w-5.jpg`, answer: "Ланос" },
  { image: `${base}images/final/w-6.jpg`, answer: "Сітроєн" },
  { image: `${base}images/final/w-7.jpg`, answer: "Міні Купер" },
  { image: `${base}images/final/w-8.jpg`, answer: "Мазераті" },
  { image: `${base}images/final/w-9.jpg`, answer: "Опель" },
  { image: `${base}images/final/w-10.jpg`, answer: "Ламборгіні" },
];
