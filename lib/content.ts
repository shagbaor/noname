/*
 * Timeline milestones. These are real events but should be fact-checked by the
 * editorial team before launch. Stories themselves live in the database.
 */

export type TimelineEntry = {
  year: string
  title: string
  body: string
  region: string
  place: string
}

export const timeline: TimelineEntry[] = [
  {
    year: "1988",
    title: "GLOW is founded",
    body: "Simon Nkoli and others form the Gay and Lesbian Organisation of the Witwatersrand, linking queer liberation to the anti-apartheid struggle.",
    region: "Southern Africa",
    place: "Johannesburg",
  },
  {
    year: "1990",
    title: "First Pride march on the continent",
    body: "Several hundred people march through Johannesburg in what is widely recorded as Africa's first Pride.",
    region: "Southern Africa",
    place: "Johannesburg",
  },
  {
    year: "1996",
    title: "Equality, written down",
    body: "South Africa's constitution protects against discrimination on the basis of sexual orientation.",
    region: "Southern Africa",
    place: "South Africa",
  },
  {
    year: "2015",
    title: "Mozambique's new penal code",
    body: "A revised penal code takes effect without the colonial-era provisions used against same-sex relations.",
    region: "Southern Africa",
    place: "Mozambique",
  },
  {
    year: "2019",
    title: "Botswana High Court ruling",
    body: "The court strikes down colonial-era laws criminalising consensual same-sex relations.",
    region: "Southern Africa",
    place: "Gaborone",
  },
  {
    year: "2020",
    title: "Gabon decriminalises",
    body: "Parliament reverses a 2019 law that had criminalised same-sex relations.",
    region: "Central Africa",
    place: "Libreville",
  },
]
