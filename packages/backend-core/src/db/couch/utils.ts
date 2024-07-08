import { getCouchInfo } from "./connections"
import fetch from "node-fetch"
import { checkSlashesInUrl } from "../../helpers"
import * as context from "../../context"
import env from "../../environment"

export async function directCouchCall(
  path: string,
  method: string = "GET",
  body?: any
) {
  let { url, cookie } = getCouchInfo()
  const couchUrl = `${url}/${path}`
  return await directCouchUrlCall({ url: couchUrl, cookie, method, body })
}

export async function directCouchUrlCall({
  url,
  cookie,
  method,
  body,
}: {
  url: string
  cookie: string
  method: string
  body?: Record<string, any>
}) {
  const params: any = {
    method: method,
    headers: {
      Authorization: cookie,
    },
  }
  if (body && method !== "GET") {
    if (typeof body === "string") {
      params.body = body
      params.headers["Content-Type"] = "text/plain"
    } else {
      params.body = JSON.stringify(body)
      params.headers["Content-Type"] = "application/json"
    }
  }
  return await fetch(checkSlashesInUrl(encodeURI(url)), params)
}

export async function directCouchQuery(
  path: string,
  method: string = "GET",
  body?: any
) {
  const response = await directCouchCall(path, method, body)
  if (response.status < 300) {
    return await response.json()
  } else {
    throw "Cannot connect to CouchDB instance"
  }
}

export function isSqsEnabledForTenant(): boolean {
  const tenantId = context.getTenantId()
  return (
    env.SQS_SEARCH_ENABLE !== undefined &&
    env.SQS_SEARCH_ENABLE_TENANTS.includes(tenantId)
  )
}
