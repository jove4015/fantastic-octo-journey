import { Prisma } from "@prisma/client";
import SuperJSON, { deserialize, parse, serialize, stringify } from "superjson";

SuperJSON.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: Prisma.Decimal.isDecimal,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Prisma.Decimal(v),
  },
  "decimal.js",
);

export default SuperJSON;
export { serialize, deserialize, stringify, parse };
