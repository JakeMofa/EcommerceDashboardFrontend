import GeneralMain from "./General/Main";
import SelectAM from "./General/SelectAM";

export default function General({ brand, userRole }) {
  return (
    <>
      <GeneralMain {...{ brand, userRole }} />
      <SelectAM {...{ brand, userRole }} />
    </>
  );
}
