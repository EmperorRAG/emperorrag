import * as Arbitrary from "effect/Arbitrary";
import * as FastCheck from "effect/FastCheck";
import * as Schema from "effect/Schema";
import { describe, it } from "vitest";
import { BetterAuthOptions } from "./config.schema";

describe("BetterAuthOptions Schema", () => {
  it("should generate valid arbitrary data", () => {
    console.log("FastCheck keys:", Object.keys(FastCheck));
    const arb = Arbitrary.make(BetterAuthOptions);
    const property = FastCheck.property(arb, (options) => {
      console.log(JSON.stringify(options, null, 2));
      return Schema.is(BetterAuthOptions)(options);
    });
    FastCheck.assert(property);
  });
});
