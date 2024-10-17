import { ViewV2 } from "@budibase/types"
import { utils, dataFilters } from "@budibase/shared-core"
import { isPlainObject } from "lodash"

function isEmptyObject(obj: any) {
  return obj && isPlainObject(obj) && Object.keys(obj).length === 0
}

export function ensureQueryUISet(view: ViewV2) {
  if (!view.queryUI && view.query && !isEmptyObject(view.query)) {
    if (!Array.isArray(view.query)) {
      // In practice this should not happen. `view.query`, at the time this code
      // goes into the codebase, only contains LegacyFilter[] in production.
      // We're changing it in the change that this comment is part of to also
      // include SearchFilters objects. These are created when we receive an
      // update to a ViewV2 that contains a queryUI and not a query field. We
      // can convert SearchFilterGroup (the type of queryUI) to SearchFilters,
      // but not LegacyFilter[], they are incompatible due to SearchFilterGroup
      // and SearchFilters being recursive types.
      //
      // So despite the type saying that `view.query` is a LegacyFilter[] |
      // SearchFilters, it will never be a SearchFilters when a `view.queryUI`
      // is specified, making it "safe" to throw an error here.
      throw new Error("view is missing queryUI field")
    }

    view.queryUI = utils.processSearchFilters(view.query)
  }
}

export function ensureQuerySet(view: ViewV2) {
  if (!view.query && view.queryUI && !isEmptyObject(view.queryUI)) {
    view.query = dataFilters.buildQuery(view.queryUI)
  }
}
