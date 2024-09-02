import NewAmazonAdvertising from "@/src/components/advertising-analytics/advertising-data/NewAmazonAdvertising";
import OldAmazonAdvertising from "@/src/components/advertising-analytics/advertising-data/OldAmazonAdvertising";

export default function AdvertisingData() {
  return process.env.NEXT_PUBLIC_PRODUCTION === "true" ? (
    <OldAmazonAdvertising />
  ) : (
    <NewAmazonAdvertising />
  );
}
