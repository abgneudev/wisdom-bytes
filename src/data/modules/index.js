import { moduleTrader } from "./trader";
import { moduleParalysis } from "./paralysis";
import { moduleLettingGo } from "./lettingGo";
import { moduleComparison } from "./comparison";
import { moduleFailure } from "./failure";
import { moduleGrief } from "./grief";
import { moduleNoise } from "./noise";

/**
 * All available lesson modules, in display order.
 * Each module is self-contained: cards + inflectionContext + metadata.
 */
export const ALL_MODULES = [
  moduleTrader,
  moduleParalysis,
  moduleLettingGo,
  moduleComparison,
  moduleFailure,
  moduleGrief,
  moduleNoise,
];
