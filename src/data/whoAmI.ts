const base = import.meta.env.BASE_URL;

export interface WhoAmIImages {
  men: string;
  women: string;
}

export const WHO_AM_I_IMAGES: WhoAmIImages = {
  men: `${base}images/who-am-i-men.png`,
  women: `${base}images/who-am-i-women.png`,
};
