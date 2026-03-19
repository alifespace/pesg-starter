SELECT * FROM "longlist";

SELECT "title", "author" FROM "longlist";

SELECT "title", "author" FROM "longlist" LIMIT 5;

SELECT "title", "author" FROM "longlist" WHERE "year" = 2023;

SELECT "title", "author", "format" FROM "longlist" WHERE "format" != 'hardcover';

SELECT "title", "author", "format" FROM "longlist" WHERE "format" <> 'hardcover';

SELECT "title", "author", "format" FROM "longlist" WHERE NOT "format" = 'hardcover';

SELECT "title", "author" FROM "longlist" WHERE "year" = 2023 OR "year" = 2022;

SELECT "title", "author", "format" FROM "longlist" WHERE ("year" = 2023 OR "year" = 2022) AND "format"!= 'hardcover';

SELECT "title", "author", "translator" FROM "longlist" WHERE "translator" IS NULL;

SELECT "title", "author", "translator" FROM "longlist" WHERE "translator" IS NOT NULL;

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE '%love%';

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE 'The %';

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE 'The %Fac%';

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE 'P_re';

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE 'T__l';

SELECT "title", "author", "year" FROM "longlist" WHERE "year" >= 2019 AND "year" < 2023;

SELECT "title", "author", "year" FROM "longlist" WHERE "year" BETWEEN 2019 AND 2022;

SELECT "title", "rating" FROM "longlist" WHERE "rating" > 4;

SELECT "title", "rating", "votes" FROM "longlist" WHERE "rating" > 4 AND "votes" > 10000;

SELECT "title", "pages" FROM "longlist" WHERE "pages" < 300;

SELECT "title", "author" FROM "longlist" WHERE "title" LIKE 'pyre';

SELECT "title", "rating" FROM "longlist" ORDER BY "rating" LIMIT 10;

SELECT "title", "rating" FROM "longlist" ORDER BY "rating" DESC LIMIT 10;

SELECT "title", "rating", "votes" FROM "longlist" ORDER BY "rating" DESC, "votes" DESC LIMIT 10;

SELECT "title" FROM "longlist" ORDER BY "title" DESC;

SELECT ROUND(AVG("rating"), 2) AS "average rating" FROM "longlist";

SELECT MAX("rating"), MIN("rating") FROM "longlist";

SELECT SUM("votes") FROM "longlist";

SELECT COUNT(*) FROM "longlist";

SELECT COUNT("translator") FROM "longlist";

SELECT MAX("title"), MIN("title") FROM "longlist";

SELECT COUNT("publisher") FROM "longlist";

SELECT DISTINCT "publisher" FROM "longlist";

SELECT COUNT(DISTINCT "publisher") FROM "longlist";

