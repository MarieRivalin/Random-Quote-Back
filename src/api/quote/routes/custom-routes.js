module.exports = {
  routes: [
    {
      method: "GET",
      path: "/quotes/random-french",
      handler: "quote.getFrenchQuote",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/quotes/random-english",
      handler: "quote.getEnglishQuote",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/quotes/add-favorites",
      handler: "quote.addFavorites",
      config: {
        auth: {
          type: "authenticated",
        },
      },
    },
  ],
};
