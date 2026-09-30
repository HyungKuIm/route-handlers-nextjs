export type Dog = {
  id: number;
  kind: string;
  country: string;
  content: string;
  height: number;
  weight: number;
  price: number;
  readcount: number;
  image: string;
};

// "h.jpg"처럼 경로 없이 파일명만 온 경우도 /images/ 아래로 맞춤
export function imageSrc(image: string) {
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/images/${image}`;
}
