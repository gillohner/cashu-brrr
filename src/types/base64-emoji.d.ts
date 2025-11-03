declare module "base64-emoji" {
  const emoji: {
    encode(input: string): string;
    decode(input: string): string;
  };
  export default emoji;
}
