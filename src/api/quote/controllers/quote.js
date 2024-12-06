"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::quote.quote", ({ strapi }) => ({
  async getFrenchQuote(ctx) {
    try {
      const quotes = await strapi.entityService.findMany("api::quote.quote", {
        populate: { photo: true },
      });
      console.log(quotes);

      if (quotes.length === 0) {
        return ctx.send({ message: "Aucune citation trouvée" }, 404);
      }
      const frenchQuotes = quotes.map((quote) => ({
        citation: quote.quote.fr.citation,
        auteur: quote.quote.fr.auteur,
        ouvrage: quote.quote.fr.ouvrage,
        photo: quote.photo?.url
          ? `http://localhost:1337${quote.photo.url}`
          : null,
      }));

      const randomFrenchQuote =
        frenchQuotes[Math.floor(Math.random() * frenchQuotes.length)];

      return ctx.send(randomFrenchQuote);
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },

  async getEnglishQuote(ctx) {
    try {
      const quotes = await strapi.entityService.findMany("api::quote.quote", {
        populate: ["photo"],
      });

      if (quotes.length === 0) {
        return ctx.send({ message: "No quotes found" }, 404);
      }

      const englishQuotes = quotes.map((quote) => ({
        id: quote.id,
        citation: quote.quote.en.citation,
        auteur: quote.quote.en.auteur,
        ouvrage: quote.quote.en.ouvrage,
        photo: quote.photo?.url
          ? `http://localhost:1337${quote.photo.url}`
          : null,
      }));

      const randomEnglishQuote =
        englishQuotes[Math.floor(Math.random() * englishQuotes.length)];
      console.log("Random English Quote:", randomEnglishQuote);

      return ctx.send(randomEnglishQuote);
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },

  async addFavorites(ctx) {
    try {
      const user = ctx.state.user;
      const { quoteId } = ctx.request.body;

      if (!quoteId) {
        return ctx.badRequest("Quote ID is required.");
      }

      const userWithFavorites = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        { populate: ["favorites"] }
      );

      if (userWithFavorites.favorites.some((fav) => fav.id === quoteId)) {
        return ctx.badRequest("Quote is already in favorites.");
      }

      await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        {
          data: {
            favorites: [
              ...userWithFavorites.favorites.map((fav) => fav.id),
              quoteId,
            ],
          },
        }
      );

      const updatedUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        { populate: ["favorites"] }
      );

      return ctx.send({ favorites: updatedUser.favorites });
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
