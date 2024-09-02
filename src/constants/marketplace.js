export const regionOptions = [
  { label: "us-east-1", value: "us-east-1" },
  { label: "us-west-2", value: "us-west-2" },
  { label: "eu-west-1", value: "eu-west-1" },
];

export const marketplaceOptions = (uspRegion) => {
  return [
    uspRegion === "us-east-1" && {
      label: "North America Region",
      options: [
        { label: "Brazil", value: "A2Q3Y263D00KWC", ext: "", tld: "com.br" },
        { label: "Canada", value: "A2EUQ1WTGCTBG2", ext: "", tld: "ca" },
        { label: "Mexico", value: "A1AM78C64UM0Y8", ext: "", tld: "com.mx" },
        { label: "USA", value: "ATVPDKIKX0DER", ext: "", tld: "com" },
      ],
    },
    uspRegion === "eu-west-1" && {
      label: "Europe Region",
      options: [
        { label: "Spain", value: "A1RKKUPIHCS9HS", ext: "-europe", tld: "com" },
        { label: "UK", value: "A1F83G8C2ARO7P", ext: "-europe", tld: "com" },
        {
          label: "France",
          value: "A13V1IB3VIYZZH",
          ext: "-europe",
          tld: "com",
        },
        { label: "Netherlands", value: "A1805IZSGTT6HS", ext: "", tld: "nl" },
        {
          label: "Germany",
          value: "A1PA6795UKMFR9",
          ext: "-europe",
          tld: "com",
        },
        { label: "Italy", value: "APJ6JRA9NG5V4", ext: "-europe", tld: "com" },
        { label: "Saudi Arabia", value: "A17E79C6D8DWNP", ext: "", tld: "sa" },
        { label: "Turkey", value: "A33AVAJ2PDY3EV", ext: "", tld: "com.tr" },
        {
          label: "United Arab Emirates (U.A.E.)",
          value: "A2VIGQ35RCS4UG",
          ext: "",
          tld: "ae",
        },
        { label: "India", value: "A21TJRUUN4KGV", ext: "", tld: "in" },
        // { label: "Poland", value: "" },
        // { label: "Sweden", value: "" },
        //
      ],
    },
    uspRegion === "us-west-2" && {
      label: "Far East Region",
      options: [
        { label: "Singapore", value: "A19VAU5U5O7RUS", ext: "", tld: "sg" },
        { label: "Australia", value: "A39IBJ37TRP1C6", ext: "", tld: "com.au" },
        { label: "Japan", value: "A1VC38T7YXB528", ext: "", tld: "co.jp" },
      ],
    },
    uspRegion === "us-west-2" && {
      label: "China Region",
      options: [
        { label: "China", value: "AAHKV2X7AFYLW", ext: "", tld: "com" },
      ],
    },
  ].filter(Boolean);
};
