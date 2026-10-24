import { useState } from "react"
import { Button } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import RefreshIcon from "@mui/icons-material/Refresh"
import copy from "clipboard-copy"
import { useTranslation } from "react-i18next"
import useAPI from "../../../hooks/useAPI"
import { Text } from "../../../designSystem/Text"

type IpLookupResponse = {
  ip: string
  city: string
  region: string
  region_code: string
  country_name: string
  country_code: string
  continent_code: string
  latitude: number | null
  longitude: number | null
  timezone: string
  utc_offset: string
  currency: string
  currency_name: string
  languages: string
  asn: string
  org: string
}

const FIELDS: { key: keyof IpLookupResponse; label: string }[] = [
  { key: "city", label: "City" },
  { key: "region", label: "Region" },
  { key: "region_code", label: "Region code" },
  { key: "country_name", label: "Country" },
  { key: "country_code", label: "Country code" },
  { key: "continent_code", label: "Continent" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "timezone", label: "Timezone" },
  { key: "utc_offset", label: "UTC offset" },
  { key: "currency", label: "Currency" },
  { key: "currency_name", label: "Currency name" },
  { key: "languages", label: "Languages" },
  { key: "asn", label: "ASN" },
  { key: "org", label: "Organization" },
]

function shown(value: IpLookupResponse[keyof IpLookupResponse]): string {
  if (value === null || value === undefined || value === "") return "—"
  return String(value)
}

const IpLookup = () => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const lookup = useAPI("ip/", "get", {
    reactQueryOptions: { enabled: true, staleTime: 60_000 },
  })
  const data = lookup.data as IpLookupResponse | undefined

  const copyIp = () => {
    if (!data?.ip) return
    copy(data.ip).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    })
  }

  if (lookup.isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (lookup.isError || !data) {
    return (
      <div className="h-full w-full overflow-y-auto flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Text fontSize="base" fontWeight="medium" className="text-[#212529]">
          {t("Could not look up your IP")}
        </Text>
        <Button onClick={() => lookup.refetch()} className="bg-[#455FE9] text-white">
          {t("Refresh")}
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto px-4 md:px-0 py-4 md:py-0">
      <div className="bg-[#E0E4F5] bg-opacity-50 rounded-[24px] p-5 md:p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Text fontSize="sm" fontWeight="medium" className="text-[#6C757D]">
              {t("Your connection")}
            </Text>
            <Text fontSize="3xl" fontWeight="semibold" className="text-[#212529] break-all">
              {data.ip || "—"}
            </Text>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button onClick={copyIp} className="min-w-0 bg-white text-[#455FE9]" aria-label={t("Copy IP")}>
              <ContentCopyIcon fontSize="small" />
              <span className="ms-1">{copied ? t("Copied") : t("Copy IP")}</span>
            </Button>
            <Button
              onClick={() => lookup.refetch()}
              className="min-w-0 bg-white text-[#455FE9]"
              aria-label={t("Refresh")}
              disabled={lookup.isFetching}
            >
              <RefreshIcon fontSize="small" className={lookup.isFetching ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>
        <Text fontSize="sm" fontWeight="extralight" className="text-[#495057]">
          {t("This is the address your connection uses to reach this panel.")}
        </Text>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 m-0">
          {FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col min-w-0">
              <dt>
                <Text fontSize="xs" fontWeight="medium" className="text-[#6C757D]">
                  {t(field.label)}
                </Text>
              </dt>
              <dd className="m-0">
                <Text fontSize="base" fontWeight="medium" className="text-[#212529] break-all">
                  {shown(data[field.key])}
                </Text>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default IpLookup
