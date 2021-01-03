export default async () => {
  const { $content } = require("@nuxt/content");
  const files = await $content({ deep: true }).where({published: { $eq: true}}).only(["path", 'slug']).fetch();

  return files.map((file) => (file.path === "/index" ? "/" : `/${file.slug}`));
};